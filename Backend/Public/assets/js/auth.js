/* Gestion de l'authentification et de la protection des pages */
const isAppPage = window.location.pathname.includes('/app/');

function protectAppPages() {
    const user = getCurrentUser();
    if (!user && isAppPage) {
        window.location.href = '../login.html';
        return false;
    }
    if (user && (window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/register.html'))) {
        window.location.href = 'app/dashboard.html';
        return false;
    }
    return true;
}

function handleLogout() {
    logoutUser();
    window.location.href = '../login.html';
}

function getFormField(id) {
    return document.getElementById(id);
}

function showFieldError(input, message) {
    if (!input) return;
    const feedback = input.closest('.form-group')?.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
    input.classList.add('input-error');
}

function clearFieldError(input) {
    if (!input) return;
    const feedback = input.closest('.form-group')?.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.style.display = 'none';
    }
    input.classList.remove('input-error');
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initAuthPages() {
    if (!protectAppPages()) return;

    const formLogin = document.querySelector('#login-form');
    const formRegister = document.querySelector('#register-form');

    if (formLogin) {
        formLogin.addEventListener('submit', (event) => {
            event.preventDefault();
            handleLogin();
        });

        const toggle = document.querySelector('#toggle-password');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const password = getFormField('login-password');
                if (password.type === 'password') {
                    password.type = 'text';
                    toggle.textContent = 'Hide';
                } else {
                    password.type = 'password';
                    toggle.textContent = 'Show';
                }
            });
        }
    }

    if (formRegister) {
        const roleCards = document.querySelectorAll('.role-card');
        roleCards.forEach((card) => {
            card.addEventListener('click', () => {
                roleCards.forEach((item) => item.classList.remove('active'));
                card.classList.add('active');
                document.querySelectorAll('[name="role"]').forEach((input) => {
                    input.checked = input.value === card.dataset.role;
                });
            });
        });

        const pwdInput = getFormField('register-password');
        const strengthBar = document.querySelectorAll('.strength-segment');
        pwdInput?.addEventListener('input', () => {
            const length = pwdInput.value.length;
            let level = 0;
            if (length >= 8) level = 4;
            else if (length >= 6) level = 3;
            else if (length >= 4) level = 2;
            else if (length > 0) level = 1;
            strengthBar.forEach((segment, index) => {
                segment.classList.toggle('active', index < level);
            });
        });

        formRegister.addEventListener('submit', (event) => {
            event.preventDefault();
            handleRegister();
        });
    }

    const logoutBtn = document.querySelector('#btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const deleteAccountBtn = document.querySelector('#btn-delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', openDeleteAccountModal);
    }

    const confirmDeleteBtn = document.querySelector('#confirm-delete-account');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleAccountDeletion);
    }

    initSettingsPage();
}

function initSettingsPage() {
    if (!window.location.pathname.endsWith('/settings.html')) return;
    const user = getCurrentUser();
    if (!user) return;
    getFormField('settings-first-name').value = user.firstName || '';
    getFormField('settings-last-name').value = user.lastName || '';
    getFormField('settings-bio').value = user.bio || '';
    document.querySelector('#btn-save-profile')?.addEventListener('click', handleSaveProfile);
}

async function handleSaveProfile() {
    const user = getCurrentUser();
    if (!user) return;
    const firstName = getFormField('settings-first-name')?.value.trim();
    const lastName = getFormField('settings-last-name')?.value.trim();
    const bio = getFormField('settings-bio')?.value.trim();
    const updated = await updateUserProfileAsync(user.id, { firstName, lastName, bio });
    if (updated) {
        saveCurrentUser(updated);
        alert('Profile saved successfully.');
    } else {
        alert('Impossible de sauvegarder le profil.');
    }
}

