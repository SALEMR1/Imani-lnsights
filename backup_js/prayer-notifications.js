// وظائف إشعارات مواقيت الصلاة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من دعم المتصفح للإشعارات
    if (!('Notification' in window)) {
        console.log('هذا المتصفح لا يدعم الإشعارات');
        return;
    }
    
    // عناصر واجهة المستخدم
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationStatus = document.getElementById('notification-status');
    
    // تهيئة الإشعارات
    initNotifications();
    
    // وظيفة تهيئة الإشعارات
    function initNotifications() {
        // التحقق من حالة الإشعارات المحفوظة
        const notificationsEnabled = localStorage.getItem('prayerNotificationsEnabled') === 'true';
        
        // تحديث واجهة المستخدم
        updateNotificationUI(notificationsEnabled);
        
        // استماع لحدث تبديل الإشعارات
        if (notificationToggle) {
            notificationToggle.addEventListener('change', toggleNotifications);
        }
        
        // إذا كانت الإشعارات مفعلة، قم بجدولتها
        if (notificationsEnabled && Notification.permission === 'granted') {
            schedulePrayerNotifications();
        }
    }
    
    // وظيفة تبديل الإشعارات
    function toggleNotifications() {
        const isEnabled = notificationToggle.checked;
        
        if (isEnabled) {
            // طلب إذن الإشعارات إذا لم يكن ممنوحاً بالفعل
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        enableNotifications();
                    } else {
                        // إذا رفض المستخدم الإذن، قم بتعطيل الإشعارات
                        notificationToggle.checked = false;
                        updateNotificationUI(false);
                    }
                });
            } else {
                enableNotifications();
            }
        } else {
            disableNotifications();
        }
    }
    
    // وظيفة تفعيل الإشعارات
    function enableNotifications() {
        localStorage.setItem('prayerNotificationsEnabled', 'true');
        updateNotificationUI(true);
        schedulePrayerNotifications();
        
        // إظهار إشعار تأكيد
        new Notification('تم تفعيل إشعارات مواقيت الصلاة', {
            body: 'ستتلقى إشعاراً عند دخول وقت كل صلاة',
            icon: 'images/prayer-icon.png'
        });
    }
    
    // وظيفة تعطيل الإشعارات
    function disableNotifications() {
        localStorage.setItem('prayerNotificationsEnabled', 'false');
        updateNotificationUI(false);
        
        // إلغاء جميع الإشعارات المجدولة
        clearScheduledNotifications();
    }
    
    // وظيفة تحديث واجهة المستخدم
    function updateNotificationUI(isEnabled) {
        if (notificationToggle) {
            notificationToggle.checked = isEnabled;
        }
        
        if (notificationStatus) {
            notificationStatus.textContent = isEnabled ? 'مفعلة' : 'معطلة';
            notificationStatus.className = isEnabled ? 'status-enabled' : 'status-disabled';
        }
    }
    
    // وظيفة جدولة إشعارات مواقيت الصلاة
    function schedulePrayerNotifications() {
        // الحصول على مواقيت الصلاة
        const prayerTimes = getPrayerTimes();
        
        // إلغاء الإشعارات المجدولة السابقة
        clearScheduledNotifications();
        
        // جدولة إشعارات جديدة
        for (const prayer in prayerTimes) {
            schedulePrayerNotification(prayer, prayerTimes[prayer]);
        }
    }
    
    // وظيفة جدولة إشعار لصلاة معينة
    function schedulePrayerNotification(prayer, time) {
        // تحويل الوقت إلى كائن Date
        const prayerTime = parseTime(time);
        const now = new Date();
        
        // حساب الوقت المتبقي حتى الصلاة
        let timeUntilPrayer = prayerTime - now;
        
        // إذا كان وقت الصلاة قد مر اليوم، جدول للغد
        if (timeUntilPrayer < 0) {
            prayerTime.setDate(prayerTime.getDate() + 1);
            timeUntilPrayer = prayerTime - now;
        }
        
        // جدولة الإشعار
        const notificationId = setTimeout(() => {
            showPrayerNotification(prayer);
        }, timeUntilPrayer);
        
        // حفظ معرف الإشعار للإلغاء لاحقاً إذا لزم الأمر
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        scheduledNotifications.push(notificationId);
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }
    
    // وظيفة إظهار إشعار الصلاة
    function showPrayerNotification(prayer) {
        // ترجمة اسم الصلاة
        const prayerNames = {
            'fajr': 'الفجر',
            'sunrise': 'الشروق',
            'dhuhr': 'الظهر',
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };
        
        const prayerName = prayerNames[prayer] || prayer;
        
        // إظهار الإشعار
        new Notification(`حان الآن وقت صلاة ${prayerName}`, {
            body: 'حي على الصلاة، حي على الفلاح',
            icon: 'images/prayer-icon.png'
        });
        
        // جدولة إشعار للغد
        const prayerTimes = getPrayerTimes();
        schedulePrayerNotification(prayer, prayerTimes[prayer]);
    }
    
    // وظيفة إلغاء الإشعارات المجدولة
    function clearScheduledNotifications() {
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        
        // إلغاء كل إشعار مجدول
        scheduledNotifications.forEach(id => {
            clearTimeout(id);
        });
        
        // مسح قائمة الإشعارات المجدولة
        localStorage.setItem('scheduledNotifications', '[]');
    }
    
    // وظيفة الحصول على مواقيت الصلاة
    function getPrayerTimes() {
        // في التطبيق الحقيقي، يمكنك استخدام API لمواقيت الصلاة
        // هنا نستخدم بيانات ثابتة للتجربة
        return {
            'fajr': '04:30',
            'sunrise': '06:00',
            'dhuhr': '12:15',
            'asr': '15:45',
            'maghrib': '18:30',
            'isha': '20:00'
        };
    }
    
    // وظيفة تحويل الوقت من نص إلى كائن Date
    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0);
        return time;
    }
});
