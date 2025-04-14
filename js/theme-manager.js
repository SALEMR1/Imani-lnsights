// إدارة سمة الموقع (فاتح/داكن)
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة زر تبديل السمة
    initThemeToggle();
    
    // تطبيق السمة المحفوظة
    applyStoredTheme();
});

// إنشاء زر تبديل السمة
function initThemeToggle() {
    // إنشاء زر تبديل السمة
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('title', 'تبديل الوضع الليلي/النهاري');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    // إضافة حدث النقر على زر تبديل السمة
    themeToggle.addEventListener('click', toggleTheme);
}

// تبديل السمة بين الوضع الفاتح والداكن
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // تغيير أيقونة الزر
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // تطبيق السمة الجديدة
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // حفظ السمة في التخزين المحلي
    localStorage.setItem('theme', newTheme);
}

// تطبيق السمة المحفوظة
function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        
        // تحديث أيقونة الزر
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = storedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    } else {
        // التحقق من تفضيلات النظام
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            
            // تحديث أيقونة الزر
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            // حفظ السمة في التخزين المحلي
            localStorage.setItem('theme', 'dark');
        }
    }
}

// إضافة استماع لتغييرات تفضيلات النظام
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // تحديث أيقونة الزر
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // حفظ السمة في التخزين المحلي
    localStorage.setItem('theme', newTheme);
});
