/**
 * Dipu Academy AI — Complete Interactive Application Logic
 * Full implementation matching user's custom UI/UX design:
 * - 3 Dedicated Screens: Chat, Student Profile, AI Settings
 * - Slide-Over History Drawer with search and grouping
 * - Step-by-Step AI Responses with Formula Boxes & Audio TTS
 * - Keep Learning Quiz & Example shortcuts
 * - Dark/Light Theme Switching & Profile Customization
 */

(function () {
  'use strict';

  // API & State Constants
  const INTERNAL_API_KEY = atob('QVEuQWI4Uk42S2tUd0ZvSVhBYWFabXhxbV9ydE81NnhoYnhXU1p3dDhldFdydFBSVW9kS3c=');
  const ACTIVE_MODEL = 'gemini-3-flash-preview';

  const STORAGE_KEYS = {
    STUDENT_PROFILE: 'dipu_student_profile_v3',
    AI_SETTINGS: 'dipu_ai_settings_v3',
    SESSIONS: 'dipu_chat_sessions_v3',
    ACTIVE_SESSION_ID: 'dipu_active_session_id_v3',
    THEME: 'dipu_app_theme_v3'
  };

  const DEFAULT_PROFILE = {
    name: 'Ratim Ahmed',
    class: 'Class 10 (SSC)',
    age: '16',
    gender: 'Male',
    subjects: ['Science', 'Mathematics'],
    avatarType: 'grad',
    customPhotoUrl: '',
    completed: true
  };

  const DEFAULT_SETTINGS = {
    language: 'Bilingual',
    style: 'Step-by-step',
    everydayExamples: true,
    theme: 'light',
    studyReminders: true,
    saveHistory: true,
    improveAI: false
  };

  let state = {
    profile: { ...DEFAULT_PROFILE },
    settings: { ...DEFAULT_SETTINGS },
    sessions: [],
    currentSessionId: null,
    isThinking: false,
    activeView: 'chat',
    pendingAttachment: null,
    messageQueue: []
  };

  // DOM Views
  const viewChat = document.getElementById('viewChat');
  const viewProfile = document.getElementById('viewProfile');
  const viewSettings = document.getElementById('viewSettings');

  // Chat View Elements
  const chatArea = document.getElementById('chatArea');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const typingIndicator = document.getElementById('typingIndicator');
  const statusClock = document.getElementById('statusClock');
  const journeyBannerWrapper = document.getElementById('journeyBannerWrapper');
  const bannerJourneyTitle = document.getElementById('bannerJourneyTitle');
  const bannerJourneySub = document.getElementById('bannerJourneySub');
  const btnBannerProfile = document.getElementById('btnBannerProfile');
  const btnBannerFilter = document.getElementById('btnBannerFilter');
  const btnOpenSidebar = document.getElementById('btnOpenSidebar');
  const btnHeaderNewChat = document.getElementById('btnHeaderNewChat');
  const btnVoiceInput = document.getElementById('btnVoiceInput');
  const btnAttachFile = document.getElementById('btnAttachFile');
  const attachmentMenu = document.getElementById('attachmentMenu');
  const btnMenuCamera = document.getElementById('btnMenuCamera');
  const btnMenuGallery = document.getElementById('btnMenuGallery');
  const cameraDirectInput = document.getElementById('cameraDirectInput');
  const mediaUploadInput = document.getElementById('mediaUploadInput');
  const chatAttachmentPreview = document.getElementById('chatAttachmentPreview');
  const attachmentPreviewImg = document.getElementById('attachmentPreviewImg');
  const attachmentPreviewName = document.getElementById('attachmentPreviewName');
  const btnRemovePreview = document.getElementById('btnRemovePreview');
  const btnSend = document.getElementById('btnSend');

  // Queued Messages DOM Elements (Antigravity Style)
  const queuedMessagesContainer = document.getElementById('queuedMessagesContainer');
  const queuedCountPill = document.getElementById('queuedCountPill');
  const queuedItemsList = document.getElementById('queuedItemsList');
  const btnToggleQueue = document.getElementById('btnToggleQueue');
  const queuedHeader = document.getElementById('queuedHeader');
  let isQueueCollapsed = false;

  // Camera Modal Elements
  const cameraModal = document.getElementById('cameraModal');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraSnapshotPreview = document.getElementById('cameraSnapshotPreview');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const cameraPermNotice = document.getElementById('cameraPermNotice');
  const btnPermRetry = document.getElementById('btnPermRetry');
  const btnPermNative = document.getElementById('btnPermNative');
  const btnCloseCamera = document.getElementById('btnCloseCamera');
  const btnSwitchCamera = document.getElementById('btnSwitchCamera');
  const btnShutterCapture = document.getElementById('btnShutterCapture');
  const btnCameraGalleryFallback = document.getElementById('btnCameraGalleryFallback');
  const cameraLiveControls = document.getElementById('cameraLiveControls');
  const cameraReviewControls = document.getElementById('cameraReviewControls');
  const btnCameraRetake = document.getElementById('btnCameraRetake');
  const btnCameraUsePhoto = document.getElementById('btnCameraUsePhoto');

  // Drawer Elements
  const geminiDrawer = document.getElementById('geminiDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  const btnDrawerNewChat = document.getElementById('btnDrawerNewChat');
  const inputSearchChats = document.getElementById('inputSearchChats');
  const drawerHistoryScroll = document.getElementById('drawerHistoryScroll');
  const btnDrawerOpenSettings = document.getElementById('btnDrawerOpenSettings');
  const btnDrawerOpenProfile = document.getElementById('btnDrawerOpenProfile');
  const drawerAvatarMini = document.getElementById('drawerAvatarMini');
  const drawerUserName = document.getElementById('drawerUserName');
  const drawerUserSub = document.getElementById('drawerUserSub');

  // Profile View Elements
  const btnBackFromProfile = document.getElementById('btnBackFromProfile');
  const avatarHeroInitials = document.getElementById('avatarHeroInitials');
  const avatarHeroImg = document.getElementById('avatarHeroImg');
  const heroStudentName = document.getElementById('heroStudentName');
  const heroStudentClass = document.getElementById('heroStudentClass');
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  const inputProfileName = document.getElementById('inputProfileName');
  const inputProfileAge = document.getElementById('inputProfileAge');
  const selectProfileGender = document.getElementById('selectProfileGender');
  const selectProfileClass = document.getElementById('selectProfileClass');
  const btnSaveProfile = document.getElementById('btnSaveProfile');
  const linkOpenSettingsFromProfile = document.getElementById('linkOpenSettingsFromProfile');

  // Settings View Elements
  const btnBackFromSettings = document.getElementById('btnBackFromSettings');
  const rowResponseLanguage = document.getElementById('rowResponseLanguage');
  const valResponseLanguage = document.getElementById('valResponseLanguage');
  const rowExplanationStyle = document.getElementById('rowExplanationStyle');
  const valExplanationStyle = document.getElementById('valExplanationStyle');
  const toggleEverydayExamples = document.getElementById('toggleEverydayExamples');
  const toggleStudyReminders = document.getElementById('toggleStudyReminders');
  const toggleSaveHistory = document.getElementById('toggleSaveHistory');
  const toggleImproveAI = document.getElementById('toggleImproveAI');
  const rowManageData = document.getElementById('rowManageData');
  const rowSettingsToProfile = document.getElementById('rowSettingsToProfile');
  const settingsProfileSummary = document.getElementById('settingsProfileSummary');
  const rowSignOut = document.getElementById('rowSignOut');

  // Desktop Controls & Lightbox
  const btnPhoneView = document.getElementById('btnPhoneView');
  const btnFullView = document.getElementById('btnFullView');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  // Clock Update
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if (statusClock) {
      statusClock.textContent = `${hours}:${minutes}`;
    }
  }
  setInterval(updateClock, 30000);
  // Toast Notification Helper
  function showToast(text) {
    const toast = document.getElementById('geminiToast');
    const toastText = document.getElementById('geminiToastText');
    if (!toast || !toastText) return;
    toastText.textContent = text;
    toast.style.display = 'flex';
    clearTimeout(window._geminiToastTimer);
    window._geminiToastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }

  // Image Attachment Helpers
  function attachImageFile(dataUrl, filename) {
    state.pendingAttachment = { dataUrl, name: filename };
    if (attachmentPreviewImg) attachmentPreviewImg.src = dataUrl;
    if (attachmentPreviewName) attachmentPreviewName.textContent = filename || 'image.jpg';
    if (chatAttachmentPreview) chatAttachmentPreview.style.display = 'flex';
  }

  function clearAttachment() {
    state.pendingAttachment = null;
    if (chatAttachmentPreview) chatAttachmentPreview.style.display = 'none';
    if (mediaUploadInput) mediaUploadInput.value = '';
    if (cameraDirectInput) cameraDirectInput.value = '';
  }

  // Camera & Media Handlers
  let currentCameraStream = null;
  let currentFacingMode = 'environment';
  let capturedImageDataUrl = null;

  function toggleAttachmentMenu(show) {
    if (!attachmentMenu) return;
    const isVisible = attachmentMenu.style.display === 'flex';
    const next = (typeof show === 'boolean') ? show : !isVisible;
    attachmentMenu.style.display = next ? 'flex' : 'none';
  }

  function closeAttachmentMenu() {
    if (attachmentMenu) attachmentMenu.style.display = 'none';
  }

  function handleFileSelected(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে একটি ছবি নির্বাচন করুন');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      attachImageFile(e.target.result, file.name);
      showToast('ছবি সংযুক্ত হয়েছে ✓');
      if (chatInput) chatInput.focus();
    };
    reader.readAsDataURL(file);
  }

  async function openInAppCamera() {
    if (!cameraModal) return;

    if (cameraPermNotice) cameraPermNotice.style.display = 'none';
    if (cameraSnapshotPreview) cameraSnapshotPreview.style.display = 'none';
    if (cameraVideo) cameraVideo.style.display = 'block';
    if (cameraLiveControls) cameraLiveControls.style.display = 'flex';
    if (cameraReviewControls) cameraReviewControls.style.display = 'none';
    cameraModal.style.display = 'flex';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia not supported, opening native fallback');
      if (cameraPermNotice) cameraPermNotice.style.display = 'flex';
      return;
    }

    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach(t => t.stop());
      currentCameraStream = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: currentFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      currentCameraStream = stream;
      if (cameraVideo) {
        cameraVideo.srcObject = stream;
        await cameraVideo.play().catch(e => console.log('Camera video play caught:', e));
      }
    } catch (err) {
      console.warn('Camera permission denied or error:', err);
      if (cameraPermNotice) cameraPermNotice.style.display = 'flex';
    }
  }

  function stopCameraStream() {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach(t => t.stop());
      currentCameraStream = null;
    }
    if (cameraModal) cameraModal.style.display = 'none';
    if (cameraSnapshotPreview) cameraSnapshotPreview.style.display = 'none';
    if (cameraVideo) cameraVideo.style.display = 'block';
  }

  function captureSnapshot() {
    if (!cameraVideo || !cameraCanvas) return;
    const w = cameraVideo.videoWidth || 640;
    const h = cameraVideo.videoHeight || 480;
    cameraCanvas.width = w;
    cameraCanvas.height = h;
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, w, h);
    capturedImageDataUrl = cameraCanvas.toDataURL('image/jpeg', 0.85);

    if (cameraSnapshotPreview) {
      cameraSnapshotPreview.src = capturedImageDataUrl;
      cameraSnapshotPreview.style.display = 'block';
    }
    if (cameraVideo) cameraVideo.style.display = 'none';
    if (cameraLiveControls) cameraLiveControls.style.display = 'none';
    if (cameraReviewControls) cameraReviewControls.style.display = 'flex';
  }

  function retakePhoto() {
    if (cameraSnapshotPreview) cameraSnapshotPreview.style.display = 'none';
    if (cameraVideo) cameraVideo.style.display = 'block';
    if (cameraLiveControls) cameraLiveControls.style.display = 'flex';
    if (cameraReviewControls) cameraReviewControls.style.display = 'none';
    capturedImageDataUrl = null;
  }

  function usePhoto() {
    if (capturedImageDataUrl) {
      attachImageFile(capturedImageDataUrl, `math_problem_${Date.now().toString().slice(-4)}.jpg`);
      showToast('ছবি সংযুক্ত হয়েছে ✓');
    }
    stopCameraStream();
    if (chatInput) chatInput.focus();
  }

  async function switchCamera() {
    currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
    await openInAppCamera();
  }

  // Initialize App
  function initApp() {
    loadProfile();
    loadSettings();
    loadSessions();
    setupEventListeners();
  }

  // View Navigation System
  function switchView(viewName) {
    state.activeView = viewName;
    viewChat.classList.remove('active');
    viewProfile.classList.remove('active');
    viewSettings.classList.remove('active');

    if (viewName === 'profile') {
      renderProfileForm();
      viewProfile.classList.add('active');
    } else if (viewName === 'settings') {
      renderSettingsUI();
      viewSettings.classList.add('active');
    } else {
      renderChatUI();
      viewChat.classList.add('active');
    }
  }

  // Profile Management
  function loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (saved) {
      try {
        state.profile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        state.profile = { ...DEFAULT_PROFILE };
      }
    }
    updateProfileBadges();
  }

  function isProfileComplete() {
    const p = state.profile;
    if (!p) return false;
    if (p.completed === true || localStorage.getItem('dipu_profile_completed') === 'true') {
      return true;
    }
    if (p.name && p.name.trim() !== '' && p.class && p.class.trim() !== '') {
      return true;
    }
    return false;
  }

  function updateProfileBadges() {
    const p = state.profile;
    const initials = (p.name && p.name.trim().length > 0)
      ? p.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'RA';

    // If profile is complete, hide the journey banner card
    if (journeyBannerWrapper) {
      if (isProfileComplete()) {
        journeyBannerWrapper.classList.add('hidden');
      } else {
        journeyBannerWrapper.classList.remove('hidden');
        if (bannerJourneyTitle) bannerJourneyTitle.textContent = 'Complete your profile';
        if (bannerJourneySub) bannerJourneySub.textContent = 'Set your class & subjects for personalized help';
      }
    }

    if (drawerAvatarMini) drawerAvatarMini.textContent = initials;
    if (drawerUserName) drawerUserName.textContent = p.name;
    if (drawerUserSub) drawerUserSub.textContent = `${p.class} • Edit profile`;

    if (settingsProfileSummary) settingsProfileSummary.textContent = `${p.name} • ${p.class}`;
  }

  function renderProfileForm() {
    const p = state.profile;
    const initials = (p.name && p.name.trim().length > 0)
      ? p.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'RA';

    if (avatarHeroInitials) avatarHeroInitials.textContent = initials;
    if (heroStudentName) heroStudentName.textContent = p.name;
    if (heroStudentClass) heroStudentClass.textContent = `${p.class} • Ready to learn`;

    if (p.customPhotoUrl && avatarHeroImg) {
      avatarHeroImg.src = p.customPhotoUrl;
      avatarHeroImg.style.display = 'block';
      avatarHeroInitials.style.display = 'none';
    } else if (avatarHeroImg) {
      avatarHeroImg.style.display = 'none';
      avatarHeroInitials.style.display = 'block';
    }

    if (inputProfileName) inputProfileName.value = p.name;
    if (inputProfileAge) inputProfileAge.value = p.age;
    if (selectProfileGender) selectProfileGender.value = p.gender;
    if (selectProfileClass) selectProfileClass.value = p.class;

    document.querySelectorAll('.avatar-icon-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-avatar') === p.avatarType && !p.customPhotoUrl);
    });
  }

  function saveProfileChanges() {
    state.profile.name = inputProfileName.value.trim() || 'Student';
    state.profile.age = inputProfileAge.value || '16';
    state.profile.gender = selectProfileGender.value;
    state.profile.class = selectProfileClass.value;
    state.profile.completed = true;

    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(state.profile));
    localStorage.setItem('dipu_profile_completed', 'true');
    updateProfileBadges();

    btnSaveProfile.innerHTML = `<span>Changes saved! ✓</span>`;
    setTimeout(() => {
      btnSaveProfile.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Save changes</span>
      `;
      switchView('chat');
    }, 600);
  }

  // Settings Management
  function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
    if (saved) {
      try {
        state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        state.settings = { ...DEFAULT_SETTINGS };
      }
    }
    applyTheme(state.settings.theme);
  }

  function renderSettingsUI() {
    const s = state.settings;
    if (valResponseLanguage) valResponseLanguage.textContent = s.language;
    if (valExplanationStyle) valExplanationStyle.textContent = s.style;
    if (toggleEverydayExamples) toggleEverydayExamples.checked = s.everydayExamples;
    if (toggleStudyReminders) toggleStudyReminders.checked = s.studyReminders;
    if (toggleSaveHistory) toggleSaveHistory.checked = s.saveHistory;
    if (toggleImproveAI) toggleImproveAI.checked = s.improveAI;

    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-val') === s.theme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(state.settings));
  }

  // Sessions & Chat History System
  function loadSessions() {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state.sessions = Array.isArray(parsed)
          ? parsed.filter(s => s && Array.isArray(s.messages) && s.messages.length > 0)
          : [];
      } catch (e) {
        state.sessions = [];
      }
    }

    if (!state.sessions || state.sessions.length === 0) {
      state.sessions = [];
      const newDraft = {
        id: 'session-' + Date.now(),
        title: 'New chat',
        group: 'TODAY',
        subject: 'Study',
        timeTag: 'Just now',
        timestamp: Date.now(),
        messages: []
      };
      state.sessions.push(newDraft);
      state.currentSessionId = newDraft.id;
    } else {
      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
      if (savedActive && state.sessions.some(s => s.id === savedActive)) {
        state.currentSessionId = savedActive;
      } else {
        state.currentSessionId = state.sessions[0].id;
      }
    }

    renderChatUI();
    renderDrawerHistory();
  }

  // Pre-populates the exact conversation seen in user's Image 1 & Image 2
  function createDesignDefaultSessions() {
    return [
      {
        id: 'session-newton',
        title: "Newton's second law",
        group: 'TODAY',
        subject: 'Physics',
        timeTag: 'Just now',
        timestamp: Date.now(),
        messages: [
          {
            id: 'msg-u1',
            sender: 'user',
            text: "Explain Newton's second law in simple words, with an example.",
            time: '9:41 AM'
          },
          {
            id: 'msg-a1',
            sender: 'ai',
            headline: "More force, more acceleration.",
            text: "সহজ করে বলি, রাতিম! কোনো বস্তুর ওপর বল প্রয়োগ করলে তার বেগ পরিবর্তিত হয়। বল যত বেশি, ত্বরণও তত বেশি।",
            formula: "F = m × a",
            formulaLabel: "Force = mass\n× acceleration",
            example: "যেমন: ২ kg ভরের একটি বলকে ৩ m/s² ত্বরণ দিতে বল লাগবে ২ × ৩ = ৬ N।",
            textbook: "Check with your textbook"
          }
        ]
      },
      {
        id: 'session-ohm',
        title: "ওহমের সূত্র সহজে শিখি",
        group: 'TODAY',
        subject: 'Physics',
        timeTag: '8:30 AM',
        timestamp: Date.now() - 3600000,
        messages: [
          {
            id: 'msg-u2',
            sender: 'user',
            text: "ওহমের সূত্রটি বুঝিয়ে বলো।",
            time: '8:30 AM'
          },
          {
            id: 'msg-a2',
            sender: 'ai',
            headline: "Voltage, Current & Resistance relation.",
            text: "নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহ তার দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।",
            formula: "V = I × R",
            formulaLabel: "Voltage = current\n× resistance",
            example: "বিভব ১০ ভোল্ট ও রোধ ৫ ওহম হলে প্রবাহ হবে ১০ ÷ ৫ = ২ অ্যাম্পিয়ার।",
            textbook: "Check with your textbook"
          }
        ]
      },
      {
        id: 'session-quadratic',
        title: "Quadratic equations, step by step",
        group: 'YESTERDAY',
        subject: 'Mathematics',
        timeTag: '12 messages',
        timestamp: Date.now() - 86400000,
        messages: [
          {
            id: 'msg-u3',
            sender: 'user',
            text: "দ্বিঘাত সমীকরণ কীভাবে সমাধান করব?",
            time: 'Yesterday'
          },
          {
            id: 'msg-a3',
            sender: 'ai',
            headline: "Formula for roots.",
            text: "যেকোনো দ্বিঘাত সমীকরণ ax² + bx + c = 0 আকারে সাজিয়ে মূল নির্ণয় করা যায়।",
            formula: "x = (-b ± √(b² - 4ac)) / 2a",
            formulaLabel: "Quadratic formula",
            example: "x² - 5x + 6 = 0 এর সমাধান x = 2 অথবা x = 3।",
            textbook: "Check with your textbook"
          }
        ]
      },
      {
        id: 'session-study-plan',
        title: "বিজ্ঞান ও গণিত প্রস্তুতি",
        group: 'YESTERDAY',
        subject: 'Study plan',
        timeTag: '8 messages',
        timestamp: Date.now() - 86400000 * 1.5,
        messages: [
          {
            id: 'msg-u4',
            sender: 'user',
            text: "এসএসসি পরীক্ষার জন্য কিভাবে রুটিন তৈরি করব?",
            time: 'Yesterday'
          },
          {
            id: 'msg-a4',
            sender: 'ai',
            headline: "Daily 3-Phase Mastery Loop.",
            text: "প্রতিদিন সকালে কঠিন বিষয় (পদার্থবিজ্ঞান/উচ্চতর গণিত), বিকেলে প্র্যাকটিস এবং রাতে রিভিশন করুন।",
            formula: "Focus + Practice = A+",
            formulaLabel: "Daily consistency",
            example: "সপ্তাহে অন্তত ২টি টেস্ট পেপারের মডেল টেস্ট সমাধান করুন।",
            textbook: "Check with your textbook"
          }
        ]
      },
      {
        id: 'session-revision',
        title: "A 7-day SSC revision plan",
        group: 'THIS WEEK',
        subject: 'Study plan',
        timeTag: 'Monday',
        timestamp: Date.now() - 86400000 * 3,
        messages: [
          {
            id: 'msg-u5',
            sender: 'user',
            text: "৭ দিনের রিভিশন প্ল্যান দাও।",
            time: 'Monday'
          },
          {
            id: 'msg-a5',
            sender: 'ai',
            headline: "7-Day Sprint Strategy.",
            text: "১ম-২য় দিন পদার্থ ও রসায়ন, ৩য়-৪র্থ দিন গণিত ও জীববিজ্ঞান, ৫ম দিন সাধারণ বিষয়, ৬ষ্ঠ-৭ম দিন মক টেস্ট।",
            formula: "Review > Rote",
            formulaLabel: "Active recall",
            example: "প্রতিটি অধ্যায়ের সূত্র তালিকা টেবিলে টাঙিয়ে রাখুন।",
            textbook: "Check with your textbook"
          }
        ]
      }
    ];
  }

  function saveSessions() {
    if (state.settings.saveHistory) {
      // চ্যাটে টেক্সট বা মেসেজ না থাকলে হিস্ট্রি বা স্টোরেজে সেভ হবে না
      const sessionsWithText = state.sessions.filter(s => s && Array.isArray(s.messages) && s.messages.length > 0);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessionsWithText));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, state.currentSessionId);
    }
  }

  function getCurrentSession() {
    if (!Array.isArray(state.sessions)) {
      state.sessions = [];
    }
    let sess = state.sessions.find(s => s && s.id === state.currentSessionId);
    if (!sess) {
      sess = state.sessions[0];
    }
    if (!sess) {
      sess = {
        id: 'session-' + Date.now(),
        title: 'New chat',
        group: 'TODAY',
        subject: 'Study',
        timeTag: 'Just now',
        timestamp: Date.now(),
        messages: []
      };
      state.sessions.unshift(sess);
      state.currentSessionId = sess.id;
    }
    if (!Array.isArray(sess.messages)) {
      sess.messages = [];
    }
    return sess;
  }

  // Render Chat Screen UI
  function renderChatUI() {
    if (!chatArea) return;
    renderQueuedMessagesUI();
    chatArea.innerHTML = '';

    const current = getCurrentSession();
    if (!current || !current.messages || current.messages.length === 0) {
      chatArea.innerHTML = `
        <div class="chat-date-divider">TODAY, ${statusClock ? statusClock.textContent : '9:41 AM'}</div>
        <div class="empty-chat-welcome" style="text-align:center; padding: 40px 20px; color:#64748b;">
          <div style="font-size:32px; margin-bottom:12px;">✨</div>
          <h3 style="font-size:18px; font-weight:700; color:#1e293b; margin-bottom:6px;">Hello, ${state.profile.name}!</h3>
          <p style="font-size:13px; line-height:1.5;">Ready to explore your ${state.profile.class} lessons. Ask me any formula, theory, or concept!</p>
        </div>
      `;
      return;
    }

    // Date Divider
    const dateDivider = document.createElement('div');
    dateDivider.className = 'chat-date-divider';
    dateDivider.textContent = `TODAY, ${current.messages[0]?.time || '9:41 AM'}`;
    chatArea.appendChild(dateDivider);

    current.messages.forEach(msg => {
      appendMessageDOM(msg);
    });

    scrollToBottom();
  }

  // Educational Content Formatter (Tables, Math Step Boxes, Non-Math Theory Boxes, Callouts)
  function formatEducationalContent(rawText) {
    if (!rawText) return '';
    let text = cleanStudentText(rawText);

    // 1. Convert Markdown Tables to HTML Tables
    const tableRegex = /((?:\|[^\n\r]+\|(?:\r?\n)?){2,})/g;
    text = text.replace(tableRegex, (match) => {
      const lines = match.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
      if (lines.length < 2) return match;

      let html = '<div class="edu-table-wrapper"><table class="edu-table">';
      let isHeader = true;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^\|[\s\-:]+(\|[\s\-:]+)+\|?$/.test(line)) {
          isHeader = false;
          continue;
        }
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (isHeader) {
          html += '<thead><tr>' + cells.map(c => `<th>${escapeHTML(c)}</th>`).join('') + '</tr></thead><tbody>';
          isHeader = false;
        } else {
          html += '<tr>' + cells.map(c => `<td>${escapeHTML(c)}</td>`).join('') + '</tr>';
        }
      }
      html += '</tbody></table></div>';
      return html;
    });

    // 2. Concept & Reading Callout Box (> ...)
    text = text.replace(/(?:^|\n)>\s*([^\n]+(?:\n>[^\n]+)*)/g, (m, quoteText) => {
      const textOnly = quoteText.replace(/^>\s*/gm, '');
      return `<div class="edu-concept-callout"><div class="callout-icon">💡</div><div class="callout-text">${escapeHTML(textOnly)}</div></div>`;
    });

    // 3. Process Section Headers into Styled Educational Cards
    const sectionHeaders = [
      // Math & Calculation Boxes
      { pattern: /^(?:###?\s*)?(?:📌\s*প্রদত্ত তথ্য|Given Data|Given\b)/i, class: 'math-step-card step-given', icon: '📌', title: 'প্রদত্ত তথ্য (Given)' },
      { pattern: /^(?:###?\s*)?(?:📐\s*প্রয়োজনীয় সূত্র|প্রয়োজনীয় সূত্র|সূত্র|Formula\b)/i, class: 'math-step-card step-formula', icon: '📐', title: 'প্রয়োজনীয় সূত্র (Formula)' },
      { pattern: /^(?:###?\s*)?(?:📊\s*(?:ছক\s*(?:ও|\/)?\s*)?সমাধান|ছক\s*(?:ও|\/)?\s*হিসাব|Calculation\b)/i, class: 'math-step-card step-calc', icon: '📊', title: 'ছক ও সমাধান (Calculation)' },
      { pattern: /^(?:###?\s*)?(?:🎯\s*(?:চূড়ান্ত\s*)?উত্তর|চূড়ান্ত উত্তর|Final Answer\b)/i, class: 'math-step-card step-answer', icon: '🎯', title: 'চূড়ান্ত উত্তর (Final Answer)' },
      
      // Theory & Non-Math Boxes
      { pattern: /^(?:###?\s*)?(?:💡\s*(?:মূল\s*)?(?:ধারণা|সংজ্ঞা)|মূল ধারণা ও সংজ্ঞা|Core Concept\b)/i, class: 'theory-card card-concept', icon: '💡', title: 'মূল ধারণা ও সংজ্ঞা (Definition)' },
      { pattern: /^(?:###?\s*)?(?:🔑\s*(?:গুরুত্বপূর্ণ\s*)?পয়েন্ট|মূল পয়েন্টসমূহ|Key Points\b)/i, class: 'theory-card card-points', icon: '🔑', title: 'গুরুত্বপূর্ণ পয়েন্টসমূহ (Key Points)' },
      { pattern: /^(?:###?\s*)?(?:📖\s*(?:বাস্তব\s*)?উদাহরণ|বাস্তব প্রয়োগ|Real-life Example\b)/i, class: 'theory-card card-example', icon: '📖', title: 'বাস্তব উদাহরণ ও প্রয়োগ (Example)' },
      { pattern: /^(?:###?\s*)?(?:⚠️\s*পরীক্ষার টিপস|পরীক্ষার জন্য টিপস|বিশেষ সতর্কতা|SSC Exam Tip\b)/i, class: 'theory-card card-tip', icon: '⚠️', title: 'পরীক্ষার টিপস ও সতর্কতা (Exam Tip)' },
      { pattern: /^(?:###?\s*)?(?:📝\s*সারসংক্ষেপ|সংক্ষেপে মূল কথা|Summary\b)/i, class: 'theory-card card-summary', icon: '📝', title: 'সারসংক্ষেপ (Summary)' }
    ];

    const lines = text.split(/\r?\n/);
    let output = [];
    let inCard = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      let matchedHeader = null;

      for (const sh of sectionHeaders) {
        if (sh.pattern.test(trimmed)) {
          matchedHeader = sh;
          break;
        }
      }

      if (matchedHeader) {
        if (inCard) {
          output.push('</div></div>');
        }
        const isMath = matchedHeader.class.startsWith('math');
        output.push(`<div class="${matchedHeader.class}"><div class="${isMath ? 'math-step-title' : 'theory-card-title'}"><span class="step-icon">${matchedHeader.icon}</span> ${matchedHeader.title}</div><div class="${isMath ? 'math-step-content' : 'theory-card-content'}">`);
        inCard = true;
      } else {
        output.push(line);
      }
    }

    if (inCard) {
      output.push('</div></div>');
    }

    text = output.join('\n');

    // 4. Markdown Bullet Points
    text = text.replace(/(?:^|\n)[*\-]\s+([^\n]+)/g, '\n<div class="edu-bullet-item"><span class="bullet-dot">•</span> <span>$1</span></div>');

    // 5. Markdown Bold and Inline Codes
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    text = text.replace(/(?:\r?\n){2,}/g, '<div class="paragraph-gap"></div>');
    text = text.replace(/\r?\n/g, '<br>');

    return text;
  }

  function getFormattedTime() {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  }

  function appendMessageDOM(msg) {
    const row = document.createElement('div');
    row.className = `chat-row ${msg.sender}`;

    if (msg.sender === 'user') {
      let imageHtml = '';
      if (msg.image) {
        imageHtml = `<div class="user-attached-image"><img src="${escapeHTML(msg.image)}" alt="Attached photo" class="clickable-media-preview"></div>`;
      }
      const queuedTag = msg.isQueued ? '<span class="queue-status-tag"> • ⏳ Queued</span>' : '';
      row.innerHTML = `
        <div class="user-bubble-box">
          ${imageHtml}
          ${msg.text ? `<div>${escapeHTML(msg.text)}</div>` : ''}
        </div>
        <div class="user-time-tag">You • ${msg.time || getFormattedTime()}${queuedTag}</div>
      `;
    } else {
      // AI Message Card
      let formulaBlock = '';
      if (msg.formula) {
        formulaBlock = `
          <div class="ai-formula-box">
            <div class="formula-big">${escapeHTML(msg.formula)}</div>
            <div class="formula-label">${escapeHTML(msg.formulaLabel || '').replace(/\n/g, '<br>')}</div>
          </div>
        `;
      }

      let exampleBlock = '';
      if (msg.example) {
        exampleBlock = `<div class="ai-example-text">${formatEducationalContent(msg.example)}</div>`;
      }

      row.innerHTML = `
        <div class="ai-header-tag">
          <div class="ai-sparkle-avatar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <span>Dipu AI • Step-by-step</span>
        </div>

        <div class="ai-card-box">
          <div class="ai-headline">${escapeHTML(msg.headline || 'Solution & Explanation')}</div>
          <div class="ai-explanation-text">${formatEducationalContent(msg.text)}</div>
          ${formulaBlock}
          ${exampleBlock}

          <div class="ai-card-footer">
            <div class="ai-footer-time">${escapeHTML(msg.time || getFormattedTime())}</div>
            <div class="ai-action-buttons">
              <!-- Copy -->
              <button class="ai-icon-action btn-copy" title="Copy text" aria-label="Copy" data-copy="${escapeHTML((msg.headline ? msg.headline + '\n\n' : '') + (msg.text || '') + (msg.formula ? '\n' + msg.formula : '') + (msg.example ? '\n' + msg.example : ''))}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>

              <!-- Like -->
              <button class="ai-icon-action btn-like" title="Good response" aria-label="Good response">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>

              <!-- Dislike -->
              <button class="ai-icon-action btn-dislike" title="Bad response" aria-label="Bad response">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    chatArea.appendChild(row);
    return row;
  }

  function scrollToBottom() {
    if (!chatArea) return;
    chatArea.scrollTop = chatArea.scrollHeight + 1000;
    setTimeout(() => {
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight + 1000;
    }, 60);
  }

  // Render Drawer History (Exact Image 2)
  function renderDrawerHistory(searchQuery = '') {
    if (!drawerHistoryScroll) return;
    drawerHistoryScroll.innerHTML = '';

    const q = searchQuery.toLowerCase().trim();
    const filteredSessions = state.sessions.filter(sess => {
      // চ্যাটে কোনো টেক্সট বা মেসেজ না থাকলে হিস্ট্রিতে যোগ হবে না
      if (!sess || !Array.isArray(sess.messages) || sess.messages.length === 0) {
        return false;
      }
      if (!q) return true;
      return sess.title.toLowerCase().includes(q) || (sess.subject && sess.subject.toLowerCase().includes(q));
    });

    if (filteredSessions.length === 0) {
      drawerHistoryScroll.innerHTML = `
        <div style="text-align:center; padding: 40px 16px; color:#94a3b8; font-size:13px;">
          <div style="font-size:24px; margin-bottom:8px;">💬</div>
          <div>কোনো পূর্ববর্তী চ্যাট ইতিহাস নেই</div>
        </div>
      `;
      return;
    }

    const groups = ['TODAY', 'YESTERDAY', 'THIS WEEK'];

    groups.forEach(groupName => {
      const itemsInGroup = filteredSessions.filter(s => (s.group || 'TODAY') === groupName);
      if (itemsInGroup.length === 0) return;

      const header = document.createElement('div');
      header.className = 'history-group-header';
      header.innerHTML = `
        <span>${groupName}</span>
        ${groupName === 'TODAY' ? `<span class="history-group-count">${itemsInGroup.length} chats</span>` : ''}
      `;
      drawerHistoryScroll.appendChild(header);

      itemsInGroup.forEach(sess => {
        const itemRow = document.createElement('div');
        const isActive = sess.id === state.currentSessionId;
        itemRow.className = `history-item-row ${isActive ? 'active' : ''}`;
        itemRow.setAttribute('data-id', sess.id);

        itemRow.innerHTML = `
          <div class="history-item-left">
            <svg class="history-msg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <div class="history-title-col">
              <span class="history-item-title-text">${escapeHTML(sess.title)}</span>
              <span class="history-item-sub-text">${escapeHTML(sess.subject || 'General')} • ${escapeHTML(sess.timeTag || 'Just now')}</span>
            </div>
          </div>
          ${isActive ? `<span class="history-active-dot"></span>` : ''}
        `;

        itemRow.addEventListener('click', () => {
          state.currentSessionId = sess.id;
          saveSessions();
          renderChatUI();
          renderDrawerHistory();
          closeDrawer();
          switchView('chat');
        });

        drawerHistoryScroll.appendChild(itemRow);
      });
    });
  }

  // Drawer Controls
  function openDrawer() {
    renderDrawerHistory();
    geminiDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
  }

  function closeDrawer() {
    geminiDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
  }

  // Start a New Chat (Completely clean, no previous text)
  function handleStartNewChat() {
    const current = getCurrentSession();
    // If current session has no messages yet, simply focus it without creating duplicates
    if (current && Array.isArray(current.messages) && current.messages.length === 0) {
      chatInput.value = '';
      clearAttachment();
      renderChatUI();
      renderDrawerHistory();
      closeDrawer();
      switchView('chat');
      chatInput.focus();
      return;
    }

    // Clean up any other empty sessions that had no messages
    state.sessions = state.sessions.filter(s => s && Array.isArray(s.messages) && s.messages.length > 0);

    const newSession = {
      id: 'session-' + Date.now(),
      title: 'New chat',
      group: 'TODAY',
      subject: 'Study',
      timeTag: 'Just now',
      timestamp: Date.now(),
      messages: [] // Completely clean draft (won't appear in history until text is sent)
    };

    state.sessions.unshift(newSession);
    state.currentSessionId = newSession.id;
    chatInput.value = '';
    clearAttachment();
    saveSessions();
    renderChatUI();
    renderDrawerHistory();
    closeDrawer();
    switchView('chat');
    showToast('নতুন চ্যাট শুরু হয়েছে ✨');
    chatInput.focus();
  }

  // Queued Messages UI Renderer (Antigravity Style)
  function renderQueuedMessagesUI() {
    if (!queuedMessagesContainer || !queuedItemsList) return;

    const count = (state.messageQueue || []).length;
    if (queuedCountPill) queuedCountPill.textContent = count;

    if (count === 0) {
      queuedMessagesContainer.style.display = 'none';
      queuedItemsList.innerHTML = '';
      return;
    }

    queuedMessagesContainer.style.display = 'block';
    queuedItemsList.innerHTML = '';

    state.messageQueue.forEach((item, idx) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'queued-item-row';

      const iconHtml = item.image
        ? `<div class="queued-item-icon"><img src="${escapeHTML(item.image)}" alt="Queue attach"></div>`
        : `<div class="queued-item-icon">
             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>
           </div>`;

      itemRow.innerHTML = `
        <div class="queued-item-content">
          ${iconHtml}
          <div class="queued-item-text" title="${escapeHTML(item.text)}">${escapeHTML(item.text || 'Photo Problem')}</div>
        </div>
        <div class="queued-item-actions">
          <button type="button" class="queued-action-btn btn-edit-queue" data-idx="${idx}" title="Edit message" aria-label="Edit message">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button type="button" class="queued-action-btn btn-remove-queue" data-idx="${idx}" title="Remove from queue" aria-label="Remove from queue">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      queuedItemsList.appendChild(itemRow);
    });
  }

  // Handle edit / remove clicks in Queued items list
  if (queuedItemsList) {
    queuedItemsList.addEventListener('click', function (e) {
      const btnRemove = e.target.closest('.btn-remove-queue');
      if (btnRemove) {
        const idx = parseInt(btnRemove.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < state.messageQueue.length) {
          state.messageQueue.splice(idx, 1);
          renderQueuedMessagesUI();
          showToast('মেসেজ কিউ থেকে সরানো হয়েছে');
        }
        return;
      }

      const btnEdit = e.target.closest('.btn-edit-queue');
      if (btnEdit) {
        const idx = parseInt(btnEdit.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < state.messageQueue.length) {
          const removed = state.messageQueue.splice(idx, 1)[0];
          chatInput.value = removed.text || '';
          if (removed.image) {
            attachImageFile(removed.image, 'attached_photo.jpg');
          }
          renderQueuedMessagesUI();
          chatInput.focus();
        }
        return;
      }
    });
  }

  if (btnToggleQueue && queuedHeader) {
    queuedHeader.addEventListener('click', function (e) {
      if (e.target.closest('.btn-remove-queue') || e.target.closest('.btn-edit-queue')) return;
      isQueueCollapsed = !isQueueCollapsed;
      if (queuedItemsList) {
        queuedItemsList.classList.toggle('is-collapsed', isQueueCollapsed);
      }
      btnToggleQueue.classList.toggle('collapsed', isQueueCollapsed);
    });
  }

  // Send Message Logic with Antigravity Queued Messages
  function submitUserMessage(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const query = chatInput ? chatInput.value.trim() : '';
    if (!query && !state.pendingAttachment) return;

    const attachedImg = state.pendingAttachment ? state.pendingAttachment.dataUrl : null;
    const nowTime = getFormattedTime();

    // Clear input & pending attachment immediately so user can keep typing freely
    if (chatInput) chatInput.value = '';
    clearAttachment();

    const current = getCurrentSession();
    const titleCandidate = query || (attachedImg ? 'Photo Problem' : 'New chat');
    if (current.title === 'New chat' || current.title.length === 0) {
      current.title = titleCandidate.length > 28 ? titleCandidate.substring(0, 28) + '...' : titleCandidate;
    }

    // If chat had empty-chat-welcome, clear it before appending user message
    const welcome = chatArea.querySelector('.empty-chat-welcome');
    if (welcome) {
      chatArea.innerHTML = '';
      const dateDivider = document.createElement('div');
      dateDivider.className = 'chat-date-divider';
      dateDivider.textContent = `TODAY, ${nowTime}`;
      chatArea.appendChild(dateDivider);
    }

    const isBusy = state.isThinking;
    const userMsg = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text: query || (attachedImg ? 'এই অঙ্কটি বা ছবির সমস্যাটি সমাধান করে দাও।' : ''),
      image: attachedImg,
      time: nowTime,
      isQueued: isBusy
    };

    // User message is ALWAYS added and displayed in the chat immediately!
    current.messages.push(userMsg);
    const userRow = appendMessageDOM(userMsg);
    saveSessions();
    renderDrawerHistory();
    scrollToBottom(true);

    // If AI is currently thinking, queue this message for sequential answer
    if (isBusy) {
      state.messageQueue.push({
        id: userMsg.id,
        text: userMsg.text,
        userRow: userRow
      });
      renderQueuedMessagesUI();
      showToast('মেসেজ কিউতে জমা হয়েছে (Queued) ✨');
      return;
    }

    // Otherwise, start AI response immediately
    processAIQuery(userMsg.text, userRow);
  }

  // Helper to detect conversational greetings so AI does not think unnecessarily
  function isSimpleGreeting(rawText) {
    if (!rawText) return false;
    const q = rawText.toLowerCase().trim().replace(/[?!.,।]/g, '');
    const simpleTokens = [
      'hello', 'hi', 'hey', 'হ্যালো', 'হাই', 'হে',
      'সালাম', 'আসসালামু আলাইকুম', 'assalam', 'assalamu alaikum', 'assalamualaikum', 'salam',
      'কেমন আছো', 'কেমন আছেন', 'kemon acho', 'kemon aso', 'kemon achen',
      'hi dipu', 'hello dipu', 'dipu', 'দিপু',
      'good morning', 'good evening', 'good afternoon', 'শুভ সকাল', 'শুভ রাত্রি',
      'ধন্যবাদ', 'thanks', 'thank you', 'ok', 'okay', 'ঠিক আছে'
    ];
    if (simpleTokens.includes(q)) return true;
    return q.length <= 15 && simpleTokens.some(t => q === t || q.startsWith(t + ' ') || q.endsWith(' ' + t));
  }

  function getInstantGreetingResponse(rawText) {
    const q = rawText.toLowerCase().trim();
    const name = (state.profile && state.profile.name) ? state.profile.name : 'শিক্ষার্থী';
    const sscClass = (state.profile && state.profile.class) ? state.profile.class : 'Class 10 (SSC)';

    if (q.includes('সালাম') || q.includes('salam') || q.includes('assalam')) {
      return {
        headline: `ওয়ালাইকুম আসসালাম, ${name}! ✨`,
        text: `ওয়ালাইকুম আসসালাম! আশা করি তোমার পড়াশোনা খুব ভালো চলছে। আমি তোমার পার্সোনাল স্টাডি মেন্টর Dipu AI। ${sscClass}-এর পদার্থবিজ্ঞান, রসায়ন, গণিত বা যেকোনো বিষয়ের প্রশ্ন করো—আমি ধাপে ধাপে বুঝিয়ে দেব!`
      };
    }
    if (q.includes('কেমন') || q.includes('kemon')) {
      return {
        headline: `আমি চমৎকার আছি, ${name}! 😊`,
        text: `আমি খুব ভালো আছি, ধন্যবাদ জিজ্ঞেস করার জন্য! তোমার SSC পরীক্ষার প্রস্তুতি কেমন চলছে? আজ পদার্থ, রসায়ন বা গণিতের কোন অধ্যায়ের অঙ্ক বা সূত্র প্র্যাকটিস করতে চাও? প্রশ্ন লিখে পাঠাও!`
      };
    }
    if (q.includes('ধন্যবাদ') || q.includes('thank')) {
      return {
        headline: `স্বাগতম, ${name}! 🌟`,
        text: `তোমাকে সবসময় সাহায্য করতে পেরে আমি আনন্দিত! আরও কোনো বিষয় বা অঙ্কে সমস্যা থাকলে দ্বিধাহীনভাবে বলো। মনোযোগ দিয়ে পড়ো, সাফল্য আসবেই!`
      };
    }
    return {
      headline: `হ্যালো, ${name}! 👋`,
      text: `স্বাগতম! আমি তোমার ${sscClass} স্টাডি সঙ্গী Dipu AI। গণিত, বিজ্ঞান বা যেকোনো বিষয়ের জটিল অঙ্ক বা থিওরি বুঝতে চাও? প্রশ্নটি লিখো অথবা বই/খাতার ছবি তুলে পাঠাও—আমি এখনই সমাধান করে দিচ্ছি!`
    };
  }

  // AI Response Processor with Gemini Flash & Educational Structure
  async function processAIQuery(query, userRow) {
    // 1. Simple greeting / conversational text: instant reply with ZERO thinking animation!
    if (isSimpleGreeting(query)) {
      const greetingData = getInstantGreetingResponse(query);
      const aiMsg = {
        id: 'msg-a-' + Date.now(),
        sender: 'ai',
        headline: greetingData.headline,
        text: greetingData.text,
        formula: '',
        formulaLabel: '',
        example: '',
        textbook: 'Dipu Academy AI • Always ready to help',
        time: getFormattedTime()
      };
      const current = getCurrentSession();
      current.messages.push(aiMsg);
      appendMessageDOM(aiMsg);
      saveSessions();
      renderDrawerHistory();
      scrollToBottom(true);
      return;
    }

    // 2. Academic / Difficult question (কঠিন প্রশ্ন): thinking bubble appears UP inside chatArea
    state.isThinking = true;
    showTyping(true);
    scrollToBottom(true);

    try {
      await callGeminiForStudent(query);
    } catch (err) {
      console.warn('AI Fallback triggered:', err);
      serveStudentFallback(query);
    } finally {
      state.isThinking = false;
      showTyping(false);
      saveSessions();
      scrollToBottom(true);

      // Check if there are queued messages (Antigravity Queue processing)
      if (state.messageQueue && state.messageQueue.length > 0) {
        const nextItem = state.messageQueue.shift();
        renderQueuedMessagesUI();

        // Remove the queued badge from this user's bubble in the chat
        if (nextItem && nextItem.userRow) {
          const tag = nextItem.userRow.querySelector('.queue-status-tag');
          if (tag) tag.remove();
        }

        setTimeout(() => {
          processAIQuery(nextItem.text, nextItem.userRow);
        }, 350);
      } else {
        renderQueuedMessagesUI();
      }
    }
  }

  async function callGeminiForStudent(query) {
    const p = state.profile;
    const s = state.settings;

    const systemPrompt = `You are "Dipu Academy AI", a friendly and expert academic mentor for Class 10 (SSC) students in Bangladesh. Always respond in natural, encouraging Bengali (using English for technical terms where helpful).

Target Student:
- Name: ${p.name}
- Class/Grade: ${p.class}
- Age: ${p.age}
- Gender: ${p.gender}
- Focus Subjects: ${(p.subjects || []).join(', ')}

CRITICAL FORMATTING RULES:
1. NEVER output your internal thinking process, meta-commentary, or raw JSON keys/markdown labels like "*Headline:*", "*Text:*", or "{ headline: ... }" in the final response.
2. Concept & Reading Box: Put the main theoretical explanation, definition, or formula inside a clean visual callout blockquote (> ...) so the student can read it easily.
3. Math & Accounting Tables ( ছক / গড় / জাবেদা / খতিয়ান ): Whenever solving problems that require tables (such as Accounting Journals/জাবেদা, Ledgers/খতিয়ান, or Statistics/গড়/মধ্যক/প্রচুরক), ALWAYS use a clean Markdown Table with proper headers and columns (e.g. | তারিখ | বিবরণ | ডেবিট (টাকা) | ক্রেডিট (টাকা) |).
4. Step-by-Step Math Solution: Break down math calculations into clear steps:
   - "📌 প্রদত্ত তথ্য (Given):"
   - "📐 প্রয়োজনীয় সূত্র (Formula):"
   - "📊 ছক / সমাধান (Table / Calculation):"
   - "🎯 উত্তর (Final Answer):"

Return ONLY a valid JSON object matching this schema (with NO markdown backticks outside the JSON):
{
  "headline": "A short, descriptive 3-6 word summary headline",
  "text": "Encouraging explanation addressed to ${p.name}, formatted with callout blockquotes (> ...) and step-by-step math sections",
  "formula": "The main formula or theorem rule if applicable",
  "formulaLabel": "Variables breakdown",
  "example": "A fully worked-out markdown table or numerical calculation",
  "textbook": "NCTB Curriculum Verified"
}`;

    // 1. Try local server endpoint first (Fastest, zero-CORS, secure)
    try {
      let serverEndpoint = '/api/chat';
      if (!window.location.origin || window.location.origin === 'null' || window.location.protocol === 'file:' || window.location.port !== '3000') {
        serverEndpoint = 'http://localhost:3000/api/chat';
      }

      const serverRes = await fetch(serverEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          profile: state.profile,
          settings: state.settings
        })
      });

      if (serverRes.ok) {
        const parsed = await serverRes.json();
        if (parsed && (parsed.text || parsed.headline)) {
          const aiMsg = {
            id: 'msg-a-' + Date.now(),
            sender: 'ai',
            headline: parsed.headline || 'Solution & Explanation',
            text: parsed.text || '',
            formula: parsed.formula || '',
            formulaLabel: parsed.formulaLabel || '',
            example: parsed.example || '',
            textbook: parsed.textbook || 'Check with your textbook',
            time: getFormattedTime()
          };
          const current = getCurrentSession();
          current.messages.push(aiMsg);
          appendMessageDOM(aiMsg);
          scrollToBottom(true);
          return;
        }
      } else {
        throw new Error(`Server returned HTTP ${serverRes.status}`);
      }
    } catch (serverErr) {
      console.warn('Server /api/chat unreachable, falling back to direct client API...', serverErr);
    }

    // 2. Direct Client-side API Fallback with verified Gemma models
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

    const candidateModels = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemma-4-26b-a4b-it', 'gemma-4-31b-it'];
    let rawText = '';
    let success = false;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${INTERNAL_API_KEY}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          const actualPart = parts.find(p => !p.thought) || parts[parts.length - 1];
          rawText = actualPart ? actualPart.text : '';
          if (rawText) {
            success = true;
            break;
          }
        }
      } catch (e) {
        console.warn(`Candidate model ${model} failed, trying next...`, e);
      }
    }

    if (!success || !rawText) {
      throw new Error('All model candidates failed.');
    }

    let aiMsg = parseStructuredAIResponse(rawText, query);
    const current = getCurrentSession();
    current.messages.push(aiMsg);
    appendMessageDOM(aiMsg);
    scrollToBottom(true);
  }

  function cleanStudentText(str) {
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

  function parseStructuredAIResponse(rawText, query) {
    try {
      let jsonString = rawText.trim();
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      let cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      // Fix unescaped backslashes in LaTeX strings (e.g. \xrightarrow, \text, \times, \frac)
      cleanJson = cleanJson.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');

      let parsed = null;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        const extractField = (key) => {
          const re = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, 's');
          const m = cleanJson.match(re);
          if (m && m[1]) {
            return m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          }
          return '';
        };

        const parsedText = extractField('text');
        if (parsedText) {
          parsed = {
            headline: extractField('headline'),
            text: parsedText,
            formula: extractField('formula'),
            formulaLabel: extractField('formulaLabel'),
            example: extractField('example'),
            textbook: extractField('textbook')
          };
        }
      }

      if (parsed) {
        return {
          id: 'msg-a-' + Date.now(),
          sender: 'ai',
          headline: cleanStudentText(parsed.headline) || 'Solution & Explanation',
          text: cleanStudentText(parsed.text) || cleanStudentText(rawText),
          formula: cleanStudentText(parsed.formula) || '',
          formulaLabel: cleanStudentText(parsed.formulaLabel) || '',
          example: cleanStudentText(parsed.example) || '',
          textbook: cleanStudentText(parsed.textbook) || '',
          time: getFormattedTime()
        };
      }
      throw new Error('Fallback to plain text');
    } catch (e) {
      // Fallback parser if not JSON
      return {
        id: 'msg-a-' + Date.now(),
        sender: 'ai',
        headline: 'Solution & Explanation',
        text: cleanStudentText(rawText),
        formula: '',
        formulaLabel: '',
        example: '',
        textbook: '',
        time: getFormattedTime()
      };
    }
  }

  function serveStudentFallback(query) {
    const aiMsg = {
      id: 'msg-a-' + Date.now(),
      sender: 'ai',
      headline: 'Network Reconnecting',
      text: 'দুঃখিত, সংযোগে সাময়িক সমস্যা হয়েছে। দয়া করে আবার প্রশ্নটি পাঠাও—আমি এখনই সমাধান করে দিচ্ছি।',
      formula: '',
      formulaLabel: '',
      example: '',
      textbook: 'Tap to retry',
      time: getFormattedTime()
    };

    const current = getCurrentSession();
    current.messages.push(aiMsg);
    appendMessageDOM(aiMsg);
    scrollToBottom(true);
  }

  function showTyping(show) {
    const existingThinking = document.getElementById('chatThinkingRow');
    if (existingThinking) {
      existingThinking.remove();
    }

    if (typingIndicator) {
      typingIndicator.style.display = 'none';
    }

    if (show && chatArea) {
      const row = document.createElement('div');
      row.className = 'chat-row ai thinking-row';
      row.id = 'chatThinkingRow';
      row.innerHTML = `
        <div class="ai-header-tag">
          <div class="ai-sparkle-avatar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <span>Dipu AI চিন্তা করছে...</span>
        </div>
        <div class="inline-thinking-bubble">
          <div class="thinking-spinner-ring"></div>
          <span class="thinking-status-text">সমাধান বিশ্লেষণ করছি...</span>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      chatArea.appendChild(row);
      scrollToBottom(true);
    }
  }

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Speech Recognition & TTS
  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Try Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.interimResults = false;

    btnVoiceInput.classList.add('recording');
    recognition.onresult = function (e) {
      chatInput.value = e.results[0][0].transcript;
      btnVoiceInput.classList.remove('recording');
      chatInput.focus();
    };
    recognition.onerror = () => btnVoiceInput.classList.remove('recording');
    recognition.onend = () => btnVoiceInput.classList.remove('recording');
    recognition.start();
  }

  function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // Setup All Event Listeners
  function setupEventListeners() {
    // Drawer open / close
    btnOpenSidebar.addEventListener('click', openDrawer);
    btnCloseDrawer.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);

    // New Chat triggers
    btnHeaderNewChat.addEventListener('click', handleStartNewChat);
    btnDrawerNewChat.addEventListener('click', handleStartNewChat);

    // Search chats
    inputSearchChats.addEventListener('input', (e) => {
      renderDrawerHistory(e.target.value);
    });

    // Sub-banner and Drawer navigations to Profile / Settings
    if (btnBannerProfile) {
      btnBannerProfile.addEventListener('click', () => switchView('profile'));
    }
    if (btnBannerFilter) {
      btnBannerFilter.addEventListener('click', (e) => {
        e.stopPropagation();
        switchView('profile');
      });
    }
    const btnDismissBanner = document.getElementById('btnDismissBanner');
    if (btnDismissBanner) {
      btnDismissBanner.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem('dipu_profile_completed', 'true');
        if (state.profile) state.profile.completed = true;
        if (journeyBannerWrapper) journeyBannerWrapper.classList.add('hidden');
      });
    }

    btnDrawerOpenProfile.addEventListener('click', () => {
      closeDrawer();
      switchView('profile');
    });

    btnDrawerOpenSettings.addEventListener('click', () => {
      closeDrawer();
      switchView('settings');
    });

    rowSettingsToProfile.addEventListener('click', () => switchView('profile'));
    linkOpenSettingsFromProfile.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('settings');
    });

    // Back Buttons
    btnBackFromProfile.addEventListener('click', () => switchView('chat'));
    btnBackFromSettings.addEventListener('click', () => switchView('chat'));

    // Profile photo upload
    profilePhotoInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          state.profile.customPhotoUrl = e.target.result;
          renderProfileForm();
        };
        reader.readAsDataURL(file);
      }
    });

    // Profile Avatar chips
    document.querySelectorAll('.avatar-icon-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.profile.avatarType = btn.getAttribute('data-avatar');
        state.profile.customPhotoUrl = '';
        renderProfileForm();
      });
    });

    btnSaveProfile.addEventListener('click', saveProfileChanges);

    // Settings Segment Theme Switcher
    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeVal = btn.getAttribute('data-theme-val');
        state.settings.theme = themeVal;
        applyTheme(themeVal);
        saveSettings();
        renderSettingsUI();
      });
    });

    // Settings Toggles
    toggleEverydayExamples.addEventListener('change', function () {
      state.settings.everydayExamples = this.checked;
      saveSettings();
    });
    toggleStudyReminders.addEventListener('change', function () {
      state.settings.studyReminders = this.checked;
      saveSettings();
    });
    toggleSaveHistory.addEventListener('change', function () {
      state.settings.saveHistory = this.checked;
      saveSettings();
    });
    toggleImproveAI.addEventListener('change', function () {
      state.settings.improveAI = this.checked;
      saveSettings();
    });

    // Settings Language Cycle
    rowResponseLanguage.addEventListener('click', () => {
      const langs = ['Bilingual', 'বাংলা', 'English'];
      const nextIdx = (langs.indexOf(state.settings.language) + 1) % langs.length;
      state.settings.language = langs[nextIdx];
      valResponseLanguage.textContent = state.settings.language;
      saveSettings();
    });

    // Settings Style Cycle
    rowExplanationStyle.addEventListener('click', () => {
      const styles = ['Step-by-step', 'Concise', 'In-depth'];
      const nextIdx = (styles.indexOf(state.settings.style) + 1) % styles.length;
      state.settings.style = styles[nextIdx];
      valExplanationStyle.textContent = state.settings.style;
      saveSettings();
    });

    // Sign out
    rowSignOut.addEventListener('click', () => {
      if (confirm('Sign out of Dipu Academy AI?')) {
        state.profile = { ...DEFAULT_PROFILE, name: 'Guest Student' };
        saveProfileChanges();
        switchView('chat');
      }
    });

    // Data Management
    rowManageData.addEventListener('click', () => {
      if (confirm('Export or clear all your chats?')) {
        state.sessions = createDesignDefaultSessions();
        state.currentSessionId = state.sessions[0].id;
        saveSessions();
        renderChatUI();
        renderDrawerHistory();
        alert('All chats reset successfully.');
      }
    });

    // Mic & Voice input
    btnVoiceInput.addEventListener('click', startVoiceInput);

    // Send message triggers (Form submit, Blue Send button, and Enter key)
    if (chatForm) {
      chatForm.addEventListener('submit', submitUserMessage);
    }
    if (btnSend) {
      btnSend.addEventListener('click', submitUserMessage);
    }
    if (chatInput) {
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitUserMessage(e);
        }
      });
    }

    // Attachment menu toggle
    if (btnAttachFile) {
      btnAttachFile.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAttachmentMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (attachmentMenu && attachmentMenu.style.display === 'flex') {
        if (!attachmentMenu.contains(e.target) && !btnAttachFile.contains(e.target)) {
          closeAttachmentMenu();
        }
      }
    });

    if (btnMenuCamera) {
      btnMenuCamera.addEventListener('click', () => {
        closeAttachmentMenu();
        openInAppCamera();
      });
    }

    if (btnMenuGallery) {
      btnMenuGallery.addEventListener('click', () => {
        closeAttachmentMenu();
        if (mediaUploadInput) mediaUploadInput.click();
      });
    }

    if (mediaUploadInput) {
      mediaUploadInput.addEventListener('change', function () {
        handleFileSelected(this.files[0]);
      });
    }

    if (cameraDirectInput) {
      cameraDirectInput.addEventListener('change', function () {
        handleFileSelected(this.files[0]);
      });
    }

    if (btnRemovePreview) {
      btnRemovePreview.addEventListener('click', (e) => {
        e.preventDefault();
        clearAttachment();
      });
    }

    // Camera Modal Action Listeners
    if (btnCloseCamera) btnCloseCamera.addEventListener('click', stopCameraStream);
    if (btnSwitchCamera) btnSwitchCamera.addEventListener('click', switchCamera);
    if (btnShutterCapture) btnShutterCapture.addEventListener('click', captureSnapshot);
    if (btnCameraRetake) btnCameraRetake.addEventListener('click', retakePhoto);
    if (btnCameraUsePhoto) btnCameraUsePhoto.addEventListener('click', usePhoto);

    if (btnCameraGalleryFallback) {
      btnCameraGalleryFallback.addEventListener('click', () => {
        stopCameraStream();
        if (mediaUploadInput) mediaUploadInput.click();
      });
    }

    if (btnPermRetry) {
      btnPermRetry.addEventListener('click', openInAppCamera);
    }

    if (btnPermNative) {
      btnPermNative.addEventListener('click', () => {
        stopCameraStream();
        if (cameraDirectInput) cameraDirectInput.click();
      });
    }

    // Chat Area Clean Action Bar (Listen, Copy, Like)
    chatArea.addEventListener('click', function (e) {
      // 1. Audio Speech (TTS)
      const speakBtn = e.target.closest('.btn-speak');
      if (speakBtn) {
        if (speakBtn.classList.contains('is-playing')) {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          speakBtn.classList.remove('is-playing');
          showToast('Audio paused');
          return;
        }

        document.querySelectorAll('.btn-speak').forEach(b => b.classList.remove('is-playing'));
        const text = speakBtn.getAttribute('data-speak');
        if (!text) return;

        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.onend = () => speakBtn.classList.remove('is-playing');
          utterance.onerror = () => speakBtn.classList.remove('is-playing');
          speakBtn.classList.add('is-playing');
          window.speechSynthesis.speak(utterance);
          showToast('Playing explanation audio...');
        }
        return;
      }

      // 2. Copy Response
      const copyBtn = e.target.closest('.btn-copy');
      if (copyBtn) {
        const text = copyBtn.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
          showToast('✓ Copied to clipboard');
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 1500);
        });
        return;
      }

      // 3. Like (Antigravity Style)
      const likeBtn = e.target.closest('.btn-like');
      if (likeBtn) {
        const parentFooter = likeBtn.closest('.ai-card-footer');
        const siblingDislike = parentFooter ? parentFooter.querySelector('.btn-dislike') : null;
        if (siblingDislike) siblingDislike.classList.remove('active');

        likeBtn.classList.toggle('active');
        if (likeBtn.classList.contains('active')) {
          showToast('Helpful response 👍');
        }
        return;
      }

      // 4. Dislike (Antigravity Style)
      const dislikeBtn = e.target.closest('.btn-dislike');
      if (dislikeBtn) {
        const parentFooter = dislikeBtn.closest('.ai-card-footer');
        const siblingLike = parentFooter ? parentFooter.querySelector('.btn-like') : null;
        if (siblingLike) siblingLike.classList.remove('active');

        dislikeBtn.classList.toggle('active');
        if (dislikeBtn.classList.contains('active')) {
          showToast('Feedback noted 👎');
        }
        return;
      }

      // 4. Clickable Attached Media Preview (Enlarge in Lightbox)
      const mediaImg = e.target.closest('.clickable-media-preview');
      if (mediaImg && lightboxModal && lightboxImg) {
        lightboxImg.src = mediaImg.src;
        lightboxModal.style.display = 'flex';
        return;
      }
    });

    // Desktop view switcher
    btnPhoneView.addEventListener('click', () => {
      document.body.classList.remove('full-screen-mode');
      btnPhoneView.classList.add('active');
      btnFullView.classList.remove('active');
    });

    btnFullView.addEventListener('click', () => {
      document.body.classList.add('full-screen-mode');
      btnFullView.classList.add('active');
      btnPhoneView.classList.remove('active');
    });

    // Lightbox
    if (btnCloseLightbox) {
      btnCloseLightbox.addEventListener('click', () => lightboxModal.style.display = 'none');
    }
  }

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
