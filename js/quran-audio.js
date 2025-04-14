// وظائف مشغل الصوت للقرآن الكريم
document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const quranPlayer = document.getElementById('quran-player');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const reciterSelect = document.getElementById('reciter-select');
    const volumeControl = document.getElementById('volume-control');
    const speedControl = document.getElementById('speed-control');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const repeatToggle = document.getElementById('repeat-toggle');
    const downloadBtn = document.getElementById('download-btn');
    
    // المتغيرات
    let currentSurah = 1;
    let currentReciter = 'mishari'; // القارئ الافتراضي
    let isRepeatEnabled = false;
    let lastPlaybackPosition = 0;
    let surahNames = {}; // سيتم تعبئتها لاحقاً
    
    // تهيئة مشغل الصوت
    initAudioPlayer();
    
    // وظيفة تهيئة مشغل الصوت
    function initAudioPlayer() {
        // تحميل أسماء السور
        loadSurahNames();
        
        // استماع لأحداث الأزرار
        playPauseBtn.addEventListener('click', togglePlayPause);
        stopBtn.addEventListener('click', stopAudio);
        reciterSelect.addEventListener('change', changeReciter);
        
        // استماع لأحداث مشغل الصوت
        quranPlayer.addEventListener('play', updatePlayPauseButton);
        quranPlayer.addEventListener('pause', updatePlayPauseButton);
        quranPlayer.addEventListener('ended', onAudioEnded);
        quranPlayer.addEventListener('timeupdate', updateProgressBar);
        quranPlayer.addEventListener('loadedmetadata', updateDuration);
        
        // إضافة مستمعي الأحداث لعناصر التحكم الإضافية
        if (volumeControl) {
            volumeControl.addEventListener('input', updateVolume);
            // ضبط مستوى الصوت الافتراضي
            volumeControl.value = 1;
            quranPlayer.volume = 1;
        }
        
        if (speedControl) {
            speedControl.addEventListener('change', updatePlaybackSpeed);
        }
        
        if (progressBar) {
            progressBar.addEventListener('click', seekAudio);
        }
        
        if (repeatToggle) {
            repeatToggle.addEventListener('change', toggleRepeat);
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadCurrentSurah);
        }
        
        // استرجاع الإعدادات المحفوظة
        loadSavedSettings();
    }
    
    // وظيفة تشغيل/إيقاف الصوت
    function togglePlayPause() {
        if (quranPlayer.paused) {
            quranPlayer.play();
        } else {
            quranPlayer.pause();
        }
    }
    
    // وظيفة إيقاف الصوت
    function stopAudio() {
        quranPlayer.pause();
        quranPlayer.currentTime = 0;
        updatePlayPauseButton();
    }
    
    // وظيفة تغيير القارئ
    function changeReciter() {
        currentReciter = reciterSelect.value;
        updateAudioSource();
    }
    
    // وظيفة تحديث زر التشغيل/الإيقاف
    function updatePlayPauseButton() {
        if (quranPlayer.paused) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }
    
    // وظيفة معالجة انتهاء الصوت
    function onAudioEnded() {
        if (isRepeatEnabled) {
            // إذا كان التكرار مفعلاً، أعد تشغيل السورة الحالية
            quranPlayer.currentTime = 0;
            quranPlayer.play();
        } else {
            // إعادة تعيين المشغل
            quranPlayer.currentTime = 0;
            updatePlayPauseButton();
        }
    }
    
    // وظيفة تحديث شريط التقدم
    function updateProgressBar() {
        if (progressBar && quranPlayer.duration) {
            const percentage = (quranPlayer.currentTime / quranPlayer.duration) * 100;
            progressBar.value = percentage;
            progressBar.style.backgroundSize = `${percentage}% 100%`;
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(quranPlayer.currentTime);
        }
    }
    
    // وظيفة تحديث مدة الصوت
    function updateDuration() {
        if (durationDisplay && !isNaN(quranPlayer.duration)) {
            durationDisplay.textContent = formatTime(quranPlayer.duration);
        }
    }
    
    // وظيفة تنسيق الوقت
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // وظيفة تحديث مستوى الصوت
    function updateVolume() {
        if (volumeControl) {
            quranPlayer.volume = volumeControl.value;
            // حفظ الإعداد
            localStorage.setItem('quranPlayerVolume', volumeControl.value);
        }
    }
    
    // وظيفة تحديث سرعة التشغيل
    function updatePlaybackSpeed() {
        if (speedControl) {
            quranPlayer.playbackRate = parseFloat(speedControl.value);
            // حفظ الإعداد
            localStorage.setItem('quranPlayerSpeed', speedControl.value);
        }
    }
    
    // وظيفة الانتقال إلى موضع محدد في الصوت
    function seekAudio(event) {
        if (progressBar && quranPlayer.duration) {
            const progressBarRect = progressBar.getBoundingClientRect();
            const clickPosition = event.clientX - progressBarRect.left;
            const percentage = clickPosition / progressBarRect.width;
            quranPlayer.currentTime = percentage * quranPlayer.duration;
        }
    }
    
    // وظيفة تبديل خاصية التكرار
    function toggleRepeat() {
        if (repeatToggle) {
            isRepeatEnabled = repeatToggle.checked;
            // حفظ الإعداد
            localStorage.setItem('quranPlayerRepeat', isRepeatEnabled);
        }
    }
    
    // وظيفة تحميل السورة الحالية
    function downloadCurrentSurah() {
        const audioUrl = getAudioUrl(currentSurah, currentReciter);
        const surahName = surahNames[currentSurah] || `سورة ${currentSurah}`;
        
        // إنشاء رابط التحميل
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = `${surahName} - ${getReciterName(currentReciter)}.mp3`;
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    // وظيفة الحصول على اسم القارئ
    function getReciterName(reciterId) {
        const reciterNames = {
            'mishari': 'مشاري راشد العفاسي',
            'sudais': 'عبد الرحمن السديس',
            'minshawi': 'محمد صديق المنشاوي'
        };
        
        return reciterNames[reciterId] || reciterId;
    }
    
    // وظيفة تحديث مصدر الصوت
    function updateAudioSource() {
        // حفظ موضع التشغيل الحالي
        const currentTime = quranPlayer.currentTime;
        const wasPlaying = !quranPlayer.paused;
        
        // تحديث المصدر بناءً على السورة والقارئ
        quranPlayer.src = getAudioUrl(currentSurah, currentReciter);
        
        // استعادة موضع التشغيل
        quranPlayer.currentTime = currentTime;
        
        // استئناف التشغيل إذا كان قيد التشغيل
        if (wasPlaying) {
            quranPlayer.play();
        }
    }
    
    // وظيفة الحصول على رابط الصوت
    function getAudioUrl(surahId, reciter) {
        // تنسيق رقم السورة (إضافة أصفار في البداية إذا لزم الأمر)
        const formattedSurahId = surahId.toString().padStart(3, '0');
        
        // روابط القراء (في التطبيق الحقيقي، يمكنك استخدام API)
        const reciterUrls = {
            'mishari': `https://server8.mp3quran.net/afs/${formattedSurahId}.mp3`,
            'sudais': `https://server11.mp3quran.net/sds/${formattedSurahId}.mp3`,
            'minshawi': `https://server13.mp3quran.net/minsh/${formattedSurahId}.mp3`
        };
        
        return reciterUrls[reciter];
    }
    
    // وظيفة تحميل أسماء السور
    function loadSurahNames() {
        // قائمة بأسماء السور القرآنية
        surahNames = {
            1: 'الفاتحة',
            2: 'البقرة',
            3: 'آل عمران',
            4: 'النساء',
            5: 'المائدة',
            6: 'الأنعام',
            7: 'الأعراف',
            8: 'الأنفال',
            9: 'التوبة',
            10: 'يونس',
            11: 'هود',
            12: 'يوسف',
            13: 'الرعد',
            14: 'إبراهيم',
            15: 'الحجر',
            16: 'النحل',
            17: 'الإسراء',
            18: 'الكهف',
            19: 'مريم',
            20: 'طه',
            21: 'الأنبياء',
            22: 'الحج',
            23: 'المؤمنون',
            24: 'النور',
            25: 'الفرقان',
            26: 'الشعراء',
            27: 'النمل',
            28: 'القصص',
            29: 'العنكبوت',
            30: 'الروم',
            31: 'لقمان',
            32: 'السجدة',
            33: 'الأحزاب',
            34: 'سبأ',
            35: 'فاطر',
            36: 'يس',
            37: 'الصافات',
            38: 'ص',
            39: 'الزمر',
            40: 'غافر',
            41: 'فصلت',
            42: 'الشورى',
            43: 'الزخرف',
            44: 'الدخان',
            45: 'الجاثية',
            46: 'الأحقاف',
            47: 'محمد',
            48: 'الفتح',
            49: 'الحجرات',
            50: 'ق',
            51: 'الذاريات',
            52: 'الطور',
            53: 'النجم',
            54: 'القمر',
            55: 'الرحمن',
            56: 'الواقعة',
            57: 'الحديد',
            58: 'المجادلة',
            59: 'الحشر',
            60: 'الممتحنة',
            61: 'الصف',
            62: 'الجمعة',
            63: 'المنافقون',
            64: 'التغابن',
            65: 'الطلاق',
            66: 'التحريم',
            67: 'الملك',
            68: 'القلم',
            69: 'الحاقة',
            70: 'المعارج',
            71: 'نوح',
            72: 'الجن',
            73: 'المزمل',
            74: 'المدثر',
            75: 'القيامة',
            76: 'الإنسان',
            77: 'المرسلات',
            78: 'النبأ',
            79: 'النازعات',
            80: 'عبس',
            81: 'التكوير',
            82: 'الانفطار',
            83: 'المطففين',
            84: 'الانشقاق',
            85: 'البروج',
            86: 'الطارق',
            87: 'الأعلى',
            88: 'الغاشية',
            89: 'الفجر',
            90: 'البلد',
            91: 'الشمس',
            92: 'الليل',
            93: 'الضحى',
            94: 'الشرح',
            95: 'التين',
            96: 'العلق',
            97: 'القدر',
            98: 'البينة',
            99: 'الزلزلة',
            100: 'العاديات',
            101: 'القارعة',
            102: 'التكاثر',
            103: 'العصر',
            104: 'الهمزة',
            105: 'الفيل',
            106: 'قريش',
            107: 'الماعون',
            108: 'الكوثر',
            109: 'الكافرون',
            110: 'النصر',
            111: 'المسد',
            112: 'الإخلاص',
            113: 'الفلق',
            114: 'الناس'
        };
    }
    
    // وظيفة تحميل الإعدادات المحفوظة
    function loadSavedSettings() {
        // استرجاع مستوى الصوت
        const savedVolume = localStorage.getItem('quranPlayerVolume');
        if (savedVolume !== null && volumeControl) {
            volumeControl.value = savedVolume;
            quranPlayer.volume = parseFloat(savedVolume);
        }
        
        // استرجاع سرعة التشغيل
        const savedSpeed = localStorage.getItem('quranPlayerSpeed');
        if (savedSpeed !== null && speedControl) {
            speedControl.value = savedSpeed;
            quranPlayer.playbackRate = parseFloat(savedSpeed);
        }
        
        // استرجاع إعداد التكرار
        const savedRepeat = localStorage.getItem('quranPlayerRepeat');
        if (savedRepeat !== null && repeatToggle) {
            isRepeatEnabled = savedRepeat === 'true';
            repeatToggle.checked = isRepeatEnabled;
        }
        
        // استرجاع القارئ المفضل
        const savedReciter = localStorage.getItem('quranPlayerReciter');
        if (savedReciter !== null && reciterSelect) {
            currentReciter = savedReciter;
            reciterSelect.value = currentReciter;
        }
        
        // استرجاع آخر سورة تم تشغيلها
        const savedSurah = localStorage.getItem('quranPlayerSurah');
        if (savedSurah !== null) {
            currentSurah = parseInt(savedSurah);
        }
        
        // استرجاع آخر موضع تشغيل
        const savedPosition = localStorage.getItem('quranPlayerPosition');
        if (savedPosition !== null) {
            lastPlaybackPosition = parseFloat(savedPosition);
            
            // إذا كان الموضع أكبر من الصفر، اسأل المستخدم إذا كان يريد استئناف التشغيل
            if (lastPlaybackPosition > 0) {
                showResumePlaybackPrompt();
            }
        }
        
        // تحديث مصدر الصوت
        updateAudioSource();
    }
    
    // وظيفة عرض مربع حوار لاستئناف التشغيل
    function showResumePlaybackPrompt() {
        const surahName = surahNames[currentSurah] || `سورة ${currentSurah}`;
        const formattedTime = formatTime(lastPlaybackPosition);
        
        if (confirm(`هل ترغب في استئناف تلاوة ${surahName} من الدقيقة ${formattedTime}؟`)) {
            quranPlayer.currentTime = lastPlaybackPosition;
        } else {
            // إذا رفض المستخدم، ابدأ من البداية
            quranPlayer.currentTime = 0;
            lastPlaybackPosition = 0;
            localStorage.setItem('quranPlayerPosition', '0');
        }
    }
    
    // حفظ موضع التشغيل بشكل دوري
    setInterval(function() {
        if (!quranPlayer.paused && quranPlayer.currentTime > 0) {
            lastPlaybackPosition = quranPlayer.currentTime;
            localStorage.setItem('quranPlayerPosition', lastPlaybackPosition);
            localStorage.setItem('quranPlayerSurah', currentSurah);
        }
    }, 5000); // حفظ كل 5 ثوان
    
    // تصدير الوظائف للاستخدام في ملفات أخرى
    window.updateAudioPlayer = function(surahId) {
        currentSurah = surahId;
        // حفظ السورة الحالية
        localStorage.setItem('quranPlayerSurah', currentSurah);
        // إعادة تعيين موضع التشغيل
        lastPlaybackPosition = 0;
        localStorage.setItem('quranPlayerPosition', '0');
        // تحديث مصدر الصوت
        updateAudioSource();
    };
});

