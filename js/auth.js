// ===== AUTHENTICATION SYSTEM =====

class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('lifecare_users');
        return users ? JSON.parse(users) : this.getDefaultUsers();
    }

    // Get default demo users
    getDefaultUsers() {
        return [
            {
                id: 'user_001',
                name: 'Sarah Johnson',
                email: 'sarah@lifecare.com',
                password: 'password123', // Demo only!
                role: 'Nursing Student',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_002',
                name: 'John Smith',
                email: 'john@lifecare.com',
                password: 'password123',
                role: 'Student',
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('lifecare_users', JSON.stringify(this.users));
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Register new user
    register(name, email, password, role) {
        // Check if email already exists
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Validate inputs
        if (!name || !email || !password || !role) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            name: name,
            email: email,
            password: password, // In production, hash this!
            role: role,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Registration successful. Please login.', user: newUser };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current user
        this.currentUser = user;
        localStorage.setItem('lifecare_current_user', JSON.stringify(user));

        return { success: true, message: 'Login successful', user: user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('lifecare_current_user');
        window.location.href = 'index.html';
    }

    // Load current user
    loadCurrentUser() {
        const user = localStorage.getItem('lifecare_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user profile
    updateProfile(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.saveUsers();

        // Update current user if it's the same
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            localStorage.setItem('lifecare_current_user', JSON.stringify(this.currentUser));
        }

        return { success: true, message: 'Profile updated', user: this.users[userIndex] };
    }
}

// Initialize auth system
const auth = new AuthSystem();

// ===== LOGIN PAGE HANDLER =====

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLink = document.getElementById('toggleLink');
    const toggleLinkBack = document.getElementById('toggleLinkBack');
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');

    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
        });
    }

    if (toggleLinkBack) {
        toggleLinkBack.addEventListener('click', (e) => {
            e.preventDefault();
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const result = auth.login(email, password);

            if (result.success) {
                showMessage('loginSuccess', result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage('loginError', result.message, 'error');
            }
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const role = document.getElementById('signupRole').value;

            if (password !== confirmPassword) {
                showMessage('signupError', 'Passwords do not match', 'error');
                return;
            }

            const result = auth.register(name, email, password, role);

            if (result.success) {
                showMessage('signupSuccess', result.message, 'success');
                setTimeout(() => {
                    signupContainer.style.display = 'none';
                    loginContainer.style.display = 'block';
                    document.getElementById('loginForm').reset();
                }, 1500);
            } else {
                showMessage('signupError', result.message, 'error');
            }
        });
    }
}

// Show message helper
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000);
    }
}

// Check authentication on page load
function checkAuth() {
    if (!auth.isLoggedIn() && window.location.pathname.includes('dashboard')) {
        window.location.href = 'pages/login.html';
    }
    if (auth.isLoggedIn() && window.location.pathname.includes('login')) {
        window.location.href = '../pages/dashboard.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initLoginPage();
};
