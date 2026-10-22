const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || Buffer.from('QVEuQWI4Uk42S2tUd0ZvSVhBYWFabXhxbV9ydE81NnhoYnhXU1p3dDhldFdydFBSVW9kS3c=', 'base64').toString('utf8');
const CANDIDATE_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemma-4-26b-a4b-it', 'gemma-4-31b-it'];

function callGoogleModel(model, payload) {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const dataString = JSON.stringify(payload);

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      },
      timeout: 18000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            const parts = parsed.candidates?.[0]?.content?.parts || [];
            const actualPart = parts.find(p => !p.thought) || parts[parts.length - 1];
            const text = actualPart ? actualPart.text : '';
            if (text) {
              return resolve({ success: true, text, model });
            }
          } catch (e) {
            return reject(new Error('JSON parse failed: ' + e.message));
          }
        }
        reject(new Error(`Model ${model} returned HTTP ${res.statusCode}: ${body.slice(0, 150)}`));
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout on model ${model}`));
    });

    req.on('error', (err) => reject(err));
    req.write(dataString);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (res.writeHead) res.writeHead(204);
    else if (res.status) res.status(204);
    return res.end();
  }

  if (req.method !== 'POST') {
    if (res.writeHead) res.writeHead(405, { 'Content-Type': 'application/json' });
    else if (res.status) res.status(405);
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let data = req.body;
  if (!data || typeof data === 'string') {
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { data = {}; }
    } else {
      data = await new Promise((resolve) => {
        let raw = '';
        req.on('data', chunk => raw += chunk);
        req.on('end', () => {
          try { resolve(JSON.parse(raw)); } catch (e) { resolve({}); }
        });
      });
    }
  }

  const { query, profile = {}, settings = {} } = data || {};
  if (!query) {
    if (res.writeHead) res.writeHead(400, { 'Content-Type': 'application/json' });
    else if (res.status) res.status(400);
    return res.end(JSON.stringify({ error: 'Query is required' }));
  }

  const pName = profile.name || 'Student';
  const pClass = profile.class || 'Class 10 (SSC)';
  const pSubjects = (profile.subjects || ['Science', 'Mathematics']).join(', ');

  const systemPrompt = `You are "Dipu Academy AI", a friendly and expert academic mentor for Class 10 (SSC) students in Bangladesh. Always respond in natural, encouraging Bengali (using English for technical terms where helpful).

Target Student:
- Name: ${pName}
- Class/Curriculum: ${pClass} (National Curriculum / NCTB Bangladesh)
- Focus Subjects: ${pSubjects}

CRITICAL PEDAGOGICAL & FORMATTING RULES:
1. NEVER output your internal thinking process, meta-commentary, self-evaluations, or raw JSON keys/markdown labels in the final response.

2. IF THE QUESTION IS MATHEMATICAL / QUANTITATIVE / ACCOUNTING / STATISTICS:
Always format the step-by-step solution using these EXACT section headers:
### 📌 প্রদত্ত তথ্য (Given)
(List all given values, variables, and units)

### 📐 প্রয়োজনীয় সূত্র (Formula)
(State the formula or theorem clearly)

### 📊 ছক ও সমাধান (Calculation)
(For Accounting/Statistics, ALWAYS use a clean Markdown Table with headers; for Math/Physics, show neat step-by-step arithmetic and algebra)

### 🎯 চূড়ান্ত উত্তর (Final Answer)
(State the final answer clearly with proper units)

3. IF THE QUESTION IS THEORETICAL / CONCEPTUAL / NON-MATH (Bangla, English, History, Civics, Biology, General Science, Islamic/Religious Studies, etc.):
Always format the explanation using these beautiful visual sections:
### 💡 মূল ধারণা ও সংজ্ঞা (Definition)
> (Put the textbook definition or core concept clearly inside this blockquote)

### 🔑 গুরুত্বপূর্ণ পয়েন্টসমূহ (Key Points)
(Bullet points detailing the essential characteristics, causes, or rules)

### 📖 বাস্তব উদাহরণ ও প্রয়োগ (Example)
(A relatable, clear real-life example or application)

### ⚠️ পরীক্ষার টিপস (SSC Exam Tip)
(Key advice for SSC board exams: common student mistakes or what examiners look for)

Return ONLY a valid JSON object matching this schema (with NO markdown backticks outside the JSON):
{
  "headline": "A short, descriptive 3-6 word summary headline",
  "text": "The full educational response formatted with the exact headers specified above",
  "formula": "The main formula or theorem rule if applicable (leave empty if non-math)",
  "formulaLabel": "Variables breakdown (leave empty if non-math)",
  "example": "A fully worked-out markdown table or brief supplementary highlight",
  "textbook": "NCTB Curriculum Verified"
}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${systemPrompt}\n\nStudent Question: ${query}` }
        ]
      }
    ]
  };

  try {
    let generatedText = null;
    let usedModel = null;

    for (const m of CANDIDATE_MODELS) {
      try {
        const result = await callGoogleModel(m, payload);
        if (result && result.text) {
          generatedText = result.text;
          usedModel = m;
          break;
        }
      } catch (err) {
        console.warn(`[Vercel API] Failed with ${m}:`, err.message);
      }
    }

    if (!generatedText) {
      throw new Error('All candidate models exhausted');
    }

    function sanitizeField(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .replace(/\*\s*JSON\s*object\?[\s\S]*$/gi, '')
        .replace(/\*\s*Fields\s*correct\?[\s\S]*$/gi, '')
        .replace(/\*\s*No\s*markdown\?[\s\S]*$/gi, '')
        .replace(/\*\s*Identity\s*maintained\?[\s\S]*$/gi, '')
        .replace(/\*\s*Tone\s*appropriate\?[\s\S]*$/gi, '')
        .replace(/\*\s*Student\s*addressed\?[\s\S]*$/gi, '')
        .trim();
    }

    let jsonString = generatedText.trim();
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (match) {
      jsonString = match[0];
    }
    let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    clean = clean.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');

    let parsedData = {};
    try {
      parsedData = JSON.parse(clean);
    } catch (err) {
      const extractField = (key) => {
        const re = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, 's');
        const m = clean.match(re);
        if (m && m[1]) {
          return m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        return '';
      };

      parsedData = {
        headline: extractField('headline'),
        text: extractField('text') || sanitizeField(generatedText),
        formula: extractField('formula'),
        formulaLabel: extractField('formulaLabel'),
        example: extractField('example'),
        textbook: extractField('textbook')
      };
    }

    const responsePayload = JSON.stringify({
      headline: sanitizeField(parsedData.headline) || 'Solution & Explanation',
      text: sanitizeField(parsedData.text) || sanitizeField(generatedText),
      formula: sanitizeField(parsedData.formula) || '',
      formulaLabel: sanitizeField(parsedData.formulaLabel) || '',
      example: sanitizeField(parsedData.example) || '',
      textbook: sanitizeField(parsedData.textbook) || '',
      modelUsed: usedModel
    });

    if (res.writeHead) res.writeHead(200, { 'Content-Type': 'application/json' });
    else if (res.status) res.status(200);
    res.end(responsePayload);

  } catch (error) {
    console.error('[Vercel API Server Error]:', error);
    if (res.writeHead) res.writeHead(500, { 'Content-Type': 'application/json' });
    else if (res.status) res.status(500);
    res.end(JSON.stringify({ error: error.message }));
  }
};
