/**
 * ملف موحد للقائمة المتجاوبة
 * يجمع وظائف القائمة من ملفات متعددة في ملف واحد
 * لتحسين الأداء وتجنب التداخل
 */

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initResponsiveMenu();
});

/**
 * تهيئة القائمة المتجاوبة
 */
function initResponsiveMenu() {
    // العناصر الأساسية
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    // التحقق من وجود العناصر
    if (!menuToggle || !nav) {
        console.log('عناصر القائمة غير موجودة');
        return;
    }
    
    // إنشاء طبقة التغطية
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    // تبديل القائمة عند النقر على زر القائمة
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // منع انتشار الحدث
        
        // تبديل حالة القائمة
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // تحديث حالة زر القائمة
        const isExpanded = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // تغيير أيقونة القائمة
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        // تطبيق لون الخلفية على عناصر القائمة
        const navItems = nav.querySelectorAll('ul, li, a');
        navItems.forEach(item => {
            if (isExpanded) {
                item.style.backgroundColor = 'var(--primary-color)';
                if (item.tagName === 'A') {
                    item.style.color = '#ffffff';
                }
            } else {
                item.style.backgroundColor = '';
                if (item.tagName === 'A') {
                    item.style.color = '';
                }
            }
        });
        
        // منع التمرير عند فتح القائمة
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // إغلاق القائمة عند النقر على طبقة التغطية
    overlay.addEventListener('click', function() {
        closeMenu();
    });
    
    // تحسين استجابة روابط القائمة
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        // إضافة مستمع الحدث للروابط
        link.addEventListener('click', function() {
            closeMenu();
            
            // تحديث حالة الرابط النشط
            updateActiveLink(this);
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== menuToggle && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // تحديث حالة الرابط النشط عند تحميل الصفحة
    updateActiveLinks();
    
    /**
     * إغلاق القائمة
     */
    function closeMenu() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // استعادة أيقونة القائمة
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // استعادة لون الخلفية على عناصر القائمة
        const navItems = nav.querySelectorAll('ul, li, a');
        navItems.forEach(item => {
            item.style.backgroundColor = '';
            if (item.tagName === 'A') {
                item.style.color = '';
            }
        });
    }
    
    /**
     * تحديث حالة الرابط النشط
     * @param {HTMLElement} activeLink - الرابط النشط
     */
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    /**
     * تحديث حالة الروابط النشطة بناءً على المسار الحالي
     */
    function updateActiveLinks() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // التحقق من مطابقة المسار أو الهاش
            if (href === currentPath || 
                (currentHash && href === currentHash) ||
                (currentPath.endsWith('/') && href === 'index.html') ||
                (currentPath.endsWith('index.html') && href === './')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // الاستماع لتغيير حجم النافذة
    window.addEventListener('resize', function() {
        // إغلاق القائمة تلقائيًا عند تغيير حجم النافذة إلى حجم أكبر
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// تصدير الوظائف للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initResponsiveMenu
    };
}
