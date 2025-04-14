// قاعدة الأسئلة
const quizQuestions = {
    questions: [
        {
            id: 1,
            category: "عقيدة",
            question: "ما هو أول ما نزل من القرآن الكريم؟",
            options: [
                "سورة الفاتحة",
                "اقرأ باسم ربك",
                "سورة العلق",
                "بسم الله الرحمن الرحيم"
            ],
            correct: 1,
            explanation: "أول ما نزل من القرآن الكريم هو قوله تعالى: اقرأ باسم ربك الذي خلق"
        },
        {
            id: 2,
            category: "فقه",
            question: "كم عدد أركان الإسلام؟",
            options: [
                "أربعة أركان",
                "خمسة أركان",
                "ستة أركان",
                "سبعة أركان"
            ],
            correct: 1,
            explanation: "أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، الصوم، والحج"
        },
        {
            id: 3,
            category: "سيرة",
            question: "من هو أول الخلفاء الراشدين؟",
            options: [
                "عمر بن الخطاب",
                "عثمان بن عفان",
                "أبو بكر الصديق",
                "علي بن أبي طالب"
            ],
            correct: 2,
            explanation: "أول الخلفاء الراشدين هو أبو بكر الصديق رضي الله عنه"
        },
        {
            id: 4,
            category: "فقه",
            question: "كم عدد ركعات صلاة الظهر؟",
            options: [
                "ركعتان",
                "ثلاث ركعات",
                "أربع ركعات",
                "خمس ركعات"
            ],
            correct: 2,
            explanation: "صلاة الظهر أربع ركعات"
        },
        {
            id: 5,
            category: "فقه",
            question: "في أي شهر هجري فُرض الصيام؟",
            options: [
                "رجب",
                "شعبان",
                "رمضان",
                "شوال"
            ],
            correct: 2,
            explanation: "فُرض الصيام في شهر رمضان المبارك"
        },
        {
            id: 6,
            category: "تاريخ",
            question: "ما هي أول قبلة للمسلمين؟",
            options: [
                "المسجد الأقصى",
                "الكعبة المشرفة",
                "المسجد النبوي",
                "مسجد قباء"
            ],
            correct: 0,
            explanation: "كانت أول قبلة للمسلمين هي المسجد الأقصى قبل أن تتحول إلى الكعبة المشرفة"
        },
        {
            id: 7,
            category: "قرآن",
            question: "كم عدد السور في القرآن الكريم؟",
            options: [
                "112 سورة",
                "113 سورة",
                "114 سورة",
                "115 سورة"
            ],
            correct: 2,
            explanation: "عدد سور القرآن الكريم 114 سورة"
        },
        {
            id: 8,
            category: "عقيدة",
            question: "ما هو عدد أركان الإيمان؟",
            options: [
                "أربعة أركان",
                "خمسة أركان",
                "ستة أركان",
                "سبعة أركان"
            ],
            correct: 2,
            explanation: "أركان الإيمان ستة: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره"
        },
        {
            id: 9,
            category: "عقيدة",
            question: "من هو خاتم الأنبياء والمرسلين؟",
            options: [
                "عيسى عليه السلام",
                "موسى عليه السلام",
                "إبراهيم عليه السلام",
                "محمد صلى الله عليه وسلم"
            ],
            correct: 3,
            explanation: "خاتم الأنبياء والمرسلين هو نبينا محمد صلى الله عليه وسلم"
        },
        {
            id: 10,
            category: "فقه",
            question: "ما هو أول عمل يحاسب عليه العبد يوم القيامة؟",
            options: [
                "الصلاة",
                "الصيام",
                "الزكاة",
                "الحج"
            ],
            correct: 0,
            explanation: "أول ما يحاسب عليه العبد يوم القيامة هي الصلاة"
        }
    ]
};

