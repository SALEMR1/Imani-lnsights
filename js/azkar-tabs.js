// ملف للتعامل مع تبويبات الأذكار
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر التبويب
    const azkarTabs = document.querySelectorAll('.azkar-tab');
    const azkarContents = document.querySelectorAll('.azkar-tab-content');
    
    // التحقق من وجود عناصر التبويب
    if (!azkarTabs.length || !azkarContents.length) {
        console.error('عناصر تبويب الأذكار غير موجودة');
        return;
    }
    
    console.log('تم تحميل تبويبات الأذكار بنجاح');
    
    // التبديل بين أنواع الأذكار
    azkarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log(`تم النقر على تبويب: ${tab.dataset.tab}`);
            
            // إزالة الفئة النشطة من جميع التبويبات
            azkarTabs.forEach(t => t.classList.remove('active'));
            azkarContents.forEach(c => c.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            const tabContent = document.getElementById(`${tabId}-azkar`);
            
            // التحقق من وجود محتوى التبويب
            if (tabContent) {
                console.log(`تم تفعيل محتوى: ${tabId}-azkar`);
                tabContent.classList.add('active');
            } else {
                console.error(`لم يتم العثور على محتوى التبويب: ${tabId}-azkar`);
            }
        });
    });
});
