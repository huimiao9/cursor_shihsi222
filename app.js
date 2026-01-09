/**
 * 测测你是人还是狗 - 趣味测试应用
 * 
 * 这是一个基于JavaScript的互动测试应用，通过8道选择题来判断用户的性格特征
 * 更偏向人类特质还是狗狗特质。应用使用本地存储，无需后端服务器。
 * 
 * 功能特性：
 * - 8道趣味选择题
 * - 实时进度显示
 * - 结果分析和百分比展示
 * - 结果分享功能
 */

// ==================== 测试题目数据 ====================
/**
 * 测试题目数组
 * 每道题包含：
 * - question: 问题文本
 * - options: 选项数组，每个选项包含：
 *   - text: 选项文本
 *   - icon: 选项图标（emoji）
 *   - score: 选项得分（1=人类倾向，2=狗狗倾向）
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

// ==================== 结果配置 ====================
/**
 * 测试结果配置数组
 * 根据总分范围匹配对应的结果类型
 * 每个结果包含：
 * - minScore/maxScore: 分数范围
 * - type: 结果类型名称
 * - emoji: 结果图标
 * - title: 结果标题
 * - description: 结果描述
 * - humanPercent: 人性百分比
 * - dogPercent: 狗性百分比
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

// ==================== 应用主类 ====================
/**
 * 测试应用主类
 * 负责管理测试流程、用户交互和结果展示
 */
class QuizApp {
    /**
     * 构造函数
     * 初始化应用状态和事件监听器
     */
    constructor() {
        this.currentQuestionIndex = 0;  // 当前题目索引（从0开始）
        this.totalScore = 0;             // 累计总分
        this.currentResult = null;       // 当前测试结果（用于分享）
        this.init();
    }

    /**
     * 初始化应用
     * 设置所有必要的事件监听器
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * 设置事件监听器
     * 绑定所有按钮的点击事件
     */
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

    /**
     * 开始测试
     * 重置测试状态，切换到测试页面，显示第一道题
     */
    startQuiz() {
        this.currentQuestionIndex = 0;  // 重置题目索引
        this.totalScore = 0;             // 重置总分
        this.switchPage('quizPage');     // 切换到测试页面
        this.showQuestion();             // 显示第一道题
    }