// قائمة السور الكاملة
const surahs = [
    { number: 1, name: "الفاتحة", versesCount: 7, type: "مكية" },
    { number: 2, name: "البقرة", versesCount: 286, type: "مدنية" },
    { number: 3, name: "آل عمران", versesCount: 200, type: "مدنية" },
    { number: 4, name: "النساء", versesCount: 176, type: "مدنية" },
    { number: 5, name: "المائدة", versesCount: 120, type: "مدنية" },
    { number: 6, name: "الأنعام", versesCount: 165, type: "مكية" },
    { number: 7, name: "الأعراف", versesCount: 206, type: "مكية" },
    { number: 8, name: "الأنفال", versesCount: 75, type: "مدنية" },
    { number: 9, name: "التوبة", versesCount: 129, type: "مدنية" },
    { number: 10, name: "يونس", versesCount: 109, type: "مكية" },
    { number: 11, name: "هود", versesCount: 123, type: "مكية" },
    { number: 12, name: "يوسف", versesCount: 111, type: "مكية" },
    { number: 13, name: "الرعد", versesCount: 43, type: "مدنية" },
    { number: 14, name: "إبراهيم", versesCount: 52, type: "مكية" },
    { number: 15, name: "الحجر", versesCount: 99, type: "مكية" },
    { number: 16, name: "النحل", versesCount: 128, type: "مكية" },
    { number: 17, name: "الإسراء", versesCount: 111, type: "مكية" },
    { number: 18, name: "الكهف", versesCount: 110, type: "مكية" },
    { number: 19, name: "مريم", versesCount: 98, type: "مكية" },
    { number: 20, name: "طه", versesCount: 135, type: "مكية" },
    { number: 21, name: "الأنبياء", versesCount: 112, type: "مكية" },
    { number: 22, name: "الحج", versesCount: 78, type: "مدنية" },
    { number: 23, name: "المؤمنون", versesCount: 118, type: "مكية" },
    { number: 24, name: "النور", versesCount: 64, type: "مدنية" },
    { number: 25, name: "الفرقان", versesCount: 77, type: "مكية" },
    { number: 26, name: "الشعراء", versesCount: 227, type: "مكية" },
    { number: 27, name: "النمل", versesCount: 93, type: "مكية" },
    { number: 28, name: "القصص", versesCount: 88, type: "مكية" },
    { number: 29, name: "العنكبوت", versesCount: 69, type: "مكية" },
    { number: 30, name: "الروم", versesCount: 60, type: "مكية" },
    { number: 31, name: "لقمان", versesCount: 34, type: "مكية" },
    { number: 32, name: "السجدة", versesCount: 30, type: "مكية" },
    { number: 33, name: "الأحزاب", versesCount: 73, type: "مدنية" },
    { number: 34, name: "سبأ", versesCount: 54, type: "مكية" },
    { number: 35, name: "فاطر", versesCount: 45, type: "مكية" },
    { number: 36, name: "يس", versesCount: 83, type: "مكية" },
    { number: 37, name: "الصافات", versesCount: 182, type: "مكية" },
    { number: 38, name: "ص", versesCount: 88, type: "مكية" },
    { number: 39, name: "الزمر", versesCount: 75, type: "مكية" },
    { number: 40, name: "غافر", versesCount: 85, type: "مكية" },
    { number: 41, name: "فصلت", versesCount: 54, type: "مكية" },
    { number: 42, name: "الشورى", versesCount: 53, type: "مكية" },
    { number: 43, name: "الزخرف", versesCount: 89, type: "مكية" },
    { number: 44, name: "الدخان", versesCount: 59, type: "مكية" },
    { number: 45, name: "الجاثية", versesCount: 37, type: "مكية" },
    { number: 46, name: "الأحقاف", versesCount: 35, type: "مكية" },
    { number: 47, name: "محمد", versesCount: 38, type: "مدنية" },
    { number: 48, name: "الفتح", versesCount: 29, type: "مدنية" },
    { number: 49, name: "الحجرات", versesCount: 18, type: "مدنية" },
    { number: 50, name: "ق", versesCount: 45, type: "مكية" },
    { number: 51, name: "الذاريات", versesCount: 60, type: "مكية" },
    { number: 52, name: "الطور", versesCount: 49, type: "مكية" },
    { number: 53, name: "النجم", versesCount: 62, type: "مكية" },
    { number: 54, name: "القمر", versesCount: 55, type: "مكية" },
    { number: 55, name: "الرحمن", versesCount: 78, type: "مدنية" },
    { number: 56, name: "الواقعة", versesCount: 96, type: "مكية" },
    { number: 57, name: "الحديد", versesCount: 29, type: "مدنية" },
    { number: 58, name: "المجادلة", versesCount: 22, type: "مدنية" },
    { number: 59, name: "الحشر", versesCount: 24, type: "مدنية" },
    { number: 60, name: "الممتحنة", versesCount: 13, type: "مدنية" },
    { number: 61, name: "الصف", versesCount: 14, type: "مدنية" },
    { number: 62, name: "الجمعة", versesCount: 11, type: "مدنية" },
    { number: 63, name: "المنافقون", versesCount: 11, type: "مدنية" },
    { number: 64, name: "التغابن", versesCount: 18, type: "مدنية" },
    { number: 65, name: "الطلاق", versesCount: 12, type: "مدنية" },
    { number: 66, name: "التحريم", versesCount: 12, type: "مدنية" },
    { number: 67, name: "الملك", versesCount: 30, type: "مكية" },
    { number: 68, name: "القلم", versesCount: 52, type: "مكية" },
    { number: 69, name: "الحاقة", versesCount: 52, type: "مكية" },
    { number: 70, name: "المعارج", versesCount: 44, type: "مكية" },
    { number: 71, name: "نوح", versesCount: 28, type: "مكية" },
    { number: 72, name: "الجن", versesCount: 28, type: "مكية" },
    { number: 73, name: "المزمل", versesCount: 20, type: "مكية" },
    { number: 74, name: "المدثر", versesCount: 56, type: "مكية" },
    { number: 75, name: "القيامة", versesCount: 40, type: "مكية" },
    { number: 76, name: "الإنسان", versesCount: 31, type: "مدنية" },
    { number: 77, name: "المرسلات", versesCount: 50, type: "مكية" },
    { number: 78, name: "النبأ", versesCount: 40, type: "مكية" },
    { number: 79, name: "النازعات", versesCount: 46, type: "مكية" },
    { number: 80, name: "عبس", versesCount: 42, type: "مكية" },
    { number: 81, name: "التكوير", versesCount: 29, type: "مكية" },
    { number: 82, name: "الانفطار", versesCount: 19, type: "مكية" },
    { number: 83, name: "المطففين", versesCount: 36, type: "مكية" },
    { number: 84, name: "الانشقاق", versesCount: 25, type: "مكية" },
    { number: 85, name: "البروج", versesCount: 22, type: "مكية" },
    { number: 86, name: "الطارق", versesCount: 17, type: "مكية" },
    { number: 87, name: "الأعلى", versesCount: 19, type: "مكية" },
    { number: 88, name: "الغاشية", versesCount: 26, type: "مكية" },
    { number: 89, name: "الفجر", versesCount: 30, type: "مكية" },
    { number: 90, name: "البلد", versesCount: 20, type: "مكية" },
    { number: 91, name: "الشمس", versesCount: 15, type: "مكية" },
    { number: 92, name: "الليل", versesCount: 21, type: "مكية" },
    { number: 93, name: "الضحى", versesCount: 11, type: "مكية" },
    { number: 94, name: "الشرح", versesCount: 8, type: "مكية" },
    { number: 95, name: "التين", versesCount: 8, type: "مكية" },
    { number: 96, name: "العلق", versesCount: 19, type: "مكية" },
    { number: 97, name: "القدر", versesCount: 5, type: "مكية" },
    { number: 98, name: "البينة", versesCount: 8, type: "مدنية" },
    { number: 99, name: "الزلزلة", versesCount: 8, type: "مدنية" },
    { number: 100, name: "العاديات", versesCount: 11, type: "مكية" },
    { number: 101, name: "القارعة", versesCount: 11, type: "مكية" },
    { number: 102, name: "التكاثر", versesCount: 8, type: "مكية" },
    { number: 103, name: "العصر", versesCount: 3, type: "مكية" },
    { number: 104, name: "الهمزة", versesCount: 9, type: "مكية" },
    { number: 105, name: "الفيل", versesCount: 5, type: "مكية" },
    { number: 106, name: "قريش", versesCount: 4, type: "مكية" },
    { number: 107, name: "الماعون", versesCount: 7, type: "مكية" },
    { number: 108, name: "الكوثر", versesCount: 3, type: "مكية" },
    { number: 109, name: "الكافرون", versesCount: 6, type: "مكية" },
    { number: 110, name: "النصر", versesCount: 3, type: "مدنية" },
    { number: 111, name: "المسد", versesCount: 5, type: "مكية" },
    { number: 112, name: "الإخلاص", versesCount: 4, type: "مكية" },
    { number: 113, name: "الفلق", versesCount: 5, type: "مكية" },
    { number: 114, name: "الناس", versesCount: 6, type: "مكية" }
];

