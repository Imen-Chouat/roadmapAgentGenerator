/* Génération des roadmaps mock selon domaine et niveau */
const ROADMAP_TEMPLATES = {
    'web-dev': {
        beginner: {
            title: 'Web Development — Beginner',
            duration: '3 months',
            totalSteps: 12,
            steps: [
                {
                    step: 1,
                    title: 'HTML Fundamentals',
                    duration: '1 week',
                    description: 'Apprenez les bases du HTML : structure, balises, formulaires et sémantique.',
                    advice: 'Construisez une page de portfolio simple pour appliquer chaque nouvelle balise.',
                    resources: [
                        { name: 'freeCodeCamp HTML', url: '#', free: true },
                        { name: 'MDN HTML Basics', url: '#', free: true },
                        { name: 'HTML5 Rocks Guide', url: '#', free: false }
                    ],
                    todos: [
                        'Étudier les balises structurelles',
                        'Créer une page avec header et footer',
                        'Ajouter un formulaire de contact',
                        'Valider la page avec la console navigateur'
                    ],
                    completed: false
                },
                {
                    step: 2,
                    title: 'CSS Fundamentals',
                    duration: '1 week',
                    description: 'Maîtrisez les sélecteurs CSS, les couleurs, les polices et la mise en page de base.',
                    advice: 'Expérimentez avec des thèmes clairs et sombres pour votre premier site.',
                    resources: [
                        { name: 'freeCodeCamp CSS', url: '#', free: true },
                        { name: 'CSS Tricks', url: '#', free: true },
                        { name: 'Udemy CSS Course', url: '#', free: false }
                    ],
                    todos: [
                        'Créer des styles pour boutons et titres',
                        'Utiliser margin et padding efficacement',
                        'Appliquer une palette de couleurs cohérente',
                        'Tester sur mobile avec l’inspecteur'
                    ],
                    completed: false
                },
                {
                    step: 3,
                    title: 'CSS Flexbox & Grid',
                    duration: '3 days',
                    description: 'Apprenez Flexbox et Grid pour des mises en page modernes et responsives.',
                    advice: 'Reproduisez une section de site existante pour comprendre les alignements.',
                    resources: [
                        { name: 'CSS-Tricks Flexbox', url: '#', free: true },
                        { name: 'MDN Grid', url: '#', free: true },
                        { name: 'Frontend Mentor', url: '#', free: false }
                    ],
                    todos: [
                        'Créer une grille de cartes responsive',
                        'Positionner un header et un footer',
                        'Utiliser gap plutôt que margins',
                        'Tester sur plusieurs tailles d’écran'
                    ],
                    completed: false
                },
                {
                    step: 4,
                    title: 'JavaScript Basics',
                    duration: '2 weeks',
                    description: 'Découvrez les variables, fonctions, tableaux, objets et logique conditionnelle.',
                    advice: 'Codez un petit jeu ou un convertisseur pour pratiquer les bases.',
                    resources: [
                        { name: 'JavaScript.info', url: '#', free: true },
                        { name: 'MDN JS Guide', url: '#', free: true },
                        { name: 'Codecademy JS', url: '#', free: false }
                    ],
                    todos: [
                        'Écrire des fonctions réutilisables',
                        'Manipuler des tableaux et objets',
                        'Utiliser les boucles et conditions',
                        'Déboguer dans la console'
                    ],
                    completed: false
                },
                {
                    step: 5,
                    title: 'DOM Manipulation',
                    duration: '1 week',
                    description: 'Interagissez avec la page et mettez à jour le contenu dynamiquement.',
                    advice: 'Créez un formulaire interactif avec validation en JavaScript.',
                    resources: [
                        { name: 'MDN DOM', url: '#', free: true },
                        { name: 'YouTube DOM Tutorial', url: '#', free: true },
                        { name: 'Scrimba DOM Course', url: '#', free: false }
                    ],
                    todos: [
                        'Sélectionner et modifier les éléments DOM',
                        'Écouter des événements utilisateur',
                        'Ajouter et supprimer des classes CSS',
                        'Créer un menu interactif'
                    ],
                    completed: false
                },
                {
                    step: 6,
                    title: 'Git & GitHub',
                    duration: '3 days',
                    description: 'Apprenez à versionner votre code et partager vos projets sur GitHub.',
                    advice: 'Publiez chaque projet sur GitHub pour bâtir un portfolio visible.',
                    resources: [
                        { name: 'GitHub Learning Lab', url: '#', free: true },
                        { name: 'Atlassian Git', url: '#', free: true },
                        { name: 'Udemy Git', url: '#', free: false }
                    ],
                    todos: [
                        'Init un dépôt local',
                        'Créer un README',
                        'Push vers GitHub',
                        'Utiliser branches simples'
                    ],
                    completed: false
                },
                {
                    step: 7,
                    title: 'Responsive Design',
                    duration: '3 days',
                    description: 'Adaptez votre site à toutes les résolutions avec media queries et layout fluide.',
                    advice: 'Testez sur mobile, tablette et bureau pour garantir une expérience uniforme.',
                    resources: [
                        { name: 'Google Responsive Design', url: '#', free: true },
                        { name: 'MDN Media Queries', url: '#', free: true },
                        { name: 'Pluralsight Responsive', url: '#', free: false }
                    ],
                    todos: [
                        'Construire un menu mobile',
                        'Rendre les images responsives',
                        'Tester les breakpoints',
                        'Optimiser les sections pour petits écrans'
                    ],
                    completed: false
                },
                {
                    step: 8,
                    title: 'JavaScript ES6+',
                    duration: '1 week',
                    description: 'Maîtrisez les fonctions fléchées, classes, modules, destructuring et async/await.',
                    advice: 'Réécrivez un ancien script en ES6 pour voir la différence de lisibilité.',
                    resources: [
                        { name: 'Babel ES6 Guide', url: '#', free: true },
                        { name: 'MDN ES6 Features', url: '#', free: true },
                        { name: 'Egghead ES6', url: '#', free: false }
                    ],
                    todos: [
                        'Utiliser let/const',
                        'Créer des classes simples',
                        'Manipuler des promesses',
                        'Importer et exporter des modules'
                    ],
                    completed: false
                },
                {
                    step: 9,
                    title: 'Fetch API & JSON',
                    duration: '3 days',
                    description: 'Récupérez des données externes et affichez-les dans votre interface.',
                    advice: 'Consommez une API publique pour créer une galerie dynamique.',
                    resources: [
                        { name: 'MDN Fetch', url: '#', free: true },
                        { name: 'JSONPlaceholder', url: '#', free: true },
                        { name: 'Scrimba API', url: '#', free: false }
                    ],
                    todos: [
                        'Requêter une API REST',
                        'JSON.parse / JSON.stringify',
                        'Afficher des cartes dynamiquement',
                        'Gérer les erreurs réseau'
                    ],
                    completed: false
                },
                {
                    step: 10,
                    title: 'First Portfolio Project',
                    duration: '1 week',
                    description: 'Construisez un portfolio moderne combinant HTML, CSS et JavaScript.',
                    advice: 'Ajoutez une section projets et un formulaire fonctionnel.',
                    resources: [
                        { name: 'Frontend Mentor', url: '#', free: false },
                        { name: 'Dribbble UI Ideas', url: '#', free: true },
                        { name: 'CodePen Inspiration', url: '#', free: true }
                    ],
                    todos: [
                        'Créer un projet personnel',
                        'Publier sur GitHub Pages',
                        'Tester le design sur mobile',
                        'Mettre en avant vos compétences'
                    ],
                    completed: false
                },
                {
                    step: 11,
                    title: 'React Fundamentals',
                    duration: '2 weeks',
                    description: 'Explorez les composants, props, state et JSX pour créer des UIs modernes.',
                    advice: 'Construisez une application simple de tâches pour comprendre le flux React.',
                    resources: [
                        { name: 'React Docs', url: '#', free: true },
                        { name: 'Scrimba React', url: '#', free: false },
                        { name: 'Codecademy React', url: '#', free: false }
                    ],
                    todos: [
                        'Créer des composants réutilisables',
                        'Gérer l’état local',
                        'Utiliser les props',
                        'Faire un mini projet React'
                    ],
                    completed: false
                },
                {
                    step: 12,
                    title: 'Deploy & Job Search',
                    duration: '1 week',
                    description: 'Déployez votre site, optimisez votre profil et commencez à postuler.',
                    advice: 'Ajoutez votre portfolio au CV et préparez une liste de projets clés.',
                    resources: [
                        { name: 'Netlify Deploy', url: '#', free: true },
                        { name: 'GitHub Pages', url: '#', free: true },
                        { name: 'LinkedIn Tips', url: '#', free: false }
                    ],
                    todos: [
                        'Déployer sur Netlify ou GitHub Pages',
                        'Préparer un CV orienté projets',
                        'Créer une page contact professionnelle',
                        'Rechercher des opportunités juniors'
                    ],
                    completed: false
                }
            ]
        },
        intermediate: {
            title: 'Web Development — Intermediate',
            duration: '6 months',
            totalSteps: 10,
            steps: [
                {
                    step: 1,
                    title: 'Advanced JavaScript',
                    duration: '2 weeks',
                    description: 'Approfondissez les closures, prototypes, modules et patterns modernes.',
                    advice: 'Construisez un utilitaire JavaScript réutilisable pour pratiquer.',
                    resources: [
                        { name: 'MDN Advanced JS', url: '#', free: true },
                        { name: 'YouTube JS Deep Dive', url: '#', free: true },
                        { name: 'Frontend Masters', url: '#', free: false }
                    ],
                    todos: [
                        'Étudier les concepts de scope',
                        'Utiliser les modules ES',
                        'Créer des fonctions asynchrones',
                        'Appliquer des patterns de conception'
                    ],
                    completed: false
                },
                {
                    step: 2,
                    title: 'Modern Frontend Toolchain',
                    duration: '1 week',
                    description: 'Maîtrisez les bundlers, preprocessors et workflow de développement.',
                    advice: 'Configurez un projet avec Vite ou Webpack pour comprendre le build.',
                    resources: [
                        { name: 'Vite Docs', url: '#', free: true },
                        { name: 'Webpack Guide', url: '#', free: true },
                        { name: 'SvelteKit Tutorial', url: '#', free: false }
                    ],
                    todos: [
                        'Installer un projet moderne',
                        'Utiliser Sass ou PostCSS',
                        'Configurer un live reloading',
                        'Optimiser les assets'
                    ],
                    completed: false
                },
                {
                    step: 3,
                    title: 'React & State Management',
                    duration: '3 weeks',
                    description: 'Approfondissez React, hooks, contexts et gestion d’état globale.',
                    advice: 'Créez un projet avec une logique de filtrage et de tri pour apprendre le state.',
                    resources: [
                        { name: 'React Hooks', url: '#', free: true },
                        { name: 'Redux Guide', url: '#', free: true },
                        { name: 'Kent C. Dodds', url: '#', free: false }
                    ],
                    todos: [
                        'Utiliser useEffect et useMemo',
                        'Gérer l’état avec Context',
                        'Intégrer une API externe',
                        'Créer un tableau de bord interactif'
                    ],
                    completed: false
                },
                {
                    step: 4,
                    title: 'API & Backend Basics',
                    duration: '2 weeks',
                    description: 'Construisez une API REST simple pour alimenter votre application frontend.',
                    advice: 'Apprenez les routes, contrôleurs et appels fetch avec une API locale.',
                    resources: [
                        { name: 'Node.js Express', url: '#', free: true },
                        { name: 'REST API Guide', url: '#', free: true },
                        { name: 'Udemy Node API', url: '#', free: false }
                    ],
                    todos: [
                        'Créer un serveur local',
                        'Gérer les routes et données',
                        'Consommer l’API en frontend',
                        'Tester les réponses JSON'
                    ],
                    completed: false
                },
                {
                    step: 5,
                    title: 'Performance et Accessibilité',
                    duration: '1 week',
                    description: 'Optimisez le chargement, l’accessibilité et le SEO technique.',
                    advice: 'Auditez une page avec Lighthouse et corrigez les points clés.',
                    resources: [
                        { name: 'Google Lighthouse', url: '#', free: true },
                        { name: 'WebAIM', url: '#', free: true },
                        { name: 'A11y Project', url: '#', free: false }
                    ],
                    todos: [
                        'Optimiser images et scripts',
                        'Améliorer l’accessibilité des formulaires',
                        'Ajouter des attributs ARIA',
                        'Réduire le temps de chargement'
                    ],
                    completed: false
                },
                {
                    step: 6,
                    title: 'Design Systems',
                    duration: '1 week',
                    description: 'Créez une bibliothèque de composants et une grille cohérente pour votre interface.',
                    advice: 'Définissez des variables de style et réutilisez-les dans plusieurs pages.',
                    resources: [
                        { name: 'Design Systems Handbook', url: '#', free: true },
                        { name: 'Figma Basics', url: '#', free: true },
                        { name: 'UXPin', url: '#', free: false }
                    ],
                    todos: [
                        'Définir couleurs et typographie',
                        'Créer un système de boutons',
                        'Utiliser des cartes modulaires',
                        'Documenter votre style guide'
                    ],
                    completed: false
                },
                {
                    step: 7,
                    title: 'Testing UI & Logic',
                    duration: '1 week',
                    description: 'Apprenez le test unitaire et fonctionnel sur vos composants web.',
                    advice: 'Écrivez des scénarios de test pour vos principaux composants.',
                    resources: [
                        { name: 'Jest Basics', url: '#', free: true },
                        { name: 'Testing Library', url: '#', free: true },
                        { name: 'Cypress Guide', url: '#', free: false }
                    ],
                    todos: [
                        'Tester les fonctions critiques',
                        'Valider les interactions utilisateur',
                        'Exécuter un test de bout en bout',
                        'Analyser les résultats'
                    ],
                    completed: false
                },
                {
                    step: 8,
                    title: 'Progressive Web App',
                    duration: '1 week',
                    description: 'Transformez un site en application installable avec cache et service workers.',
                    advice: 'Ajoutez un service worker simple et un manifeste web.',
                    resources: [
                        { name: 'PWA Guide', url: '#', free: true },
                        { name: 'Google PWA', url: '#', free: true },
                        { name: 'Academind PWA', url: '#', free: false }
                    ],
                    todos: [
                        'Ajouter un manifeste',
                        'Mettre en cache des ressources',
                        'Tester le mode hors-ligne',
                        'Permettre l’installation'
                    ],
                    completed: false
                },
                {
                    step: 9,
                    title: 'GraphQL Basics',
                    duration: '1 week',
                    description: 'Découvrez GraphQL et comparez-le aux API REST pour des requêtes plus souples.',
                    advice: 'Créez une simple API GraphQL et consommez-la depuis le frontend.',
                    resources: [
                        { name: 'GraphQL.org', url: '#', free: true },
                        { name: 'Apollo Docs', url: '#', free: true },
                        { name: 'Udemy GraphQL', url: '#', free: false }
                    ],
                    todos: [
                        'Définir un schéma simple',
                        'Tester des requêtes',
                        'Écrire une mutation',
                        'Intégrer dans une interface'
                    ],
                    completed: false
                },
                {
                    step: 10,
                    title: 'Portfolio avancé & carrière',
                    duration: '2 weeks',
                    description: 'Finalisez un portfolio technique et préparez votre candidature UX compétitive.',
                    advice: 'Ajoutez une étude de cas détaillée et un lien vers GitHub.',
                    resources: [
                        { name: 'Career Guide', url: '#', free: true },
                        { name: 'LinkedIn Tips', url: '#', free: true },
                        { name: 'Interview Prep', url: '#', free: false }
                    ],
                    todos: [
                        'Créer une page de projet complet',
                        'Ajouter un blog ou étude de cas',
                        'Rédiger une introduction claire',
                        'Préparer une liste de questions techniques'
                    ],
                    completed: false
                }
            ]
        }
    },
    'ai-ml': {
        beginner: {
            title: 'AI / Machine Learning — Beginner',
            duration: '4 months',
            totalSteps: 10,
            steps: [
                {
                    step: 1,
                    title: 'Python Basics',
                    duration: '2 weeks',
                    description: 'Apprenez Python : variables, structures, fonctions et scripts simples.',
                    advice: 'Écrivez de petits programmes pour automatiser des tâches quotidiennes.',
                    resources: [
                        { name: 'Python.org', url: '#', free: true },
                        { name: 'Real Python', url: '#', free: true },
                        { name: 'Coursera Python', url: '#', free: false }
                    ],
                    todos: [
                        'Installer Python',
                        'Tester des boucles et conditions',
                        'Écrire des fonctions',
                        'Explorer les listes et dictionnaires'
                    ],
                    completed: false
                },
                {
                    step: 2,
                    title: 'Math for ML',
                    duration: '2 weeks',
                    description: 'Révisez les bases de l’algèbre linéaire, statistiques et probabilités pour ML.',
                    advice: 'Concentrez-vous sur les vecteurs, matrices et distributions simples.',
                    resources: [
                        { name: 'Khan Academy', url: '#', free: true },
                        { name: '3Blue1Brown ML', url: '#', free: true },
                        { name: 'Coursera ML Math', url: '#', free: false }
                    ],
                    todos: [
                        'Étudier les moyennes et variance',
                        'Comprendre les matrices',
                        'Tracer des distributions',
                        'Lire des articles introductifs'
                    ],
                    completed: false
                },
                {
                    step: 3,
                    title: 'Pandas & NumPy',
                    duration: '2 weeks',
                    description: 'Manipulez des jeux de données avec Pandas et effectuez des calculs rapides avec NumPy.',
                    advice: 'Nettoyez un dataset simple et analysez-le avec des visualisations.',
                    resources: [
                        { name: 'Pandas Guide', url: '#', free: true },
                        { name: 'NumPy Tutorial', url: '#', free: true },
                        { name: 'DataCamp', url: '#', free: false }
                    ],
                    todos: [
                        'Charger un dataset CSV',
                        'Explorer les colonnes',
                        'Filtrer et trier les données',
                        'Calculer des statistiques clés'
                    ],
                    completed: false
                },
                {
                    step: 4,
                    title: 'Data Visualization',
                    duration: '1 week',
                    description: 'Découvrez comment représenter visuellement les données pour mieux les comprendre.',
                    advice: 'Comparez plusieurs graphiques pour une même métrique.',
                    resources: [
                        { name: 'Matplotlib Guide', url: '#', free: true },
                        { name: 'Seaborn Tutorial', url: '#', free: true },
                        { name: 'Plotly Course', url: '#', free: false }
                    ],
                    todos: [
                        'Créer un histogramme',
                        'Dessiner un nuage de points',
                        'Visualiser des tendances',
                        'Sauvegarder vos graphiques'
                    ],
                    completed: false
                },
                {
                    step: 5,
                    title: 'Machine Learning Basics',
                    duration: '2 weeks',
                    description: 'Initiez-vous aux algorithmes supervisés avec scikit-learn et dataset de classification.',
                    advice: 'Commencez par une régression linéaire simple avant de passer à la classification.',
                    resources: [
                        { name: 'Scikit-Learn', url: '#', free: true },
                        { name: 'ML Crash Course', url: '#', free: true },
                        { name: 'Fast.ai', url: '#', free: false }
                    ],
                    todos: [
                        'Charger des données d’exemple',
                        'Séparer training/test',
                        'Entraîner un modèle',
                        'Évaluer la précision'
                    ],
                    completed: false
                },
                {
                    step: 6,
                    title: 'Supervised Learning',
                    duration: '2 weeks',
                    description: 'Explorez les algorithmes de classification et de régression les plus courants.',
                    advice: 'Comparez plusieurs modèles pour choisir le plus performant.',
                    resources: [
                        { name: 'ML Algorithms', url: '#', free: true },
                        { name: 'Kaggle Notebooks', url: '#', free: true },
                        { name: 'Coursera ML', url: '#', free: false }
                    ],
                    todos: [
                        'Tester KNN et SVM',
                        'Comparer les scores',
                        'Optimiser les hyperparamètres',
                        'Analyser les erreurs'
                    ],
                    completed: false
                },
                {
                    step: 7,
                    title: 'Unsupervised Learning',
                    duration: '1 week',
                    description: 'Comprenez le clustering et la réduction de dimension pour explorer des données non étiquetées.',
                    advice: 'Utilisez K-means sur un dataset simple pour visualiser les groupes.',
                    resources: [
                        { name: 'Unsupervised ML', url: '#', free: true },
                        { name: 'Sklearn Clustering', url: '#', free: true },
                        { name: 'DataCamp Clustering', url: '#', free: false }
                    ],
                    todos: [
                        'Essayer K-means',
                        'Visualiser les clusters',
                        'Étudier PCA',
                        'Comparer avec données réelles'
                    ],
                    completed: false
                },
                {
                    step: 8,
                    title: 'Neural Networks intro',
                    duration: '2 weeks',
                    description: 'Initiez-vous aux réseaux de neurones avec TensorFlow ou PyTorch et perceptrons.',
                    advice: 'Commencez par un exemple de classification simple comme MNIST.',
                    resources: [
                        { name: 'TensorFlow Tutorial', url: '#', free: true },
                        { name: 'PyTorch Intro', url: '#', free: true },
                        { name: 'DeepLearning.AI', url: '#', free: false }
                    ],
                    todos: [
                        'Comprendre les couches',
                        'Construire un modèle simple',
                        'Entraîner et évaluer',
                        'Visualiser les résultats'
                    ],
                    completed: false
                },
                {
                    step: 9,
                    title: 'First ML Project',
                    duration: '2 weeks',
                    description: 'Lancez un projet pratique : collecte, nettoyage, modélisation et présentation des résultats.',
                    advice: 'Choisissez un problème simple et documentez chaque étape.',
                    resources: [
                        { name: 'Kaggle Projects', url: '#', free: true },
                        { name: 'GitHub ML', url: '#', free: true },
                        { name: 'Data Science Portfolio', url: '#', free: false }
                    ],
                    todos: [
                        'Choisir un dataset',
                        'Préparer les données',
                        'Construire un modèle',
                        'Présenter les conclusions'
                    ],
                    completed: false
                },
                {
                    step: 10,
                    title: 'Deploy ML Model',
                    duration: '1 week',
                    description: 'Mettez en ligne un modèle simple pour le partager avec un portfolio ou une appli.',
                    advice: 'Utilisez un notebook cloud ou une micro-API pour déployer rapidement.',
                    resources: [
                        { name: 'Streamlit', url: '#', free: true },
                        { name: 'Heroku Guide', url: '#', free: true },
                        { name: 'AWS Sagemaker', url: '#', free: false }
                    ],
                    todos: [
                        'Créer une application simple',
                        'Intégrer votre modèle',
                        'Déployer en ligne',
                        'Partager le lien'
                    ],
                    completed: false
                }
            ]
        }
    }
};

