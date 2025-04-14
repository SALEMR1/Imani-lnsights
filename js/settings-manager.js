// تهيئة الإعدادات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadSettings();
    setupEventListeners();
    setupColorPreview();
});

// تهيئة التبويبات
function initializeTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const navItems = document.querySelectorAll('.settings-nav li');

    // إخفاء جميع التبويبات ما عدا التبويب النشط
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // عرض التبويب الأول افتراضياً
    if (tabs.length > 0) {
        tabs[0].style.display = 'block';
    }

    // إضافة مستمعي الأحداث للتبويبات
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // إزالة الفئة النشطة من جميع عناصر التنقل
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // إخفاء جميع التبويبات
            tabs.forEach(tab => {
                tab.style.display = 'none';
            });
            
            // إضافة الفئة النشطة للعنصر المحدد
            item.classList.add('active');
            
            // عرض التبويب المحدد
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }
        });
    });
}

// تحميل الإعدادات المحفوظة
function loadSettings() {
    // إعدادات عامة
    setCheckboxValue('auto-dark-mode', 'autoDarkMode');
    setCheckboxValue('save-last-location', 'saveLastLocation');
    setCheckboxValue('enable-sound', 'enableSound');

    // إعدادات الصلاة
    setSelectValue('prayer-calculation-method', 'prayerCalculationMethod');
    setCheckboxValue('prayer-notifications', 'prayerNotifications');
    setInputValue('prayer-notification-time', 'prayerNotificationTime');
    setSelectValue('adhan-sound', 'adhanSound');

    // إعدادات القرآن
    setSelectValue('default-reciter', 'defaultReciter');
    setRangeValue('quran-font-size', 'quranFontSize');
    setCheckboxValue('show-translation', 'showTranslation');
    setCheckboxValue('show-tafseer', 'showTafseer');

    // إعدادات الإشعارات
    setCheckboxValue('prayer-time-notifications', 'prayerTimeNotifications');
    setCheckboxValue('azkar-notifications', 'azkarNotifications');
    setCheckboxValue('articles-notifications', 'articlesNotifications');
    setCheckboxValue('fatawa-notifications', 'fatawaNotifications');

    // إعدادات المظهر
    setSelectValue('theme-select', 'theme');
    setColorValue('primary-color', 'primaryColor');
    setSelectValue('font-size', 'fontSize');
    setSelectValue('font-family', 'fontFamily');

    // إعدادات اللغة والمنطقة
    setSelectValue('language-select', 'language');
    setSelectValue('timezone-select', 'timezone');
    setSelectValue('date-format', 'dateFormat');
    setSelectValue('time-format', 'timeFormat');

    // إعدادات البيانات والخصوصية
    setCheckboxValue('save-reading-history', 'saveReadingHistory');
    setCheckboxValue('save-favorites', 'saveFavorites');
    setCheckboxValue('share-analytics', 'shareAnalytics');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // حفظ الإعدادات
    document.getElementById('save-settings').addEventListener('click', saveAllSettings);

    // إعادة تعيين الإعدادات
    document.getElementById('reset-settings').addEventListener('click', resetSettings);

    // مسح البيانات
    document.getElementById('clear-data').addEventListener('click', clearAllData);

    // تصدير البيانات
    document.getElementById('export-data').addEventListener('click', exportData);
    
    // استيراد البيانات
    document.getElementById('import-data').addEventListener('click', importData);
    
    // إعادة تعيين اللون الافتراضي
    const resetColorBtn = document.getElementById('reset-color');
    if (resetColorBtn) {
        resetColorBtn.addEventListener('click', resetDefaultColor);
    }

    // إضافة مستمعي الأحداث لجميع عناصر التحكم
    setupInputListeners();
}

// إعداد معاينة الألوان
function setupColorPreview() {
    const colorPicker = document.getElementById('primary-color');
    if (colorPicker) {
        // تحديث المعاينة عند تغيير اللون
        colorPicker.addEventListener('input', updateColorPreview);
        
        // تحديث المعاينة عند تحميل الصفحة
        updateColorPreview();
    }
}

// تحديث معاينة الألوان
function updateColorPreview() {
    const colorPicker = document.getElementById('primary-color');
    const previewBtn = document.getElementById('color-preview-btn');
    const previewHeader = document.getElementById('color-preview-header');
    const previewAccent = document.getElementById('color-preview-accent');
    
    if (colorPicker && previewBtn && previewHeader && previewAccent) {
        const selectedColor = colorPicker.value;
        
        previewBtn.style.backgroundColor = selectedColor;
        previewHeader.style.backgroundColor = selectedColor;
        previewAccent.style.backgroundColor = selectedColor;
        
        // تطبيق اللون على متغيرات CSS
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        
        // حساب اللون الداكن للتدرجات
        const darkerColor = adjustColor(selectedColor, -20);
        document.documentElement.style.setProperty('--primary-color-dark', darkerColor);
        
        // حساب قيم RGB للاستخدام في الشفافية
        const rgbValues = hexToRgb(selectedColor);
        if (rgbValues) {
            document.documentElement.style.setProperty('--primary-color-rgb', `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`);
        }
    }
}