// تحديث قائمة السور في الواجهة
function updateSurahList(filter = 'all') {
    const surahList = document.getElementById('surah-list');
    surahList.innerHTML = '';

    surahs.forEach(surah => {
        if (filter === 'all' || 
            (filter === 'makkah' && surah.type === 'مكية') || 
            (filter === 'madinah' && surah.type === 'مدنية')) {
            
            const li = document.createElement('li');
            li.className = 'surah-item';
            li.innerHTML = `
                <div class="surah-info">
                    <span class="surah-number">${surah.number}</span>
                    <div class="surah-name-container">
                        <span class="surah-name">${surah.name}</span>
                        <span class="surah-details">
                            <span class="verses-count">${surah.versesCount} آية</span>
                            <span class="surah-type ${surah.type === 'مكية' ? 'makki' : 'madani'}">${surah.type}</span>
                        </span>
                    </div>
                </div>
            `;
            
            li.addEventListener('click', () => loadSurah(surah.number));
            surahList.appendChild(li);
        }
    });
}

// البحث في السور
function searchSurahs(query) {
    const searchQuery = query.trim().toLowerCase();
    const surahList = document.getElementById('surah-list');
    surahList.innerHTML = '';

    surahs.forEach(surah => {
        if (surah.name.toLowerCase().includes(searchQuery) || 
            surah.number.toString().includes(searchQuery)) {
            
            const li = document.createElement('li');
            li.className = 'surah-item';
            li.innerHTML = `
                <div class="surah-info">
                    <span class="surah-number">${surah.number}</span>
                    <div class="surah-name-container">
                        <span class="surah-name">${surah.name}</span>
                        <span class="surah-details">
                            <span class="verses-count">${surah.versesCount} آية</span>
                            <span class="surah-type ${surah.type === 'مكية' ? 'makki' : 'madani'}">${surah.type}</span>
                        </span>
                    </div>
                </div>
            `;
            
            li.addEventListener('click', () => loadSurah(surah.number));
            surahList.appendChild(li);
        }
    });
}

