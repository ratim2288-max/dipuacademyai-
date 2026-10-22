/**
 * DipuAcademy Custom Knowledge Base
 * ----------------------------------
 * এই ফাইলটিতে DipuAcademy এর সমস্ত কোর্স, অ্যাডমিশন, সাধারণ প্রশ্নোত্তর ও তথ্য সংরক্ষিত আছে।
 * ইউজার চাইলে সরাসরি ব্রাউজার ইন্টারফেস থেকেও নতুন ডেটা যোগ/এডিট করতে পারবেন।
 */

const DEFAULT_KNOWLEDGE_BASE = [
  // --- Academy Info & Greetings ---
  {
    id: "about_academy",
    category: "About",
    title: "DipuAcademy পরিচিতি",
    patterns: [
      "dipu academy ki", "dipu academy ki kaj kore", "dipuacademy ki", 
      "what is dipuacademy", "about dipu academy", "academy details",
      "দীপু একাডেমি কি", "দীপু একাডেমি সম্পর্কে বলো", "তোমাদের একাডেমি কি"
    ],
    answer: `**DipuAcademy** হলো একটি আধুনিক ও বিশ্বমানের প্রফেশনাল স্কিল ডেভেলপমেন্ট এবং আইটি ট্রেনিং প্ল্যাটফর্ম। 🚀

এখানে শিক্ষার্থীদের বর্তমান সময়ের চাহিদাসম্পন্ন প্রযুক্তি যেমন: **Full-Stack Web Development, AI & Data Science, UI/UX Design, এবং Digital Marketing** এর বাস্তবমুখী প্র্যাকটিক্যাল প্রজেক্টভিত্তিক প্রশিক্ষণ প্রদান করা হয়।

✨ **আমাদের বিশেষত্ব:**
• ১০০% প্রজেক্ট বেইজড ক্লাস
• ডেডিকেটেড ১-অন-১ মেন্টর সাপোর্ট
• লাইফটাইম কোর্স এক্সেস ও কমিউনিটি সাপোর্ট
• ইন্টার্নশিপ ও ফ্রিল্যান্সিং গাইডলাইন`,
    chips: ["কোর্সসমূহ কি কি?", "ভর্তি হওয়ার নিয়ম", "যোগাযোগের ঠিকানা"]
  },
  {
    id: "greetings",
    category: "General",
    title: "শুভেচ্ছা ও কুশল বিনিময়",
    patterns: [
      "hi", "hello", "hey", "assalamu alaikum", "slam", "kemon achen", 
      "হাই", "হ্যালো", "আসসালামু আলাইকুম", "কেমন আছেন", "নমস্কার", "শুভ সকাল", "শুভ সন্ধ্যা"
    ],
    answer: `ওয়ালাইকুম আসসালাম! **DipuAcademy AI Assistant**-এ আপনাকে স্বাগতম! 😊 

আমি আপনাকে আমাদের বিভিন্ন কোর্স, ফি, ক্লাস শিডিউল, ও ভর্তি সম্পর্কিত যেকোনো তথ্য দিয়ে সাহায্য করতে পারি। 

আপনি আজ কি বিষয়ে জানতে আগ্রহী?`,
    chips: ["সকল কোর্স দেখুন", "কোর্স ফি কত?", "ভর্তির প্রক্রিয়া", "সাপোর্ট ও যোগাযোগ"]
  },

  // --- Courses ---
  {
    id: "course_web_dev",
    category: "Courses",
    title: "Full-Stack Web Development Course",
    patterns: [
      "web development course", "web dev", "mern stack", "html css javascript react", 
      "ওয়েব ডেভেলপমেন্ট", "ওয়েব ডেভেলপমেন্ট কোর্স", "ওয়েব ডিজাইন", "frontend backend"
    ],
    answer: `🌐 **Full-Stack Web Development Masterclass**

শূন্য থেকে অ্যাডভান্সড লেভেলের কমপ্লিট ওয়েব ডেভেলপার হওয়ার সবচেয়ে প্রিমিয়াম কোর্স!

📌 **যা যা শিখবেন:**
• Frontend: HTML5, Modern CSS3, Tailwind CSS, JavaScript (ES6+), React.js
• Backend: Node.js, Express.js
• Database: MongoDB, Firebase
• Tools: Git, GitHub, Vercel, REST API Integration

⏱️ **কোর্সের মেয়াদ:** ৪ মাস (৪৮টি লাইভ ক্লাস)
💰 **কোর্স ফি:** ৫,০০০ টাকা (স্পেশাল স্কলারশিপে ৩৫০০ টাকা)
🏆 **সার্টিফিকেট:** কোর্স সম্পন্ন শেষে ভেরিফাইড প্রফেশনাল সার্টিফিকেট।`,
    chips: ["ওয়েব কোর্সে ভর্তি", "অন্যান্য কোর্সসমূহ", "মেন্টর কে?"]
  },
  {
    id: "course_ai_python",
    category: "Courses",
    title: "Python, Machine Learning & AI",
    patterns: [
      "ai course", "python course", "machine learning", "data science", 
      "কৃত্রিম বুদ্ধিমত্তা", "পাইথন কোর্স", "এআই কোর্স", "মেশিন লার্নিং"
    ],
    answer: `🤖 **Python, Machine Learning & AI Masterclass**

ভবিষ্যতের আধুনিক টেকনোলজিতে দক্ষ হতে ডিপু একাডেমির স্পেশাল AI প্রোগ্রাম।

📌 **কোর্স কারিকুলাম:**
• Python Programming (Basics to OOP)
• Data Analysis: NumPy, Pandas, Matplotlib
• Machine Learning Models: Regression, Classification, Clustering
• Deep Learning & LLM / OpenAI API Integration
• Real-life AI Chatbot & Prediction Projects

⏱️ **কোর্সের মেয়াদ:** ৩.৫ মাস
💰 **কোর্স ফি:** ৬,০০০ টাকা
🎓 **কারা করতে পারবে:** যাদের গণিত ও প্রোগ্রামিংয়ের বেসিক আগ্রহ আছে।`,
    chips: ["পাইথন ক্লাসের সময়", "ভর্তি লিঙ্ক দিন", "কোর্স ফি"]
  },
  {
    id: "course_graphics_uiux",
    category: "Courses",
    title: "UI/UX & Graphic Design",
    patterns: [
      "graphic design", "ui ux design", "figma photoshop", "গ্রাফিক্স ডিজাইন", "ইউআই ইউএক্স"
    ],
    answer: `🎨 **Professional Graphic & UI/UX Design**

সৃজনশীল ক্যারিয়ার গড়তে ডিজাইন টুলস ও প্রফেশনাল থিওরি শেখার সেরা কোর্স।

📌 **টুলস ও টপিকস:**
• Figma (Wireframing, Prototyping, Mobile App & Web UI)
• Adobe Photoshop & Illustrator (Branding, Logo, Social Media Ads)
• Design Principles, Typography & Color Psychology
• Behance & Dribbble Portfolio Creation

⏱️ **মেয়াদ:** ৩ মাস (৩৬টি ক্লাস)
💰 **ফি:** ৪,০০০ টাকা`,
    chips: ["UI/UX কোর্সে ভর্তি", "ক্লাস কীভাবে হয়?"]
  },
  {
    id: "course_digital_marketing",
    category: "Courses",
    title: "Digital Marketing & Freelancing",
    patterns: [
      "digital marketing", "seo", "facebook ads", "ডিজিটাল মার্কেটিং", "ফ্রিল্যান্সিং"
    ],
    answer: `📈 **Complete Digital Marketing & Freelancing**

অনলাইন বিজনেস গ্রোথ ও আন্তর্জাতিক মার্কেটপ্লেসে সফল ক্যারিয়ার গড়ার কোর্স।

📌 **হাইলাইটস:**
• Search Engine Optimization (SEO - Onpage, Offpage, Technical)
• Facebook, Instagram, Google Ads & Meta Pixel
• Content Strategy & Email Marketing
• Fiverr ও Upwork মার্কেটপ্লেস হ্যান্ডহোল্ডিং গাইডলাইন

⏱️ **মেয়াদ:** ২.৫ মাস
💰 **ফি:** ৩,৫০০ টাকা`,
    chips: ["ফ্রিল্যান্সিং গাইডলাইন", "ভর্তি নিয়ম"]
  },
  {
    id: "all_courses",
    category: "Courses",
    title: "সকল কোর্স তালিকা",
    patterns: [
      "all courses", "kors gulo ki ki", "course list", "sob course", 
      "কি কি কোর্স আছে", "সব কোর্স তালিকা", "কোর্স লিস্ট", "কোর্সের নাম"
    ],
    answer: `📚 **DipuAcademy-তে বর্তমানে চালু থাকা কোর্সসমূহ:**

1. 🌐 **Full-Stack Web Development** (MERN Stack) — ফি: ৩৫০০৳
2. 🤖 **Python & AI / Machine Learning** — ফি: ৬০০০৳
3. 🎨 **UI/UX & Creative Graphic Design** — ফি: ৪০০০৳
4. 📈 **Digital Marketing & SEO Masterclass** — ফি: ৩৫০০৳
5. 💼 **Freelancing & Career Launchpad** (ফ্রি সাথে অন্তর্ভুক্ত)

যে কোনো নির্দিষ্ট কোর্সের বিস্তারিত জানতে কোর্সের নাম লিখে মেসেজ করুন!`,
    chips: ["Web Development", "Python & AI", "UI/UX Design", "Digital Marketing"]
  },

  // --- Admission & Fees ---
  {
    id: "admission_process",
    category: "Admission",
    title: "ভর্তি হওয়ার নিয়ম",
    patterns: [
      "admission process", "how to admit", "vorti hobo kivabe", "admission", 
      "ভর্তি হব কিভাবে", "ভর্তি হওয়ার নিয়ম", "অ্যাডমিশন প্রসেস", "রেজিস্ট্রেশন"
    ],
    answer: `📝 **DipuAcademy-তে ভর্তি হওয়ার সহজ ৪টি ধাপ:**

1️⃣ **কোর্স নির্বাচন করুন:** আমাদের ওয়েবসাইট বা এই চ্যাটবট থেকে আপনার পছন্দের কোর্স সিলেক্ট করুন।
2️⃣ **অ্যাডমিশন ফর্ম পূরণ করুন:** আমাদের অফিসিয়াল পোর্টালে আপনার নাম, ফোন ও ইমেইল দিয়ে ফর্ম সাবমিট করুন।
3️⃣ **পেমেন্ট সম্পন্ন করুন:** বিকাশ/নগদ/রকেটে নির্ধারিত কোর্স ফি পেমেন্ট করে ট্রানজেকশন আইডি দিন।
4️⃣ **কনফার্মেশন ও ব্যাচ এক্সেস:** ৩০ মিনিটের মধ্যে এসএমএস/ইমেইলে ক্লাস গ্রুপ ও স্টুডেন্ট পোর্টালের এক্সেস পেয়ে যাবেন!

📞 যেকোনো প্রয়োজনে সরাসরি কল বা হোয়াটসঅ্যাপ করুন: **+880 1700-000000**`,
    chips: ["বিকাশ পেমেন্ট নম্বর", "কোর্স ফি কত?", "অফিস কোথায়?"]
  },
  {
    id: "payment_methods",
    category: "Admission",
    title: "পেমেন্ট মাধ্যম",
    patterns: [
      "payment method", "bkash nagad", "kivabe taka pathabo", "taka payment", 
      "পেমেন্ট নম্বর", "বিকাশ নম্বর", "নগদ", "ফি কিভাবে দেব"
    ],
    answer: `💳 **পেমেন্ট করার নিয়মাবলী:**

আপনি নিম্নলিখিত মাধ্যমে খুব সহজেই ফি প্রদান করতে পারেন:
• **bKash (Personal / Merchant):** 01700-000000
• **Nagad (Personal):** 01800-000000
• **Rocket:** 01700-000000-8
• **Bank Transfer:** City Bank / Dutch Bangla Bank (ডিটেইলসের জন্য ইনবক্স করুন)

⚠️ *পেমেন্ট করার পর রেফারেন্সে আপনার নাম ও মোবাইল নম্বর লিখবেন এবং ট্রানজেকশন আইডি সেভ রাখবেন।*`,
    chips: ["ভর্তির ফর্ম লিঙ্ক", "সাপোর্ট হটলাইন"]
  },

  // --- Classes & Certificate ---
  {
    id: "class_system",
    category: "Academic",
    title: "ক্লাস কীভাবে হয়?",
    patterns: [
      "class kivabe hoy", "online or offline", "live class", "recorded class", 
      "ক্লাস কিভাবে হয়", "অনলাইন নাকি অফলাইন", "লাইভ ক্লাস", "রেকর্ডেড ভিডিও"
    ],
    answer: `🎓 **আমাদের ক্লাস সিস্টেম:**

• **ক্লাস ফরম্যাট:** Zoom / Google Meet-এ সরাসরি প্রিমিয়াম ইন্টারঅ্যাক্টিভ লাইভ ক্লাস।
• **রেকর্ডিং ব্যাকআপ:** প্রতিটি লাইভ ক্লাসের HD রেকর্ডিং ক্লাস শেষ হওয়ার ২ ঘণ্টার মধ্যে স্টুডেন্ট ড্যাশবোর্ডে আপলোড করা হয়।
• **সাপোর্ট সেশন:** প্রতিদিন সকাল ১১টা থেকে রাত ১১টা পর্যন্ত ডেডিকেটেড গুগল মিট সাপোর্ট রুম খোলা থাকে।
• **অ্যাসাইনমেন্ট ও প্রজেক্ট:** প্রতি সপ্তাহে হ্যান্ডস-অন হোমওয়ার্ক ও টেস্ট প্রজেক্ট নেওয়া হয়।`,
    chips: ["সার্টিফিকেট পাওয়া যাবে?", "ক্লাসের সময়সূচী", "সকল কোর্স"]
  },
  {
    id: "certificate_info",
    category: "Academic",
    title: "সার্টিফিকেট তথ্য",
    patterns: [
      "certificate pabo", "certificate deya hoy", "is certificate valid", 
      "সার্টিফিকেট", "সার্টিফিকেট পাবো কি", "ভেরিফাইড সার্টিফিকেট"
    ],
    answer: `🏆 **হ্যাঁ, নিশ্চিতভাবেই ভেরিফাইড সার্টিফিকেট পাবেন!**

কোর্সের সমস্ত অ্যাসাইনমেন্ট ও ফাইনাল ক্যাপস্টোন প্রজেক্ট সফলভাবে জমা দেওয়ার পর আপনাকে **DipuAcademy Certified Graduate** ডিজিটাল ও প্রিন্টেবল সার্টিফিকেট দেওয়া হবে। 

প্রতিটি সার্টিফিকেটে একটি ইউনিক **QR Code ও Verification ID** থাকে যা যেকোনো নিয়োগদাতা অনলাইন থেকে যাচাই করতে পারবেন।`,
    chips: ["কোর্সের মেয়াদ কত?", "ভর্তি হওয়ার নিয়ম"]
  },

  // --- Contact & Location ---
  {
    id: "contact_support",
    category: "Support",
    title: "যোগাযোগ ও ঠিকানা",
    patterns: [
      "contact", "phone number", "whatsapp", "address", "location", "office", 
      "যোগাযোগ", "ফোন নম্বর", "হোয়াটসঅ্যাপ", "ঠিকানা", "অফিস কোথায়", "হেল্পলাইন"
    ],
    answer: `📍 **DipuAcademy হেড অফিস ও যোগাযোগ:**

🏢 **অফিস ঠিকানা:** লেভেল ৪, আইটি পার্ক টাওয়ার, ধানমন্ডি, ঢাকা - ১২০৯
📞 **হটলাইন:** +880 1700-000000 / +880 1800-000000
💬 **হোয়াটসঅ্যাপ:** +880 1700-000000
📧 **ইমেইল:** support@dipuacademy.com / info@dipuacademy.com
🌐 **ওয়েবসাইট:** www.dipuacademy.com
⏰ **অফিস সময়:** শনি - বৃহস্পতি (সকাল ৯:০০ টা - রাত ৮:০০ টা)`,
    chips: ["ফেসবুক পেজ লিঙ্ক", "ভর্তি সংক্রান্ত সাহায্য", "কোর্স ফি"]
  },
  {
    id: "founder_dipu",
    category: "About",
    title: "প্রতিষ্ঠাতা ও ইন্সট্রাক্টর",
    patterns: [
      "dipu sir ke", "founder", "instructor", "teacher", "who is dipu", 
      "দীপু স্যার কে", "ইন্সট্রাক্টর কে", "টিচার কে", "প্রতিষ্ঠাতা"
    ],
    answer: `👨‍🏫 **Dipu Sir সম্পর্কে:**

দীপু স্যার হলেন একজন সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার ও অভিজ্ঞ টেক মেন্টর। তিনি বিগত ৭+ বছর ধরে দেশ-বিদেশের বিভিন্ন মাল্টিন্যাশনাল কোম্পানিতে সফটওয়্যার আর্কিটেক্ট ও লিড ডেভেলপার হিসেবে দায়িত্ব পালন করেছেন।

তাঁর হাত ধরে ৫০০০+ শিক্ষার্থী সফলভাবে প্রোগ্রামিং, ফ্রিল্যান্সিং ও টেক ক্যারিয়ারে যুক্ত হয়েছেন। ডিপু একাডেমিতে প্রতিটি কোর্স তাঁর সরাসরি তত্ত্বাবধানে পরিচালিত হয়।`,
    chips: ["ওয়েব ডেভেলপমেন্ট কোর্স", "যোগাযোগের ঠিকানা"]
  }
];

// Helper to get active knowledge base (merged with localStorage)
function getActiveKnowledgeBase() {
  try {
    const saved = localStorage.getItem("dipu_academy_kb");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load custom KB from storage, using default", e);
  }
  return DEFAULT_KNOWLEDGE_BASE;
}

// Helper to save knowledge base
function saveActiveKnowledgeBase(kbArray) {
  try {
    localStorage.setItem("dipu_academy_kb", JSON.stringify(kbArray));
    return true;
  } catch (e) {
    console.error("Failed to save KB to storage", e);
    return false;
  }
}
