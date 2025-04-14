// وظائف صفحة الفتاوى الإسلامية
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود العناصر قبل تهيئة الوظائف
    try {
        // تهيئة وظائف الفتاوى
        initFatawaSearch();
        initFatawaFilter();
        initSaveFatawa();
        initLoadMore();
        initFatwaRequestForm();
        initShareButtons();
        
        // تهيئة دعم الأجهزة المحمولة
        initMobileSupport();
    } catch (error) {
        console.error('حدث خطأ أثناء تهيئة صفحة الفتاوى:', error);
    }
});

// تهيئة وظيفة البحث
function initFatawaSearch() {
    const searchInput = document.getElementById('fatawa-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // البحث عند النقر على زر البحث
        searchBtn.addEventListener('click', function() {
            searchFatawa(searchInput.value);
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFatawa(searchInput.value);
            }
        });
    }
}

// وظيفة البحث في الفتاوى
function searchFatawa(query) {
    query = query.trim().toLowerCase();
    const fatwaCards = document.querySelectorAll('.fatwa-card');
    
    fatwaCards.forEach(card => {
        const title = card.querySelector('.fatwa-title').textContent.toLowerCase();
        const question = card.querySelector('.fatwa-question p').textContent.toLowerCase();
        const answer = card.querySelector('.fatwa-answer p').textContent.toLowerCase();
        const category = card.querySelector('.fatwa-category').textContent.toLowerCase();
        const scholar = card.querySelector('.fatwa-scholar').textContent.toLowerCase();
        
        // إظهار أو إخفاء البطاقة بناءً على نتيجة البحث
        if (query === '' || 
            title.includes(query) || 
            question.includes(query) || 
            answer.includes(query) || 
            category.includes(query) || 
            scholar.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // تحديث رسالة عدم وجود نتائج
    updateNoResultsMessage();
}

// تهيئة وظيفة التصفية
function initFatawaFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const scholarFilter = document.getElementById('scholar-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterFatawa();
        });
    }
    
    if (scholarFilter) {
        scholarFilter.addEventListener('change', function() {
            filterFatawa();
        });
    }
}

