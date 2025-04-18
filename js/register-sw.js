/**
 * تسجيل Service Worker لدعم العمل دون اتصال بالإنترنت
 * يسمح للمستخدمين بالوصول إلى المحتوى الديني حتى بدون إنترنت
 */

// التحقق من دعم Service Worker ومن أن البروتوكول هو HTTP أو HTTPS
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.protocol === 'http:')) {
    window.addEventListener('load', function() {
        // تسجيل Service Worker
        navigator.serviceWorker.register('./service-worker.js')
            .then(function(registration) {
                console.log('Service Worker تم التسجيل بنجاح:', registration.scope);
                
                // التحقق من وجود تحديثات
                registration.addEventListener('updatefound', function() {
                    // إذا وجد تحديث، الحصول على Service Worker الجديد
                    const newWorker = registration.installing;
                    
                    // مراقبة حالة Service Worker الجديد
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // إظهار إشعار بوجود تحديث
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(function(error) {
                console.log('فشل تسجيل Service Worker:', error);
            });
        
        // الاستماع لرسائل من Service Worker
        navigator.serviceWorker.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
                console.log('تم تحديث التخزين المؤقت:', event.data.url);
            }
        });
        
        // إضافة مستمع لحالة الاتصال بالإنترنت
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // تحديث حالة الاتصال عند تحميل الصفحة
        updateOnlineStatus();
    });
} else {
    console.log('Service Worker غير مدعوم أو البروتوكول غير آمن (file:)');
}

/**
 * تحديث حالة الاتصال بالإنترنت
 */
function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    
    // إنشاء عنصر الإشعار إذا لم يكن موجودًا
    let statusNotification = document.getElementById('connection-status');
    
    if (!statusNotification) {
        statusNotification = document.createElement('div');
        statusNotification.id = 'connection-status';
        statusNotification.className = 'connection-status';
        document.body.appendChild(statusNotification);
        
        // إضافة الأنماط للإشعار
        const style = document.createElement('style');
        style.textContent = `
            .connection-status {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                text-align: center;
                max-width: 90%;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .connection-status.show {
                opacity: 1;
            }
            
            .connection-status.online {
                background-color: var(--success-color, #4caf50);
            }
            
            .connection-status.offline {
                background-color: var(--danger-color, #f44336);
            }
        `;
        document.head.appendChild(style);
    }
    
    // تحديث محتوى الإشعار
    if (isOnline) {
        statusNotification.textContent = 'تم استعادة الاتصال بالإنترنت';
        statusNotification.className = 'connection-status online';
    } else {
        statusNotification.textContent = 'أنت غير متصل بالإنترنت. بعض الميزات قد لا تعمل.';
        statusNotification.className = 'connection-status offline';
    }
    
    // إظهار الإشعار
    statusNotification.classList.add('show');
    
    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(function() {
        statusNotification.classList.remove('show');
    }, 3000);
}

/**
 * إظهار إشعار بوجود تحديث
 */
function showUpdateNotification() {
    // إنشاء عنصر الإشعار
    const updateNotification = document.createElement('div');
    updateNotification.className = 'update-notification';
    updateNotification.innerHTML = `
        <p>يوجد تحديث جديد للموقع!</p>
        <button id="update-button">تحديث الآن</button>
    `;
    
    // إضافة الأنماط للإشعار
    const style = document.createElement('style');
    style.textContent = `
        .update-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color, #1f6e8c);
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            max-width: 300px;
        }
        
        .update-notification p {
            margin: 0 0 10px 0;
        }
        
        .update-notification button {
            background-color: white;
            color: var(--primary-color, #1f6e8c);
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .update-notification button:hover {
            background-color: #f5f5f5;
        }
    `;
    
    // إضافة العناصر إلى الصفحة
    document.head.appendChild(style);
    document.body.appendChild(updateNotification);
    
    // إضافة مستمع للزر
    document.getElementById('update-button').addEventListener('click', function() {
        // إرسال رسالة إلى Service Worker لتخطي الانتظار
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            
            // إعادة تحميل الصفحة
            window.location.reload();
        }
    });
}
