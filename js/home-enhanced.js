// ملف جافاسكريبت لتعزيز الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات التمرير
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroSection = document.getElementById('hero-section');
        
        // تأثير التوازي عند التمرير
        if (heroSection) {
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
    
    // تحميل صور الخلفية بشكل متأخر
    const preloadBackgrounds = () => {
        const backgrounds = [
            'images/backgrounds/mosque-bg.jpg',
            'images/backgrounds/quran-bg.jpg',
            'images/tasbih-bg.jpg'
        ];
        
        backgrounds.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    // تشغيل وظيفة تحميل الصور المتأخر
    setTimeout(preloadBackgrounds, 1000);
    
    // إضافة تأثيرات التحويم على ميزات البطل
    const heroFeatures = document.querySelectorAll('.hero-feature');
    heroFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