// وظيفة تصفية الفتاوى
function filterFatawa() {
    const categoryFilter = document.getElementById('category-filter').value;
    const scholarFilter = document.getElementById('scholar-filter').value;
    const fatwaCards = document.querySelectorAll('.fatwa-card');
    
    fatwaCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const scholar = card.getAttribute('data-scholar');
        
        // تحديد ما إذا كانت البطاقة تطابق معايير التصفية
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter;
        const scholarMatch = scholarFilter === 'all' || scholar === scholarFilter;
        
        // إظهار أو إخفاء البطاقة بناءً على نتيجة التصفية
        if (categoryMatch && scholarMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // تحديث رسالة عدم وجود نتائج
    updateNoResultsMessage();
}

// تحديث رسالة عدم وجود نتائج
function updateNoResultsMessage() {
    const fatwaCards = document.querySelectorAll('.fatwa-card');
    const fatwaList = document.querySelector('.fatawa-list');
    let visibleCards = 0;
    
    // حساب عدد البطاقات المرئية
    fatwaCards.forEach(card => {
        if (card.style.display !== 'none') {
            visibleCards++;
        }
    });
    
    // إضافة أو إزالة رسالة عدم وجود نتائج
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCards === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div style="text-align: center; padding: 30px; background-color: var(--card-bg, #fff); border-radius: 8px; margin-bottom: 20px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-color, #4caf50); margin-bottom: 15px;"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>لم يتم العثور على فتاوى تطابق معايير البحث. يرجى تجربة كلمات بحث أخرى أو تغيير معايير التصفية.</p>
                </div>
            `;
            fatwaList.appendChild(noResultsMessage);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

// تهيئة وظيفة حفظ الفتاوى
function initSaveFatawa() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            // تبديل حالة الحفظ
            const isSaved = this.classList.contains('saved');
            
            if (isSaved) {
                // إلغاء حفظ الفتوى
                this.classList.remove('saved');
                this.innerHTML = '<i class="far fa-bookmark"></i> حفظ';
                
                // إظهار رسالة
                showNotification('تم إلغاء حفظ الفتوى');
            } else {
                // حفظ الفتوى
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-bookmark"></i> محفوظ';
                
                // إظهار رسالة
                showNotification('تم حفظ الفتوى بنجاح');
            }
            
            // في التطبيق الحقيقي، يمكنك حفظ حالة الفتاوى المحفوظة في localStorage
            saveFatawaToLocalStorage();
        });
    });
    
    // استرجاع حالة الفتاوى المحفوظة
    loadSavedFatawa();
}

// حفظ الفتاوى في التخزين المحلي
function saveFatawaToLocalStorage() {
    const savedFatawa = [];
    const saveButtons = document.querySelectorAll('.save-btn.saved');
    
    saveButtons.forEach(button => {
        const fatwaCard = button.closest('.fatwa-card');
        const fatwaTitle = fatwaCard.querySelector('.fatwa-title').textContent;
        const fatwaCategory = fatwaCard.getAttribute('data-category');
        const fatwaScholar = fatwaCard.getAttribute('data-scholar');
        
        savedFatawa.push({
            title: fatwaTitle,
            category: fatwaCategory,
            scholar: fatwaScholar
        });
    });
    
    localStorage.setItem('savedFatawa', JSON.stringify(savedFatawa));
}

// تحميل الفتاوى المحفوظة من التخزين المحلي
function loadSavedFatawa() {
    const savedFatawa = JSON.parse(localStorage.getItem('savedFatawa')) || [];
    const fatwaCards = document.querySelectorAll('.fatwa-card');
    
    fatwaCards.forEach(card => {
        const fatwaTitle = card.querySelector('.fatwa-title').textContent;
        const fatwaCategory = card.getAttribute('data-category');
        const fatwaScholar = card.getAttribute('data-scholar');
        const saveButton = card.querySelector('.save-btn');
        
        // التحقق مما إذا كانت الفتوى محفوظة
        const isSaved = savedFatawa.some(fatwa => 
            fatwa.title === fatwaTitle && 
            fatwa.category === fatwaCategory && 
            fatwa.scholar === fatwaScholar
        );
        
        if (isSaved && saveButton) {
            saveButton.classList.add('saved');
            saveButton.innerHTML = '<i class="fas fa-bookmark"></i> محفوظ';
        }
    });
}

// تهيئة وظيفة تحميل المزيد
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // محاكاة تحميل المزيد من الفتاوى
            loadMoreFatawa();
        });
    }
}

// وظيفة تحميل المزيد من الفتاوى
function loadMoreFatawa() {
    // إظهار مؤشر التحميل
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    loadMoreBtn.disabled = true;
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
        // إضافة فتاوى جديدة
        const fatwaList = document.querySelector('.fatawa-list');
        
        // إنشاء فتاوى جديدة
        const newFatawa = [
            {
                category: 'hajj',
                scholar: 'al-fawzan',
                title: 'حكم الإنابة في الحج',
                question: 'هل يجوز الإنابة في الحج عن شخص متوفى؟',
                answer: 'نعم، يجوز الإنابة في الحج عن الميت، وكذلك عن العاجز الذي لا يُرجى برؤه، لحديث الخثعمية التي سألت النبي صلى الله عليه وسلم فقالت: "إن فريضة الله على عباده في الحج أدركت أبي شيخاً كبيراً لا يستطيع أن يثبت على الراحلة، أفأحج عنه؟" قال: "نعم". متفق عليه. ويشترط في النائب أن يكون قد حج عن نفسه أولاً، ثم يحج عن غيره.',
                reference: 'المصدر: الملخص الفقهي، الشيخ صالح الفوزان، ج1، ص 324.',
                date: '10 ذو القعدة 1425هـ'
            },
            {
                category: 'nikah',
                scholar: 'bin-baz',
                title: 'حكم عقد النكاح بدون ولي',
                question: 'ما حكم عقد النكاح بدون ولي؟',
                answer: 'لا يصح عقد النكاح بدون ولي، لقول النبي صلى الله عليه وسلم: "لا نكاح إلا بولي" رواه أبو داود والترمذي وصححه الألباني، وقوله صلى الله عليه وسلم: "أيما امرأة نكحت بغير إذن وليها فنكاحها باطل" رواه أحمد وأبو داود والترمذي. والولي هو الأب ثم الجد ثم الابن ثم الأخ الشقيق ثم الأخ لأب ثم العم الشقيق ثم العم لأب ثم بنوهم على هذا الترتيب، ثم السلطان ولي من لا ولي له.',
                reference: 'المصدر: فتاوى اللجنة الدائمة، المجموعة الأولى، ج18، ص 178.',
                date: '15 محرم 1416هـ'
            },
            {
                category: 'muamalat',
                scholar: 'ibn-uthaymeen',
                title: 'حكم بيع التقسيط',
                question: 'ما حكم بيع التقسيط بزيادة في الثمن؟',
                answer: 'بيع التقسيط جائز شرعاً ولو كان بزيادة في الثمن مقابل التأجيل، وهو من البيوع المباحة بالكتاب والسنة والإجماع، لقوله تعالى: "وأحل الله البيع وحرم الربا"، ولا فرق بين أن يكون الثمن حالاً أو مؤجلاً. والزيادة في الثمن مقابل التأجيل جائزة؛ لأنها ليست من الربا المحرم، وإنما هي من باب مقابلة الأجل بجزء من الثمن، وهذا جائز باتفاق العلماء. لكن يشترط أن يكون الثمن معلوماً ومحدداً عند العقد، وأن لا يكون هناك زيادة في الثمن بعد العقد بسبب التأخر في السداد.',
                reference: 'المصدر: مجموع فتاوى ورسائل الشيخ محمد بن صالح العثيمين، المجلد 29، ص 37.',
                date: '20 جمادى الأولى 1421هـ'
            }
        ];
        
        // إضافة الفتاوى الجديدة إلى الصفحة
        newFatawa.forEach(fatwa => {
            const fatwaCard = document.createElement('div');
            fatwaCard.className = 'fatwa-card';
            fatwaCard.setAttribute('data-category', fatwa.category);
            fatwaCard.setAttribute('data-scholar', fatwa.scholar);
            
            fatwaCard.innerHTML = `
                <div class="fatwa-header">
                    <h3 class="fatwa-title">${fatwa.title}</h3>
                    <div class="fatwa-meta">
                        <span class="fatwa-category">${getCategoryName(fatwa.category)}</span>
                        <span class="fatwa-scholar">${getScholarName(fatwa.scholar)}</span>
                    </div>
                </div>
                <div class="fatwa-content">
                    <div class="fatwa-question">
                        <h4><i class="fas fa-question-circle"></i> السؤال:</h4>
                        <p>${fatwa.question}</p>
                    </div>
                    <div class="fatwa-answer">
                        <h4><i class="fas fa-comment-dots"></i> الجواب:</h4>
                        <p>${fatwa.answer}</p>
                    </div>
                    <div class="fatwa-reference">
                        <p>${fatwa.reference}</p>
                    </div>
                </div>
                <div class="fatwa-footer">
                    <div class="fatwa-actions">
                        <button class="btn share-btn"><i class="fas fa-share-alt"></i> مشاركة</button>
                        <button class="btn save-btn"><i class="far fa-bookmark"></i> حفظ</button>
                    </div>
                    <div class="fatwa-date">تاريخ الفتوى: ${fatwa.date}</div>
                </div>
            `;
            
            fatwaList.appendChild(fatwaCard);
        });
        
        // إعادة تهيئة أزرار الحفظ والمشاركة للفتاوى الجديدة
        initSaveFatawa();
        initShareButtons();
        
        // تطبيق التصفية الحالية على الفتاوى الجديدة
        filterFatawa();
        
        // استعادة زر التحميل
        loadMoreBtn.innerHTML = 'تحميل المزيد من الفتاوى';
        loadMoreBtn.disabled = false;
        
        // إخفاء زر التحميل إذا لم تعد هناك فتاوى إضافية
        if (newFatawa.length < 3) {
            loadMoreBtn.style.display = 'none';
            
            // إظهار رسالة "لا توجد المزيد من الفتاوى"
            const loadMore = document.querySelector('.load-more');
            const noMoreMessage = document.createElement('p');
            noMoreMessage.className = 'no-more-message';
            noMoreMessage.textContent = 'لا توجد المزيد من الفتاوى';
            noMoreMessage.style.textAlign = 'center';
            noMoreMessage.style.color = '#666';
            noMoreMessage.style.marginTop = '10px';
            loadMore.appendChild(noMoreMessage);
        }
    }, 1500);
}

// تهيئة نموذج طلب الفتوى
function initFatwaRequestForm() {
    const fatwaRequestForm = document.getElementById('fatwa-request-form');
    
    if (fatwaRequestForm) {
        fatwaRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على قيم النموذج
            const category = document.getElementById('question-category').value;
            const title = document.getElementById('question-title').value;
            const content = document.getElementById('question-content').value;
            const email = document.getElementById('contact-email').value;
            
            // في التطبيق الحقيقي، يمكنك إرسال البيانات إلى الخادم
            // هنا سنقوم بمحاكاة نجاح الإرسال
            
            // إظهار رسالة نجاح
            showNotification('تم إرسال طلب الفتوى بنجاح! سيتم الرد عليك في أقرب وقت ممكن.');
            
            // إعادة تعيين النموذج
            fatwaRequestForm.reset();
        });
    }
}

// تهيئة أزرار المشاركة
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    if (!shareButtons || shareButtons.length === 0) {
        console.log('لم يتم العثور على أزرار المشاركة');
        return;
    }
    
    // إزالة أي مستمعي أحداث سابقة لتجنب التكرار
    shareButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // إضافة مستمع الحدث الجديد مع منع الفقاعة
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // منع الفقاعة للأجهزة المحمولة
            
            const fatwaCard = this.closest('.fatwa-card');
            const fatwaTitle = fatwaCard.querySelector('.fatwa-title').textContent;
            const fatwaQuestion = fatwaCard.querySelector('.fatwa-question p').textContent;
            const fatwaAnswer = fatwaCard.querySelector('.fatwa-answer p').textContent;
            
            // في التطبيق الحقيقي، يمكنك استخدام Web Share API
            if (navigator.share) {
                navigator.share({
                    title: fatwaTitle,
                    text: fatwaQuestion + '\n' + fatwaAnswer,
                    url: window.location.href
                })
                .then(() => showNotification('تمت المشاركة بنجاح'))
                .catch(error => {
                    console.error('حدث خطأ أثناء المشاركة:', error);
                    // إذا فشلت المشاركة، استخدم الطريقة البديلة
                    showShareOptions(fatwaTitle, fatwaQuestion + '\n' + fatwaAnswer);
                });
            } else {
                // إظهار قائمة مشاركة بديلة
                showShareOptions(fatwaTitle, fatwaQuestion + '\n' + fatwaAnswer);
            }
        });
    });
    
    console.log('تم تهيئة أزرار المشاركة بنجاح');
}

// إظهار خيارات المشاركة
function showShareOptions(title, text) {
    // إنشاء قائمة مشاركة بسيطة
    let shareModal = document.querySelector('.share-modal');
    
    if (!shareModal) {
        shareModal = document.createElement('div');
        shareModal.className = 'share-modal';
        shareModal.style.position = 'fixed';
        shareModal.style.top = '0';
        shareModal.style.left = '0';
        shareModal.style.width = '100%';
        shareModal.style.height = '100%';
        shareModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        shareModal.style.zIndex = '1000';
        shareModal.style.display = 'flex';
        shareModal.style.justifyContent = 'center';
        shareModal.style.alignItems = 'center';
        
        const shareContent = document.createElement('div');
        shareContent.style.backgroundColor = 'var(--card-bg, #fff)';
        shareContent.style.padding = '20px';
        shareContent.style.borderRadius = '8px';
        shareContent.style.maxWidth = '400px';
        shareContent.style.width = '90%';
        
        shareContent.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary-color, #4caf50);">مشاركة الفتوى</h3>
            <p style="margin-bottom: 20px;">${title}</p>
            <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
                <a href="https://wa.me/?text=${encodeURIComponent(title + '\n' + text)}" target="_blank" style="color: #25D366; font-size: 2rem;"><i class="fab fa-whatsapp"></i></a>
                <a href="https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}" target="_blank" style="color: #0088cc; font-size: 2rem;"><i class="fab fa-telegram"></i></a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" style="color: #1DA1F2; font-size: 2rem;"><i class="fab fa-twitter"></i></a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" style="color: #4267B2; font-size: 2rem;"><i class="fab fa-facebook"></i></a>
            </div>
            <button id="close-share-modal" style="width: 100%; padding: 10px; background-color: var(--primary-color, #4caf50); color: white; border: none; border-radius: 4px; cursor: pointer;">إغلاق</button>
        `;
        
        shareModal.appendChild(shareContent);
        document.body.appendChild(shareModal);
        
        // إغلاق النافذة
        document.getElementById('close-share-modal').addEventListener('click', function() {
            shareModal.remove();
        });
        
        // إغلاق النافذة عند النقر خارجها
        shareModal.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                shareModal.remove();
            }
        });
    }
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
    switch (category) {
        case 'salah':
            return 'الصلاة';
        case 'zakat':
            return 'الزكاة';
        case 'sawm':
            return 'الصيام';
        case 'hajj':
            return 'الحج والعمرة';
        case 'nikah':
            return 'النكاح والطلاق';
        case 'muamalat':
            return 'المعاملات';
        case 'other':
            return 'فتاوى متنوعة';
        default:
            return category;
    }
}