// إعادة تعيين اللون الافتراضي
function resetDefaultColor() {
    const colorPicker = document.getElementById('primary-color');
    if (colorPicker) {
        colorPicker.value = '#1f6e8c';
        updateColorPreview();
        saveSettingToLocalStorage('primary-color', '#1f6e8c');
        showNotification('تم استعادة اللون الافتراضي');
    }
}

// تعديل اللون (تفتيح أو تغميق)
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// تحويل اللون من نظام Hex إلى RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// استيراد البيانات
function importData() {
    // إنشاء عنصر إدخال ملف مؤقت
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // التحقق من صحة البيانات المستوردة
                    if (importedData && typeof importedData === 'object') {
                        // مسح البيانات الحالية
                        localStorage.clear();
                        
                        // استيراد البيانات الجديدة
                        for (const key in importedData) {
                            localStorage.setItem(key, importedData[key]);
                        }
                        
                        // إعادة تحميل الإعدادات
                        loadSettings();
                        updateColorPreview();
                        
                        showNotification('تم استيراد الإعدادات بنجاح', 'success');
                    } else {
                        showNotification('تنسيق ملف الإعدادات غير صحيح', 'error');
                    }
                } catch (error) {
                    console.error('خطأ في استيراد البيانات:', error);
                    showNotification('حدث خطأ أثناء استيراد الإعدادات', 'error');
                }
            };
            
            reader.readAsText(file);
        }
    });
    
    // تشغيل نافذة اختيار الملف
    fileInput.click();
}

// تصدير البيانات
function exportData() {
    try {
        // جمع جميع البيانات من التخزين المحلي
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        
        // تحويل البيانات إلى سلسلة JSON
        const jsonData = JSON.stringify(data, null, 2);
        
        // إنشاء ملف للتنزيل
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء رابط التنزيل
        const a = document.createElement('a');
        a.href = url;
        a.download = `basaer-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        // تنظيف
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showNotification('تم تصدير الإعدادات بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showNotification('حدث خطأ أثناء تصدير الإعدادات', 'error');
    }
}

// إعداد مستمعي الأحداث لعناصر التحكم
function setupInputListeners() {
    // إضافة مستمعي الأحداث للصناديق المحددة
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveSettingToLocalStorage(checkbox.id, checkbox.checked);
        });
    });

    // إضافة مستمعي الأحداث للقوائم المنسدلة
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            saveSettingToLocalStorage(select.id, select.value);
        });
    });

    // إضافة مستمعي الأحداث لمدخلات النص والأرقام
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="range"], input[type="color"]').forEach(input => {
        input.addEventListener('change', () => {
            saveSettingToLocalStorage(input.id, input.value);
        });
    });
}

// وظائف مساعدة لتعيين قيم عناصر التحكم
function setCheckboxValue(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
        element.checked = localStorage.getItem(settingKey) === 'true';
    }
}

function setSelectValue(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
        const value = localStorage.getItem(settingKey);
        if (value) {
            element.value = value;
        }
    }
}

function setInputValue(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
        const value = localStorage.getItem(settingKey);
        if (value) {
            element.value = value;
        }
    }
}

function setRangeValue(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
        const value = localStorage.getItem(settingKey);
        if (value) {
            element.value = value;
        }
    }
}

function setColorValue(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
        const value = localStorage.getItem(settingKey);
        if (value) {
            element.value = value;
        }
    }
}

// حفظ الإعدادات
function saveSettingToLocalStorage(key, value) {
    localStorage.setItem(key, value);
    showNotification('تم حفظ الإعداد بنجاح');
}

// حفظ جميع الإعدادات
function saveAllSettings() {
    // حفظ جميع القيم الحالية في التخزين المحلي
    document.querySelectorAll('input, select').forEach(element => {
        const value = element.type === 'checkbox' ? element.checked : element.value;
        localStorage.setItem(element.id, value);
    });

    showNotification('تم حفظ جميع الإعدادات بنجاح');
}

// إعادة تعيين الإعدادات
function resetSettings() {
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الإعدادات؟')) {
        localStorage.clear();
        loadSettings();
        showNotification('تم إعادة تعيين الإعدادات إلى القيم الافتراضية');
    }
}

// مسح جميع البيانات
function clearAllData() {
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        localStorage.clear();
        showNotification('تم مسح جميع البيانات بنجاح');
    }
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}