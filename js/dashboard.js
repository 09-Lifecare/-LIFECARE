// ===== DASHBOARD SYSTEM =====

class DashboardSystem {
    constructor() {
        this.user = auth.getCurrentUser();
        if (!this.user) {
            window.location.href = 'pages/login.html';
            return;
        }
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.loadUserData();
        this.setupEventListeners();
        this.renderDashboard();
    }

    loadUserData() {
        // Load or create user data
        const userDataKey = `lifecare_data_${this.user.id}`;
        const defaultData = {
            tasks: [
                { id: 1, title: 'Study Pharmacology', completed: false, dueDate: '2026-05-05', priority: 'high' },
                { id: 2, title: 'Complete Clinical Notes', completed: true, dueDate: '2026-05-03', priority: 'high' },
                { id: 3, title: 'Submit Assignment', completed: false, dueDate: '2026-05-10', priority: 'medium' }
            ],
            health: [
                { id: 1, date: '2026-05-01', bloodPressure: '120/80', symptoms: 'None', notes: 'Feeling good' },
                { id: 2, date: '2026-04-30', bloodPressure: '118/78', symptoms: 'Slight headache', notes: 'Managed with rest' }
            ],
            expenses: [
                { id: 1, category: 'Food', amount: 25.50, date: '2026-05-01', description: 'Lunch at cafeteria' },
                { id: 2, category: 'Transport', amount: 10.00, date: '2026-04-30', description: 'Bus fare' },
                { id: 3, category: 'Books', amount: 45.00, date: '2026-04-28', description: 'Textbooks' }
            ],
            duties: [
                { id: 1, date: '2026-05-02', shift: 'Morning (6AM-2PM)', unit: 'ICU', status: 'Scheduled' },
                { id: 2, date: '2026-05-05', shift: 'Evening (2PM-10PM)', unit: 'Ward A', status: 'Scheduled' }
            ],
            budget: 500
        };

        this.userData = JSON.parse(localStorage.getItem(userDataKey)) || defaultData;
        this.userDataKey = userDataKey;
    }

    saveUserData() {
        localStorage.setItem(this.userDataKey, JSON.stringify(this.userData));
    }

    setupEventListeners() {
        // Sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Logout
        const logoutLink = document.querySelector('[data-section="logout"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                auth.logout();
            });
        }
    }

    switchSection(section) {
        // Hide all sections
        const sections = document.querySelectorAll('[data-view]');
        sections.forEach(s => s.style.display = 'none');

        // Show selected section
        const selectedSection = document.querySelector(`[data-view="${section}"]`);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // Update active sidebar link
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    }

    renderDashboard() {
        this.renderHeader();
        this.renderOverview();
        this.renderTasks();
        this.renderHealth();
        this.renderExpenses();
        this.renderDuties();
    }

    renderHeader() {
        const userNameEl = document.querySelector('.user-name');
        const userRoleEl = document.querySelector('.user-role');
        const userAvatarEl = document.querySelector('.user-avatar');

        if (userNameEl) userNameEl.textContent = this.user.name;
        if (userRoleEl) userRoleEl.textContent = this.user.role;
        if (userAvatarEl) userAvatarEl.textContent = this.user.name.charAt(0).toUpperCase();
    }

    renderOverview() {
        const tasksContainer = document.getElementById('dashboardTasks');
        const expensesContainer = document.getElementById('dashboardExpenses');
        const healthContainer = document.getElementById('dashboardHealth');
        const dutiesContainer = document.getElementById('dashboardDuties');

        // Tasks overview
        if (tasksContainer) {
            const completedTasks = this.userData.tasks.filter(t => t.completed).length;
            tasksContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Total Tasks</span>
                    <span class="stat-value">${this.userData.tasks.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Completed</span>
                    <span class="stat-value">${completedTasks}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Pending</span>
                    <span class="stat-value">${this.userData.tasks.length - completedTasks}</span>
                </div>
            `;
        }

        // Expenses overview
        if (expensesContainer) {
            const totalExpenses = this.userData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const remaining = this.userData.budget - totalExpenses;
            expensesContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Budget</span>
                    <span class="stat-value">$${this.userData.budget.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Spent</span>
                    <span class="stat-value">$${totalExpenses.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Remaining</span>
                    <span class="stat-value">$${remaining.toFixed(2)}</span>
                </div>
            `;
        }

        // Health overview
        if (healthContainer && this.userData.health.length > 0) {
            const lastHealth = this.userData.health[0];
            healthContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Blood Pressure</span>
                    <span class="stat-value">${lastHealth.bloodPressure}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Symptoms</span>
                    <span class="stat-value">${lastHealth.symptoms}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Last Update</span>
                    <span class="stat-value">${lastHealth.date}</span>
                </div>
            `;
        }

        // Duties overview
        if (dutiesContainer && this.userData.duties.length > 0) {
            const nextDuty = this.userData.duties[0];
            dutiesContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Next Duty</span>
                    <span class="stat-value">${nextDuty.date}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Shift</span>
                    <span class="stat-value">${nextDuty.shift}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Unit</span>
                    <span class="stat-value">${nextDuty.unit}</span>
                </div>
            `;
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        tasksList.innerHTML = this.userData.tasks.map(task => `
            <li>
                <div class="list-item-text">
                    <div class="list-item-main ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="list-item-sub">${task.dueDate}</div>
                </div>
                <span class="list-item-badge" style="background-color: ${task.priority === 'high' ? '#FEE2E2' : '#FEF3C7'}; color: ${task.priority === 'high' ? '#991B1B' : '#92400E'}">${task.priority}</span>
            </li>
        `).join('');
    }

    renderHealth() {
        const healthList = document.getElementById('healthList');
        if (!healthList) return;

        healthList.innerHTML = this.userData.health.map(record => `
            <li>
                <div class="list-item-text">
                    <div class="list-item-main">BP: ${record.bloodPressure}</div>
                    <div class="list-item-sub">${record.date} - ${record.symptoms}</div>
                </div>
            </li>
        `).join('');
    }

    renderExpenses() {
        const expensesList = document.getElementById('expensesList');
        if (!expensesList) return;

        expensesList.innerHTML = this.userData.expenses.map(expense => `
            <li>
                <div class="list-item-text">
                    <div class="list-item-main">${expense.category}</div>
                    <div class="list-item-sub">${expense.description}</div>
                </div>
                <span class="list-item-badge" style="background-color: #E3F2FD; color: #1E40AF">$${expense.amount.toFixed(2)}</span>
            </li>
        `).join('');
    }

    renderDuties() {
        const dutiesList = document.getElementById('dutiesList');
        if (!dutiesList) return;

        dutiesList.innerHTML = this.userData.duties.map(duty => `
            <li>
                <div class="list-item-text">
                    <div class="list-item-main">${duty.unit}</div>
                    <div class="list-item-sub">${duty.date} - ${duty.shift}</div>
                </div>
                <span class="list-item-badge" style="background-color: #ECFDF5; color: #047857">${duty.status}</span>
            </li>
        `).join('');
    }
}

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new DashboardSystem();
    dashboard.switchSection('overview');
});
