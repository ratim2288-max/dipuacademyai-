/**
 * DipuAcademy AI — Interactive Chat App Controller
 * ------------------------------------------------
 * Handles UI interactions, message sending, markdown parsing,
 * speech synthesis & recognition, and the Custom Training Data Modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const btnSend = document.getElementById("btnSend");
  const btnMic = document.getElementById("btnMic");
  const suggestionContainer = document.getElementById("suggestionChips");
  const btnClearChat = document.getElementById("btnClearChat");
  const btnAudioToggle = document.getElementById("btnAudioToggle");
  const btnOpenKB = document.getElementById("btnOpenKB");
  const kbModal = document.getElementById("kbModal");
  const btnCloseKB = document.getElementById("btnCloseKB");
  const toastNotice = document.getElementById("toastNotice");

  // State
  let soundEnabled = true;
  let isListening = false;
  let recognition = null;

  // Initialize Speech Recognition if supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "bn-BD"; // Bengali support with fallback to en-US

    recognition.onstart = () => {
      isListening = true;
      btnMic.classList.add("listening");
      showToast("🎙️ শুনছি... আপনার প্রশ্ন বলুন");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      handleSendMessage();
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      isListening = false;
      btnMic.classList.remove("listening");
    };

    recognition.onend = () => {
      isListening = false;
      btnMic.classList.remove("listening");
    };
  } else {
    btnMic.style.display = "none";
  }

  // Play subtle sound using Web Audio API (no external file dependencies)
  function playBeep(type = "recv") {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "send") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // AudioContext not allowed or not supported
    }
  }

  // Toast Notification
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toastNotice.classList.add("show");
    setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 2800);
  }

  // Simple Markdown to HTML parser
  function formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Phone / WhatsApp links
    html = html.replace(/(\+880[\s-]?\d{4}-?\d{6})/g, '<a href="tel:$1" style="color: #38bdf8; text-decoration: underline;">$1</a>');

    // Bullet points
    html = html.replace(/^[•\-\*]\s+(.*)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Numbered lists
    html = html.replace(/^\d+[\.\)]\s+(.*)$/gm, "<li>$1</li>");

    // Line breaks
    html = html.replace(/\n\n/g, "<p></p>").replace(/\n/g, "<br>");

    return html;
  }

  // Format current time
  function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Add message bubble to chat
  function appendMessage(text, sender = "bot", confidence = null) {
    const row = document.createElement("div");
    row.className = `message-row ${sender}-row`;

    const avatar = document.createElement("div");
    avatar.className = `avatar ${sender}-avatar`;
    avatar.innerHTML = sender === "bot" ? "🤖" : "👤";

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${sender}-bubble`;

    // Content
    const contentDiv = document.createElement("div");
    contentDiv.className = "bubble-content";
    contentDiv.innerHTML = formatMarkdown(text);
    bubble.appendChild(contentDiv);

    // Footer with time & actions
    const footer = document.createElement("div");
    footer.className = "bubble-footer";
    
    const timeSpan = document.createElement("span");
    timeSpan.textContent = getTimeString() + (confidence ? ` • Confidence ${confidence}%` : "");
    footer.appendChild(timeSpan);

    if (sender === "bot") {
      const actions = document.createElement("div");
      actions.className = "bubble-actions";

      // Copy Button
      const btnCopy = document.createElement("button");
      btnCopy.className = "action-chip";
      btnCopy.innerHTML = "📋 কপি";
      btnCopy.title = "মেসেজ কপি করুন";
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(text);
        btnCopy.innerHTML = "✓ কপিড";
        setTimeout(() => { btnCopy.innerHTML = "📋 কপি"; }, 1500);
      };

      // Speak Button
      const btnSpeak = document.createElement("button");
      btnSpeak.className = "action-chip";
      btnSpeak.innerHTML = "🔊 শুনুন";
      btnSpeak.title = "ভয়েসে শুনুন";
      btnSpeak.onclick = () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const cleanText = text.replace(/[*#•]/g, "");
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = "bn-BD";
          window.speechSynthesis.speak(utterance);
        }
      };

      actions.appendChild(btnCopy);
      actions.appendChild(btnSpeak);
      footer.appendChild(actions);
    }

    bubble.appendChild(footer);
    row.appendChild(avatar);
    row.appendChild(bubble);

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "bot") playBeep("recv");
    else playBeep("send");
  }

  // Show typing indicator
  function showTypingIndicator() {
    const row = document.createElement("div");
    row.className = "message-row bot-row";
    row.id = "activeTyping";

    const avatar = document.createElement("div");
    avatar.className = "avatar bot-avatar";
    avatar.innerHTML = "🤖";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble bot-bubble";
    bubble.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("activeTyping");
    if (indicator) indicator.remove();
  }

  // Render suggestion chips
  function updateSuggestionChips(chips = []) {
    suggestionContainer.innerHTML = "";
    if (!chips || chips.length === 0) return;

    chips.forEach(chipText => {
      const chip = document.createElement("button");
      chip.className = "suggestion-chip";
      chip.innerHTML = `<span>💬</span> ${chipText}`;
      chip.onclick = () => {
        chatInput.value = chipText;
        handleSendMessage();
      };
      suggestionContainer.appendChild(chip);
    });
  }

  // Send message flow
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Render User Message
    appendMessage(text, "user");
    chatInput.value = "";
    chatInput.focus();

    // 2. Typing indicator
    showTypingIndicator();

    // 3. Process via AI Matching Engine with a realistic micro-delay
    const delay = Math.floor(Math.random() * 250) + 350;
    setTimeout(() => {
      removeTypingIndicator();
      const response = dipuAI.findBestMatch(text);
      appendMessage(response.answer, "bot", response.confidence);
      updateSuggestionChips(response.chips);
    }, delay);
  }

  // Event Listeners for Chat
  btnSend.addEventListener("click", handleSendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Microphone click
  if (btnMic && recognition) {
    btnMic.addEventListener("click", () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  }

  // Clear chat
  btnClearChat.addEventListener("click", () => {
    if (confirm("আপনি কি চ্যাট হিস্ট্রি ক্লিয়ার করতে চান?")) {
      chatMessages.innerHTML = "";
      dipuAI.context = { lastTopic: null, lastCourse: null, historyCount: 0 };
      initWelcomeMessage();
      showToast("চ্যাট রিসেট করা হয়েছে");
    }
  });

  // Sound toggle
  btnAudioToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnAudioToggle.innerHTML = soundEnabled ? "🔊" : "🔇";
    showToast(soundEnabled ? "সাউন্ড অন করা হয়েছে" : "সাউন্ড মিউট করা হয়েছে");
  });

  // Welcome message init
  function initWelcomeMessage() {
    const welcome = `স্বাগতম! 🌟 আমি **DipuAcademy AI Assistant**। 

আপনি আমাদের **কোর্সসমূহ, ভর্তি ফি, লাইভ ক্লাসের শিডিউল, ও ডিপু স্যার সম্পর্কিত** যেকোনো প্রশ্ন করতে পারেন। নিচে দেওয়া সাজেশনের যেকোনোটিতে ক্লিক করে দ্রুত শুরু করতে পারেন!`;
    appendMessage(welcome, "bot");
    updateSuggestionChips([
      "সকল কোর্স তালিকা",
      "ওয়েব ডেভেলপমেন্ট কোর্স",
      "Python & AI কোর্স",
      "কোর্স ফি কত?",
      "ভর্তি হওয়ার নিয়ম",
      "যোগাযোগের ঠিকানা"
    ]);
  }

  // =========================================================
  // Knowledge Base Training Management Modal Logic
  // =========================================================
  const kbTabList = document.getElementById("kbTabList");
  const kbTabAdd = document.getElementById("kbTabAdd");
  const kbSectionList = document.getElementById("kbSectionList");
  const kbSectionAdd = document.getElementById("kbSectionAdd");
  const kbCardContainer = document.getElementById("kbCardContainer");
  const kbSearchInput = document.getElementById("kbSearchInput");
  const formAddKB = document.getElementById("formAddKB");
  const btnResetKB = document.getElementById("btnResetKB");
  const btnExportKB = document.getElementById("btnExportKB");
  const btnImportKB = document.getElementById("btnImportKB");
  const fileImportInput = document.getElementById("fileImportInput");

  // Open / Close Modal
  btnOpenKB.addEventListener("click", () => {
    kbModal.classList.add("open");
    renderKBList();
  });

  btnCloseKB.addEventListener("click", () => {
    kbModal.classList.remove("open");
  });

  kbModal.addEventListener("click", (e) => {
    if (e.target === kbModal) kbModal.classList.remove("open");
  });

  // Tabs
  kbTabList.addEventListener("click", () => {
    kbTabList.classList.add("active");
    kbTabAdd.classList.remove("active");
    kbSectionList.style.display = "block";
    kbSectionAdd.style.display = "none";
    renderKBList();
  });

  kbTabAdd.addEventListener("click", () => {
    kbTabAdd.classList.add("active");
    kbTabList.classList.remove("active");
    kbSectionList.style.display = "none";
    kbSectionAdd.style.display = "block";
  });

  // Render items in KB list
  function renderKBList(filterText = "") {
    const kb = getActiveKnowledgeBase();
    kbCardContainer.innerHTML = "";

    const filtered = kb.filter(item => {
      const q = filterText.toLowerCase();
      return item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.patterns.some(p => p.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      kbCardContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">কোনো ডাটা পাওয়া যায়নি।</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "kb-card-item";

      const meta = document.createElement("div");
      meta.className = "kb-card-meta";
      meta.innerHTML = `
        <span class="kb-card-badge">${item.category}</span>
        <div class="kb-card-title">${item.title}</div>
        <div class="kb-card-patterns"><strong>প্রশ্ন/কীওয়ার্ডস:</strong> ${item.patterns.join(", ")}</div>
      `;

      const actions = document.createElement("div");
      actions.className = "kb-actions";

      const btnDel = document.createElement("button");
      btnDel.className = "btn-card-del";
      btnDel.innerHTML = "🗑️ ডিলিট";
      btnDel.onclick = () => {
        if (confirm(`আপনি কি "${item.title}" তথ্যটি ট্রেনিং ডাটা থেকে মুছে ফেলতে চান?`)) {
          const currentKB = getActiveKnowledgeBase();
          const updated = currentKB.filter(x => x.id !== item.id);
          saveActiveKnowledgeBase(updated);
          renderKBList(kbSearchInput.value);
          showToast("ডাটা ডিলিট করা হয়েছে");
        }
      };

      actions.appendChild(btnDel);
      card.appendChild(meta);
      card.appendChild(actions);
      kbCardContainer.appendChild(card);
    });
  }

  // Filter KB search
  kbSearchInput.addEventListener("input", (e) => {
    renderKBList(e.target.value);
  });

  // Add new Custom Knowledge
  formAddKB.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = document.getElementById("kbCategory").value.trim();
    const title = document.getElementById("kbTitle").value.trim();
    const rawPatterns = document.getElementById("kbPatterns").value.trim();
    const answer = document.getElementById("kbAnswer").value.trim();
    const rawChips = document.getElementById("kbChips").value.trim();

    if (!title || !rawPatterns || !answer) {
      alert("অনুগ্রহ করে টাইটেল, প্রশ্ন ও উত্তর পূরণ করুন!");
      return;
    }

    const patterns = rawPatterns.split(",").map(p => p.trim()).filter(p => p.length > 0);
    const chips = rawChips ? rawChips.split(",").map(c => c.trim()).filter(c => c.length > 0) : ["সকল কোর্স", "যোগাযোগ"];

    const newItem = {
      id: "custom_" + Date.now(),
      category: category || "Custom",
      title: title,
      patterns: patterns,
      answer: answer,
      chips: chips
    };

    const currentKB = getActiveKnowledgeBase();
    currentKB.unshift(newItem);
    saveActiveKnowledgeBase(currentKB);

    formAddKB.reset();
    showToast("🎉 নতুন ট্রেনিং ডাটা সফলভাবে যুক্ত হয়েছে!");
    kbTabList.click();
  });

  // Reset to default
  btnResetKB.addEventListener("click", () => {
    if (confirm("আপনি কি সমস্ত কাস্টম ডাটা মুছে ফ্যাক্টরি ডিফল্টে রিসেট করতে চান?")) {
      localStorage.removeItem("dipu_academy_kb");
      renderKBList();
      showToast("ডিফল্ট ডাটায় রিসেট সম্পন্ন!");
    }
  });

  // Export JSON
  btnExportKB.addEventListener("click", () => {
    const kb = getActiveKnowledgeBase();
    const blob = new Blob([JSON.stringify(kb, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dipuacademy_knowledge_base_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON ব্যাকআপ ডাউনলোড হয়েছে");
  });

  // Import JSON
  btnImportKB.addEventListener("click", () => {
    fileImportInput.click();
  });

  fileImportInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          saveActiveKnowledgeBase(imported);
          renderKBList();
          showToast("সফলভাবে JSON ডাটা ইম্পোর্ট করা হয়েছে!");
        } else {
          alert("ভুল ফাইল ফরম্যাট! একটি বৈধ JSON ফাইল দিন।");
        }
      } catch (err) {
        alert("JSON ফাইল পড়তে সমস্যা হয়েছে: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Run initial welcome
  initWelcomeMessage();
});
