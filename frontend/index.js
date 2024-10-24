import { AuthClient } from "@dfinity/auth-client";

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
    updateAuthButtons(false);
}

async function handleIIAuthentication() {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
    } else {
        await authClient.login({
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: () => {
                handleAuthenticated(authClient);
            },
        });
    }
}

function handleAuthenticated(authClient) {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    console.log(`Authenticated with principal: ${principal}`);
    updateAuthButtons(true);
}

// Canister interaction (placeholder)
function callCanister() {
    console.log("Canister interaction is not available in this demo.");
    document.getElementById('canisterResult').textContent = "Canister interaction is not available in this demo.";
}

// Event listeners
document.getElementById('iiAuthButton').addEventListener('click', handleIIAuthentication);
document.getElementById('callCanisterButton').addEventListener('click', callCanister);

// Initialize authentication
initAuth();

// Trigger Prism.js highlighting
Prism.highlightAll();
