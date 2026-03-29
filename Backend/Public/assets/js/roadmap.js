/* Roadmap detail page */
async function initRoadmapPage() {
    const user = await loadCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    const roadmapId = new URLSearchParams(window.location.search).get('id');
    let roadmap = roadmapId ? await loadRoadmapById(roadmapId) : null;

    // Support both API shape (user field) and localStorage shape (userId field)
    const ownerId = roadmap?.user || roadmap?.userId;
    const currentId = user.id;
    if (!roadmap || (ownerId && ownerId.toString() !== currentId.toString())) {
        window.location.href = 'dashboard.html';
        return;
    }

    renderRoadmap(roadmap);
    attachRoadmapEvents(roadmap);
}

function getChapters(roadmap) {
    return roadmap.chapters || roadmap.steps || [];
}

function renderRoadmap(roadmap) {
    const titleEl = document.querySelector('#roadmap-title');
    const metaEl = document.querySelector('#roadmap-meta');
    const dateEl = document.querySelector('#roadmap-date');
    const domainEl = document.querySelector('#roadmap-domain');
    const stepsContainer = document.querySelector('#steps-container');
    const summaryContainer = document.querySelector('#kpi-summary');

    if (titleEl) titleEl.textContent = roadmap.title || 'Untitled';
    if (metaEl) metaEl.textContent = `${roadmap.level || ''} · ${roadmap.duration || ''}`;
    if (dateEl) dateEl.textContent = roadmap.createdAt
        ? `Created ${new Date(roadmap.createdAt).toLocaleDateString()}` : '';
    if (domainEl) domainEl.textContent = roadmap.field || roadmap.domain || '—';

    if (!stepsContainer || !summaryContainer) return;
    stepsContainer.innerHTML = '';

    const chapters = getChapters(roadmap);

    chapters.forEach((chapter, index) => {
        const isCompleted = chapter.status === 'completed' ||
            (roadmap.completedSteps || []).includes(chapter.step || index);
        stepsContainer.appendChild(createChapterCard(chapter, index, isCompleted, roadmap));
    });

    const completed = chapters.filter(
        (c) => c.status === 'completed'
    ).length;
    const total = chapters.length;
    const totalResources = chapters.reduce((count, c) => {
        return count + (c.resources ? c.resources.length : 0);
    }, 0);

    summaryContainer.innerHTML = `
    <div class="kpi-card"><span>📌 Steps Total</span><strong>${total}</strong></div>
    <div class="kpi-card"><span>⏱️ Duration</span><strong>${roadmap.duration || '—'}</strong></div>
    <div class="kpi-card"><span>📚 Resources</span><strong>${totalResources}</strong></div>
    <div class="kpi-card"><span>✅ Completed</span><strong>${completed}/${total}</strong></div>
  `;
}

function createChapterCard(chapter, index, completed, roadmap) {
    const item = document.createElement('article');
    item.className = 'step-item';
    if (completed) item.classList.add('completed');

    // Support both API chapters and localStorage steps
    const title = chapter.title || chapter.name || `Step ${index + 1}`;
    const description = chapter.description || '';
    const duration = chapter.duration || '';
    const advice = chapter.advice || '';
    const chapterId = chapter._id || chapter.id || index;

    // Resources can be strings (API) or objects (localStorage)
    const resourcesHtml = (chapter.resources || []).map((r) => {
        if (typeof r === 'string') return `<li><a href="${r}" target="_blank" rel="noopener">${r}</a></li>`;
        return `<li>${r.name} ${r.free ? '(free)' : '(paid)'}</li>`;
    }).join('');

    const todosHtml = (chapter.todos || []).map((t) => `<li>${t}</li>`).join('');

    item.innerHTML = `
    <div class="step-head">
      <div>
        <h4>STEP ${index + 1} · ${title}</h4>
        <span class="step-label">${duration}</span>
      </div>
      <button class="complete-btn" data-index="${index}" data-chapter-id="${chapterId}">
        ${completed ? '✓ Completed' : 'Mark Complete'}
      </button>
    </div>
    <div class="step-details">
      <p>${description}</p>
      ${advice ? `<div><strong>Advice:</strong><p>${advice}</p></div>` : ''}
      ${resourcesHtml ? `<div><strong>Resources:</strong><ul>${resourcesHtml}</ul></div>` : ''}
      ${todosHtml ? `<div><strong>What to Do:</strong><ul>${todosHtml}</ul></div>` : ''}
    </div>
  `;
    return item;
}

function attachRoadmapEvents(roadmap) {
    document.querySelector('#back-button')?.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    document.querySelector('#chat-about-button')?.addEventListener('click', () => {
        window.location.href = `chat.html?id=${roadmap.id}`;
    });

    document.querySelector('#delete-roadmap-button')?.addEventListener('click', async () => {
        if (confirm('Supprimer cette roadmap ? Cette action est irréversible.')) {
            await deleteRoadmapAsync(roadmap.id);
            window.location.href = 'dashboard.html';
        }
    });

    document.querySelector('#share-roadmap-button')?.addEventListener('click', async () => {
        const shareText = `${roadmap.title} — ${roadmap.field || roadmap.domain || ''} (${roadmap.duration || ''})`;
        try {
            await navigator.clipboard.writeText(shareText);
            alert('Roadmap copied to clipboard!');
        } catch (e) {
            alert('Impossible de copier le lien.');
        }
    });

    document.querySelector('#steps-container')?.addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-index]');
        if (!button) return;
        const index = Number(button.dataset.index);
        const chapterId = button.dataset.chapterId;
        const chapters = getChapters(roadmap);
        const chapter = chapters[index];
        const isCompleted = chapter.status === 'completed';

        await updateRoadmapStepAsync(roadmap.id, chapterId, !isCompleted);
        const updated = await loadRoadmapById(roadmap.id);
        if (updated) {
            renderRoadmap(updated);
            roadmap = updated;
            attachRoadmapEvents(roadmap);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('roadmap.html')) {
        initRoadmapPage().catch((e) => console.error(e));
    }
});