class IslamicQuiz {
    constructor() {
        this.questions = quizQuestions.questions;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedOption = null;
        this.questionsPerGame = 10;
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading';
        this.loadingElement.textContent = 'جاري تحميل الأسئلة...';
        
        // DOM Elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.nextButton = document.getElementById('next-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.scoreElement = document.getElementById('score');
        this.currentQuestionElement = document.getElementById('current-question');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.resultContainer = document.getElementById('result-container');
        
        // Event Listeners
        this.nextButton.addEventListener('click', () => this.checkAnswer());
        this.restartButton.addEventListener('click', () => this.initializeQuiz());
    }
    
    async initializeQuiz() {
        this.optionsContainer.innerHTML = '';
        this.optionsContainer.appendChild(this.loadingElement);
        
        if (this.questions.length === 0) {
            const loaded = await this.loadQuestions();
            if (!loaded) {
                this.showError('حدث خطأ في تحميل الأسئلة. يرجى المحاولة مرة أخرى.');
                return;
            }
        }
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedOption = null;
        this.currentQuestions = this.getRandomQuestions();
        
        this.resultContainer.style.display = 'none';
        this.restartButton.style.display = 'none';
        this.nextButton.style.display = 'block';
        
        this.updateScore();
        this.displayQuestion();
    }
    
    getRandomQuestions() {
        const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, this.questionsPerGame);
    }
    
    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.currentQuestionElement.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsElement.textContent = this.questionsPerGame;
        
        this.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.onclick = () => this.selectOption(index, button);
            this.optionsContainer.appendChild(button);
        });
        
        this.nextButton.disabled = true;
    }
    
    selectOption(index, button) {
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        button.classList.add('selected');
        this.selectedOption = index;
        this.nextButton.disabled = false;
    }
    
    checkAnswer() {
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        const correctIndex = currentQuestion.correct;
        
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === this.selectedOption) {
                option.classList.add('wrong');
            }
        });
        
        if (this.selectedOption === correctIndex) {
            this.score++;
            this.updateScore();
        }
        
        // Show explanation
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.textContent = currentQuestion.explanation;
        this.optionsContainer.appendChild(explanationDiv);
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questionsPerGame) {
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 2000);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    showResults() {
        const percentage = (this.score / this.questionsPerGame) * 100;
        const correctAnswers = document.getElementById('correct-answers');
        const percentageElement = document.getElementById('percentage');
        const messageElement = document.getElementById('message');
        
        document.querySelector('.quiz-content').style.display = 'none';
        this.resultContainer.style.display = 'block';
        this.restartButton.style.display = 'inline-block';
        this.nextButton.style.display = 'none';
        
        // إضافة زر إعادة اللعب في نهاية النتائج أيضًا
        const resultContent = document.querySelector('.result-content');
        if (resultContent && !document.querySelector('.restart-btn-result')) {
            const restartBtnResult = document.createElement('button');
            restartBtnResult.className = 'btn restart-btn-result';
            restartBtnResult.innerHTML = '<i class="fas fa-redo"></i> إعادة اللعب';
            restartBtnResult.addEventListener('click', () => this.initializeQuiz());
            resultContent.appendChild(restartBtnResult);
        }
        
        correctAnswers.textContent = this.score;
        percentageElement.textContent = percentage.toFixed(0);
        
        let message = '';
        if (percentage === 100) {
            message = 'ما شاء الله! أداء ممتاز، بارك الله فيك';
        } else if (percentage >= 80) {
            message = 'أحسنت! نتيجة رائعة';
        } else if (percentage >= 60) {
            message = 'جيد! واصل التعلم والتحسن';
        } else {
            message = 'لا بأس، حاول مرة أخرى وواصل التعلم';
        }
        messageElement.textContent = message;
    }
    
    showError(message) {
        this.optionsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="retry-btn" onclick="window.quizInstance.initializeQuiz()">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// Initialize the quiz when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizInstance = new IslamicQuiz();
    window.quizInstance.initializeQuiz();
}); 