// تحميل السورة المحددة
async function loadSurah(surahNumber) {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return;

    // تحديث عنوان السورة
    document.getElementById('surah-title').textContent = `سورة ${surah.name}`;
    document.querySelector('.ayah-text').innerHTML = '<div class="loading">جاري تحميل السورة...</div>';

    try {
        // تحميل نص السورة
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`);
        const data = await response.json();
        
        if (data.code === 200) {
            displaySurahContent(data.data);
            
            // تحديث مشغل الصوت
            updateAudioPlayer(surahNumber);
            
            // تحديث URL الصفحة
            history.pushState({ surah: surahNumber }, '', `#surah=${surahNumber}`);
        } else {
            throw new Error('فشل في تحميل السورة');
        }
    } catch (error) {
        console.error('خطأ في تحميل السورة:', error);
        document.querySelector('.ayah-text').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>عذراً، حدث خطأ في تحميل السورة. يرجى المحاولة مرة أخرى.</p>
                <button onclick="loadSurah(${surahNumber})" class="retry-btn">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// تحديث مشغل الصوت
function updateAudioPlayer(surahNumber) {
    const audioPlayer = document.getElementById('quran-player');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const reciterSelect = document.getElementById('reciter-select');
    
    // الحصول على القارئ المحدد
    const reciter = reciterSelect.value;
    
    // تحديث مصدر الصوت
    const audioSource = `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahNumber}.mp3`;
    audioPlayer.src = audioSource;
    
    // إعادة تعيين أزرار التحكم
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    // إضافة مستمعي الأحداث
    playPauseBtn.onclick = function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    };
    
    stopBtn.onclick = function() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    };
    
    // تحديث الأزرار عند انتهاء التشغيل
    audioPlayer.onended = function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.currentTime = 0;
    };
    
    // تحديث الأزرار عند تغيير القارئ
    reciterSelect.onchange = function() {
        updateAudioPlayer(surahNumber);
    };
}

