// استيراد قاعدة بيانات الأحاديث
// يتم استيراد المتغير hadiths من ملف hadith-data.js

document.addEventListener('DOMContentLoaded', function() {
    // العناصر في صفحة HTML
    const hadithTextElement = document.querySelector('.hadith-text p');
    const hadithSourceElement = document.querySelector('.hadith-source p');
    const prevButton = document.getElementById('prev-hadith');
    const nextButton = document.getElementById('next-hadith');
    const randomButton = document.getElementById('random-hadith');

    // مؤشر الحديث الحالي
    let currentHadithIndex = 0;

    // عرض الحديث الحالي
    function displayHadith(index) {
        if (!hadiths || hadiths.length === 0) return;
        
        // التأكد من أن المؤشر ضمن النطاق
        if (index < 0) index = hadiths.length - 1;
        if (index >= hadiths.length) index = 0;
        
        currentHadithIndex = index;
        
        // عرض الحديث ومصدره
        hadithTextElement.textContent = hadiths[index].text;
        hadithSourceElement.textContent = hadiths[index].source;
        
        // إضافة تأثير انتقالي
        const hadithCard = document.querySelector('.hadith-card');
        hadithCard.style.opacity = '0';
        setTimeout(() => {
            hadithCard.style.opacity = '1';
        }, 300);
    }

    // الانتقال إلى الحديث السابق
    function goToPreviousHadith() {
        displayHadith(currentHadithIndex - 1);
    }

    // الانتقال إلى الحديث التالي
    function goToNextHadith() {
        displayHadith(currentHadithIndex + 1);
    }

    // عرض حديث عشوائي
    function showRandomHadith() {
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        displayHadith(randomIndex);
    }

    // إضافة أحداث النقر للأزرار
    if (prevButton) prevButton.addEventListener('click', goToPreviousHadith);
    if (nextButton) nextButton.addEventListener('click', goToNextHadith);
    if (randomButton) randomButton.addEventListener('click', showRandomHadith);

    // عرض الحديث الأول عند تحميل الصفحة
    displayHadith(0);

    // إضافة دعم لاختصارات لوحة المفاتيح للتنقل بين الأحاديث
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            goToPreviousHadith();
        } else if (event.key === 'ArrowLeft') {
            goToNextHadith();
        }
    });
});
