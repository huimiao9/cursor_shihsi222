// 日记本应用主逻辑
class DiaryApp {
    constructor() {
        this.diaries = this.loadDiaries();
        this.currentEditId = null;
        this.deleteTargetId = null;
        this.init();
    }

    // 初始化应用
    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderDiaries();
        this.updateStats();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 表单提交
        document.getElementById('diaryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // 取消编辑
        document.getElementById('btnCancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        // 搜索
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchDiaries(e.target.value);
        });

        // 心情筛选
        document.getElementById('moodFilter').addEventListener('change', (e) => {
            this.filterByMood(e.target.value);
        });

        // 排序
        document.getElementById('sortOrder').addEventListener('change', (e) => {
            this.sortDiaries(e.target.value);
        });

        // 删除确认模态框
        document.getElementById('btnCancelDelete').addEventListener('click', () => {
            this.hideDeleteModal();
        });

        document.getElementById('btnConfirmDelete').addEventListener('click', () => {
            this.confirmDelete();
        });

        // 点击模态框外部关闭
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.hideDeleteModal();
            }
        });
    }

    // 设置默认日期为今天
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('diaryDate').value = today;
    }

    // 处理表单提交
    handleSubmit() {
        const title = document.getElementById('diaryTitle').value.trim();
        const date = document.getElementById('diaryDate').value;
        const mood = document.getElementById('diaryMood').value;
        const content = document.getElementById('diaryContent').value.trim();

        if (!title || !date || !content) {
            alert('请填写完整的日记内容！');
            return;
        }

        const diary = {
            id: this.currentEditId || Date.now().toString(),
            title,
            date,
            mood,
            content,
            createdAt: this.currentEditId ? this.getDiary(this.currentEditId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            this.updateDiary(diary);
        } else {
            this.addDiary(diary);
        }

        this.resetForm();
        this.renderDiaries();
        this.updateStats();
    }

    // 添加日记
    addDiary(diary) {
        this.diaries.unshift(diary);
        this.saveDiaries();
        this.showNotification('日记保存成功！', 'success');
    }

    // 更新日记
    updateDiary(diary) {
        const index = this.diaries.findIndex(d => d.id === diary.id);
        if (index !== -1) {
            this.diaries[index] = diary;
            this.saveDiaries();
            this.showNotification('日记更新成功！', 'success');
        }
    }

    // 删除日记
    deleteDiary(id) {
        this.deleteTargetId = id;
        this.showDeleteModal();
    }

    // 确认删除
    confirmDelete() {
        if (this.deleteTargetId) {
            this.diaries = this.diaries.filter(d => d.id !== this.deleteTargetId);
            this.saveDiaries();
            this.renderDiaries();
            this.updateStats();
            this.hideDeleteModal();
            this.showNotification('日记已删除', 'success');
            this.deleteTargetId = null;
        }
    }

    // 获取单个日记
    getDiary(id) {
        return this.diaries.find(d => d.id === id);
    }

    // 编辑日记
    editDiary(id) {
        const diary = this.getDiary(id);
        if (!diary) return;

        this.currentEditId = id;
        document.getElementById('diaryTitle').value = diary.title;
        document.getElementById('diaryDate').value = diary.date;
        document.getElementById('diaryMood').value = diary.mood;
        document.getElementById('diaryContent').value = diary.content;

        document.getElementById('editorTitle').textContent = '✏️ 编辑日记';
        document.getElementById('btnSubmitText').textContent = '更新日记';
        document.getElementById('btnCancelEdit').style.display = 'block';

        // 滚动到编辑器
        document.getElementById('diaryEditor').scrollIntoView({ behavior: 'smooth' });
    }

    // 取消编辑
    cancelEdit() {
        this.resetForm();
    }

    // 重置表单
    resetForm() {
        document.getElementById('diaryForm').reset();
        this.setDefaultDate();
        this.currentEditId = null;
        document.getElementById('editorTitle').textContent = '✍️ 写新日记';
        document.getElementById('btnSubmitText').textContent = '保存日记';
        document.getElementById('btnCancelEdit').style.display = 'none';
    }

    // 搜索日记
    searchDiaries(query) {
        const filtered = query.trim() === '' 
            ? this.diaries
            : this.diaries.filter(d => 
                d.title.toLowerCase().includes(query.toLowerCase()) ||
                d.content.toLowerCase().includes(query.toLowerCase())
            );
        this.renderDiaries(filtered);
    }

    // 按心情筛选
    filterByMood(mood) {
        const searchQuery = document.getElementById('searchInput').value;
        let filtered = mood === '' 
            ? this.diaries
            : this.diaries.filter(d => d.mood === mood);

        // 如果有搜索查询，应用搜索
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(d => 
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        this.renderDiaries(filtered);
    }

    // 排序日记
    sortDiaries(order) {
        const sorted = [...this.diaries].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        this.renderDiaries(sorted);
    }

    // 渲染日记列表
    renderDiaries(diariesToRender = this.diaries) {
        const listContainer = document.getElementById('diaryList');
        const emptyState = document.getElementById('emptyState');

        if (diariesToRender.length === 0) {
            listContainer.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        listContainer.innerHTML = diariesToRender.map(diary => this.createDiaryCard(diary)).join('');

        // 添加事件监听器
        diariesToRender.forEach(diary => {
            document.getElementById(`edit-${diary.id}`).addEventListener('click', () => {
                this.editDiary(diary.id);
            });
            document.getElementById(`delete-${diary.id}`).addEventListener('click', () => {
                this.deleteDiary(diary.id);
            });
        });
    }

    // 创建日记卡片HTML
    createDiaryCard(diary) {
        const date = new Date(diary.date);
        const formattedDate = date.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });

        const contentPreview = diary.content.length > 200 
            ? diary.content.substring(0, 200) + '...'
            : diary.content;

        return `
            <div class="diary-item">
                <div class="diary-header">
                    <div class="diary-title-section">
                        <h3 class="diary-title">${this.escapeHtml(diary.title)}</h3>
                        <div class="diary-meta">
                            <span class="diary-mood">${diary.mood}</span>
                            <span>📅 ${formattedDate}</span>
                        </div>
                    </div>
                    <div class="diary-actions">
                        <button class="btn-icon btn-edit" id="edit-${diary.id}" title="编辑">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" id="delete-${diary.id}" title="删除">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="diary-content">${this.escapeHtml(contentPreview)}</div>
            </div>
        `;
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 更新统计信息
    updateStats() {
        const totalEntries = this.diaries.length;
        const totalWords = this.diaries.reduce((sum, diary) => 
            sum + diary.content.length, 0
        );

        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('totalWords').textContent = totalWords.toLocaleString();
    }

    // 显示删除确认模态框
    showDeleteModal() {
        document.getElementById('deleteModal').classList.add('show');
    }

    // 隐藏删除确认模态框
    hideDeleteModal() {
        document.getElementById('deleteModal').classList.remove('show');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 保存日记到本地存储
    saveDiaries() {
        localStorage.setItem('diaries', JSON.stringify(this.diaries));
    }

    // 从本地存储加载日记
    loadDiaries() {
        const stored = localStorage.getItem('diaries');
        return stored ? JSON.parse(stored) : [];
    }
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new DiaryApp();
});

