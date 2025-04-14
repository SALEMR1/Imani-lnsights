// وظائف صفحة الإعدادات
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initializeTabNavigation();
    initializeSettingsListeners();
});

// عرض التبويب الأول عند تحميل الصفحة
function showInitialTab() {
    const firstTab = document.querySelector('.settings-nav li');
    if (firstTab) {
        const targetId = firstTab.getAttribute('data-tab');
        const targetTab = document.getElementById(targetId + '-settings');
        if (targetTab) {
            // إخفاء جميع التبويبات
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.style.display = 'none';
            });
            // عرض التبويب المحدد
            targetTab.style.display = 'block';
            firstTab.classList.add('active');
        }
    }
}

// تهيئة التنقل بين التبويبات
function initializeTabNavigation() {
    const navItems = document.querySelectorAll('.settings-nav li');
    const tabs = document.querySelectorAll('.settings-tab');

    // عرض التبويب الأول افتراضياً
    if (tabs.length > 0) {
        tabs[0].style.display = 'block';
        navItems[0]?.classList.add('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-tab');

            // إزالة الفئة النشطة من جميع العناصر
            navItems.forEach(nav => nav.classList.remove('active'));
            tabs.forEach(tab => tab.style.display = 'none');

            // إضافة الفئة النشطة للعنصر المحدد
            item.classList.add('active');
            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.style.display = 'block';
            }
        });
    });
}

// تحميل الإعدادات المحفوظة
function loadSettings() {
    // إعدادات عامة
    const generalSettings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
    document.getElementById('auto-dark-mode').checked = generalSettings.autoDarkMode || false;
    document.getElementById('save-last-location').checked = generalSettings.saveLastLocation || false;
    document.getElementById('enable-sound').checked = generalSettings.enableSound || false;

    // إعدادات الصلاة
    const prayerSettings = JSON.parse(localStorage.getItem('prayerSettings') || '{}');
    document.getElementById('prayer-calculation-method').value = prayerSettings.calculationMethod || 'mwl';
    document.getElementById('prayer-notifications').checked = prayerSettings.notifications || false;
    document.getElementById('prayer-notification-time').value = prayerSettings.notificationTime || 15;
    document.getElementById('adhan-sound').value = prayerSettings.adhanSound || 'makkah';

    // إعدادات القرآن
    const quranSettings = JSON.parse(localStorage.getItem('quranSettings') || '{}');
    document.getElementById('default-reciter').value = quranSettings.defaultReciter || 'mishari';
    document.getElementById('quran-font-size').value = quranSettings.fontSize || 24;
    document.getElementById('show-translation').checked = quranSettings.showTranslation || false;
    document.getElementById('show-tafseer').checked = quranSettings.showTafseer || false;

    // إعدادات الإشعارات
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    document.getElementById('prayer-time-notifications').checked = notificationSettings.prayerTime || false;
    document.getElementById('azkar-notifications').checked = notificationSettings.azkar || false;
    document.getElementById('articles-notifications').checked = notificationSettings.articles || false;
    document.getElementById('fatawa-notifications').checked = notificationSettings.fatawa || false;

    // إعدادات المظهر
    const appearanceSettings = JSON.parse(localStorage.getItem('appearanceSettings') || '{}');
    document.getElementById('theme-select').value = appearanceSettings.theme || 'light';
    document.getElementById('primary-color').value = appearanceSettings.primaryColor || '#4CAF50';
    document.getElementById('font-size').value = appearanceSettings.fontSize || 'medium';
    document.getElementById('font-family').value = appearanceSettings.fontFamily || 'traditional';
}

