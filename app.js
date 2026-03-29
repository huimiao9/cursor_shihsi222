// 测测你是牛还是马 - 趣味测试应用

// 测试题目数据
const questions = [
    {
        question: '清晨的第一件事是？',
        options: [
            { text: '慢慢伸展，整理当天计划', icon: '🧘', score: 1 },
            { text: '精神抖擞，想马上出发奔跑', icon: '🏇', score: 2 }
        ]
    },
    {
        question: '午后休息时你更喜欢？',
        options: [
            { text: '找块草地晒太阳，慢慢放空', icon: '🌾', score: 1 },
            { text: '活动筋骨，来点轻松小跑', icon: '🐎', score: 2 }
        ]
    },
    {
        question: '遇到新环境时你的状态是？',
        options: [
            { text: '先观察一阵，再慢慢适应', icon: '👀', score: 1 },
            { text: '快速探索，期待新冒险', icon: '🧭', score: 2 }
        ]
    },
    {
        question: '朋友约你周末出游，你会？',
        options: [
            { text: '安排好路线和节奏，慢慢走', icon: '🗺️', score: 1 },
            { text: '想去更远更刺激的地方', icon: '⛰️', score: 2 }
        ]
    },
    {
        question: '对待吃饭这件事，你更像？',
        options: [
            { text: '细嚼慢咽，慢慢享受', icon: '🥬', score: 1 },
            { text: '胃口大开，吃得很有劲', icon: '🥕', score: 2 }
        ]
    },
    {
        question: '工作/学习节奏更接近？',
        options: [
            { text: '稳扎稳打，持续输出', icon: '🧱', score: 1 },
            { text: '冲刺型，高效又利落', icon: '⚡', score: 2 }
        ]
    },
    {
        question: '你更擅长的风格是？',
        options: [
            { text: '沉稳可靠，慢慢推进', icon: '🪨', score: 1 },
            { text: '灵活机敏，说走就走', icon: '🎯', score: 2 }
        ]
    },
    {
        question: '当你心情不错时，会选择？',
        options: [
            { text: '找个舒服的地方慢慢待着', icon: '🌤️', score: 1 },
            { text: '想出去撒欢，跑一圈', icon: '💨', score: 2 }
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
        type: '纯粹的牛系',
        emoji: '🐮',
        title: '你是100%的牛系！',
        description: '你稳重踏实、耐心可靠，做事讲究节奏感，给人强烈的安全感。你就像勤恳的老黄牛，慢慢耕耘也能收获满满！',
        cowPercent: 100,
        horsePercent: 0
    },
    {
        minScore: 11,
        maxScore: 12,
        type: '偏牛系',
        emoji: '🐄',
        title: '你是偏牛系的存在',
        description: '你更偏爱稳定和耐心，但偶尔也会想来点马系的速度与激情。你稳而不慢，踏实又有小惊喜！',
        cowPercent: 75,
        horsePercent: 25
    },
    {
        minScore: 13,
        maxScore: 13,
        type: '牛马平衡',
        emoji: '🐮🐴',
        title: '你是完美的牛马平衡体！',
        description: '你既有牛系的耐心与稳重，又有马系的速度与活力。你能在慢与快之间自由切换，是个超有魅力的存在！',
        cowPercent: 50,
        horsePercent: 50
    },
    {
        minScore: 14,
        maxScore: 15,
        type: '偏马系',
        emoji: '🐴',
        title: '你是偏马系的存在',
        description: '你有着马系的冲劲和速度，但也保留了一些牛系的稳健。你果断、热情、行动力强，是个很有带动感的伙伴！',
        cowPercent: 25,
        horsePercent: 75
    },
    {
        minScore: 16,
        maxScore: 16,
        type: '纯粹的马系',
        emoji: '🐎',
        title: '你是100%的马系！',
        description: '你拥有马系般的活力与自由精神，行动迅速、敢冲敢拼，充满朝气。你的奔跑能带动身边的人，记得也给自己放松一下哦！',
        cowPercent: 0,
        horsePercent: 100
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
            document.getElementById('cowBar').style.width = `${result.cowPercent}%`;
            document.getElementById('horseBar').style.width = `${result.horsePercent}%`;
            document.getElementById('cowScore').textContent = `${result.cowPercent}%`;
            document.getElementById('horseScore').textContent = `${result.horsePercent}%`;
        }, 300);
    }

    restartQuiz() {
        this.startQuiz();
    }

    shareResult() {
        if (!this.currentResult) return;

        const shareText = `我在「测测你是牛还是马」测试中的结果是：${this.currentResult.title}\n${this.currentResult.description}\n牛系指数：${this.currentResult.cowPercent}% | 马系指数：${this.currentResult.horsePercent}%`;

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
