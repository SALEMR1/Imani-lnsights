// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const articlesContainer = document.getElementById('articles-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('article-search');
    const searchButton = document.getElementById('search-article-btn');
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // المتغيرات
    let currentCategory = 'all';
    let currentPage = 1;
    const articlesPerPage = 6;
    let filteredArticles = [];
    
    // بيانات المقالات (في التطبيق الحقيقي، يمكن استخدام API)
    const articles = Array.from(document.querySelectorAll('.article-card'));
    
    // تهيئة الصفحة
    initArticlesPage();
    
    // وظيفة تهيئة الصفحة
    function initArticlesPage() {
        // استماع لأحداث تصفية المقالات
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة الفئة النشطة من جميع الأزرار
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر المحدد
                button.classList.add('active');
                
                // تحديث الفئة الحالية
                currentCategory = button.getAttribute('data-category');
                
                // إعادة تعيين الصفحة الحالية
                currentPage = 1;
                
                // تصفية المقالات وعرضها
                filterAndDisplayArticles();
            });
        });
        
        // استماع لحدث البحث
        searchButton.addEventListener('click', searchArticles);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchArticles();
            }
        });
        
        // استماع لأحداث التنقل بين الصفحات
        prevPageBtn.addEventListener('click', goToPrevPage);
        nextPageBtn.addEventListener('click', goToNextPage);
        
        // تصفية المقالات وعرضها عند تحميل الصفحة
        filterAndDisplayArticles();
    }
    
    // وظيفة تصفية المقالات وعرضها
    function filterAndDisplayArticles() {
        // تصفية المقالات حسب الفئة
        if (currentCategory === 'all') {
            filteredArticles = articles;
        } else {
            filteredArticles = articles.filter(article => 
                article.getAttribute('data-category') === currentCategory
            );
        }
        
        // تصفية المقالات حسب البحث إذا كان هناك نص بحث
        const searchText = searchInput.value.trim().toLowerCase();
        if (searchText) {
            filteredArticles = filteredArticles.filter(article => {
                const title = article.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
                return title.includes(searchText) || excerpt.includes(searchText);
            });
        }
        
        // حساب عدد الصفحات
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        // تحديث أزرار التنقل بين الصفحات
        updatePagination(totalPages);
        
        // عرض المقالات للصفحة الحالية
        displayArticlesForCurrentPage();
    }
    
    // وظيفة عرض المقالات للصفحة الحالية
    function displayArticlesForCurrentPage() {
        // حساب نطاق المقالات للصفحة الحالية
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToDisplay = filteredArticles.slice(startIndex, endIndex);
        
        // إخفاء جميع المقالات
        articles.forEach(article => {
            article.style.display = 'none';
        });
        
        // عرض المقالات المطلوبة فقط
        articlesToDisplay.forEach(article => {
            article.style.display = 'block';
        });
        
        // عرض رسالة إذا لم يتم العثور على مقالات
        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = '<div class="no-results">لم يتم العثور على مقالات مطابقة للبحث</div>';
        } else if (articlesToDisplay.length === 0 && currentPage > 1) {
            // إذا كانت الصفحة الحالية فارغة، انتقل إلى الصفحة السابقة
            currentPage--;
            displayArticlesForCurrentPage();
        }
    }
    
    // وظيفة تحديث أزرار التنقل بين الصفحات
    function updatePagination(totalPages) {
        // تحديث أزرار السابق والتالي
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // إنشاء أرقام الصفحات
        pageNumbers.innerHTML = '';
        
        // إذا كان عدد الصفحات أكثر من 5، عرض الصفحات المحيطة بالصفحة الحالية
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // ضبط نطاق الصفحات إذا كانت الصفحة الحالية قريبة من النهاية
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // إضافة أزرار أرقام الصفحات
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                filterAndDisplayArticles();
            });
            pageNumbers.appendChild(pageBtn);
        }
    }
    
    // وظيفة البحث في المقالات
    function searchArticles() {
        // إعادة تعيين الصفحة الحالية
        currentPage = 1;
        
        // تصفية المقالات وعرضها
        filterAndDisplayArticles();
    }
    
    // وظيفة الانتقال إلى الصفحة السابقة
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            filterAndDisplayArticles();
        }
    }
    
    // وظيفة الانتقال إلى الصفحة التالية
    function goToNextPage() {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            filterAndDisplayArticles();
        }
    }
});
