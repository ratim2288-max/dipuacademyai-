/**
 * DipuAcademy Smart AI Matching Engine
 * ------------------------------------
 * Handles semantic matching, fuzzy search, tokenization,
 * context tracking and fallback responses for Bengali & English.
 */

class DipuAIEngine {
  constructor() {
    this.context = {
      lastTopic: null,
      lastCourse: null,
      historyCount: 0
    };

    // Phonetic & common synonyms dictionary for Banglish / Bengali
    this.synonyms = {
      "taka": ["fee", "cost", "dam", "mullo", "khoroch", "টাকা", "ফি", "খরচ", "মূল্য"],
      "vorti": ["admission", "admit", "join", "enroll", "ভর্তি", "ভর্তির", "রেজিস্ট্রেশন"],
      "course": ["kors", "korsh", "shikha", "training", "কোর্স", "ট্রেনিং", "ক্লাস"],
      "class": ["klas", "porashona", "time", "shomoy", "সময়", "শিডিউল", "ক্লাস"],
      "jogajog": ["contact", "phone", "number", "thikana", "address", "যোগাযোগ", "ফোন", "ঠিকানা", "হটলাইন"],
      "web": ["mern", "react", "website", "html", "javascript", "developer"],
      "ai": ["python", "machine learning", "ml", "পাইথন", "এআই", "মেশিন লার্নিং"]
    };
  }

  // Normalize string: lowercase, strip punctuation, clean extra whitespace
  normalize(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[?!.,;:()[\]{}"'\\\/।—–-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Tokenize string into meaningful words
  tokenize(text) {
    const clean = this.normalize(text);
    return clean.split(" ").filter(t => t.length > 0);
  }

  // Expand tokens with known synonyms
  expandTokens(tokens) {
    const expanded = new Set(tokens);
    for (const token of tokens) {
      for (const [key, synList] of Object.entries(this.synonyms)) {
        if (token === key || synList.includes(token)) {
          expanded.add(key);
          synList.forEach(s => expanded.add(s));
        }
      }
    }
    return Array.from(expanded);
  }

  // Jaccard similarity coefficient
  calculateJaccard(tokensA, tokensB) {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : (intersection.size / union.size);
  }

  // Main match function
  findBestMatch(userInput) {
    const kb = getActiveKnowledgeBase();
    const cleanInput = this.normalize(userInput);
    const rawTokens = this.tokenize(userInput);
    const inputTokens = this.expandTokens(rawTokens);

    if (rawTokens.length === 0) {
      return {
        matched: false,
        confidence: 0,
        answer: "অনুগ্রহ করে কিছু লিখুন, যাতে আমি সাহায্য করতে পারি!",
        chips: ["সকল কোর্স", "কোর্স ফি", "ভর্তি নিয়ম"]
      };
    }

    let bestItem = null;
    let highestScore = 0;
    let matchReason = "";

    // Check context for single/short follow-up words (e.g., "ফি কত?", "সময় কবে?")
    const isFeeQuery = rawTokens.some(t => ["fee", "fi", "taka", "cost", "dam", "ফি", "খরচ", "কত"].includes(t));
    const isDurationQuery = rawTokens.some(t => ["time", "shomoy", "duration", "সময়", "মেয়াদ", "কবে"].includes(t));

    if (this.context.lastCourse && (isFeeQuery || isDurationQuery) && rawTokens.length <= 3) {
      const courseItem = kb.find(item => item.id === this.context.lastCourse);
      if (courseItem) {
        return {
          matched: true,
          confidence: 0.95,
          item: courseItem,
          answer: `আপনি **${courseItem.title}** সম্পর্কে জানতে চেয়েছেন:\n\n${courseItem.answer}`,
          chips: courseItem.chips || ["ভর্তি লিঙ্ক দিন", "অন্যান্য কোর্স"]
        };
      }
    }

    // Loop through KB items
    for (const item of kb) {
      let itemScore = 0;

      // 1. Exact pattern inclusion check (High priority)
      for (const pattern of item.patterns) {
        const cleanPattern = this.normalize(pattern);
        if (cleanInput === cleanPattern) {
          itemScore = Math.max(itemScore, 1.0);
          matchReason = "Exact phrase match";
        } else if (cleanInput.includes(cleanPattern) || cleanPattern.includes(cleanInput)) {
          itemScore = Math.max(itemScore, 0.85);
          matchReason = "Substring match";
        } else {
          // Token matching between pattern and user input
          const patternTokens = this.tokenize(cleanPattern);
          const jaccard = this.calculateJaccard(inputTokens, patternTokens);
          itemScore = Math.max(itemScore, jaccard * 0.8);
        }
      }

      // 2. Title & answer content relevance
      const titleTokens = this.tokenize(item.title);
      const titleOverlap = titleTokens.filter(t => inputTokens.includes(t)).length;
      if (titleOverlap > 0) {
        itemScore = Math.max(itemScore, (titleOverlap / titleTokens.length) * 0.75);
      }

      if (itemScore > highestScore) {
        highestScore = itemScore;
        bestItem = item;
      }
    }

    this.context.historyCount++;

    // Threshold evaluation
    if (highestScore >= 0.40 && bestItem) {
      // Update contextual memory if it's a course
      if (bestItem.id.startsWith("course_")) {
        this.context.lastCourse = bestItem.id;
        this.context.lastTopic = bestItem.title;
      }

      return {
        matched: true,
        confidence: Math.round(highestScore * 100),
        item: bestItem,
        answer: bestItem.answer,
        chips: bestItem.chips || ["সকল কোর্স", "যোগাযোগ", "ভর্তি নিয়ম"]
      };
    }

    // Fallback for unrecognized questions
    return {
      matched: false,
      confidence: Math.round(highestScore * 100),
      answer: `দুঃখিত, আমি আপনার প্রশ্নটি পুরোপুরি বুঝতে পারিনি। 🤖\n\nআপনি কি ডিপু একাডেমির **কোর্সসমূহ, ভর্তি ফি, কিংবা ক্লাস শিডিউল** সম্পর্কিত তথ্য জানতে চাইছেন? নিচে দেওয়া অপশনগুলো দেখতে পারেন অথবা সরাসরি আমাদের হটলাইনে যোগাযোগ করতে পারেন।`,
      chips: [
        "সকল কোর্স তালিকা", 
        "ভর্তি হওয়ার নিয়ম", 
        "কোর্স ফি কত?", 
        "যোগাযোগ ও ঠিকানা", 
        "Dipu Sir সম্পর্কে"
      ]
    };
  }
}

// Global instance
const dipuAI = new DipuAIEngine();
