// 测测你是人还是狗 - 趣味测试应用

// 测试题目数据
const questions = [
    {
        question: '早上起床后你第一件事是？',
        options: [
            { text: '看手机刷社交媒体', icon: '📱', score: 1 },
            { text: '伸懒腰打哈欠，然后找吃的', icon: '🥱', score: 2 }
        ]
    },
    {
        question: '看到喜欢的人时你会？',
        options: [
            { text: '装作不在意，偷偷观察', icon: '😎', score: 1 },
            { text: '立刻兴奋冲过去打招呼', icon: '🤗', score: 2 }
        ]
    },
    {
        question: '有人敲门时你的反应是？',
        options: [
            { text: '透过猫眼看看是谁', icon: '👁️', score: 1 },
            { text: '立刻冲到门口大声询问', icon: '🔊', score: 2 }
        ]
    },
    {
        question: '你最喜欢的活动是？',
        options: [
            { text: '躺在沙发上刷手机看剧', icon: '📺', score: 1 },
            { text: '出去跑步玩耍晒太阳', icon: '🏃', score: 2 }
        ]
    },
    {
        question: '洗澡时你的状态是？',
        options: [
            { text: '享受放松的温水时光', icon: '🛁', score: 1 },
            { text: '能躲就躲，被抓到就认命', icon: '😰', score: 2 }
        ]
    },
    {
        question: '对待食物的态度是？',
        options: [
            { text: '挑食，看心情和口味', icon: '🤔', score: 1 },
            { text: '看到就吃，碗都舔干净', icon: '🍖', score: 2 }
        ]
    },
    {
        question: '你睡觉的姿势通常是？',
        options: [
            { text: '侧卧或平躺，保持优雅', icon: '😴', score: 1 },
            { text: '四脚朝天或卷成一团', icon: '🐕', score: 2 }
        ]
    },
    {
        question: '听到奇怪声音时你会？',
        options: [
            { text: '先观察情况再决定', icon: '🤨', score: 1 },
            { text: '立刻警觉，竖起耳朵', icon: '👂', score: 2 }
        ]
    }
];

// 结果配置
// 说明：每题 score=1 偏人类、score=2 偏狗狗，总分范围为 8~16，
// 通过 minScore/maxScore 区间映射到最终测试结果。
const results = [
    {
        minScore: 8,
        maxScore: 10,
        type: '纯粹的人类',
        emoji: '👨',
        title: '你是100%的人类！',
        description: '你完全展现了人类的理性、自制和社会性。你善于思考，懂得掩饰情绪，是一个成熟的现代人类。不过偶尔也可以放松一下，学学狗狗的率真哦！',
        humanPercent: 100,
        dogPercent: 0
    },
    {
        minScore: 11,
        maxScore: 12,
        type: '偏人类',
        emoji: '🙂',
        title: '你是偏人类的存在',
        description: '你主要展现人类特质，但偶尔也会有些狗狗的天真和直接。你懂得控制情绪，但也不失真诚，是个有趣的灵魂！',
        humanPercent: 75,
        dogPercent: 25
    },
    {
        minScore: 13,
        maxScore: 13,
        type: '人狗平衡',
        emoji: '🐶👤',
        title: '你是完美的人狗平衡体！',
        description: '你既有人类的理性和克制，又有狗狗的热情和真诚。你能在不同场合切换状态，是个超级有魅力的存在！',
        humanPercent: 50,
        dogPercent: 50
    },
    {
        minScore: 14,
        maxScore: 15,
        type: '偏狗狗',
        emoji: '🐕',
        title: '你是偏狗狗的存在',
        description: '你有着狗狗般的热情和真诚，但也保留了一些人类的理智。你真诚、直接、热情，是个很好相处的朋友！',
        humanPercent: 25,
        dogPercent: 75
    },
    {
        minScore: 16,
        maxScore: 16,
        type: '纯粹的狗狗',
        emoji: '🐕',
        title: '你是100%的狗狗！',
        description: '汪汪汪！你拥有狗狗般纯粹的快乐和忠诚。你热情、真诚、直率，对生活充满热爱。你的真诚让人感到温暖！记得保护好自己哦～',
        humanPercent: 0,
        dogPercent: 100
    }
];

// 应用状态
class QuizApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 开始测试按钮
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        // 重新测试按钮
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartQuiz();
        });

        // 分享按钮
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResult();
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.switchPage('quizPage');
        this.showQuestion();
    }

    showQuestion() {
        const question = questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;

        // 更新进度条
        document.getElementById('progress').style.width = `${progress}%`;

        // 更新问题编号
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;

        // 更新问题文本
        document.getElementById('questionText').textContent = question.question;

        // 渲染选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = `
                <span class="option-icon">${option.icon}</span>
                <span class="option-text">${option.text}</span>
            `;
            button.addEventListener('click', () => {
                this.selectOption(option.score);
            });
            optionsContainer.appendChild(button);
        });
    }

    selectOption(score) {
        this.totalScore += score;

        // 延迟后显示下一题或结果
        setTimeout(() => {
            if (this.currentQuestionIndex < questions.length - 1) {
                this.currentQuestionIndex++;
                this.showQuestion();
            } else {
                this.showResult();
            }
        }, 300);
    }

    showResult() {
        // 找到对应的结果
        const result = results.find(r =>
            this.totalScore >= r.minScore && this.totalScore <= r.maxScore
        );

        if (!result) {
            console.error('未找到匹配的结果');
            return;
        }

        // 切换到结果页面
        this.switchPage('resultPage');

        // 显示结果
        document.getElementById('resultEmoji').textContent = result.emoji;
        document.getElementById('resultTitle').textContent = result.title;
        document.getElementById('resultDescription').textContent = result.description;

        // 保存结果用于分享
        this.currentResult = result;

        // 动画显示分数条
        setTimeout(() => {
            document.getElementById('humanBar').style.width = `${result.humanPercent}%`;
            document.getElementById('dogBar').style.width = `${result.dogPercent}%`;
            document.getElementById('humanScore').textContent = `${result.humanPercent}%`;
            document.getElementById('dogScore').textContent = `${result.dogPercent}%`;
        }, 300);
    }

    restartQuiz() {
        this.startQuiz();
    }

    shareResult() {
        if (!this.currentResult) return;

        const shareText = `我在「测测你是人还是狗」测试中的结果是：${this.currentResult.title}\n${this.currentResult.description}\n人性指数：${this.currentResult.humanPercent}% | 狗性指数：${this.currentResult.dogPercent}%`;

        // 复制到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    this.showToast();
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    this.fallbackCopyToClipboard(shareText);
                });
        } else {
            this.fallbackCopyToClipboard(shareText);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast();
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制结果');
        }

        document.body.removeChild(textArea);
    }

    showToast() {
        const toast = document.getElementById('shareToast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    switchPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(pageId).classList.add('active');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