// عرض محتوى السورة
function displaySurahContent(surahData) {
    const ayahTextContainer = document.querySelector('.ayah-text');
    ayahTextContainer.innerHTML = '';

    // إضافة البسملة إذا لم تكن سورة التوبة
    if (surahData.number !== 9) {
        const bismillah = document.createElement('div');
        bismillah.className = 'bismillah-text';
        bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
        ayahTextContainer.appendChild(bismillah);
    }

    // إنشاء عناصر الآيات
    surahData.ayahs.forEach(ayah => {
        const ayahElement = document.createElement('div');
        ayahElement.className = 'ayah';
        ayahElement.setAttribute('data-ayah-number', ayah.numberInSurah);
        
        const ayahText = document.createElement('span');
        ayahText.className = 'ayah-text';
        ayahText.textContent = ayah.text;
        
        const ayahNumber = document.createElement('span');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = ayah.numberInSurah;
        
        ayahElement.appendChild(ayahText);
        ayahElement.appendChild(ayahNumber);
        
        // إضافة خيارات التفاعل
        ayahElement.addEventListener('click', () => {
            showAyahOptions(ayah, surahData);
        });
        
        ayahTextContainer.appendChild(ayahElement);
    });

    // تحديث معلومات الصفحة
    updatePageInfo(surahData.page, surahData.juz);
}

