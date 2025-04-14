// تهيئة القائمة المحمولة
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

// وظيفة تهيئة القائمة المحمولة
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!menuToggle || !nav) {
        console.log('عناصر القائمة غير موجودة');
        return;
    }
    
    // تبديل القائمة عند النقر على زر القائمة
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // منع انتشار الحدث
        
        // تبديل حالة القائمة
        nav.classList.toggle('active');
        
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
    });
    
    // تحسين استجابة روابط القائمة على الأجهزة المحمولة
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        // إضافة مستمع الحدث للروابط
        link.addEventListener('click', function() {
            // إغلاق القائمة بعد النقر على الرابط
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                // استعادة أيقونة القائمة
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            // استعادة أيقونة القائمة
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // تحسين أزرار الفتاوى إذا كنا في صفحة الفتاوى
    if (window.location.pathname.includes('fatawa.html')) {
        enhanceFatawaButtons();
    }
}

// تحسين أزرار الفتاوى
function enhanceFatawaButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const saveButtons = document.querySelectorAll('.save-btn');
    
    // تحسين أزرار المشاركة
    shareButtons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.padding = '12px 20px';
        button.style.margin = '5px';
        button.style.touchAction = 'manipulation';
    });
    
    // تحسين أزرار الحفظ
    saveButtons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.padding = '12px 20px';
        button.style.margin = '5px';
        button.style.touchAction = 'manipulation';
    });
    
    console.log('تم تحسين أزرار الفتاوى للأجهزة المحمولة');
}