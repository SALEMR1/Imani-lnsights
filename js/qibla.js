// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const getLocationBtn = document.getElementById('get-location');
    const currentLocationElement = document.getElementById('current-location');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const qiblaDirectionElement = document.getElementById('qibla-direction');
    const compassArrow = document.getElementById('compass-arrow');
    
    // إحداثيات الكعبة المشرفة
    const KAABA_LATITUDE = 21.422487;
    const KAABA_LONGITUDE = 39.826206;
    
    // استمع لحدث النقر على زر تحديد الموقع
    getLocationBtn.addEventListener('click', getLocation);
    
    // وظيفة الحصول على الموقع الحالي
    function getLocation() {
        if (navigator.geolocation) {
            getLocationBtn.textContent = 'جاري تحديد الموقع...';
            getLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                // نجاح
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // عرض الإحداثيات
                    latitudeElement.textContent = latitude.toFixed(6);
                    longitudeElement.textContent = longitude.toFixed(6);
                    
                    // الحصول على اسم الموقع
                    getLocationName(latitude, longitude);
                    
                    // حساب اتجاه القبلة
                    const qiblaDirection = calculateQiblaDirection(latitude, longitude);
                    qiblaDirectionElement.textContent = qiblaDirection.toFixed(2) + '° من الشمال';
                    
                    // تدوير سهم البوصلة
                    compassArrow.style.transform = `translate(-50%, -50%) rotate(${qiblaDirection}deg)`;
                    
                    // إعادة تمكين الزر
                    getLocationBtn.textContent = 'تحديد موقعي';
                    getLocationBtn.disabled = false;
                    
                    // استخدام مستشعر التوجيه إذا كان متاحًا
                    if (window.DeviceOrientationEvent) {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                },
                // خطأ
                function(error) {
                    let errorMessage;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'تم رفض الوصول إلى الموقع الجغرافي.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'معلومات الموقع غير متاحة.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'انتهت مهلة طلب الموقع.';
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage = 'حدث خطأ غير معروف.';
                            break;
                    }
                    
                    alert(errorMessage);
                    
                    // إعادة تمكين الزر
                    getLocationBtn.textContent = 'تحديد موقعي';
                    getLocationBtn.disabled = false;
                }
            );
        } else {
            alert('متصفحك لا يدعم تحديد الموقع الجغرافي.');
        }
    }
    
    // وظيفة الحصول على اسم الموقع
    function getLocationName(latitude, longitude) {
        // في التطبيق الحقيقي، يمكنك استخدام خدمة Reverse Geocoding
        // مثال: fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        
        // محاكاة الحصول على اسم الموقع
        setTimeout(() => {
            currentLocationElement.textContent = 'القاهرة، مصر';
        }, 1000);
    }
    
    // وظيفة حساب اتجاه القبلة
    function calculateQiblaDirection(latitude, longitude) {
        // تحويل الإحداثيات من درجات إلى راديان
        const lat1 = toRadians(latitude);
        const lon1 = toRadians(longitude);
        const lat2 = toRadians(KAABA_LATITUDE);
        const lon2 = toRadians(KAABA_LONGITUDE);
        
        // حساب اتجاه القبلة باستخدام صيغة الاتجاه الأولي
        const y = Math.sin(lon2 - lon1);
        const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
        let qiblaRadians = Math.atan2(y, x);
        
        // تحويل الاتجاه من راديان إلى درجات
        let qiblaDegrees = toDegrees(qiblaRadians);
        
        // التأكد من أن الاتجاه موجب
        if (qiblaDegrees < 0) {
            qiblaDegrees += 360;
        }
        
        return qiblaDegrees;
    }
    
    // وظيفة التعامل مع توجيه الجهاز
    function handleOrientation(event) {
        // الحصول على اتجاه الجهاز (بالدرجات)
        const alpha = event.alpha;
        
        // إذا كان الاتجاه متاحًا
        if (alpha !== null) {
            // الحصول على اتجاه القبلة المحسوب مسبقًا
            const qiblaDirection = parseFloat(qiblaDirectionElement.textContent);
            
            // حساب الاتجاه النسبي للقبلة بناءً على اتجاه الجهاز
            const relativeDirection = qiblaDirection - alpha;
            
            // تدوير سهم البوصلة
            compassArrow.style.transform = `translate(-50%, -50%) rotate(${relativeDirection}deg)`;
        }
    }
    
    // وظيفة تحويل الدرجات إلى راديان
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // وظيفة تحويل الراديان إلى درجات
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
});