const DOMAIN_LABELS = {
    'web-dev': 'Web Development',
    'ai-ml': 'AI / Machine Learning',
    'mobile-dev': 'Mobile Development',
    'ui-ux': 'UI / UX Design',
    'data-science': 'Data Science',
    'devops-cloud': 'DevOps / Cloud'
};

function getDomainLabel(domainKey) {
    if (DOMAIN_LABELS[domainKey]) {
        return DOMAIN_LABELS[domainKey];
    }
    if (!domainKey) {
        return 'Growth Path';
    }
    return domainKey.charAt(0).toUpperCase() + domainKey.slice(1);
}

function createRoadmapFromProfile(profile) {
    const { domain, level, title, goal, hoursPerWeek, duration } = profile;
    const template = ROADMAP_TEMPLATES[domain]?.[level] || ROADMAP_TEMPLATES['web-dev'].beginner;
    const domainLabel = getDomainLabel(domain);
    const roadmapTitle = title || `${domainLabel} — ${getLevelLabel(level)} — ${getDurationLabel(duration || template.duration)}`;
    const description = `Personalized ${domainLabel} roadmap for ${getLevelLabel(level)} learners.`;

    // Convert steps to chapters format (compatible with MongoDB API)
    const chapters = (template.steps || []).map((step) => ({
        title: step.title,
        description: step.description,
        duration: step.duration,
        resources: (step.resources || []).map((r) => r.url || r.name || r),
        status: 'not-started',
        // keep original fields for localStorage fallback
        advice: step.advice,
        todos: step.todos
    }));

    const payload = {
        id: generateUuid(),
        userId: profile.userId,
        title: roadmapTitle,
        field: domainLabel,
        domain,
        description,
        level,
        goal,
        hoursPerWeek,
        duration: duration || template.duration,
        status: 'not-started',
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        // API shape
        chapters,
        // localStorage fallback shape
        steps: template.steps,
        completedSteps: [],
        chatHistory: []
    };
    return payload;
}

