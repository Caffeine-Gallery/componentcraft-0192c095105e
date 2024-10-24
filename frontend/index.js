import { AuthClient } from "@dfinity/auth-client";
import { backend } from "declarations/backend";

// Handle view switching
document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', () => {
        const view = button.dataset.view;
        const card = button.closest('.component-card');
        
        // Update buttons
        card.querySelectorAll('.view-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update views
        card.querySelectorAll('.component-view').forEach(view => {
            view.classList.remove('active');
        });
        card.querySelector(`.${view}-view`).classList.add('active');
    });
});

// Handle code copying with improved feedback
document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
        const code = button.nextElementSibling.textContent;
        navigator.clipboard.writeText(code);
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
});

// Handle category switching
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        
        // Update active link
        document.querySelectorAll('.category-link').forEach(l => {
            l.classList.remove('active');
        });
        link.classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('.category-section').forEach(section => {
            if (category === 'all' || section.id === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
});

// Handle theme switching
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    themeToggle.classList.toggle('light');
});

// Authentication functions
async function initAuth() {
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
        updateAuthButtons(true);
    } else {
        updateAuthButtons(false);
    }

    return authClient;
}

function updateAuthButtons(isAuthenticated) {
    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(button => {
        if (isAuthenticated) {
            button.textContent = 'Sign Out';
            button.onclick = handleSignOut;
        } else {
            button.textContent = button.innerHTML;
            button.onclick = null;
        }
    });
}

async function handleSignOut() {
    const authClient = await AuthClient.create();
    await authClient.logout();
    await backend.logout();
    updateAuthButtons(false);
}

async function handleGoogleAuth() {
    const authClient = await initAuth();
    await authClient.login({
        identityProvider: "https://accounts.google.com",
        onSuccess: async () => {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal().toString();
            await backend.registerUser(principal, "user@example.com");
            updateAuthButtons(true);
        },
    });
}

async function handleGitHubAuth() {
    const authClient = await initAuth();
    await authClient.login({
        identityProvider: "https://github.com/login/oauth/authorize",
        onSuccess: async () => {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal().toString();
            await backend.registerUser(principal, "user@example.com");
            updateAuthButtons(true);
        },
    });
}

async function handleInternetIdentityAuth() {
    const authClient = await initAuth();
    await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal().toString();
            await backend.registerUser(principal, "user@example.com");
            updateAuthButtons(true);
        },
    });
}

// Initialize authentication
initAuth();

// Add event listeners for auth buttons
document.getElementById('googleAuthButton').addEventListener('click', handleGoogleAuth);
document.getElementById('githubAuthButton').addEventListener('click', handleGitHubAuth);
document.getElementById('iiAuthButton').addEventListener('click', handleInternetIdentityAuth);

// Trigger Prism.js highlighting
Prism.highlightAll();
