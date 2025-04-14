// تهيئة PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class BookViewer {
    constructor() {
        this.currentBook = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.pdfDoc = null;
        this.scale = 1.5;
        this.container = document.getElementById('pdf-container');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    async loadBook(bookUrl) {
        try {
            // تحميل ملف PDF
            const loadingTask = pdfjsLib.getDocument(bookUrl);
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;
            
            // تحديث معلومات الصفحات
            document.getElementById('total-pages').textContent = this.totalPages;
            document.getElementById('current-page').textContent = this.currentPage;
            
            // عرض الصفحة الأولى
            this.renderPage(1);
            
            return true;
        } catch (error) {
            console.error('خطأ في تحميل الكتاب:', error);
            this.showError('عذراً، حدث خطأ أثناء تحميل الكتاب');
            return false;
        }
    }

    async renderPage(pageNumber) {
        try {
            const page = await this.pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: this.scale });

            // تعيين أبعاد الكانفاس
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            this.currentPage = pageNumber;
            document.getElementById('current-page').textContent = pageNumber;

            // تحديث حالة أزرار التنقل
            this.updateNavigationButtons();
        } catch (error) {
            console.error('خطأ في عرض الصفحة:', error);
            this.showError('عذراً، حدث خطأ أثناء عرض الصفحة');
        }
    }

    updateNavigationButtons() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        
        prevButton.disabled = this.currentPage <= 1;
        nextButton.disabled = this.currentPage >= this.totalPages;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.container.innerHTML = '';
        this.container.appendChild(errorDiv);
    }

    // التكبير والتصغير
    zoomIn() {
        this.scale *= 1.2;
        this.renderPage(this.currentPage);
    }

    zoomOut() {
        this.scale /= 1.2;
        this.renderPage(this.currentPage);
    }

    // التنقل بين الصفحات
    async nextPage() {
        if (this.currentPage < this.totalPages) {
            await this.renderPage(this.currentPage + 1);
        }
    }

    async previousPage() {
        if (this.currentPage > 1) {
            await this.renderPage(this.currentPage - 1);
        }
    }

    // حفظ موضع القراءة
    saveBookmark() {
        const bookmark = {
            bookUrl: this.currentBook,
            page: this.currentPage,
            timestamp: new Date().toISOString()
        };
        
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        bookmarks = bookmarks.filter(b => b.bookUrl !== this.currentBook);
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        
        showToast('تم حفظ موضع القراءة');
    }

    // استعادة موضع القراءة
    loadBookmark(bookUrl) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const bookmark = bookmarks.find(b => b.bookUrl === bookUrl);
        
        if (bookmark) {
            this.renderPage(bookmark.page);
            return true;
        }
        return false;
    }
}

// إنشاء كائن عارض الكتب
const bookViewer = new BookViewer();

// تصدير الكائن للاستخدام في الملفات الأخرى
window.bookViewer = bookViewer; 