async function handleLogin() {
    const email = getFormField('login-email')?.value.trim();
    const password = getFormField('login-password')?.value.trim();

    clearFieldError(getFormField('login-email'));
    clearFieldError(getFormField('login-password'));

    let valid = true;
    if (!email || !validateEmail(email)) {
        showFieldError(getFormField('login-email'), 'Entrez un email valide.');
        valid = false;
    }

    if (!password) {
        showFieldError(getFormField('login-password'), 'Le mot de passe ne peut pas être vide.');
        valid = false;
    }

    if (!valid) return;

    const authResponse = await loginUser({ email, password });

    let finalUser = null;
    let finalToken = null;

    if (authResponse) {
        // API responded — normalize _id to id
        finalToken = authResponse.token || authResponse.accessToken || null;
        const rawUser = authResponse.user || authResponse;
        const userId = rawUser.id || rawUser._id;
        if (userId) {
            finalUser = {
                id: String(userId),
                firstName: rawUser.firstName || rawUser.firstname || '',
                lastName: rawUser.lastName || rawUser.lastname || '',
                email: rawUser.email || email,
                createdAt: rawUser.createdAt || ''
            };
        }
    }

    if (!finalUser) {
        // API unavailable — try localStorage fallback
        const localUser = getUserByEmail(email);
        if (localUser && localUser.password === password) {
            finalUser = localUser;
        } else {
            showFieldError(getFormField('login-password'), 'Email ou mot de passe incorrect.');
            return;
        }
    }

    saveCurrentUser(finalUser);
    if (finalToken) saveAuthToken(finalToken);
    window.location.href = 'app/dashboard.html';
}

async function handleRegister() {
    const firstName = getFormField('first-name')?.value.trim();
    const lastName = getFormField('last-name')?.value.trim();
    const email = getFormField('register-email')?.value.trim();
    const password = getFormField('register-password')?.value.trim();
    const terms = getFormField('terms-checkbox')?.checked;
    const role = 'user';

    const fields = [
        { id: 'first-name', value: firstName, message: 'Prénom requis.' },
        { id: 'last-name', value: lastName, message: 'Nom requis.' },
        { id: 'register-email', value: email, message: 'Email requis.' },
        { id: 'register-password', value: password, message: 'Mot de passe requis.' }
    ];

    let valid = true;
    fields.forEach((field) => {
        clearFieldError(getFormField(field.id));
        if (!field.value) {
            showFieldError(getFormField(field.id), field.message);
            valid = false;
        }
    });

    if (email && !validateEmail(email)) {
        showFieldError(getFormField('register-email'), 'Email invalide.');
        valid = false;
    }

    if (password && password.length < 8) {
        showFieldError(getFormField('register-password'), 'Le mot de passe doit contenir au moins 8 caractères.');
        valid = false;
    }

    if (!terms) {
        showFieldError(getFormField('terms-checkbox'), 'Vous devez accepter les CGU.');
        valid = false;
    }

    if (!valid) return;

    const registerResponse = await registerUser({
        firstname: firstName,
        lastname: lastName,
        email,
        password
    });

    let finalUser = null;
    let finalToken = null;

    if (registerResponse) {
        // API responded — normalize _id to id
        finalToken = registerResponse.token || registerResponse.accessToken || null;
        const rawUser = registerResponse.user || registerResponse;
        const userId = rawUser.id || rawUser._id;
        if (userId) {
            finalUser = {
                id: String(userId),
                firstName: rawUser.firstName || rawUser.firstname || firstName,
                lastName: rawUser.lastName || rawUser.lastname || lastName,
                email: rawUser.email || email,
                role,
                createdAt: rawUser.createdAt || new Date().toISOString().split('T')[0]
            };
        }
    }

    if (!finalUser) {
        // API unavailable — fallback to localStorage
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            showFieldError(getFormField('register-email'), 'Un compte avec cet email existe déjà.');
            return;
        }
        finalUser = {
            id: generateUuid(),
            firstName,
            lastName,
            email,
            password,
            role,
            createdAt: new Date().toISOString().split('T')[0]
        };
        createUser(finalUser);
    }

    saveCurrentUser(finalUser);
    if (finalToken) saveAuthToken(finalToken);
    window.location.href = 'app/dashboard.html';
}

function openDeleteAccountModal() {
    const modal = document.querySelector('#delete-account-modal');
    modal?.classList.add('active');
}

function handleAccountDeletion() {
    const confirmation = getFormField('confirm-delete-text')?.value.trim();
    const user = getCurrentUser();
    if (!user) return;
    if (confirmation !== 'DELETE') {
        alert('Tapez DELETE pour confirmer la suppression du compte.');
        return;
    }
    deleteUser(user.id);
    window.location.href = '../login.html';
}

window.addEventListener('DOMContentLoaded', initAuthPages);
