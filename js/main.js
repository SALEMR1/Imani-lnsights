// تفعيل القائمة المتجاوبة على الهاتف المحمول
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

overlay.addEventListener('click', () => {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// إغلاق القائمة عند النقر على أي رابط
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// تحديث حالة القائمة النشطة
function updateActiveLink() {
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// تحديث حالة القائمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateActiveLink); 