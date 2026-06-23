/**
 * Ultra-Minimal JavaScript - No Dependencies
 * Only 10 lines for navigation active state
 */

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    document.body.classList.remove('is-loading');
});