    /**
     * 显示当前题目
     * 更新进度条、问题文本和选项按钮
     */
    showQuestion() {
        // 获取当前题目数据
        const question = questions[this.currentQuestionIndex];
        
        // 计算进度百分比（当前题号 / 总题数 * 100）
        const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;

        // 更新进度条宽度
        document.getElementById('progress').style.width = `${progress}%`;

        // 更新问题编号显示（显示为从1开始的题号）
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;

        // 更新问题文本内容
        document.getElementById('questionText').textContent = question.question;

        // 清空选项容器，准备渲染新选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        // 遍历所有选项，创建选项按钮
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            // 设置按钮内容：图标 + 文本
            button.innerHTML = `
                <span class="option-icon">${option.icon}</span>
                <span class="option-text">${option.text}</span>
            `;
            // 绑定点击事件，选择该选项时累加分数
            button.addEventListener('click', () => {
                this.selectOption(option.score);
            });
            // 将按钮添加到容器中
            optionsContainer.appendChild(button);
        });
    }

    /**
     * 选择选项
     * 累加分数，然后显示下一题或结果页面
     * @param {number} score - 选项得分（1或2）
     */
    selectOption(score) {
        // 累加当前选项的分数
        this.totalScore += score;

        // 延迟300ms后显示下一题或结果（提供视觉反馈时间）
        setTimeout(() => {
            // 如果还有未答的题目，显示下一题
            if (this.currentQuestionIndex < questions.length - 1) {
                this.currentQuestionIndex++;
                this.showQuestion();
            } else {
                // 所有题目答完，显示结果
                this.showResult();
            }
        }, 300);
    }

    /**
     * 显示测试结果
     * 根据总分匹配对应的结果类型，并展示在结果页面
     */
    showResult() {
        // 根据总分在结果配置中查找匹配的结果
        // 查找总分在minScore和maxScore范围内的结果
        const result = results.find(r =>
            this.totalScore >= r.minScore && this.totalScore <= r.maxScore
        );

        // 如果未找到匹配结果，输出错误并返回
        if (!result) {
            console.error('未找到匹配的结果');
            return;
        }

        // 切换到结果页面
        this.switchPage('resultPage');

        // 更新结果页面的显示内容
        document.getElementById('resultEmoji').textContent = result.emoji;
        document.getElementById('resultTitle').textContent = result.title;
        document.getElementById('resultDescription').textContent = result.description;

        // 保存当前结果，用于后续分享功能
        this.currentResult = result;

        // 延迟300ms后动画显示分数条（提供页面切换的视觉过渡）
        setTimeout(() => {
            // 设置人性百分比条宽度
            document.getElementById('humanBar').style.width = `${result.humanPercent}%`;
            // 设置狗性百分比条宽度
            document.getElementById('dogBar').style.width = `${result.dogPercent}%`;
            // 更新人性百分比文本
            document.getElementById('humanScore').textContent = `${result.humanPercent}%`;
            // 更新狗性百分比文本
            document.getElementById('dogScore').textContent = `${result.dogPercent}%`;
        }, 300);
    }

    /**
     * 重新开始测试
     * 重置所有状态并重新开始测试流程
     */
    restartQuiz() {
        this.startQuiz();
    }

    /**
     * 分享测试结果
     * 将结果文本复制到剪贴板，方便用户分享
     */
    shareResult() {
        // 如果没有结果，直接返回
        if (!this.currentResult) return;

        // 构建分享文本内容
        const shareText = `我在「测测你是人还是狗」测试中的结果是：${this.currentResult.title}\n${this.currentResult.description}\n人性指数：${this.currentResult.humanPercent}% | 狗性指数：${this.currentResult.dogPercent}%`;

        // 优先使用现代 Clipboard API 复制到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    // 复制成功，显示提示
                    this.showToast();
                })
                .catch(err => {
                    // 复制失败，使用备用方法
                    console.error('复制失败:', err);
                    this.fallbackCopyToClipboard(shareText);
                });
        } else {
            // 浏览器不支持 Clipboard API，使用备用方法
            this.fallbackCopyToClipboard(shareText);
        }
    }

    /**
     * 备用复制方法
     * 使用传统的 document.execCommand 方法复制文本（兼容旧浏览器）
     * @param {string} text - 要复制的文本内容
     */
    fallbackCopyToClipboard(text) {
        // 创建一个隐藏的文本区域元素
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // 将元素移到屏幕外（不可见但仍在DOM中）
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        // 添加到DOM中
        document.body.appendChild(textArea);
        // 选中文本区域中的所有文本
        textArea.select();

        try {
            // 执行复制命令
            document.execCommand('copy');
            // 复制成功，显示提示
            this.showToast();
        } catch (err) {
            // 复制失败，输出错误并提示用户
            console.error('复制失败:', err);
            alert('复制失败，请手动复制结果');
        }

        // 清理：移除临时创建的文本区域元素
        document.body.removeChild(textArea);
    }

    /**
     * 显示分享成功提示
     * 显示一个3秒的toast提示，告知用户结果已复制到剪贴板
     */
    showToast() {
        // 获取toast元素并添加show类（触发显示动画）
        const toast = document.getElementById('shareToast');
        toast.classList.add('show');
        
        // 3秒后移除show类（隐藏toast）
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * 切换页面
     * 隐藏所有页面，然后显示指定的页面
     * @param {string} pageId - 要显示的页面元素ID
     */
    switchPage(pageId) {
        // 隐藏所有页面：移除所有.page元素的active类
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面：为目标页面添加active类
        document.getElementById(pageId).classList.add('active');
    }
}

// ==================== 应用初始化 ====================
/**
 * 当DOM加载完成后初始化应用
 * 确保所有HTML元素都已加载，再创建应用实例
 */
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
