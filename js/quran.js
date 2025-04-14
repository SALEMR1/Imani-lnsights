function displayVerses(verses) {
    const ayahTextContainer = document.querySelector('.quran-text');
    ayahTextContainer.innerHTML = '';
    
    // إضافة زر التبديل بين العرض العادي وعرض المصحف
    if (!document.querySelector('.view-toggle')) {
        const viewToggle = document.createElement('div');
        viewToggle.className = 'view-toggle';
        viewToggle.innerHTML = `
            <button class="view-toggle-btn" id="toggle-view">
                <i class="fas fa-book-open"></i> عرض المصحف
            </button>
        `;
        ayahTextContainer.parentNode.insertBefore(viewToggle, ayahTextContainer);
        
        // إضافة حدث النقر على زر التبديل
        document.getElementById('toggle-view').addEventListener('click', toggleQuranView);
    }
    
    // إنشاء حاوية للآيات
    const ayahContainer = document.createElement('div');
    ayahContainer.className = 'ayah-text';
    ayahTextContainer.appendChild(ayahContainer);

    verses.forEach((verse) => {
        const ayahSpan = document.createElement('span');
        ayahSpan.className = 'ayah';
        
        // إضافة نص الآية
        const ayahContent = document.createElement('span');
        ayahContent.className = 'ayah-content';
        ayahContent.textContent = verse.text;
        ayahSpan.appendChild(ayahContent);
        
        // إضافة رقم الآية
        const ayahNumber = document.createElement('span');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = convertToArabicNumbers(verse.number);
        ayahSpan.appendChild(ayahNumber);
        
        ayahContainer.appendChild(ayahSpan);
    });

    // تحديث رقم الصفحة
    if (verses.length > 0 && verses[0].page) {
        updatePageNumber(verses[0].page);
    }
}

// دالة لتحويل الأرقام إلى الأرقام العربية
function convertToArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[digit] || digit).join('');
}

// تحديث رقم الصفحة
function updatePageNumber(pageNumber) {
    const pageNumberElement = document.querySelector('.page-number');
    if (pageNumberElement) {
        pageNumberElement.textContent = `صفحة ${convertToArabicNumbers(pageNumber)}`;
    }
}

// تحميل الآيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const sampleVerses = [
        { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", number: 1, page: 1 },
        { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", number: 2, page: 1 },
        { text: "الرَّحْمَٰنِ الرَّحِيمِ", number: 3, page: 1 },
        { text: "مَالِكِ يَوْمِ الدِّينِ", number: 4, page: 1 },
        { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", number: 5, page: 1 },
        { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", number: 6, page: 1 },
        { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", number: 7, page: 1 }
    ];
    
    // إضافة المزيد من الآيات للاختبار
    const longSurahVerses = generateLongSurah();
    
    displayVerses(sampleVerses);
    
    // إضافة حدث النقر على عناصر قائمة السور (إذا وجدت)
    const surahListItems = document.querySelectorAll('#surah-list li');
    if (surahListItems.length > 0) {
        surahListItems.forEach(item => {
            item.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع العناصر
                surahListItems.forEach(li => li.classList.remove('active'));
                // إضافة الفئة النشطة للعنصر المنقور
                this.classList.add('active');
                
                // عرض السورة المحددة (في هذا المثال نعرض سورة طويلة للاختبار)
                displayVerses(longSurahVerses);
            });
        });
    }
});

// دالة لإنشاء سورة طويلة للاختبار
function generateLongSurah() {
    const verses = [];
    // إنشاء 50 آية للاختبار
    for (let i = 1; i <= 50; i++) {
        verses.push({
            text: `هذا نص تجريبي للآية رقم ${i} من السورة. نستخدم هذا النص لاختبار عرض السور الطويلة بشكل المصحف.`,
            number: i,
            page: Math.ceil(i / 15) // تقسيم الآيات على صفحات
        });
    }
    return verses;
}

// دالة للتبديل بين العرض العادي وعرض المصحف
function toggleQuranView() {
    const ayahTextContainer = document.querySelector('.quran-text');
    const toggleButton = document.getElementById('toggle-view');
    
    if (ayahTextContainer.classList.contains('mushaf-style')) {
        // التبديل إلى العرض العادي
        ayahTextContainer.classList.remove('mushaf-style');
        toggleButton.innerHTML = '<i class="fas fa-book-open"></i> عرض المصحف';
    } else {
        // التبديل إلى عرض المصحف
        ayahTextContainer.classList.add('mushaf-style');
        toggleButton.innerHTML = '<i class="fas fa-list"></i> العرض العادي';
    }
}

// دالة لعرض خيارات الآية
function showVerseOptions(verse) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'ayah-options';
    optionsContainer.innerHTML = `
        <button class="option-btn" onclick="playVerse(${verse.number})">
            <i class="fas fa-play"></i> استماع
        </button>
        <button class="option-btn" onclick="copyVerse(${verse.number})">
            <i class="fas fa-copy"></i> نسخ
        </button>
        <button class="option-btn" onclick="showTafseer(${verse.number})">
            <i class="fas fa-book"></i> التفسير
        </button>
    `;
    
    document.body.appendChild(optionsContainer);
    
    // إزالة الخيارات بعد النقر خارجها
    setTimeout(() => {
        document.addEventListener('click', function removeOptions(e) {
            if (!optionsContainer.contains(e.target)) {
                optionsContainer.remove();
                document.removeEventListener('click', removeOptions);
            }
        });
    }, 0);
}

// تحديث حجم الخط
function updateFontSize(size) {
    const ayahText = document.querySelector('.ayah-text');
    if (ayahText) {
        const currentSize = parseInt(window.getComputedStyle(ayahText).fontSize);
        const newSize = currentSize + size;
        if (newSize >= 20 && newSize <= 40) {
            ayahText.style.fontSize = `${newSize}px`;
            ayahText.style.lineHeight = `${newSize * 1.8}px`;
        }
    }
} 