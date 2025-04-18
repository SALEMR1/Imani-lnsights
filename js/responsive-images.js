/**
 * ملف لتحسين تحميل الصور المتجاوبة
 * يدعم التحميل الكسول والصور المتجاوبة لتحسين الأداء
 */

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initResponsiveImages();
});

/**
 * تهيئة الصور المتجاوبة
 */
function initResponsiveImages() {
    // التحقق من دعم التحميل الكسول الأصلي
    const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;
    
    // تحديد جميع الصور في الصفحة
    const images = document.querySelectorAll('img:not(.no-lazy)');
    
    // تطبيق التحميل الكسول على الصور
    images.forEach(img => {
        // إضافة فئة للصور الكسولة
        img.classList.add('lazy-image');
        
        // استخدام التحميل الكسول الأصلي إذا كان مدعومًا
        if (supportsNativeLazy) {
            img.loading = 'lazy';
            
            // إضافة مستمع لحدث تحميل الصورة
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        } 
        // استخدام IntersectionObserver إذا كان مدعومًا
        else if ('IntersectionObserver' in window) {
            observeImage(img);
        } 
        // التحميل الفوري للمتصفحات القديمة
        else {
            img.classList.add('loaded');
        }
    });
    
    // تحسين الصور المتجاوبة
    enhanceResponsiveImages();
}

/**
 * مراقبة الصور باستخدام IntersectionObserver
 * @param {HTMLImageElement} img - عنصر الصورة
 */
function observeImage(img) {
    try {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    
                    // تحميل الصورة من البيانات الوصفية
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                    }
                    
                    if (image.dataset.srcset) {
                        image.srcset = image.dataset.srcset;
                    }
                    
                    // إضافة فئة "loaded" بعد التحميل
                    image.addEventListener('load', function() {
                        this.classList.add('loaded');
                    });
                    
                    // إيقاف المراقبة بعد التحميل
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '200px', // تحميل الصور قبل ظهورها بـ 200 بكسل
            threshold: 0.01 // بدء التحميل عند ظهور 1% من الصورة
        });
        
        observer.observe(img);
    } catch (error) {
        console.error('خطأ في مراقبة الصورة:', error);
        
        // تحميل الصورة فورًا في حالة الخطأ
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
        
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
        
        img.classList.add('loaded');
    }
}

/**
 * تحسين الصور المتجاوبة
 */
function enhanceResponsiveImages() {
    // تحديد الصور التي تحتاج إلى تحسين
    const heroImages = document.querySelectorAll('.hero-image, .feature-image, .article-image');
    
    heroImages.forEach(img => {
        // التحقق من عدم وجود srcset
        if (!img.srcset && img.src) {
            // الحصول على مسار الصورة الأصلية
            const originalSrc = img.src;
            const fileExt = originalSrc.split('.').pop();
            const baseSrc = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
            
            // إنشاء srcset للصور المختلفة
            const srcsetValues = [
                `${baseSrc}-small.${fileExt} 480w`,
                `${baseSrc}-medium.${fileExt} 768w`,
                `${baseSrc}.${fileExt} 1200w`
            ];
            
            // تعيين srcset و sizes
            img.srcset = srcsetValues.join(', ');
            img.sizes = '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw';
            
            // إضافة سمة data-original-src
            img.setAttribute('data-original-src', originalSrc);
        }
    });
}

// تصدير الوظائف للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initResponsiveImages,
        observeImage,
        enhanceResponsiveImages
    };
}