function getSuggestionLabel(domain) {
    return DOMAIN_LABELS[domain] || 'Other';
}

function getLevelLabel(level) {
    const map = {
        beginner: 'Complete Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
    };
    return map[level] || 'Beginner';
}

function getGoalLabel(goal) {
    const map = {
        'get-job': 'Get a Job',
        'personal-project': 'Personal Project',
        'general-knowledge': 'General Knowledge',
        'academic-purpose': 'Academic Purpose',
        'career-switch': 'Career Switch'
    };
    return map[goal] || 'General Goal';
}

function getDurationLabel(duration) {
    const map = {
        '1 month': '1 Month',
        '3 months': '3 Months',
        '6 months': '6 Months',
        '1 year': '1 Year'
    };
    return map[duration] || duration;
}

const ROADMAP_QUESTIONS = [
    {
        id: 'domain',
        prompt: "Hi! I'm GUIDE ME 👋 I'll help you build your personalized learning roadmap. First, what domain do you want to learn?",
        type: 'options',
        options: [
            { label: '🌐 Web Dev', value: 'web-dev' },
            { label: '🤖 AI/ML', value: 'ai-ml' },
            { label: '📱 Mobile', value: 'mobile-dev' },
            { label: '🎨 Design', value: 'ui-ux' },
            { label: '📊 Data Science', value: 'data-science' },
            { label: '☁️ DevOps', value: 'devops-cloud' },
            { label: '📝 Other...', value: 'other-domain' }
        ]
    },
    {
        id: 'customDomain',
        prompt: 'Please enter the domain you want to learn:',
        type: 'input',
        placeholder: 'e.g. Product Management, Cybersecurity, Marketing'
    },
    {
        id: 'level',
        prompt: 'Great choice! What is your current level in this domain?',
        type: 'options',
        options: [
            { label: '🌱 Complete Beginner', value: 'beginner' },
            { label: '📖 Some Knowledge', value: 'intermediate' },
            { label: '💪 Intermediate', value: 'intermediate' },
            { label: '🚀 Advanced', value: 'advanced' }
        ]
    },
    {
        id: 'goal',
        prompt: 'What is your main goal?',
        type: 'options',
        options: [
            { label: '💼 Get a Job', value: 'get-job' },
            { label: '🚀 Personal Project', value: 'personal-project' },
            { label: '📚 General Knowledge', value: 'general-knowledge' },
            { label: '🎓 Academic Purpose', value: 'academic-purpose' },
            { label: '🔄 Career Switch', value: 'career-switch' }
        ]
    },
    {
        id: 'hoursPerWeek',
        prompt: 'How many hours per week can you dedicate?',
        type: 'options',
        options: [
            { label: '⏱️ 1-3h', value: '1-3h' },
            { label: '⏰ 4-7h', value: '4-7h' },
            { label: '🕐 8-15h', value: '8-15h' },
            { label: '🔥 15h+', value: '15h+' }
        ]
    },
    {
        id: 'duration',
        prompt: 'What is your target timeframe?',
        type: 'options',
        options: [
            { label: '📅 1 Month', value: '1 month' },
            { label: '🗓️ 3 Months', value: '3 months' },
            { label: '📆 6 Months', value: '6 months' },
            { label: '🎯 1 Year', value: '1 year' }
        ]
    },
    {
        id: 'title',
        prompt: 'Almost done! Give your roadmap a name (or keep the suggested one):',
        type: 'input',
        placeholder: 'Web Dev — Beginner — 3 months'
    }
];