// عرض خيارات الآية
function showAyahOptions(ayah, surahData) {
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'ayah-options';
    optionsMenu.innerHTML = `
        <button class="option-btn" data-action="play">
            <i class="fas fa-play"></i> استماع
        </button>
        <button class="option-btn" data-action="copy">
            <i class="fas fa-copy"></i> نسخ
        </button>
        <button class="option-btn" data-action="share">
            <i class="fas fa-share"></i> مشاركة
        </button>
        <button class="option-btn" data-action="tafseer">
            <i class="fas fa-book"></i> تفسير
        </button>
    `;
    
    // إضافة معالجات الأحداث للخيارات
    optionsMenu.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            handleAyahAction(action, ayah, surahData);
            optionsMenu.remove();
        });
    });
    
    // إضافة القائمة إلى الصفحة
    document.body.appendChild(optionsMenu);
    
    // إزالة القائمة عند النقر خارجها
    document.addEventListener('click', function removeMenu(e) {
        if (!optionsMenu.contains(e.target)) {
            optionsMenu.remove();
            document.removeEventListener('click', removeMenu);
        }
    });
}

// معالجة إجراءات الآية
async function handleAyahAction(action, ayah, surahData) {
    switch (action) {
        case 'play':
            // تشغيل الآية الصوتية
            const audioPlayer = document.getElementById('quran-player');
            const reciter = document.getElementById('reciter-select').value;
            audioPlayer.src = `https://cdn.islamic.network/quran/audio-ayah/128/${reciter}/${surahData.number}/${ayah.numberInSurah}.mp3`;
            audioPlayer.play();
            break;
            
        case 'copy':
            // نسخ نص الآية
            const ayahText = `${ayah.text} [${surahData.name}: ${ayah.numberInSurah}]`;
            await navigator.clipboard.writeText(ayahText);
            showNotification('تم نسخ الآية');
            break;
            
        case 'share':
            // مشاركة الآية
            const shareText = `${ayah.text}\n\n- سورة ${surahData.name} (${ayah.numberInSurah})\n`;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `سورة ${surahData.name} - الآية ${ayah.numberInSurah}`,
                        text: shareText,
                        url: window.location.href
                    });
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                await navigator.clipboard.writeText(shareText);
                showNotification('تم نسخ الآية للمشاركة');
            }
            break;
            
        case 'tafseer':
            // عرض تفسير الآية
            showTafseer(surahData.name, ayah.numberInSurah, ayah.text);
            break;
    }
}

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// تحديث معلومات الصفحة
function updatePageInfo(pageNumber, juzNumber) {
    const pageNumberElement = document.querySelector('.page-number');
    const juzNumberElement = document.querySelector('.juz-number');
    
    if (pageNumberElement && pageNumber) {
        pageNumberElement.textContent = `صفحة ${pageNumber}`;
    } else {
        pageNumberElement.textContent = '';
    }
    
    if (juzNumberElement && juzNumber) {
        juzNumberElement.textContent = `الجزء ${juzNumber}`;
    } else {
        juzNumberElement.textContent = '';
    }
}

