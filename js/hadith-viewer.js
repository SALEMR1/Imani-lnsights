/**
 * نظام عرض الأحاديث النبوية
 * يتيح عرض الأحاديث النبوية والتنقل بينها
 */

// بيانات الأحاديث المضمنة مباشرة لتجنب مشاكل التحميل
const HARDCODED_HADITHS = [
  {
    "id": 1,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من سلك طريقًا يلتمس فيه علمًا سهل الله له به طريقًا إلى الجنة\"",
    "source": "رواه مسلم"
  },
  {
    "id": 2,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه\"",
    "source": "متفق عليه"
  },
  {
    "id": 3,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 4,
    "text": "عن أنس بن مالك رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"ثلاث من كن فيه وجد حلاوة الإيمان: أن يكون الله ورسوله أحب إليه مما سواهما، وأن يحب المرء لا يحبه إلا لله، وأن يكره أن يعود في الكفر كما يكره أن يلقى في النار\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 5,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"المسلم من سلم المسلمون من لسانه ويده، والمهاجر من هجر ما نهى الله عنه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 6,
    "text": "عن عبد الله بن عمرو رضي الله عنهما قال: قال رسول الله صلى الله عليه وسلم: \"المسلم من سلم المسلمون من لسانه ويده، والمهاجر من هجر ما نهى الله عنه\"",
    "source": "رواه البخاري"
  },
  {
    "id": 7,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت، ومن كان يؤمن بالله واليوم الآخر فليكرم جاره، ومن كان يؤمن بالله واليوم الآخر فليكرم ضيفه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 8,
    "text": "عن أبي ذر رضي الله عنه قال: قال لي رسول الله صلى الله عليه وسلم: \"اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن\"",
    "source": "رواه الترمذي وقال: حديث حسن"
  },
  {
    "id": 9,
    "text": "عن ابن عباس رضي الله عنهما قال: كنت خلف النبي صلى الله عليه وسلم يوماً فقال: \"يا غلام، إني أعلمك كلمات: احفظ الله يحفظك، احفظ الله تجده تجاهك، إذا سألت فاسأل الله، وإذا استعنت فاستعن بالله، واعلم أن الأمة لو اجتمعت على أن ينفعوك بشيء لم ينفعوك إلا بشيء قد كتبه الله لك، وإن اجتمعوا على أن يضروك بشيء لم يضروك إلا بشيء قد كتبه الله عليك، رفعت الأقلام وجفت الصحف\"",
    "source": "رواه الترمذي وقال: حديث حسن صحيح"
  },
  {
    "id": 10,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"إن الله تعالى قال: من عادى لي وليا فقد آذنته بالحرب، وما تقرب إلي عبدي بشيء أحب إلي مما افترضته عليه، وما يزال عبدي يتقرب إلي بالنوافل حتى أحبه، فإذا أحببته كنت سمعه الذي يسمع به، وبصره الذي يبصر به، ويده التي يبطش بها، ورجله التي يمشي بها، وإن سألني لأعطينه، ولئن استعاذني لأعيذنه\"",
    "source": "رواه البخاري"
  },
  {
    "id": 11,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"سبعة يظلهم الله في ظله يوم لا ظل إلا ظله: الإمام العادل، وشاب نشأ في عبادة الله، ورجل قلبه معلق في المساجد، ورجلان تحابا في الله اجتمعا عليه وتفرقا عليه، ورجل دعته امرأة ذات منصب وجمال فقال إني أخاف الله، ورجل تصدق بصدقة فأخفاها حتى لا تعلم شماله ما تنفق يمينه، ورجل ذكر الله خاليا ففاضت عيناه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 12,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"خير يوم طلعت عليه الشمس يوم الجمعة، فيه خلق آدم، وفيه أدخل الجنة، وفيه أخرج منها، ولا تقوم الساعة إلا في يوم الجمعة\"",
    "source": "رواه مسلم"
  },
  {
    "id": 13,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"الصلوات الخمس، والجمعة إلى الجمعة، ورمضان إلى رمضان، مكفرات لما بينهن إذا اجتنبت الكبائر\"",
    "source": "رواه مسلم"
  },
  {
    "id": 14,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من صام رمضان إيمانا واحتسابا غفر له ما تقدم من ذنبه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 15,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من قام ليلة القدر إيمانا واحتسابا غفر له ما تقدم من ذنبه\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 16,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"أفضل الصيام بعد رمضان شهر الله المحرم، وأفضل الصلاة بعد الفريضة صلاة الليل\"",
    "source": "رواه مسلم"
  },
  {
    "id": 17,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من صلى على جنازة حتى يصلى عليها فله قيراط، ومن شهدها حتى تدفن فله قيراطان، قيل: وما القيراطان؟ قال: مثل الجبلين العظيمين\"",
    "source": "رواه البخاري ومسلم"
  },
  {
    "id": 18,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"إذا مات الإنسان انقطع عنه عمله إلا من ثلاثة: إلا من صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له\"",
    "source": "رواه مسلم"
  },
  {
    "id": 19,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من دعا إلى هدى كان له من الأجر مثل أجور من تبعه لا ينقص ذلك من أجورهم شيئا، ومن دعا إلى ضلالة كان عليه من الإثم مثل آثام من تبعه لا ينقص ذلك من آثامهم شيئا\"",
    "source": "رواه مسلم"
  },
  {
    "id": 20,
    "text": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: \"من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة، ومن يسر على معسر يسر الله عليه في الدنيا والآخرة، ومن ستر مسلما ستره الله في الدنيا والآخرة، والله في عون العبد ما كان العبد في عون أخيه\"",
    "source": "رواه مسلم"
  }
];

