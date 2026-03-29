/* Chat page script */
const GENERAL_CHAT_CHIPS = [
    'Create a roadmap for Web Dev',
    'Build an AI/ML roadmap',
    'I want a Data Science path',
    'Help me start coding'
];

let generalChatState = null;
let generalChatHistory = [];

async function initChatPage() {
    const user = await loadCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    const roadmapId = new URLSearchParams(window.location.search).get('id');
    const roadmap = roadmapId ? await loadRoadmapById(roadmapId) : null;

    // Support both API shape (user field) and localStorage shape (userId field)
    const ownerId = roadmap?.user || roadmap?.userId;
    if (roadmap && ownerId && ownerId.toString() === user.id.toString()) {
        await initRoadmapChat(roadmap);
        return;
    }

    initGeneralChat(user);
}

async function initRoadmapChat(roadmap) {
    renderChatHeader(roadmap);
    await renderChatHistory(roadmap);
    attachChatEvents(roadmap);
}

function initGeneralChat(user) {
    const titleEl = document.querySelector('#chat-roadmap-title');
    if (titleEl) titleEl.textContent = '💬 Chat with GUIDE ME';
    const subtitle = document.querySelector('.text-muted');
    if (subtitle) subtitle.textContent = 'Ask for a personalized roadmap, then follow the steps at your pace.';

    generalChatState = { userId: user.id, step: 0, profile: { userId: user.id } };
    generalChatHistory = [];
    renderGeneralQuickChips();
    addBotMessage('Bonjour ! Je suis GUIDE ME. Commence par demander : "Create a roadmap for Web Dev" ou sélectionne une suggestion.');
    attachGeneralChatEvents(user);
}

function renderChatHeader(roadmap) {
    const titleEl = document.querySelector('#chat-roadmap-title');
    if (titleEl) titleEl.textContent = roadmap.title || 'Roadmap Chat';
    const quicks = ['What should I start with?', 'How long will step 3 take?', 'Give me more resources', "I'm stuck, help me"];
    const chipsContainer = document.querySelector('#quick-chips');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = quicks.map((label) =>
        `<button class="chip" type="button">${label}</button>`
    ).join('');
}

function renderGeneralQuickChips() {
    const chipsContainer = document.querySelector('#quick-chips');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = GENERAL_CHAT_CHIPS.map((label) =>
        `<button class="chip" type="button">${label}</button>`
    ).join('');
}

async function renderChatHistory(roadmap) {
    const history = await loadChatHistoryAsync(roadmap.id);
    const messages = document.querySelector('#message-list');
    if (!messages) return;
    messages.innerHTML = history.map((msg) => formatMessage(msg)).join('');
    messages.scrollTop = messages.scrollHeight;
}

function attachChatEvents(roadmap) {
    document.querySelector('#chat-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        await handleUserQuestion(roadmap);
    });

    document.querySelector('#quick-chips')?.addEventListener('click', async (event) => {
        const chip = event.target.closest('button');
        if (!chip) return;
        const inputEl = document.querySelector('#chat-input');
        if (inputEl) inputEl.value = chip.textContent.trim();
        await handleUserQuestion(roadmap);
    });

    document.querySelector('#message-list')?.addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-value]');
        if (!button) return;
        const inputEl = document.querySelector('#chat-input');
        if (inputEl) inputEl.value = button.textContent.trim();
        await handleUserQuestion(roadmap);
    });
}

function attachGeneralChatEvents(user) {
    document.querySelector('#chat-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        await handleGeneralUserQuestion(user);
    });

    document.querySelector('#quick-chips')?.addEventListener('click', async (event) => {
        const chip = event.target.closest('button');
        if (!chip) return;
        const inputEl = document.querySelector('#chat-input');
        if (inputEl) inputEl.value = chip.textContent.trim();
        await handleGeneralUserQuestion(user);
    });

    document.querySelector('#message-list')?.addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-value]');
        if (!button) return;
        const inputEl = document.querySelector('#chat-input');
        if (inputEl) inputEl.value = button.textContent.trim();
        await handleGeneralUserQuestion(user);
    });
}

async function handleUserQuestion(roadmap) {
    const input = document.querySelector('#chat-input');
    const question = input?.value.trim();
    if (!question) return;
    const userMessage = { role: 'user', content: question, createdAt: new Date().toISOString() };
    await saveChatMessageAsync(roadmap.id, userMessage);
    addUserMessage(question);
    if (input) input.value = '';
    await showTypingIndicator();

    let answer;
    try {
        if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
            const history = await loadChatHistoryAsync(roadmap.id);
            answer = await askClaudeAboutRoadmap(question, roadmap, history);
        } else {
            answer = generateChatResponse(question, roadmap);
        }
    } catch (error) {
        console.error('AI chat error:', error);
        answer = generateChatResponse(question, roadmap);
    }

    const aiMessage = { role: 'ai', content: answer, createdAt: new Date().toISOString() };
    await saveChatMessageAsync(roadmap.id, aiMessage);
    addBotMessage(answer);
}

// General chat history for context window
let generalChatMessages = [];