// تحسين أداء البحث باستخدام Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// تطبيق Debounce على وظيفة البحث
const debouncedSearch = debounce((query) => {
    searchSurahs(query);
}, 300);

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحديث قائمة السور
    updateSurahList();

    // مستمع البحث
    const searchInput = document.getElementById('surah-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // مستمعي التصفية
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateSurahList(button.dataset.filter);
        });
    });

    // مستمع الترتيب
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            updateSurahList(currentFilter);
        });
    }

    // تحميل السورة الأولى افتراضياً
    loadSurah(1);
});

// إضافة تنسيقات CSS إضافية
const style = document.createElement('style');
style.textContent = `
    .quran-line {
        text-align: justify;
        margin: 15px 0;
        line-height: 2.5;
    }

    .bismillah-text {
        text-align: center;
        font-family: 'KFGQPC Uthmanic Script HAFS', 'me_quran', serif;
        font-size: 32px;
        margin: 20px 0;
        color: #8B4513;
    }

    .ayah {
        font-family: 'KFGQPC Uthmanic Script HAFS', 'me_quran', serif;
        font-size: 28px;
        color: #000;
        position: relative;
        margin: 0 3px;
    }

    .dark-theme .ayah {
        color: #e0e0e0;
    }

    .error-message {
        text-align: center;
        color: #ff4444;
        padding: 20px;
        font-size: 18px;
    }
`;
document.head.appendChild(style);
