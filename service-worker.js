/**
 * Service Worker لموقع بصائر إيمانية
 * يوفر إمكانية استخدام الموقع بدون اتصال بالإنترنت
 */

// إصدار التخزين المؤقت
const CACHE_VERSION = 'v1';

// اسم التخزين المؤقت
const CACHE_NAME = `basaer-cache-${CACHE_VERSION}`;

// الملفات الأساسية للتخزين المؤقت
const CORE_ASSETS = [
    './',
    './index.html',
    './css/combined.css',
    './js/unified-menu.js',
    './js/responsive-images.js',
    './js/prayer-times.js',
    './js/script-azkar.js',
    './js/quran-audio.js',
    './fonts/Tajawal-Regular.woff2',
    './fonts/Amiri-Regular.woff2'
];

// الملفات الدينية للتخزين المؤقت
const RELIGIOUS_CONTENT = [
    './data/quran.json',
    './data/azkar.json',
    './data/hadith.json'
];

// جميع الملفات للتخزين المؤقت
const CACHE_ASSETS = [
    ...CORE_ASSETS,
    ...RELIGIOUS_CONTENT
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: تثبيت');
    
    // تخزين الملفات الأساسية مؤقتًا
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: تخزين الملفات مؤقتًا');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                // تنشيط Service Worker الجديد فورًا
                return self.skipWaiting();
            })
    );
});

// تنشيط Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: تنشيط');
    
    // حذف التخزين المؤقت القديم
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: حذف التخزين المؤقت القديم', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // التأكد من استخدام Service Worker الجديد لجميع الصفحات
                return self.clients.claim();
            })
    );
});

// التعامل مع طلبات الشبكة
self.addEventListener('fetch', event => {
    // تجاهل طلبات غير GET
    if (event.request.method !== 'GET') return;
    
    // تجاهل طلبات التحليلات وطلبات الطرف الثالث
    const url = new URL(event.request.url);
    if (url.hostname !== self.location.hostname && 
        !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    // استراتيجية الشبكة أولاً ثم التخزين المؤقت
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // نسخة من الاستجابة للتخزين المؤقت
                const responseClone = response.clone();
                
                // تخزين الاستجابة مؤقتًا
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });
                
                return response;
            })
            .catch(() => {
                // استخدام التخزين المؤقت في حالة فشل الشبكة
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // إذا كان الطلب لصفحة HTML، عرض صفحة الوضع غير المتصل
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./offline.html');
                        }
                        
                        // إذا كان الطلب لصورة، عرض صورة بديلة
                        if (event.request.headers.get('accept').includes('image')) {
                            return caches.match('./img/offline-image.png');
                        }
                    });
            })
    );
});

// التعامل مع رسائل من الصفحة
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
