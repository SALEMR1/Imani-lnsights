/**
 * ملف لتحسين دعم اللمس على الأجهزة المحمولة
 * يعالج مشاكل الأزرار التي لا تستجيب على الهاتف
 */

document.addEventListener('DOMContentLoaded', function() {
    // تحسين استجابة جميع الأزرار والروابط
    enhanceTouchSupport();
    
    // تحسين استجابة القائمة
    enhanceMobileMenu();
    
    // تحسين استجابة أزرار التنقل
    enhanceNavigationLinks();
});

/**
 * تحسين استجابة جميع الأزرار والروابط للمس
 */
function enhanceTouchSupport() {
    // تحديد جميع الأزرار والروابط في الصفحة
    const touchElements = document.querySelectorAll('button, a, .btn, [role="button"], input[type="button"], input[type="submit"]');
    
    // إضافة مستمعات أحداث اللمس لكل عنصر
    touchElements.forEach(element => {
        // إزالة أي مستمعات أحداث قديمة
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        
        // إضافة مستمعات أحداث جديدة
        element.addEventListener('touchstart', handleTouchStart, {passive: true});
        element.addEventListener('touchend', handleTouchEnd);
    });
}

/**
 * معالجة حدث بداية اللمس
 */
function handleTouchStart(e) {
    // إضافة فئة للعنصر عند اللمس لإظهار تأثير بصري
    this.classList.add('touch-active');
}

/**
 * معالجة حدث نهاية اللمس
 */
function handleTouchEnd(e) {
    // إزالة فئة اللمس النشط
    this.classList.remove('touch-active');
    
    // إذا كان العنصر زر أو رابط، تنفيذ الإجراء المناسب
    if (this.tagName.toLowerCase() === 'a') {
        const href = this.getAttribute('href');
        
        // إذا كان رابطاً داخلياً (مثل #section)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        } 
        // إذا كان رابطاً خارجياً
        else if (href && !href.startsWith('javascript:')) {
            e.preventDefault();
            window.location.href = href;
        }
    }
}

/**
 * تحسين استجابة القائمة المتنقلة
 */
function enhanceMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        // إزالة أي مستمعات أحداث قديمة
        menuToggle.removeEventListener('click', toggleMenu);
        
        // إضافة مستمع حدث جديد
        menuToggle.addEventListener('click', toggleMenu);
        
        // إضافة مستمع حدث للمس
        menuToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }
    
    // دالة تبديل القائمة
    function toggleMenu() {
        nav.classList.toggle('active');
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !expanded);
    }
}

/**
 * تحسين استجابة روابط التنقل
 */
function enhanceNavigationLinks() {
    // الحصول على جميع روابط القائمة
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // تحسين استجابة كل رابط
    navLinks.forEach(link => {
        // إزالة أي مستمعات أحداث قديمة
        link.removeEventListener('click', handleNavLinkClick);
        
        // إضافة مستمع حدث جديد
        link.addEventListener('click', handleNavLinkClick);
        
        // إضافة مستمع حدث للمس
        link.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleNavLinkClick.call(this, e);
        });
    });
    
    // دالة معالجة النقر على روابط التنقل
    function handleNavLinkClick(e) {
        const href = this.getAttribute('href');
        
        // إذا كان الرابط يشير إلى صفحة أخرى (ليس رابطًا داخليًا مثل #quran)
        if (href && !href.startsWith('#')) {
            e.preventDefault();
            window.location.href = href;
        }
    }
}
