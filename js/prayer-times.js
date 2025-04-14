// تهيئة مواقيت الصلاة
document.addEventListener('DOMContentLoaded', () => {
    initializePrayerTimes();
    // تحديث المواقيت كل دقيقة
    setInterval(updatePrayerTimes, 60000);
});

// دالة تهيئة مواقيت الصلاة
async function initializePrayerTimes() {
    try {
        // الحصول على الموقع الجغرافي
        const position = await getCurrentPosition();
        const prayerTimes = await fetchPrayerTimes(position.latitude, position.longitude);
        updatePrayerTimesUI(prayerTimes);
        updateNextPrayer(prayerTimes);
    } catch (error) {
        console.error('خطأ في تحميل مواقيت الصلاة:', error);
        // استخدام موقع افتراضي (مكة المكرمة) في حالة الخطأ
        const prayerTimes = await fetchPrayerTimes(21.3891, 39.8579);
        updatePrayerTimesUI(prayerTimes);
        updateNextPrayer(prayerTimes);
    }
}

// الحصول على الموقع الجغرافي
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('المتصفح لا يدعم تحديد الموقع'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            error => reject(error)
        );
    });
}

// جلب مواقيت الصلاة من API
async function fetchPrayerTimes(latitude, longitude) {
    try {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const response = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=4`);
        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        console.error('خطأ في جلب مواقيت الصلاة:', error);
        throw error;
    }
}

// تحديث واجهة المستخدم بمواقيت الصلاة
function updatePrayerTimesUI(timings) {
    const prayerNames = {
        Fajr: 'fajr-time',
        Sunrise: 'sunrise-time',
        Dhuhr: 'dhuhr-time',
        Asr: 'asr-time',
        Maghrib: 'maghrib-time',
        Isha: 'isha-time'
    };

    for (const [prayer, elementId] of Object.entries(prayerNames)) {
        const element = document.getElementById(elementId);
        if (element && timings[prayer]) {
            element.textContent = timings[prayer];
        }
    }

    // تحديث التاريخ الهجري
    updateHijriDate();
}

// تحديث التاريخ الهجري
async function updateHijriDate() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/gToH');
        const data = await response.json();
        const hijriDate = data.data.hijri;
        const hijriElement = document.getElementById('hijri-date');
        if (hijriElement) {
            hijriElement.textContent = `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}هـ`;
        }
    } catch (error) {
        console.error('خطأ في جلب التاريخ الهجري:', error);
    }
}

// تحديث الصلاة القادمة
function updateNextPrayer(timings) {
    const prayers = [
        { name: 'الفجر', time: timings.Fajr },
        { name: 'الشروق', time: timings.Sunrise },
        { name: 'الظهر', time: timings.Dhuhr },
        { name: 'العصر', time: timings.Asr },
        { name: 'المغرب', time: timings.Maghrib },
        { name: 'العشاء', time: timings.Isha }
    ];

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
    
    let nextPrayer = prayers.find(prayer => prayer.time > currentTime);
    if (!nextPrayer) {
        nextPrayer = prayers[0]; // إذا كانت جميع الصلوات لليوم قد انتهت، فالصلاة القادمة هي فجر اليوم التالي
    }

    const nextPrayerElement = document.getElementById('next-prayer');
    const remainingTimeElement = document.getElementById('remaining-time');
    
    if (nextPrayerElement && remainingTimeElement) {
        nextPrayerElement.textContent = `الصلاة القادمة: ${nextPrayer.name}`;
        updateRemainingTime(nextPrayer.time);
    }
}

// تحديث الوقت المتبقي للصلاة القادمة
function updateRemainingTime(prayerTime) {
    const now = new Date();
    const prayer = new Date();
    const [prayerHours, prayerMinutes] = prayerTime.split(':');
    
    prayer.setHours(parseInt(prayerHours));
    prayer.setMinutes(parseInt(prayerMinutes));
    prayer.setSeconds(0);

    if (prayer < now) {
        prayer.setDate(prayer.getDate() + 1);
    }

    const remainingTime = prayer - now;
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    const remainingTimeElement = document.getElementById('remaining-time');
    if (remainingTimeElement) {
        remainingTimeElement.textContent = `متبقي: ${hours} ساعة و ${minutes} دقيقة`;
    }
}

// تحديث مواقيت الصلاة
async function updatePrayerTimes() {
    try {
        const position = await getCurrentPosition();
        const prayerTimes = await fetchPrayerTimes(position.latitude, position.longitude);
        updatePrayerTimesUI(prayerTimes);
        updateNextPrayer(prayerTimes);
    } catch (error) {
        console.error('خطأ في تحديث مواقيت الصلاة:', error);
    }
} 