// ملف جافاسكريبت للمسبحة الإلكترونية
document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const tasbihCount = document.getElementById('tasbih-count');
    const tasbihTotal = document.getElementById('tasbih-total');
    const tasbihBead = document.getElementById('tasbih-bead');
    const tasbihButton = document.getElementById('tasbih-button');
    const resetButton = document.getElementById('reset-button');
    const saveButton = document.getElementById('save-button');
    const vibrateToggle = document.getElementById('vibrate-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const historyList = document.getElementById('history-list');
    const presetButtons = document.querySelectorAll('.preset-button');
    
    // المتغيرات
    let count = 0;
    let totalCount = 0;
    let targetCount = 0;
    let currentDhikr = '';
    let isVibrationEnabled = true;
    let isSoundEnabled = true;
    let history = [];
    
    // تحميل الإعدادات المحفوظة
    loadSettings();
    
    // إضافة مستمعي الأحداث
    tasbihBead.addEventListener('click', incrementCount);
    tasbihButton.addEventListener('click', incrementCount);
    resetButton.addEventListener('click', resetCount);
    saveButton.addEventListener('click', saveCount);
    vibrateToggle.addEventListener('click', toggleVibration);
    soundToggle.addEventListener('click', toggleSound);
    
    // إضافة مستمعي الأحداث للأزرار المسبقة
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = parseInt(this.getAttribute('data-target'));
            const dhikr = this.getAttribute('data-dhikr');
            setPreset(dhikr, target);
            
            // إزالة الفئة النشطة من جميع الأزرار
            presetButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
        });
    });
    
    // إضافة دعم لوحة المفاتيح
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            incrementCount();
            event.preventDefault();
        }
    });
    
    // وظيفة زيادة العداد
    function incrementCount() {
        count++;
        totalCount++;
        
        // تحديث العرض
        tasbihCount.textContent = count;
        tasbihTotal.textContent = `المجموع: ${totalCount}`;
        
        // إضافة تأثير الضغط
        addPressEffect();
        
        // تشغيل الاهتزاز إذا كان مفعلاً
        if (isVibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate(30);
        }
        
        // تشغيل الصوت إذا كان مفعلاً
        if (isSoundEnabled) {
            playClickSound();
        }
        
        // التحقق مما إذا تم الوصول إلى الهدف
        if (targetCount > 0 && count >= targetCount) {
            tasbihCount.classList.add('complete');
            tasbihBead.classList.add('complete');
            
            // تشغيل صوت الإكمال
            if (isSoundEnabled) {
                playCompleteSound();
            }
            
            // اهتزاز أطول للإكمال
            if (isVibrationEnabled && 'vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        }
        
        // حفظ الإعدادات
        saveSettings();
    }
    
    // وظيفة إعادة تعيين العداد
    function resetCount() {
        // إذا كان العداد بالفعل صفر، أعد تعيين المجموع أيضًا
        if (count === 0) {
            totalCount = 0;
            tasbihTotal.textContent = `المجموع: ${totalCount}`;
        } else {
            count = 0;
            tasbihCount.textContent = count;
            
            // إزالة تأثيرات الإكمال
            tasbihCount.classList.remove('complete');
            tasbihBead.classList.remove('complete');
        }
        
        // حفظ الإعدادات
        saveSettings();
    }
    
    // وظيفة حفظ العدد الحالي
    function saveCount() {
        if (count === 0) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('ar-SA');
        
        const historyItem = {
            dhikr: currentDhikr || 'تسبيح',
            count: count,
            time: timeString,
            date: dateString
        };
        
        // إضافة العنصر إلى التاريخ
        history.unshift(historyItem);
        
        // الاحتفاظ بآخر 20 عنصر فقط
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // تحديث عرض التاريخ
        updateHistoryDisplay();
        
        // حفظ التاريخ
        localStorage.setItem('tasbihHistory', JSON.stringify(history));
        
        // عرض رسالة تأكيد
        showNotification('تم حفظ العدد بنجاح');
    }
    
    // وظيفة تبديل الاهتزاز
    function toggleVibration() {
        isVibrationEnabled = !isVibrationEnabled;
        vibrateToggle.classList.toggle('active', isVibrationEnabled);
        
        // حفظ الإعداد
        localStorage.setItem('tasbihVibration', isVibrationEnabled);
        
        // عرض رسالة تأكيد
        showNotification(isVibrationEnabled ? 'تم تفعيل الاهتزاز' : 'تم إيقاف الاهتزاز');
    }
    
    // وظيفة تبديل الصوت
    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        soundToggle.classList.toggle('active', isSoundEnabled);
        
        // حفظ الإعداد
        localStorage.setItem('tasbihSound', isSoundEnabled);
        
        // عرض رسالة تأكيد
        showNotification(isSoundEnabled ? 'تم تفعيل الصوت' : 'تم إيقاف الصوت');
    }
    
    // وظيفة تعيين الذكر والهدف
    function setPreset(dhikr, target) {
        currentDhikr = dhikr;
        targetCount = target;
        count = 0;
        
        // تحديث العرض
        tasbihCount.textContent = count;
        
        // إزالة تأثيرات الإكمال
        tasbihCount.classList.remove('complete');
        tasbihBead.classList.remove('complete');
        
        // إضافة عنصر الذكر إذا لم يكن موجودًا
        let dhikrElement = document.querySelector('.tasbih-dhikr');
        if (!dhikrElement) {
            dhikrElement = document.createElement('div');
            dhikrElement.className = 'tasbih-dhikr';
            tasbihCount.insertAdjacentElement('afterend', dhikrElement);
        }
        dhikrElement.textContent = dhikr;
        
        // إضافة عنصر الهدف إذا لم يكن موجودًا
        let targetElement = document.querySelector('.tasbih-target');
        if (!targetElement) {
            targetElement = document.createElement('div');
            targetElement.className = 'tasbih-target';
            document.querySelector('.tasbih-display').appendChild(targetElement);
        }
        targetElement.textContent = `الهدف: ${target}`;
        
        // حفظ الإعدادات
        saveSettings();
        
        // عرض رسالة تأكيد
        showNotification(`تم تعيين "${dhikr}" بهدف ${target}`);
    }
    
    // وظيفة إضافة تأثير الضغط
    function addPressEffect() {
        // إضافة فئة للعداد للتحريك
        tasbihCount.classList.add('animate');
        
        // إضافة فئة للخرزة للضغط
        tasbihBead.classList.add('pressed');
        
        // إزالة الفئات بعد انتهاء التأثير
        setTimeout(() => {
            tasbihCount.classList.remove('animate');
            tasbihBead.classList.remove('pressed');
        }, 150);
    }
    
    // وظيفة تشغيل صوت النقر
    function playClickSound() {
        // إنشاء صوت بسيط باستخدام Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
            console.log('فشل تشغيل الصوت:', error);
        }
    }
    
    // وظيفة تشغيل صوت الإكمال
    function playCompleteSound() {
        // إنشاء صوت بسيط للإكمال باستخدام Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // صوت من ثلاث نغمات
            const notes = [600, 800, 1000];
            const duration = 0.15;
            
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                gainNode.gain.value = 0.1;
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const startTime = audioContext.currentTime + (index * duration);
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });
        } catch (error) {
            console.log('فشل تشغيل صوت الإكمال:', error);
        }
    }
    
    // وظيفة تحديث عرض التاريخ
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'history-empty';
            emptyMessage.textContent = 'لا توجد سجلات حتى الآن';
            historyList.appendChild(emptyMessage);
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-dhikr">${item.dhikr}</div>
                <div class="history-count">${item.count}</div>
                <div class="history-time">${item.date} ${item.time}</div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
    
    // وظيفة عرض إشعار
    function showNotification(message) {
        // التحقق مما إذا كان هناك إشعار موجود بالفعل
        const existingNotification = document.querySelector('.tasbih-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = 'tasbih-notification';
        notification.textContent = message;
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إضافة فئة للتحريك
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // وظيفة حفظ الإعدادات
    function saveSettings() {
        const settings = {
            count: count,
            totalCount: totalCount,
            targetCount: targetCount,
            currentDhikr: currentDhikr
        };
        
        localStorage.setItem('tasbihSettings', JSON.stringify(settings));
    }
    
    // وظيفة تحميل الإعدادات
    function loadSettings() {
        // تحميل الإعدادات الرئيسية
        const settingsJson = localStorage.getItem('tasbihSettings');
        if (settingsJson) {
            const settings = JSON.parse(settingsJson);
            count = settings.count || 0;
            totalCount = settings.totalCount || 0;
            targetCount = settings.targetCount || 0;
            currentDhikr = settings.currentDhikr || '';
            
            // تحديث العرض
            tasbihCount.textContent = count;
            tasbihTotal.textContent = `المجموع: ${totalCount}`;
            
            // إضافة عنصر الذكر إذا كان هناك ذكر حالي
            if (currentDhikr) {
                const dhikrElement = document.createElement('div');
                dhikrElement.className = 'tasbih-dhikr';
                dhikrElement.textContent = currentDhikr;
                tasbihCount.insertAdjacentElement('afterend', dhikrElement);
            }
            
            // إضافة عنصر الهدف إذا كان هناك هدف
            if (targetCount > 0) {
                const targetElement = document.createElement('div');
                targetElement.className = 'tasbih-target';
                targetElement.textContent = `الهدف: ${targetCount}`;
                document.querySelector('.tasbih-display').appendChild(targetElement);
                
                // تفعيل الزر المناسب
                presetButtons.forEach(button => {
                    if (parseInt(button.getAttribute('data-target')) === targetCount && 
                        button.getAttribute('data-dhikr') === currentDhikr) {
                        button.classList.add('active');
                    }
                });
            }
        }
        
        // تحميل إعدادات الاهتزاز والصوت
        const vibrationSetting = localStorage.getItem('tasbihVibration');
        if (vibrationSetting !== null) {
            isVibrationEnabled = vibrationSetting === 'true';
            vibrateToggle.classList.toggle('active', isVibrationEnabled);
        } else {
            vibrateToggle.classList.add('active');
        }
        
        const soundSetting = localStorage.getItem('tasbihSound');
        if (soundSetting !== null) {
            isSoundEnabled = soundSetting === 'true';
            soundToggle.classList.toggle('active', isSoundEnabled);
        } else {
            soundToggle.classList.add('active');
        }
        
        // تحميل سجل التسبيح
        const historyJson = localStorage.getItem('tasbihHistory');
        if (historyJson) {
            history = JSON.parse(historyJson);
            updateHistoryDisplay();
        }
    }
    
    // إضافة تنسيقات CSS للإشعارات
    const style = document.createElement('style');
    style.textContent = `
        .tasbih-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: #2ecc71;
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .tasbih-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .history-empty {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
    
    // إنشاء ملفات الصوت للمسبحة
    function createSoundFiles() {
        // التحقق من وجود ملفات الصوت
        // في التطبيق الحقيقي، يجب أن تكون ملفات الصوت موجودة بالفعل
        // هنا نقوم باستخدام ملفات صوت افتراضية للعرض

        // في التطبيق الحقيقي، يجب أن تكون هذه الملفات موجودة في مجلد sounds
        // يمكن استخدام ملفات صوت مختلفة مثل صوت نقرة خفيفة للنقر وصوت جرس للإكمال
    }
});
