/**
 * 测测你是人还是狗 - 趣味测试应用
 * 
 * 这是一个趣味心理测试应用，通过8道选择题来评估用户的行为特征
 * 更接近人类还是狗狗的特质
 * 
 * @author 开发者
 * @version 1.0.0
 */

/**
 * 测试题目数据数组
 * 每个题目包含问题文本和两个选项
 * score: 1 表示人类特质，2 表示狗狗特质
 */
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

/**
 * 结果配置数组
 * 根据总分范围匹配对应的结果类型
 * minScore/maxScore: 分数范围
 * humanPercent/dogPercent: 人性/狗性指数百分比
 */
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

/**
 * QuizApp 测试应用主类
 * 负责管理整个测试流程，包括：
 * - 页面切换
 * - 题目展示
 * - 分数计算
 * - 结果显示
 * - 分享功能
 */
class QuizApp {
    /**
     * 构造函数 - 初始化应用状态
     * currentQuestionIndex: 当前题目索引
     * totalScore: 累计得分
     */
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.init();
    }

    /**
     * 初始化方法
     * 设置事件监听器
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * 设置所有按钮的事件监听器
     * 包括：开始测试、重新测试、分享结果按钮
     */
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartQuiz();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResult();
        });
    }

    /**
     * 开始测试
     * 重置状态并切换到测试页面
     */
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.switchPage('quizPage');
        this.showQuestion();
    }

    /**
     * 显示当前题目
     * 更新进度条、题目编号、题目文本和选项按钮
     */
    showQuestion() {
        const question = questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;

        document.getElementById('progress').style.width = `${progress}%`;

        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;

        document.getElementById('questionText').textContent = question.question;

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

    /**
     * 处理选项选择
     * 累加分数，延迟后显示下一题或结果
     * @param {number} score - 选中选项的分数
     */
    selectOption(score) {
        this.totalScore += score;

        setTimeout(() => {
            if (this.currentQuestionIndex < questions.length - 1) {
                this.currentQuestionIndex++;
                this.showQuestion();
            } else {
                this.showResult();
            }
        }, 300);
    }

    /**
     * 显示测试结果
     * 根据总分匹配结果类型，更新结果页面内容
     */
    showResult() {
        const result = results.find(r =>
            this.totalScore >= r.minScore && this.totalScore <= r.maxScore
        );

        if (!result) {
            console.error('未找到匹配的结果');
            return;
        }

        this.switchPage('resultPage');

        document.getElementById('resultEmoji').textContent = result.emoji;
        document.getElementById('resultTitle').textContent = result.title;
        document.getElementById('resultDescription').textContent = result.description;

        this.currentResult = result;

        setTimeout(() => {
            document.getElementById('humanBar').style.width = `${result.humanPercent}%`;
            document.getElementById('dogBar').style.width = `${result.dogPercent}%`;
            document.getElementById('humanScore').textContent = `${result.humanPercent}%`;
            document.getElementById('dogScore').textContent = `${result.dogPercent}%`;
        }, 300);
    }

    /**
     * 重新开始测试
     * 调用 startQuiz 重置所有状态
     */
    restartQuiz() {
        this.startQuiz();
    }

    /**
     * 分享测试结果
     * 将结果文本复制到剪贴板
     */
    shareResult() {
        if (!this.currentResult) return;

        const shareText = `我在「测测你是人还是狗」测试中的结果是：${this.currentResult.title}\n${this.currentResult.description}\n人性指数：${this.currentResult.humanPercent}% | 狗性指数：${this.currentResult.dogPercent}%`;

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

    /**
     * 备用复制方法
     * 用于不支持 Clipboard API 的浏览器
     * @param {string} text - 要复制的文本
     */
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

    /**
     * 显示分享成功提示
     * 3秒后自动隐藏
     */
    showToast() {
        const toast = document.getElementById('shareToast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * 切换页面显示
     * 隐藏所有页面，显示目标页面
     * @param {string} pageId - 目标页面的ID
     */
    switchPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        document.getElementById(pageId).classList.add('active');
    }
}

/**
 * 应用入口
 * DOM 加载完成后初始化 QuizApp 实例
 */
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
