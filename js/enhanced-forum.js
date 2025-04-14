// تحسينات المنتدى الإسلامي
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع وظائف المنتدى
    initForumSearch();
    initCategoryFilter();
    initNewQuestionModal();
    initMobileMenu();
    initForumStats();
    initTopicInteractions();
    initPagination();
    
    // إضافة إحصائيات المنتدى إذا لم تكن موجودة
    addForumStatsIfNotExists();
});

// تهيئة وظيفة البحث في المنتدى
function initForumSearch() {
    const searchInput = document.getElementById('forum-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // البحث عند النقر على زر البحث
        searchBtn.addEventListener('click', function() {
            searchTopics(searchInput.value);
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTopics(searchInput.value);
            }
        });
        
        // إضافة تأثير التلقائي للبحث
        searchInput.addEventListener('input', function() {
            if (searchInput.value.length > 2) {
                // تأخير البحث لتجنب الكثير من عمليات البحث المتكررة
                clearTimeout(searchInput.timer);
                searchInput.timer = setTimeout(function() {
                    searchTopics(searchInput.value);
                }, 300);
            } else if (searchInput.value.length === 0) {
                // إظهار جميع المواضيع إذا كان حقل البحث فارغًا
                searchTopics('');
            }
        });
    }
}

// وظيفة البحث في المواضيع
function searchTopics(query) {
    query = query.trim().toLowerCase();
    const topicItems = document.querySelectorAll('.topic-item');
    let resultsFound = false;
    
    topicItems.forEach(item => {
        const title = item.querySelector('.topic-title h3').textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const author = item.querySelector('.topic-author span').textContent.toLowerCase();
        
        // البحث في العنوان والوسوم والكاتب
        if (query === '' || 
            title.includes(query) || 
            tags.some(tag => tag.includes(query)) || 
            author.includes(query)) {
            item.style.display = 'grid';
            resultsFound = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // إظهار رسالة إذا لم يتم العثور على نتائج
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (!resultsFound) {
        if (!noResultsMessage) {
            const forumTopics = document.querySelector('.forum-topics');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 30px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>لم يتم العثور على مواضيع تطابق بحثك. يرجى تجربة كلمات بحث أخرى.</p>
                </div>
            `;
            forumTopics.appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // تحديث عرض ترقيم الصفحات
    updatePaginationVisibility(resultsFound);
}

// تهيئة وظيفة التصفية حسب الفئة
function initCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterTopicsByCategory(this.value);
        });
    }
}

// وظيفة التصفية حسب الفئة
function filterTopicsByCategory(category) {
    const topicItems = document.querySelectorAll('.topic-item');
    let resultsFound = false;
    
    topicItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'grid';
            resultsFound = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // إظهار رسالة إذا لم يتم العثور على نتائج
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (!resultsFound) {
        if (!noResultsMessage) {
            const forumTopics = document.querySelector('.forum-topics');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 30px;">
                    <i class="fas fa-filter" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>لم يتم العثور على مواضيع في هذه الفئة. يرجى اختيار فئة أخرى.</p>
                </div>
            `;
            forumTopics.appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // تحديث عرض ترقيم الصفحات
    updatePaginationVisibility(resultsFound);
}

// تحديث عرض ترقيم الصفحات
function updatePaginationVisibility(show) {
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = show ? 'flex' : 'none';
    }
}

// تهيئة نافذة السؤال الجديد
function initNewQuestionModal() {
    const newQuestionBtn = document.getElementById('new-question-btn');
    const modal = document.getElementById('new-question-modal');
    const closeModal = document.querySelector('.close-modal');
    const questionForm = document.getElementById('question-form');
    
    if (newQuestionBtn && modal) {
        // فتح النافذة
        newQuestionBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
        });
        
        // إغلاق النافذة
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // إغلاق النافذة عند النقر خارجها
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // معالجة النموذج
        if (questionForm) {
            questionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                submitNewQuestion();
            });
        }
    }
}

