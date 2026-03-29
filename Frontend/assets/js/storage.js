/* API client + localStorage fallback for Guide Me */
const STORAGE_KEYS = {
    users: 'guide-me-users',
    currentUser: 'guide-me-current-user',
    authToken: 'guide-me-auth-token',
    roadmaps: 'guide-me-roadmaps'
};

const API_BASE_URL = 'http://localhost:5000/api';
const API_TIMEOUT_MS = 7000;

function getAuthToken() {
    try { return localStorage.getItem(STORAGE_KEYS.authToken); }
    catch (e) { return null; }
}

function saveAuthToken(token) {
    try {
        if (token) localStorage.setItem(STORAGE_KEYS.authToken, token);
        else localStorage.removeItem(STORAGE_KEYS.authToken);
    } catch (e) { console.error('saveAuthToken error', e); }
}

function clearAuthToken() {
    try { localStorage.removeItem(STORAGE_KEYS.authToken); }
    catch (e) { console.error('clearAuthToken error', e); }
}

function fetchJson(path, options = {}) {
    return fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    }).then((response) => {
        if (!response.ok) {
            return response.text().then((message) => {
                throw new Error(`API ${path} failed: ${response.status} ${message}`);
            });
        }
        return response.json();
    });
}

async function apiFetchJson(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const token = getAuthToken();
        return await fetchJson(path, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {})
            },
            signal: controller.signal,
            ...options
        });
    } finally {
        clearTimeout(timeout);
    }
}

async function tryApi(fetcher, fallback) {
    try { return await fetcher(); }
    catch (error) {
        console.warn('[Guide Me] API fallback:', error.message);
        return typeof fallback === 'function' ? fallback() : fallback;
    }
}

// Normalize user object: API returns _id, frontend uses id
function normalizeUser(user) {
    if (!user) return null;
    return {
        ...user,
        id: user.id || user._id,
        firstName: user.firstName || user.firstname,
        lastName: user.lastName || user.lastname
    };
}

// Normalize roadmap: API uses _id
function normalizeRoadmap(r) {
    if (!r) return null;
    return { ...r, id: r.id || r._id };
}

async function loadCurrentUser() {
    return await tryApi(async () => {
        const user = await apiFetchJson('/user/profile');
        const normalized = normalizeUser(user);
        if (normalized && normalized.id) saveCurrentUser(normalized);
        return normalized;
    }, getCurrentUser());
}

