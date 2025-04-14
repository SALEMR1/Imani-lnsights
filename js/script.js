// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع الوظائف
    if (typeof initQuranSection === 'function') {
        initQuranSection();
    }
    
    if (typeof initPrayerTimes === 'function') {
        initPrayerTimes();
    }
    
    if (typeof initHadithSection === 'function') {
        initHadithSection();
    }
    
    // التحقق من وجود دالة initAzkarSection قبل استدعائها
    if (typeof initAzkarSection === 'function') {
        initAzkarSection();
    } else {
        console.log('دالة initAzkarSection غير معرفة بعد. سيتم تجاهلها.');
    }
    
    // التاريخ الهجري
    if (typeof displayHijriDate === 'function') {
        displayHijriDate();
    }
    
    // إصلاح مشكلة الروابط في القائمة العلوية
    initMobileSupport();
    fixNavigationLinks();
});

// دالة مساعدة للتحقق من وجود العنصر قبل تحديث النص
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// دالة لتحسين دعم الأجهزة المحمولة
function initMobileSupport() {
    // التعامل مع زر القائمة المتنقلة
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // تحسين مساحات النقر للأزرار على الأجهزة المحمولة
    const allButtons = document.querySelectorAll('button, .btn, nav ul li a');
    allButtons.forEach(button => {
        if (button.offsetWidth < 44 || button.offsetHeight < 44) {
            button.style.minWidth = '44px';
            button.style.minHeight = '44px';
        }
    });
    
    // إضافة مستمع للتعامل مع الشاشة الكاملة على الأجهزة المحمولة
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && nav) {
            nav.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// دالة لإصلاح مشكلة الروابط في القائمة العلوية
function fixNavigationLinks() {
    // الحصول على جميع روابط القائمة
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // التأكد من أن جميع الروابط تعمل بشكل صحيح
    navLinks.forEach(link => {
        // إضافة مستمع حدث جديد مباشرة بدلاً من استبدال العنصر
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // إذا كان الرابط يشير إلى صفحة أخرى (ليس رابطًا داخليًا مثل #quran)
            if (href && !href.startsWith('#')) {
                // الانتقال إلى الصفحة المطلوبة
                window.location.href = href;
                e.preventDefault(); // منع السلوك الافتراضي
            }
        });
    });
    
    // إضافة دعم خاص لزر الصفحة الرئيسية
    const homeLink = document.querySelector('nav ul li a[href="index.html"]');
    if (homeLink) {
        homeLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        };
    }
    
    // إضافة دعم خاص لزر من نحن
    const aboutUsLink = document.querySelector('nav ul li a[href="about-us.html"]');
    if (aboutUsLink) {
        aboutUsLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'about-us.html';
        };
    }
}

// وظائف القرآن الكريم
function initQuranSection() {
    const surahList = document.getElementById('surah-list');
    const quranText = document.getElementById('quran-text');
    const surahTitle = document.getElementById('surah-title');
    const surahSearch = document.getElementById('surah-search');
    const sortSelect = document.getElementById('sort-select');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // تحديث قائمة السور
    function updateSurahList(filter = 'all', searchQuery = '', sortBy = 'order') {
        if (!surahList) return;
        
        surahList.innerHTML = '';
        
        let filteredSurahs = [...surahs];
        
        // تطبيق الفلتر
        if (filter !== 'all') {
            filteredSurahs = surahs.filter(surah => 
                filter === 'makkah' ? surah.type === 'مكية' : surah.type === 'مدنية'
            );
        }
        
        // تطبيق البحث
        if (searchQuery) {
            const query = searchQuery.trim().toLowerCase();
            filteredSurahs = filteredSurahs.filter(surah =>
                surah.name.toLowerCase().includes(query) ||
                surah.number.toString().includes(query)
            );
        }
        
        // تطبيق الترتيب
        switch (sortBy) {
            case 'name':
                filteredSurahs.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                break;
            case 'verses':
                filteredSurahs.sort((a, b) => b.versesCount - a.versesCount);
                break;
            default: // order
                filteredSurahs.sort((a, b) => a.number - b.number);
        }
        
        // إنشاء عناصر القائمة
        filteredSurahs.forEach(surah => {
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
        });
    }
    
    // إضافة مستمعي الأحداث
    if (surahSearch) {
        surahSearch.addEventListener('input', (e) => {
            updateSurahList(
                document.querySelector('.filter-btn.active').dataset.filter,
                e.target.value,
                sortSelect.value
            );
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            updateSurahList(
                document.querySelector('.filter-btn.active').dataset.filter,
                surahSearch.value,
                e.target.value
            );
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSurahList(
                btn.dataset.filter,
                surahSearch.value,
                sortSelect.value
            );
        });
    });
    
    // تحميل القائمة الأولية
    updateSurahList();
}

