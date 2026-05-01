// ===== NAVBAR HANDLER =====

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

function updateNavbar() {
    const loginBtn = document.querySelector('.btn-login');
    const navMenu = document.querySelector('.nav-menu');

    // Check if user is logged in
    if (auth && auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        
        // Replace login button with logout
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                auth.logout();
            };
        }

        // Add dashboard link if not already there
        const dashboardLink = navMenu?.querySelector('[href*="dashboard"]');
        if (!dashboardLink) {
            const dashboardItem = document.createElement('li');
            dashboardItem.className = 'nav-item';
            dashboardItem.innerHTML = '<a href="pages/dashboard.html" class="nav-link">Dashboard</a>';
            navMenu?.insertBefore(dashboardItem, navMenu.lastElementChild);
        }
    } else {
        // User is not logged in
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.href = 'pages/login.html';
        }

        // Remove dashboard link
        const dashboardLink = navMenu?.querySelector('[href*="dashboard"]');
        if (dashboardLink) {
            dashboardLink.parentElement.remove();
        }
    }
}

// Update navbar when returning to page
window.addEventListener('focus', updateNavbar);
