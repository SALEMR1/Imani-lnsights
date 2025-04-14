// ملف جافاسكريبت للتعامل مع معاينة المقالات
document.addEventListener('DOMContentLoaded', function() {
    // تحديد عناصر المقالات
    const articlePreviews = document.querySelectorAll('.article-preview');
    
    // إضافة مستمع أحداث لكل مقال
    articlePreviews.forEach(article => {
        article.addEventListener('click', function(event) {
            // منع السلوك الافتراضي للرابط إذا تم النقر على المقال نفسه وليس على الرابط
            if (event.target.tagName !== 'A') {
                event.preventDefault();
                const articleLink = this.querySelector('.read-more');
                if (articleLink) {
                    window.location.href = articleLink.getAttribute('href');
                }
            }
        });
        
        // إضافة تأثير عند تمرير المؤشر
        article.addEventListener('mouseenter', function() {
            this.classList.add('article-hover');
        });
        
        article.addEventListener('mouseleave', function() {
            this.classList.remove('article-hover');
        });
    });
    
    // وظيفة لتقصير النص إلى عدد محدد من الكلمات
    function truncateText(text, maxWords) {
        const words = text.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return text;
    }
    
    // تقصير نصوص المقالات
    const articleExcerpts = document.querySelectorAll('.article-excerpt');
    articleExcerpts.forEach(excerpt => {
        const originalText = excerpt.textContent;
        excerpt.textContent = truncateText(originalText, 25);
    });
    
    // تحميل المزيد من المقالات عند النقر على زر "المزيد من المقالات"
    const loadMoreBtn = document.getElementById('load-more-articles');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
    
    // وظيفة تحميل المزيد من المقالات
    function loadMoreArticles() {
        // في التطبيق الحقيقي، هنا سيتم جلب المقالات من الخادم
        // لكن لأغراض العرض، سنقوم بإضافة مقالات ثابتة
        
        const articlesContainer = document.querySelector('.articles-container');
        
        // مقالات إضافية
        const newArticles = [
            {
                title: 'فضل صيام شهر رمضان',
                excerpt: 'يعتبر شهر رمضان من أفضل الشهور عند المسلمين، وفيه تضاعف الحسنات وتُغفر الذنوب. تعرف على فضائل الصيام وآدابه في هذا المقال المفصل.',
                image: 'images/articles/ramadan.jpg',
                category: 'عبادات',
                date: '١٥ شعبان ١٤٤٥',
                link: 'articles/ramadan-fasting.html'
            },
            {
                title: 'أحكام الزكاة وفضلها',
                excerpt: 'الزكاة ركن من أركان الإسلام الخمسة، وهي فريضة على كل مسلم تتوفر فيه شروط وجوبها. تعرف على أحكامها وكيفية حسابها.',
                image: 'images/articles/zakat.jpg',
                category: 'فقه',
                date: '١٠ شعبان ١٤٤٥',
                link: 'articles/zakat-rules.html'
            },
            {
                title: 'آداب المسلم في التعامل مع الآخرين',
                excerpt: 'الإسلام دين يحث على حسن الخلق والتعامل الراقي مع الآخرين. في هذا المقال نستعرض أهم آداب المسلم في تعاملاته اليومية.',
                image: 'images/articles/manners.jpg',
                category: 'أخلاق',
                date: '٥ شعبان ١٤٤٥',
                link: 'articles/islamic-manners.html'
            }
        ];
        
        // إنشاء عناصر المقالات الجديدة وإضافتها للصفحة
        newArticles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article-preview';
            
            articleElement.innerHTML = `
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-category">${article.category}</span>
                        <span class="article-date">${article.date}</span>
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${truncateText(article.excerpt, 25)}</p>
                    <a href="${article.link}" class="read-more">قراءة المزيد</a>
                </div>
            `;
            
            articlesContainer.appendChild(articleElement);
            
            // إضافة مستمعي الأحداث للمقال الجديد
            articleElement.addEventListener('click', function(event) {
                if (event.target.tagName !== 'A') {
                    event.preventDefault();
                    const articleLink = this.querySelector('.read-more');
                    if (articleLink) {
                        window.location.href = articleLink.getAttribute('href');
                    }
                }
            });
            
            articleElement.addEventListener('mouseenter', function() {
                this.classList.add('article-hover');
            });
            
            articleElement.addEventListener('mouseleave', function() {
                this.classList.remove('article-hover');
            });
        });
        
        // إخفاء زر "المزيد" بعد تحميل كل المقالات
        loadMoreBtn.style.display = 'none';
    }
});