// تهيئة مستمعي الأحداث للإعدادات
function initializeSettingsListeners() {
    // مستمعو الإعدادات العامة
    const generalInputs = ['auto-dark-mode', 'save-last-location', 'enable-sound'];
    generalInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            const generalSettings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
            generalSettings[id.replace(/-/g, '')] = e.target.checked;
            localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
            if (id === 'auto-dark-mode') {
                updateTheme(e.target.checked);
            }
        });
    });

    // مستمعو إعدادات الصلاة
    const prayerInputs = ['prayer-calculation-method', 'prayer-notifications', 'prayer-notification-time', 'adhan-sound'];
    prayerInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            const prayerSettings = JSON.parse(localStorage.getItem('prayerSettings') || '{}');
            prayerSettings[id.replace(/-/g, '')] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            localStorage.setItem('prayerSettings', JSON.stringify(prayerSettings));
        });
    });

    // مستمعو إعدادات القرآن
    const quranInputs = ['default-reciter', 'quran-font-size', 'show-translation', 'show-tafseer'];
    quranInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            const quranSettings = JSON.parse(localStorage.getItem('quranSettings') || '{}');
            quranSettings[id.replace(/-/g, '')] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            localStorage.setItem('quranSettings', JSON.stringify(quranSettings));
            if (id === 'quran-font-size') {
                updateQuranPreview();
            }
        });
    });

    // مستمعو إعدادات الإشعارات
    const notificationInputs = ['prayer-time-notifications', 'azkar-notifications', 'articles-notifications', 'fatawa-notifications'];
    notificationInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
            notificationSettings[id.replace(/-notifications/, '')] = e.target.checked;
            localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
            if (e.target.checked) {
                requestNotificationPermission();
            }
        });
    });

    // مستمعو إعدادات المظهر
    const appearanceInputs = ['theme-select', 'primary-color', 'font-size', 'font-family'];
    appearanceInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            const appearanceSettings = JSON.parse(localStorage.getItem('appearanceSettings') || '{}');
            appearanceSettings[id.replace(/-/g, '')] = e.target.value;
            localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
            updateAppearance(appearanceSettings);
        });
    });

    // مستمع تصدير الإعدادات
    document.getElementById('exportSettings').addEventListener('click', exportSettings);

    // مستمع استيراد الإعدادات
    document.getElementById('importSettings').addEventListener('change', importSettings);

    // مستمع إعادة تعيين الإعدادات
    document.getElementById('resetSettings').addEventListener('click', resetSettings);
}

// تحديث المظهر
function updateAppearance(settings) {
    const root = document.documentElement;
    if (settings.primaryColor) {
        root.style.setProperty('--primary-color', settings.primaryColor);
    }
    if (settings.fontSize) {
        document.body.className = `font-size-${settings.fontSize}`;
    }
    if (settings.fontFamily) {
        root.style.setProperty('--font-family', settings.fontFamily === 'traditional' ? 'Amiri' : 'Cairo');
    }
}

// تحديث السمة
function updateTheme(isAuto) {
    const appearanceSettings = JSON.parse(localStorage.getItem('appearanceSettings') || '{}');
    if (isAuto) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', appearanceSettings.theme || 'light');
    }
}

// تحديث معاينة القرآن
function updateQuranPreview() {
    const quranSettings = JSON.parse(localStorage.getItem('quranSettings') || '{}');
    const previewElements = document.querySelectorAll('.quran-text');
    previewElements.forEach(element => {
        element.style.fontSize = `${quranSettings.fontSize || 24}px`;
    });
}

// تصدير الإعدادات
function exportSettings() {
    const settings = {
        darkMode: localStorage.getItem('darkMode'),
        prayerSettings: JSON.parse(localStorage.getItem('prayerSettings') || '{}'),
        quranSettings: JSON.parse(localStorage.getItem('quranSettings') || '{}'),
        language: localStorage.getItem('language'),
        notificationSettings: JSON.parse(localStorage.getItem('notificationSettings') || '{}')
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'islamic-app-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// استيراد الإعدادات
function importSettings(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                // تحديث جميع الإعدادات
                if (settings.darkMode) localStorage.setItem('darkMode', settings.darkMode);
                if (settings.prayerSettings) localStorage.setItem('prayerSettings', JSON.stringify(settings.prayerSettings));
                if (settings.quranSettings) localStorage.setItem('quranSettings', JSON.stringify(settings.quranSettings));
                if (settings.language) localStorage.setItem('language', settings.language);
                if (settings.notificationSettings) localStorage.setItem('notificationSettings', JSON.stringify(settings.notificationSettings));

                // إعادة تحميل الإعدادات
                loadSettings();
                
                alert('تم استيراد الإعدادات بنجاح');
            } catch (error) {
                alert('حدث خطأ أثناء استيراد الإعدادات');
                console.error('خطأ في استيراد الإعدادات:', error);
            }
        };
        reader.readAsText(file);
    }
}

// إعادة تعيين الإعدادات
function resetSettings() {
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الإعدادات؟')) {
        // مسح جميع الإعدادات من التخزين المحلي
        localStorage.removeItem('darkMode');
        localStorage.removeItem('prayerSettings');
        localStorage.removeItem('quranSettings');
        localStorage.removeItem('language');
        localStorage.removeItem('notificationSettings');

        // إعادة تحميل الإعدادات الافتراضية
        loadSettings();
        
        alert('تم إعادة تعيين الإعدادات بنجاح');
    }
}

// التحقق من دعم الإشعارات
function checkNotificationSupport() {
    return 'Notification' in window;
}

// طلب إذن الإشعارات
function requestNotificationPermission() {
    if (checkNotificationSupport()) {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                alert('لتلقي الإشعارات، يرجى السماح بالإشعارات في إعدادات المتصفح');
            }
        });
    } else {
        alert('متصفحك لا يدعم الإشعارات');
    }
}