// متغيرات عامة
let hadiths = [];
let currentHadithIndex = 0;

// عناصر DOM
let hadithTextElement = null;
let hadithSourceElement = null;
let prevButton = null;
let nextButton = null;
let randomButton = null;

/**
 * تهيئة عناصر DOM
 * @returns {boolean} - نجاح أو فشل التهيئة
 */
function initializeDOMElements() {
    try {
        hadithTextElement = document.querySelector('.hadith-text p');
        hadithSourceElement = document.querySelector('.hadith-source p');
        prevButton = document.getElementById('prev-hadith');
        nextButton = document.getElementById('next-hadith');
        randomButton = document.getElementById('random-hadith');
        
        // التحقق من وجود جميع العناصر
        if (!hadithTextElement || !hadithSourceElement || !prevButton || !nextButton || !randomButton) {
            console.error('لم يتم العثور على بعض عناصر DOM المطلوبة');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('خطأ أثناء تهيئة عناصر DOM:', error);
        return false;
    }
}

/**
 * تحميل بيانات الأحاديث من ملف JSON أو استخدام البيانات المضمنة
 */
async function loadHadiths() {
    try {
        console.log('جاري تحميل بيانات الأحاديث...');
        
        try {
            // محاولة تحميل البيانات من الملف
            const response = await fetch('./data/hadith.json');
            if (response.ok) {
                const data = await response.json();
                console.log('تم تحميل البيانات من الملف بنجاح:', data.length, 'حديث');
                hadiths = data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (fetchError) {
            // استخدام البيانات المضمنة في حالة فشل التحميل
            console.log('فشل تحميل البيانات من الملف، استخدام البيانات المضمنة');
            hadiths = HARDCODED_HADITHS;
        }
        
        // عرض الحديث الأول بعد تحميل البيانات
        if (hadiths && hadiths.length > 0) {
            console.log('تم تحميل', hadiths.length, 'حديث بنجاح');
            displayHadith(currentHadithIndex);
            enableButtons();
        } else {
            throw new Error('لا توجد أحاديث متاحة');
        }
    } catch (error) {
        console.error('خطأ في تحميل الأحاديث:', error);
        if (hadithTextElement) {
            hadithTextElement.textContent = 'حدث خطأ في تحميل الأحاديث. يرجى المحاولة مرة أخرى لاحقاً.';
        }
    }
}

/**
 * عرض حديث معين بناءً على الفهرس
 * @param {number} index - فهرس الحديث المراد عرضه
 */
/**
 * عرض حديث معين بناءً على الفهرس
 * @param {number} index - فهرس الحديث المراد عرضه
 */
function displayHadith(index) {
    if (!hadiths || hadiths.length === 0) {
        console.error('لا توجد أحاديث متاحة للعرض');
        return;
    }
    
    // التأكد من أن الفهرس ضمن النطاق المسموح
    if (index < 0) index = hadiths.length - 1;
    if (index >= hadiths.length) index = 0;
    
    currentHadithIndex = index;
    const hadith = hadiths[currentHadithIndex];
    
    if (!hadith) {
        console.error('الحديث غير موجود في الفهرس:', index);
        return;
    }
    
    console.log('عرض الحديث رقم:', currentHadithIndex + 1, 'من', hadiths.length);
    
    // تم إزالة عداد الأحاديث بناءً على طلب المستخدم
    
    // إضافة تأثير انتقالي للنص
    if (hadithTextElement && hadithSourceElement) {
        hadithTextElement.style.opacity = 0;
        hadithSourceElement.style.opacity = 0;
        
        setTimeout(() => {
            hadithTextElement.textContent = hadith.text;
            hadithSourceElement.textContent = hadith.source;
            
            // تم إزالة عداد الأحاديث بناءً على طلب المستخدم
            
            hadithTextElement.style.opacity = 1;
            hadithSourceElement.style.opacity = 1;
        }, 300);
    } else {
        console.error('عناصر عرض الحديث غير متاحة');
    }
}

/**
 * الانتقال إلى الحديث التالي
 */
function nextHadith() {
    displayHadith(currentHadithIndex + 1);
}

/**
 * الانتقال إلى الحديث السابق
 */
function prevHadith() {
    displayHadith(currentHadithIndex - 1);
}

/**
 * عرض حديث عشوائي
 */
function randomHadith() {
    if (hadiths.length <= 1) return;
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * hadiths.length);
    } while (randomIndex === currentHadithIndex);
    
    displayHadith(randomIndex);
}

/**
 * تفعيل أزرار التنقل
 */
function enableButtons() {
    // إزالة مستمعي الأحداث السابقة لتجنب التكرار
    prevButton.removeEventListener('click', prevHadith);
    nextButton.removeEventListener('click', nextHadith);
    randomButton.removeEventListener('click', randomHadith);
    
    // إضافة مستمعي الأحداث الجديدة
    prevButton.addEventListener('click', prevHadith);
    nextButton.addEventListener('click', nextHadith);
    randomButton.addEventListener('click', randomHadith);
    
    // تحسين مظهر الأزرار
    [prevButton, nextButton, randomButton].forEach(button => {
        if (button) {
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.3s ease';
            
            // إضافة تأثيرات التحويم
            button.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#1f6e8c';
                this.style.color = '#fff';
            });
            
            button.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
                this.style.color = '';
            });
        }
    });
    
    // إضافة دعم لاختصارات لوحة المفاتيح
    document.removeEventListener('keydown', handleKeyNavigation);
    document.addEventListener('keydown', handleKeyNavigation);
    
    console.log('تم تفعيل أزرار التنقل بين الأحاديث');
}