// وظيفة إرسال سؤال جديد
function submitNewQuestion() {
    const title = document.getElementById('question-title').value;
    const category = document.getElementById('question-category').value;
    const content = document.getElementById('question-content').value;
    
    if (title && category && content) {
        // في التطبيق الحقيقي، سيتم إرسال البيانات إلى الخادم
        // هنا سنقوم بمحاكاة إضافة السؤال إلى المنتدى
        
        // إضافة السؤال الجديد إلى قائمة المواضيع
        addNewTopicToList(title, category, content);
        
        // إغلاق النافذة
        const modal = document.getElementById('new-question-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // إعادة تعيين النموذج
        document.getElementById('question-form').reset();
        
        // إظهار رسالة نجاح
        showNotification('تم إضافة سؤالك بنجاح!');
        
        // تحديث إحصائيات المنتدى
        updateForumStats();
    }
}

// إضافة موضوع جديد إلى القائمة
function addNewTopicToList(title, category, content) {
    const forumTopics = document.querySelector('.forum-topics');
    const topicHeader = document.querySelector('.topic-header');
    
    if (forumTopics && topicHeader) {
        // إنشاء عنصر الموضوع الجديد
        const newTopic = document.createElement('div');
        newTopic.className = 'topic-item';
        newTopic.setAttribute('data-category', category);
        
        // الحصول على اسم الفئة بالعربية
        const categoryName = getCategoryName(category);
        
        // الحصول على اسم المستخدم الحالي (في التطبيق الحقيقي، سيتم الحصول عليه من الجلسة)
        const currentUser = 'المستخدم الحالي';
        
        // الحصول على التاريخ والوقت الحاليين
        const now = new Date();
        const dateStr = formatArabicDate(now);
        const timeStr = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        // تعيين محتوى الموضوع
        newTopic.innerHTML = `
            <div class="topic-title">
                <div class="topic-icon"><i class="fas fa-question-circle"></i></div>
                <a href="topic.html?id=new">
                    <h3>${title}</h3>
                    <div class="topic-tags">
                        <span class="tag">${categoryName}</span>
                        <span class="tag">جديد</span>
                    </div>
                </a>
            </div>
            <div class="topic-author">
                <img src="images/default-avatar.jpg" alt="${currentUser}">
                <span>${currentUser}</span>
            </div>
            <div class="topic-replies">0</div>
            <div class="topic-views">1</div>
            <div class="topic-date">
                <span class="date">${dateStr}</span>
                <span class="time">${timeStr}</span>
            </div>
        `;
        
        // إضافة الموضوع إلى بداية القائمة (بعد العنوان)
        forumTopics.insertBefore(newTopic, topicHeader.nextSibling);
        
        // إضافة تفاعلات الموضوع
        initTopicInteractions();
    }
}

// تنسيق التاريخ بالعربية
function formatArabicDate(date) {
    // تحويل التاريخ الميلادي إلى هجري (تقريبي)
    // في التطبيق الحقيقي، يمكن استخدام مكتبة لتحويل التاريخ بدقة
    const hijriMonths = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
        'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    // تقريب بسيط للتاريخ الهجري (هذا ليس دقيقًا، فقط للعرض)
    const day = Math.min(29, date.getDate());
    const month = date.getMonth();
    const year = date.getFullYear() - 579; // تقريب بسيط للسنة الهجرية
    
    return day + ' ' + hijriMonths[month] + ' ' + year + 'هـ';
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
    const categories = {
        'aqeedah': 'العقيدة',
        'fiqh': 'الفقه',
        'quran': 'القرآن وعلومه',
        'hadith': 'الحديث وعلومه',
        'general': 'أسئلة عامة'
    };
    
    return categories[category] || category;
}

// تهيئة قائمة الجوال
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// إضافة إحصائيات المنتدى إذا لم تكن موجودة
function addForumStatsIfNotExists() {
    if (!document.querySelector('.forum-stats')) {
        const forumSection = document.querySelector('.forum-section .container');
        const sectionTitle = document.querySelector('.forum-section .section-title');
        
        if (forumSection && sectionTitle) {
            const statsElement = document.createElement('div');
            statsElement.className = 'forum-stats';
            statsElement.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-comments"></i></div>
                    <div class="stat-value">35</div>
                    <div class="stat-label">المواضيع</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-reply"></i></div>
                    <div class="stat-value">128</div>
                    <div class="stat-label">الردود</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-value">42</div>
                    <div class="stat-label">الأعضاء</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user"></i></div>
                    <div class="stat-value">آخر عضو</div>
                    <div class="stat-label">أحمد محمد</div>
                </div>
            `;
            
            // إدراج الإحصائيات بعد عنوان القسم
            forumSection.insertBefore(statsElement, sectionTitle.nextSibling);
        }
    }
}

// تهيئة إحصائيات المنتدى
function initForumStats() {
    // يمكن استخدام هذه الوظيفة لتحديث الإحصائيات من الخادم
    // في هذا المثال، سنستخدمها فقط لإضافة تأثيرات حركية
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon i');
            icon.classList.add('fa-bounce');
            
            setTimeout(() => {
                icon.classList.remove('fa-bounce');
            }, 1000);
        });
    });
}

// تحديث إحصائيات المنتدى
function updateForumStats() {
    const topicsValue = document.querySelector('.forum-stats .stat-card:nth-child(1) .stat-value');
    
    if (topicsValue) {
        // زيادة عدد المواضيع
        let count = parseInt(topicsValue.textContent);
        topicsValue.textContent = count + 1;
        
        // إضافة تأثير حركي
        topicsValue.style.animation = 'none';
        setTimeout(() => {
            topicsValue.style.animation = 'pulse 1s';
        }, 10);
    }
}

// تهيئة تفاعلات المواضيع
function initTopicInteractions() {
    const topicItems = document.querySelectorAll('.topic-item');
    
    topicItems.forEach(item => {
        // إضافة تأثير النقر
        item.addEventListener('click', function(e) {
            // تجاهل النقر على الروابط
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                const link = this.querySelector('.topic-title a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// تهيئة ترقيم الصفحات
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // في التطبيق الحقيقي، سيتم تحميل الصفحة المناسبة
            // هنا سنقوم فقط بتغيير الصفحة النشطة
            document.querySelector('.pagination .current').classList.remove('current');
            this.classList.add('current');
            
            // إظهار رسالة
            showNotification('جاري تحميل الصفحة...');
        });
    });
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
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
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
