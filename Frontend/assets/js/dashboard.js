/* Dashboard script */
let currentRoadmaps = [];

async function initDashboard() {
    const user = await loadCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    renderSidebar(user);
    await renderMain(user);
    attachDashboardEvents(user);
}

function renderSidebar(user) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    const fn = user.firstName || user.firstname || 'G';
    const ln = user.lastName || user.lastname || 'M';
    const initials = `${fn[0]}${ln[0]}`.toUpperCase();
    const nameEl = sidebar.querySelector('#sidebar-name');
    const emailEl = sidebar.querySelector('#sidebar-email');
    const avatarEl = sidebar.querySelector('#sidebar-avatar');
    if (nameEl) nameEl.textContent = `${fn} ${ln}`;
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) avatarEl.textContent = initials;
}

async function renderMain(user) {
    const greeting = document.querySelector('#greeting-name');
    const fn = user.firstName || user.firstname || 'there';
    if (greeting) greeting.textContent = fn;
    await loadRoadmaps(user.id);
}

async function loadRoadmaps(userId) {
    const roadmaps = await loadRoadmapsForUser(userId);
    currentRoadmaps = roadmaps;
    const listContainer = document.querySelector('#roadmap-list');
    const emptyState = document.querySelector('#empty-state');
    const countBadge = document.querySelector('#roadmap-count');

    if (!listContainer || !emptyState) return;
    if (countBadge) countBadge.textContent = String(roadmaps.length);

    listContainer.innerHTML = '';

    if (roadmaps.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    const grid = document.createElement('div');
    grid.className = 'roadmap-grid';
    roadmaps.forEach((roadmap) => grid.appendChild(createRoadmapCard(roadmap)));
    listContainer.appendChild(grid);
}

function getProgress(roadmap) {
    // Support both API shape (chapters, progress) and localStorage shape (steps, completedSteps)
    if (typeof roadmap.progress === 'number') return roadmap.progress;
    if (roadmap.steps && roadmap.completedSteps) {
        return roadmap.steps.length > 0
            ? (roadmap.completedSteps.length / roadmap.steps.length) * 100
            : 0;
    }
    return 0;
}

function getStepCount(roadmap) {
    if (roadmap.chapters) return roadmap.chapters.length;
    if (roadmap.steps) return roadmap.steps.length;
    return 0;
}

function createRoadmapCard(roadmap) {
    const card = document.createElement('article');
    card.className = 'roadmap-card';
    const progress = Math.round(getProgress(roadmap));
    const stepCount = getStepCount(roadmap);
    const field = roadmap.field || roadmap.domain || '—';
    const level = roadmap.level || '';
    const duration = roadmap.duration || '';
    const createdAt = roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleDateString() : '';

    card.innerHTML = `
    <div class="card-head">
      <div class="domain-badge">🌐 ${field}</div>
      <button class="btn btn-secondary btn-sm" data-action="delete" data-id="${roadmap.id}">🗑️</button>
    </div>
    <div>
      <h3>${roadmap.title || 'Untitled'}</h3>
      <div class="badges">
        <span class="badge-pill">${level}</span>
        <span class="badge-pill">${duration}</span>
      </div>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width: ${progress}%"></div></div>
    <div class="card-meta">
      <span>${stepCount} steps · ${progress}% complete</span>
      <span>${createdAt}</span>
    </div>
    <div class="card-actions">
      <button class="btn btn-secondary" data-action="view" data-id="${roadmap.id}">View Roadmap</button>
      <button class="btn btn-secondary" data-action="chat" data-id="${roadmap.id}">Chat AI</button>
    </div>
  `;
    return card;
}

function attachDashboardEvents(user) {
    document.querySelector('#btn-create-roadmap')?.addEventListener('click', () => {
        window.location.href = 'new-roadmap.html';
    });

    document.querySelector('#btn-generate-first')?.addEventListener('click', () => {
        window.location.href = 'new-roadmap.html';
    });

    document.querySelector('#search-roadmaps')?.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = currentRoadmaps.filter((r) =>
            (r.title || '').toLowerCase().includes(query)
        );
        renderFilteredRoadmaps(filtered);
    });

    document.querySelector('#roadmap-list')?.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const { action, id } = target.dataset;
        if (action === 'view') window.location.href = `roadmap.html?id=${id}`;
        if (action === 'chat') window.location.href = `chat.html?id=${id}`;
        if (action === 'delete') openDeleteModal(id);
    });
}

function renderFilteredRoadmaps(filtered) {
    const listContainer = document.querySelector('#roadmap-list');
    const emptyState = document.querySelector('#empty-state');
    if (!listContainer || !emptyState) return;
    listContainer.innerHTML = '';
    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        const h3 = emptyState.querySelector('h3');
        if (h3) h3.textContent = 'No roadmap matches your search';
        return;
    }
    emptyState.style.display = 'none';
    const grid = document.createElement('div');
    grid.className = 'roadmap-grid';
    filtered.forEach((r) => grid.appendChild(createRoadmapCard(r)));
    listContainer.appendChild(grid);
}

function openDeleteModal(roadmapId) {
    const modal = document.querySelector('#delete-roadmap-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.dataset.currentRoadmap = roadmapId;
}

function closeDeleteModal() {
    const modal = document.querySelector('#delete-roadmap-modal');
    if (!modal) return;
    modal.classList.remove('active');
    delete modal.dataset.currentRoadmap;
}

async function confirmDeleteRoadmap() {
    const modal = document.querySelector('#delete-roadmap-modal');
    const roadmapId = modal?.dataset.currentRoadmap;
    if (!roadmapId) return;
    await deleteRoadmapAsync(roadmapId);
    const user = await loadCurrentUser();
    if (user) await loadRoadmaps(user.id);
    closeDeleteModal();
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard().catch((e) => console.error(e));
        document.querySelector('#confirm-roadmap-delete')?.addEventListener('click', confirmDeleteRoadmap);
        document.querySelector('#cancel-roadmap-delete')?.addEventListener('click', closeDeleteModal);
    }
});