let roadmapCurrentQuestion = 0;
let roadmapProfile = {};

function initRoadmapBuilder() {
    if (!window.location.pathname.endsWith('new-roadmap.html')) return;
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    const botMessages = document.querySelector('#bot-messages');
    const form = document.querySelector('#roadmap-chat-form');
    const input = document.querySelector('#roadmap-input');
    if (!botMessages || !form || !input) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (!value && ROADMAP_QUESTIONS[roadmapCurrentQuestion].type === 'input') return;
        if (!value && ROADMAP_QUESTIONS[roadmapCurrentQuestion].type === 'options') return;
        addUserMessage(value || 'Selected option');
        handleRoadmapAnswer(value);
        input.value = '';
    });

    botMessages.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-value]');
        if (!button) return;
        const value = button.dataset.value;
        addUserMessage(button.textContent.trim());
        handleRoadmapAnswer(value);
    });

    roadmapCurrentQuestion = 0;
    roadmapProfile = { userId: user.id };
    renderRoadmapQuestion();
}

function renderRoadmapQuestion() {
    const question = ROADMAP_QUESTIONS[roadmapCurrentQuestion];
    if (!question) return;
    addBotMessage(question.prompt, question.options, question.placeholder);
}

function addBotMessage(text, options = [], placeholder = '') {
    const container = document.querySelector('#bot-messages');
    if (!container) return;
    const message = document.createElement('div');
    message.className = 'message ai';
    let content = `<div class="avatar">🤖</div><div class="bubble"><p>${text}</p>`;
    if (options.length) {
        content += '<div class="message-actions" style="flex-wrap:wrap; gap:0.75rem; margin-top:1rem;">';
        options.forEach((option) => {
            content += `<button type="button" data-value="${option.value}" class="chip">${option.label}</button>`;
        });
        content += '</div>';
    }
    content += '</div>';
    message.innerHTML = content;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
    const input = document.querySelector('#roadmap-input');
    const currentQ = ROADMAP_QUESTIONS[roadmapCurrentQuestion];
    if (currentQ && currentQ.type === 'input' && input) {
        input.placeholder = placeholder;
    }
}