// الحصول على اسم العالم
function getScholarName(scholar) {
    switch (scholar) {
        case 'bin-baz':
            return 'الشيخ عبد العزيز بن باز';
        case 'ibn-uthaymeen':
            return 'الشيخ ابن عثيمين';
        case 'al-albani':
            return 'الشيخ الألباني';
        case 'al-fawzan':
            return 'الشيخ الفوزان';
        case 'al-uthaymin':
            return 'الشيخ العثيمين';
        default:
            return scholar;
    }
}

// إظهار إشعار
function showNotification(message) {
    // التحقق من وجود عنصر الإشعار
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // إنشاء عنصر الإشعار
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // إضافة تنسيقات CSS للإشعار
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'var(--primary-color, #4caf50)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1001';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
    }
    
    // تحديث محتوى الإشعار
    notification.textContent = message;
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

// تهيئة دعم الأجهزة المحمولة
function initMobileSupport() {
    // التحقق مما إذا كان الجهاز محمولاً
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        console.log('تم اكتشاف جهاز محمول، تطبيق تحسينات الأجهزة المحمولة');
        
        // تحسين أحجام الأزرار للأجهزة المحمولة
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.style.padding = '12px 20px';
            button.style.fontSize = '16px';
            button.style.margin = '5px';
            button.style.minWidth = '120px';
            button.style.touchAction = 'manipulation'; // تحسين اللمس على الأجهزة المحمولة
        });
        
        // تحسين مساحة النقر للأزرار
        const actionButtons = document.querySelectorAll('.fatwa-actions .btn');
        actionButtons.forEach(button => {
            button.style.minHeight = '44px'; // الحد الأدنى للمس المناسب على iOS
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.position = 'relative';
            button.style.zIndex = '5'; // للتأكد من أن الزر فوق العناصر الأخرى
        });
        
        // تحسين المسافات بين العناصر لتسهيل النقر
        const fatwaActions = document.querySelectorAll('.fatwa-actions');
        fatwaActions.forEach(actions => {
            actions.style.padding = '10px 0';
            actions.style.gap = '15px';
            actions.style.display = 'flex';
            actions.style.flexWrap = 'wrap';
            actions.style.justifyContent = 'space-around';
        });
    }
    
    console.log('تم تهيئة دعم الأجهزة المحمولة');
}