/**
 * معالجة التنقل باستخدام لوحة المفاتيح
 */
function handleKeyNavigation(event) {
    if (event.key === 'ArrowRight') {
        prevHadith();
    } else if (event.key === 'ArrowLeft') {
        nextHadith();
    } else if (event.key === 'r' || event.key === 'ر') {
        randomHadith();
    }
}

/**
 * تهيئة نظام عرض الأحاديث عند تحميل الصفحة
 */
/**
 * تهيئة نظام عرض الأحاديث
 */
function initializeHadithSystem() {
    console.log('جاري تهيئة نظام الأحاديث...');
    
    // تهيئة عناصر DOM أولاً
    if (initializeDOMElements()) {
        // تحميل بيانات الأحاديث
        loadHadiths();
        
        // إضافة تأثيرات CSS للحديث
        addHadithStyles();
        
        return true;
    } else {
        console.error('فشل في تهيئة عناصر DOM');
        return false;
    }
}

/**
 * إضافة تأثيرات CSS للحديث
 */
function addHadithStyles() {
    // إضافة أنماط CSS للحديث
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .hadith-text p {
            line-height: 1.8;
            position: relative;
            padding: 10px 20px;
        }
        
        .hadith-source p {
            font-style: italic;
            text-align: left;
            margin-top: 15px;
            color: #555;
        }
        
        /* تم إزالة أنماط عداد الأحاديث */
        
        .hadith-controls button {
            transition: all 0.3s ease;
            margin: 0 5px;
        }
        
        .hadith-controls button:hover {
            background-color: #1f6e8c;
            color: white;
        }
    `;
    
    // إضافة أنماط CSS إلى الصفحة
    document.head.appendChild(styleElement);
}

// استدعاء التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('تم تحميل الصفحة');
    
    // تأخير قصير للتأكد من تحميل جميع العناصر
    setTimeout(() => {
        initializeHadithSystem();
    }, 500);
});
