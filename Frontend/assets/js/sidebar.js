function initSidebarToggle() {
    const shell = document.querySelector('.dashboard-shell, .chat-shell, .roadmap-shell');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('#btn-toggle-sidebar');

    if (!shell || !sidebar || !toggleButton) {
        return;
    }

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = shell.classList.toggle('sidebar-open');
        toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
        if (!shell.classList.contains('sidebar-open')) {
            return;
        }
        if (sidebar.contains(event.target) || toggleButton.contains(event.target)) {
            return;
        }
        shell.classList.remove('sidebar-open');
        toggleButton.setAttribute('aria-expanded', 'false');
    });
}

window.addEventListener('DOMContentLoaded', initSidebarToggle);