function addUserMessage(text) {
    const container = document.querySelector('#bot-messages');
    if (!container) return;
    const message = document.createElement('div');
    message.className = 'message user';
    message.innerHTML = `<div class="bubble"><p>${text}</p></div>`;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
}

function handleRoadmapAnswer(answer) {
    const question = ROADMAP_QUESTIONS[roadmapCurrentQuestion];
    if (!question) return;
    const value = normalizeRoadmapAnswer(question.id, answer);
    if (question.id === 'customDomain') {
        roadmapProfile.domain = value;
    } else {
        roadmapProfile[question.id] = value;
    }

    if (question.id === 'title' && !value) {
        roadmapProfile.title = getDefaultRoadmapTitle();
    }

    roadmapCurrentQuestion += 1;
    if (question.id === 'domain' && value !== 'other-domain' && ROADMAP_QUESTIONS[roadmapCurrentQuestion]?.id === 'customDomain') {
        roadmapCurrentQuestion += 1;
    }

    if (roadmapCurrentQuestion >= ROADMAP_QUESTIONS.length) {
        createRoadmapFromProfileWithLoader();
        return;
    }
    renderRoadmapQuestion();
}

function normalizeRoadmapAnswer(id, answer) {
    const lower = answer.toLowerCase();
    if (id === 'domain') {
        if (lower === 'other-domain' || lower === 'other') {
            return 'other-domain';
        }
        const mapping = {
            'web dev': 'web-dev',
            'ai': 'ai-ml',
            'ai/ml': 'ai-ml',
            'mobile': 'mobile-dev',
            'design': 'ui-ux',
            'data': 'data-science',
            'cloud': 'devops-cloud'
        };
        return mapping[lower] || answer || 'web-dev';
    }
    if (id === 'customDomain') {
        return answer.trim();
    }
    if (id === 'level') {
        if (lower.includes('beginner')) return 'beginner';
        if (lower.includes('intermediate') || lower.includes('some knowledge')) return 'intermediate';
        if (lower.includes('advanced')) return 'advanced';
        return 'beginner';
    }
    if (id === 'goal') {
        if (lower.includes('job')) return 'get-job';
        if (lower.includes('personal')) return 'personal-project';
        if (lower.includes('general')) return 'general-knowledge';
        if (lower.includes('academic')) return 'academic-purpose';
        if (lower.includes('career')) return 'career-switch';
        return 'general-knowledge';
    }
    if (id === 'hoursPerWeek') {
        if (lower.includes('1-3')) return '1-3h';
        if (lower.includes('4-7')) return '4-7h';
        if (lower.includes('8-15')) return '8-15h';
        if (lower.includes('15')) return '15h+';
        return '4-7h';
    }
    if (id === 'duration') {
        if (lower.includes('1 month')) return '1 month';
        if (lower.includes('3 months')) return '3 months';
        if (lower.includes('6 months')) return '6 months';
        if (lower.includes('1 year')) return '1 year';
        return '3 months';
    }
    return answer;
}