// وظائف مواقيت الصلاة
function initPrayerTimes() {
    // التحقق مما إذا كنا في صفحة تحتوي على قسم مواقيت الصلاة
    const prayerSection = document.getElementById('prayer');
    if (!prayerSection) {
        // إذا لم يكن قسم مواقيت الصلاة موجوداً، نخرج من الدالة
        return;
    }
    
    const locationElement = document.getElementById('current-location');
    const currentDateElement = document.getElementById('current-date');
    const hijriDateElement = document.getElementById('hijri-date');
    
    // عرض التاريخ الحالي إذا كان العنصر موجوداً
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('ar', options);
    }
    
    // محاكاة تحديد الموقع إذا كان العنصر موجوداً
    if (locationElement) {
        locationElement.textContent = "القاهرة، مصر";
    }
    
    // محاكاة مواقيت الصلاة مع التحقق من وجود العناصر
    updateElementText('fajr-time', "04:30");
    updateElementText('sunrise-time', "06:05");
    updateElementText('dhuhr-time', "12:15");
    updateElementText('asr-time', "15:45");
    updateElementText('maghrib-time', "18:25");
    updateElementText('isha-time', "19:55");
    
    // في التطبيق الحقيقي، يمكنك استخدام API لمواقيت الصلاة
    // مثال: getPrayerTimes();
    
    // وظيفة الحصول على مواقيت الصلاة من API
    function getPrayerTimes() {
        // استخدام Geolocation API للحصول على موقع المستخدم
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // استخدام API لمواقيت الصلاة
                // مثال: fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`)
                //     .then(response => response.json())
                //     .then(data => {
                //         // عرض مواقيت الصلاة
                //     });
                
                // الحصول على اسم المدينة باستخدام Reverse Geocoding
                // مثال: fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                //     .then(response => response.json())
                //     .then(data => {
                //         locationElement.textContent = data.address.city + '، ' + data.address.country;
                //     });
            });
        }
    }
}

// وظائف الأحاديث النبوية
function initHadithSection() {
    // التحقق مما إذا كنا في صفحة تحتوي على قسم الأحاديث
    const hadithSection = document.getElementById('hadith');
    if (!hadithSection) {
        // إذا لم يكن قسم الأحاديث موجوداً، نخرج من الدالة
        return;
    }
    const hadiths = [
        {
            text: "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من سلك طريقًا يلتمس فيه علمًا سهل الله له به طريقًا إلى الجنة\"",
            source: "رواه مسلم"
        },
        {
            text: "عن عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: \"إنما الأعمال بالنيات وإنما لكل امرئ ما نوى\"",
            source: "متفق عليه"
        },
        {
            text: "عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: \"المسلم من سلم المسلمون من لسانه ويده، والمؤمن من أمنه الناس على دمائهم وأموالهم\"",
            source: "رواه الترمذي"
        },
        {
            text: "عن أنس بن مالك رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه\"",
            source: "رواه البخاري ومسلم"
        },
        {
            text: "عن أبي ذر الغفاري رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن\"",
            source: "رواه الترمذي"
        },
        {
            text: "عن النعمان بن بشير رضي الله عنهما قال: سمعت رسول الله صلى الله عليه وسلم يقول: \"إن الحلال بيّن وإن الحرام بيّن، وبينهما أمور مشتبهات لا يعلمهن كثير من الناس، فمن اتقى الشبهات فقد استبرأ لدينه وعرضه\"",
            source: "رواه البخاري ومسلم"
        },
        {
            text: "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"الإيمان بضع وسبعون شعبة، فأفضلها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق، والحياء شعبة من الإيمان\"",
            source: "رواه مسلم"
        },
        {
            text: "عن عبد الله بن عمرو رضي الله عنهما قال: قال رسول الله صلى الله عليه وسلم: \"المسلم من سلم المسلمون من لسانه ويده، والمهاجر من هجر ما نهى الله عنه\"",
            source: "رواه البخاري"
        },
        {
            text: "عن أبي سعيد الخدري رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: \"من رأى منكم منكرًا فليغيره بيده، فإن لم يستطع فبلسانه، فإن لم يستطع فبقلبه، وذلك أضعف الإيمان\"",
            source: "رواه مسلم"
        },
        {
            text: "عن ابن عباس رضي الله عنهما قال: كنت خلف النبي صلى الله عليه وسلم يومًا فقال: \"يا غلام، إني أعلمك كلمات: احفظ الله يحفظك، احفظ الله تجده تجاهك، إذا سألت فاسأل الله، وإذا استعنت فاستعن بالله\"",
            source: "رواه الترمذي"
        },
        {
            text: "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من لا يشكر الناس لا يشكر الله\"",
            source: "رواه أبو داود والترمذي"
        },
        {
            text: "عن عائشة رضي الله عنها قالت: قال رسول الله صلى الله عليه وسلم: \"إن الله رفيق يحب الرفق في الأمر كله\"",
            source: "متفق عليه"
        }
    ];
    
    let currentHadithIndex = 0;
    const hadithText = document.querySelector('.hadith-text p');
    const hadithSource = document.querySelector('.hadith-source p');
    
    // التحقق من وجود عناصر النص
    if (!hadithText || !hadithSource) {
        console.log('عناصر نص الحديث غير موجودة');
        return;
    }
    
    // أزرار التنقل
    const prevBtn = document.getElementById('prev-hadith');
    const nextBtn = document.getElementById('next-hadith');
    const randomBtn = document.getElementById('random-hadith');
    
    // عرض الحديث
    function displayHadith(index) {
        if (hadithText && hadithSource) {
            hadithText.textContent = hadiths[index].text;
            hadithSource.textContent = hadiths[index].source;
        }
    }
    
    // عرض الحديث الأول عند التحميل
    displayHadith(currentHadithIndex);
    
    // إضافة مستمعي الأحداث إذا كانت الأزرار موجودة
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentHadithIndex = (currentHadithIndex + 1) % hadiths.length;
            displayHadith(currentHadithIndex);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentHadithIndex = (currentHadithIndex - 1 + hadiths.length) % hadiths.length;
            displayHadith(currentHadithIndex);
        });
    }
    
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * hadiths.length);
            currentHadithIndex = randomIndex;
            displayHadith(currentHadithIndex);
        });
    }
}