async function loginUser(credentials) {
    return await tryApi(async () => {
        const data = await apiFetchJson('/user/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        // Normalize user inside response
        if (data && data.user) data.user = normalizeUser(data.user);
        return data;
    }, null);
}

async function registerUser(payload) {
    return await tryApi(async () => {
        const data = await apiFetchJson('/user/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        if (data && data.user) data.user = normalizeUser(data.user);
        return data;
    }, null);
}

async function loadRoadmapsForUser(userId) {
    return await tryApi(async () => {
        const roadmaps = await apiFetchJson('/roadmap/getAll');
        return Array.isArray(roadmaps) ? roadmaps.map(normalizeRoadmap) : [];
    }, () => getRoadmaps(userId));
}

async function loadAllRoadmaps() {
    return await tryApi(async () => {
        const roadmaps = await apiFetchJson('/roadmap/getAll');
        return Array.isArray(roadmaps) ? roadmaps.map(normalizeRoadmap) : [];
    }, []);
}

async function loadRoadmapById(roadmapId) {
    return await tryApi(async () => {
        const r = await apiFetchJson(`/roadmap/get/${roadmapId}`);
        return normalizeRoadmap(r);
    }, () => getRoadmapById(roadmapId));
}

async function saveRoadmapAsync(data) {
    return await tryApi(async () => {
        const r = await apiFetchJson('/roadmap/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return normalizeRoadmap(r);
    }, () => createRoadmap(data));
}

async function updateRoadmapAsync(id, updates) {
    return await tryApi(async () => {
        const r = await apiFetchJson(`/roadmap/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return normalizeRoadmap(r);
    }, () => updateRoadmap(id, updates));
}

async function updateRoadmapStepAsync(roadmapId, chapterId, completed) {
    return await tryApi(async () => {
        const r = await apiFetchJson(`/roadmap/updateChapter/${roadmapId}/${chapterId}`, {
            method: 'PUT',
            body: JSON.stringify({ completed })
        });
        return normalizeRoadmap(r);
    }, () => updateRoadmapStep(roadmapId, chapterId, completed));
}

async function deleteRoadmapAsync(id) {
    return await tryApi(async () => {
        return await apiFetchJson(`/roadmap/delete/${id}`, { method: 'DELETE' });
    }, () => deleteRoadmap(id));
}

async function loadUserStats() {
    return await tryApi(async () => {
        return await apiFetchJson('/stats/userStats');
    }, null);
}

async function loadRoadmapStats(roadmapId) {
    return await tryApi(async () => {
        return await apiFetchJson(`/stats/roadmapStats/${roadmapId}`);
    }, null);
}

async function loadAllRoadmapStats() {
    return await tryApi(async () => {
        return await apiFetchJson('/stats/allRoadmapStats');
    }, null);
}

async function loadGeneralStats() {
    return await tryApi(async () => {
        return await apiFetchJson('/stats/generalStats');
    }, null);
}

async function loadAllUsers() {
    return await tryApi(async () => {
        const users = await apiFetchJson('/user/all');
        return Array.isArray(users) ? users.map(normalizeUser) : [];
    }, []);
}

async function loadAllUsersWithRoadmaps() {
    return await tryApi(async () => {
        const users = await apiFetchJson('/user/allWithRoadmaps');
        return Array.isArray(users) ? users.map(normalizeUser) : [];
    }, []);
}

async function deleteCurrentUser() {
    return await tryApi(async () => {
        return await apiFetchJson('/user/delete', { method: 'DELETE' });
    }, null);
}

async function changeUserPassword(currentPassword, newPassword) {
    return await tryApi(async () => {
        return await apiFetchJson('/user/changePassword', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }, null);
}

async function updateUserProfileAsync(userId, updates) {
    return await tryApi(async () => {
        const user = await apiFetchJson('/user/update', {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return normalizeUser(user);
    }, () => updateUser(userId, updates));
}

async function saveChatMessageAsync(roadmapId, message) {
    // Chat endpoint not implemented on backend, use localStorage
    return saveChatMessage(roadmapId, message);
}

async function loadChatHistoryAsync(roadmapId) {
    return getChatHistory(roadmapId);
}

/* ---- localStorage helpers ---- */

function getStoredData(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function setStoredData(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.error('setStoredData error', e); }
}

function createUser(data) {
    const users = getStoredData(STORAGE_KEYS.users);
    users.push(data);
    setStoredData(STORAGE_KEYS.users, users);
    return data;
}

function getUserByEmail(email) {
    return getStoredData(STORAGE_KEYS.users).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
}

function getUserById(id) {
    return getStoredData(STORAGE_KEYS.users).find((u) => u.id === id);
}

function updateUser(id, updates) {
    const users = getStoredData(STORAGE_KEYS.users).map(
        (u) => (u.id === id ? { ...u, ...updates } : u)
    );
    setStoredData(STORAGE_KEYS.users, users);
    const current = getCurrentUser();
    if (current?.id === id) saveCurrentUser({ ...current, ...updates });
    return getUserById(id);
}

function saveCurrentUser(user) {
    try { localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user)); }
    catch (e) { console.error('saveCurrentUser error', e); }
}

function getCurrentUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    clearAuthToken();
}

function deleteUser(id) {
    setStoredData(
        STORAGE_KEYS.users,
        getStoredData(STORAGE_KEYS.users).filter((u) => u.id !== id)
    );
    setStoredData(
        STORAGE_KEYS.roadmaps,
        getStoredData(STORAGE_KEYS.roadmaps).filter((r) => r.userId !== id)
    );
    logoutUser();
}

function createRoadmap(data) {
    const roadmaps = getStoredData(STORAGE_KEYS.roadmaps);
    roadmaps.push(data);
    setStoredData(STORAGE_KEYS.roadmaps, roadmaps);
    return data;
}

function getRoadmaps(userId) {
    return getStoredData(STORAGE_KEYS.roadmaps).filter((r) => r.userId === userId);
}

function getRoadmapById(id) {
    return getStoredData(STORAGE_KEYS.roadmaps).find((r) => r.id === id);
}

function updateRoadmap(id, updates) {
    const updated = getStoredData(STORAGE_KEYS.roadmaps).map(
        (r) => (r.id === id ? { ...r, ...updates } : r)
    );
    setStoredData(STORAGE_KEYS.roadmaps, updated);
    return getRoadmapById(id);
}

function updateRoadmapStep(roadmapId, stepIndex, completed) {
    const roadmap = getRoadmapById(roadmapId);
    if (!roadmap) return null;
    const steps = roadmap.steps.map((step, index) =>
        index === stepIndex ? { ...step, completed } : step
    );
    const completedSteps = steps
        .filter((step) => step.completed)
        .map((step) => step.step);
    return updateRoadmap(roadmapId, { steps, completedSteps });
}

function deleteRoadmap(id) {
    setStoredData(
        STORAGE_KEYS.roadmaps,
        getStoredData(STORAGE_KEYS.roadmaps).filter((r) => r.id !== id)
    );
}

function saveChatMessage(roadmapId, message) {
    const roadmap = getRoadmapById(roadmapId);
    if (!roadmap) return;
    const history = roadmap.chatHistory || [];
    history.push(message);
    updateRoadmap(roadmapId, { chatHistory: history });
}

function getChatHistory(roadmapId) {
    const roadmap = getRoadmapById(roadmapId);
    return roadmap ? roadmap.chatHistory || [] : [];
}

function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