function getDefaultRoadmapTitle() {
    return `${getDomainLabel(roadmapProfile.domain)} — ${getLevelLabel(roadmapProfile.level)} — ${getDurationLabel(roadmapProfile.duration)}`;
}

async function createRoadmapFromProfileWithLoader() {
    addBotMessage('🚀 Claude AI is building your personalized roadmap...');
    const container = document.querySelector('#bot-messages');
    if (!container) return;

    try {
        await delay(400);
        addBotMessage('🔍 Analyzing your profile and goals...');
        await delay(500);
        addBotMessage('📚 Selecting the best learning path...');

        let roadmapData;

        if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
            // Real AI generation
            roadmapData = await generateRoadmapWithAI(roadmapProfile);
        } else {
            // Fallback to templates if no key set
            await delay(1200);
            roadmapData = createRoadmapFromProfile(roadmapProfile);
        }

        const savedRoadmap = await saveRoadmapAsync(roadmapData);
        const finalId = savedRoadmap?.id || savedRoadmap?._id || roadmapData.id;
        addBotMessage('✅ Your roadmap is ready! Click below to start learning.');
        addBotMessage(`<a href="roadmap.html?id=${finalId}" style="display:inline-block;margin-top:0.5rem;padding:0.75rem 1.5rem;background:var(--cyan-primary);color:#0b1020;border-radius:12px;font-weight:700;text-decoration:none;">View My Roadmap →</a>`);
    } catch (error) {
        console.error('AI generation error:', error);
        addBotMessage('⚠️ AI generation failed, using smart template instead...');
        await delay(800);
        const roadmapData = createRoadmapFromProfile(roadmapProfile);
        const savedRoadmap = await saveRoadmapAsync(roadmapData);
        const finalId = savedRoadmap?.id || savedRoadmap?._id || roadmapData.id;
        addBotMessage(`✅ Roadmap ready! <a href="roadmap.html?id=${finalId}" style="color:var(--cyan-primary);">View My Roadmap →</a>`);
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener('DOMContentLoaded', initRoadmapBuilder);