async function handleGeneralUserQuestion(user) {
    const input = document.querySelector('#chat-input');
    const question = input?.value.trim();
    if (!question) return;
    addUserMessage(question);
    generalChatMessages.push({ role: 'user', content: question });
    if (input) input.value = '';
    await showTypingIndicator();

    try {
        if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
            // Use Claude AI for general chat
            const answer = await askClaudeGeneral(question, generalChatMessages);
            generalChatMessages.push({ role: 'ai', content: answer });

            // Check if AI has enough info to generate a roadmap
            const lowerAnswer = answer.toLowerCase();
            const lowerQuestion = question.toLowerCase();
            const readyKeywords = ["ready to generate", "let me create", "generating your", "building your roadmap", "create your roadmap"];
            const isReady = readyKeywords.some(k => lowerAnswer.includes(k));

            if (isReady) {
                addBotMessage(answer);
                await showTypingIndicator();
                // Extract profile from conversation
                const profile = extractProfileFromChat(generalChatMessages, user.id);
                addBotMessage('🚀 Generating your personalized roadmap with AI...');
                const roadmapData = await generateRoadmapWithAI(profile).catch(() => createRoadmapFromProfile(profile));
                const saved = await saveRoadmapAsync(roadmapData);
                const id = saved?.id || saved?._id || roadmapData.id;
                addBotMessage(`✅ Ta roadmap est prête ! <a href="roadmap.html?id=${id}" style="color:var(--cyan-primary);font-weight:700;">Voir ma roadmap →</a>`);
            } else {
                addBotMessage(answer);
            }
        } else {
            // Fallback to static responses
            const response = await generateGeneralChatResponse(question, user);
            if (response) {
                addBotMessage(response.text, response.options || []);
                if (response.roadmap) {
                    const saved = await saveRoadmapAsync(response.roadmap);
                    const id = saved?.id || saved?._id || response.roadmap.id;
                    addBotMessage(`✅ Ta roadmap est prête : <a href="roadmap.html?id=${id}" style="color:var(--cyan-primary);">Voir ma roadmap →</a>`);
                }
            }
        }
    } catch (error) {
        console.error('General chat AI error:', error);
        const response = await generateGeneralChatResponse(question, user);
        if (response) addBotMessage(response.text, response.options || []);
    }
}

function extractProfileFromChat(messages, userId) {
    const allText = messages.map(m => m.content).join(' ').toLowerCase();
    const profile = { userId, level: 'beginner', duration: '3 months', goal: 'general-knowledge', hoursPerWeek: '4-7h' };

    if (allText.includes('web')) profile.domain = 'web-dev';
    else if (allText.includes('ai') || allText.includes('machine learning')) profile.domain = 'ai-ml';
    else if (allText.includes('mobile')) profile.domain = 'mobile-dev';
    else if (allText.includes('data science')) profile.domain = 'data-science';
    else if (allText.includes('devops')) profile.domain = 'devops-cloud';
    else if (allText.includes('design') || allText.includes('ux')) profile.domain = 'ui-ux';
    else profile.domain = 'web-dev';

    if (allText.includes('intermediate')) profile.level = 'intermediate';
    else if (allText.includes('advanced') || allText.includes('expert')) profile.level = 'advanced';

    if (allText.includes('1 month')) profile.duration = '1 month';
    else if (allText.includes('6 month')) profile.duration = '6 months';
    else if (allText.includes('1 year')) profile.duration = '1 year';

    if (allText.includes('job') || allText.includes('career')) profile.goal = 'get-job';
    else if (allText.includes('project')) profile.goal = 'personal-project';

    return profile;
}

function formatMessage(message) {
    if (message.role === 'user') {
        return `<div class="message user"><div class="bubble"><p>${message.content}</p></div></div>`;
    }
    return `<div class="message ai"><div class="avatar">🤖</div><div class="bubble"><p>${message.content}</p></div></div>`;
}

function addBotMessage(text, options = []) {
    const messages = document.querySelector('#message-list');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = 'message ai';
    let content = `<div class="avatar">🤖</div><div class="bubble"><p>${text}</p>`;
    if (options.length) {
        content += '<div class="message-actions" style="flex-wrap:wrap;gap:0.75rem;margin-top:1rem;">';
        options.forEach((opt) => {
            content += `<button type="button" class="chip" data-value="${opt.value}">${opt.label}</button>`;
        });
        content += '</div>';
    }
    content += '</div>';
    div.innerHTML = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
    const messages = document.querySelector('#message-list');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `<div class="bubble"><p>${text}</p></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    return new Promise((resolve) => {
        const messages = document.querySelector('#message-list');
        if (!messages) return resolve();
        const typing = document.createElement('div');
        typing.className = 'message ai';
        typing.innerHTML = `<div class="avatar">🤖</div><div class="bubble"><div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => { typing.remove(); resolve(); }, 1200);
    });
}

// Get chapters/steps from roadmap regardless of shape
function getChapters(roadmap) {
    return roadmap.chapters || roadmap.steps || [];
}

function generateChatResponse(question, roadmap) {
    const text = question.toLowerCase();
    const chapters = getChapters(roadmap);

    if (text.includes('start') || text.includes('begin')) {
        const first = chapters[0];
        return first
            ? `Commence par l'étape 1 : ${first.title}. ${first.description || ''}`
            : "Consulte la première étape dans ta roadmap.";
    }

    if (/step\s*(\d+)/.test(text)) {
        const match = question.match(/step\s*(\d+)/);
        const num = Number(match?.[1] || 1);
        const chapter = chapters[num - 1];
        if (chapter) {
            const resources = (chapter.resources || [])
                .map((r) => (typeof r === 'string' ? r : r.name))
                .join(', ');
            return `Étape ${num} : ${chapter.title}. ${chapter.description || ''} ${resources ? `Ressources : ${resources}.` : ''}`;
        }
        return "Je n'ai pas trouvé cette étape. Vérifie le numéro et réessaie.";
    }

    if (text.includes('resource')) {
        const all = chapters.flatMap((c) =>
            (c.resources || []).map((r) => `• ${typeof r === 'string' ? r : r.name}`)
        );
        return `Ressources clés :\n${all.slice(0, 6).join('\n')}`;
    }

    if (text.includes('stuck') || text.includes('help')) {
        const next = chapters.find((c) => c.status !== 'completed');
        return `Pas de panique ! Reprends depuis : ${next?.title || 'la prochaine étape'}. Relis les conseils et avance petit à petit.`;
    }

    if (text.includes('how long')) {
        const durations = chapters.map((c) => `${c.title} — ${c.duration || '?'}`);
        return `Durées estimées :\n${durations.slice(0, 5).join('\n')}`;
    }

    return `Bonne question ! Consulte les étapes de ta roadmap. Tu peux demander "What should I start with?" ou "Give me more resources".`;
}

async function generateGeneralChatResponse(question, user) {
    const text = question.toLowerCase();

    if (generalChatState && generalChatState.step < ROADMAP_QUESTIONS.length &&
        (generalChatState.step > 0 || text.includes('roadmap') || text.includes('plan') || text.includes('path') || text.includes('create') || text.includes('build'))) {

        const currentQuestion = ROADMAP_QUESTIONS[generalChatState.step];
        const answer = normalizeRoadmapAnswer(currentQuestion.id, question);
        generalChatState.profile[currentQuestion.id] = answer;
        generalChatState.step += 1;

        if (generalChatState.step >= ROADMAP_QUESTIONS.length) {
            const roadmapData = createRoadmapFromProfile(generalChatState.profile);
            generalChatState = null;
            return { text: `🚀 Super ! Ta roadmap "${roadmapData.title}" est prête.`, roadmap: roadmapData };
        }

        const nextQuestion = ROADMAP_QUESTIONS[generalChatState.step];
        return { text: nextQuestion.prompt, options: nextQuestion.options };
    }

    const directProfile = parseRoadmapQuery(text);
    if (directProfile.domain && directProfile.level) {
        const roadmapData = createRoadmapFromProfile({ userId: user.id, ...directProfile });
        return {
            text: `✅ J'ai créé un roadmap ${getDomainLabel(roadmapData.domain)} (${getLevelLabel(roadmapData.level)}).`,
            roadmap: roadmapData
        };
    }

    if (text.includes('create') || text.includes('build') || text.includes('roadmap') || text.includes('plan')) {
        generalChatState = { userId: user.id, step: 0, profile: { userId: user.id } };
        const firstQuestion = ROADMAP_QUESTIONS[0];
        return { text: firstQuestion.prompt, options: firstQuestion.options };
    }

    if (text.includes('help') || text.includes('start')) {
        return {
            text: 'Je peux te créer une roadmap personnalisée. Quelle spécialité t'intéresse ?',
            options: ROADMAP_QUESTIONS[0].options
        };
    }

    return { text: 'Essaie : "Create a roadmap for Web Dev" ou "Build a Data Science roadmap".' };
}

function parseRoadmapQuery(text) {
    const profile = {};
    if (text.includes('web')) profile.domain = 'web-dev';
    else if (text.includes('ai') || text.includes('machine')) profile.domain = 'ai-ml';
    else if (text.includes('mobile')) profile.domain = 'mobile-dev';
    else if (text.includes('design') || text.includes('ux')) profile.domain = 'ui-ux';
    else if (text.includes('data')) profile.domain = 'data-science';
    else if (text.includes('devops') || text.includes('cloud')) profile.domain = 'devops-cloud';

    if (text.includes('beginner') || text.includes('start')) profile.level = 'beginner';
    else if (text.includes('intermediate')) profile.level = 'intermediate';
    else if (text.includes('advanced') || text.includes('expert')) profile.level = 'advanced';
    else if (profile.domain) profile.level = 'beginner'; // default

    if (!profile.domain) return profile;
    return {
        ...profile,
        duration: '3 months',
        hoursPerWeek: '4-7h',
        goal: 'get-job',
        title: `${getDomainLabel(profile.domain)} — ${getLevelLabel(profile.level)}`
    };
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('chat.html')) {
        initChatPage().catch((e) => console.error(e));
    }
});
