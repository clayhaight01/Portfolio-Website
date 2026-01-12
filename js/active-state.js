document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // robust matching (handling relative paths, root, etc)
        if (href) {
            // Resolve relative links to absolute to compare with location.pathname
            // simpler check: if current path ends with the href (ignoring ./ prefix)
            const cleanHref = href.replace(/^\.\//, '');
            const cleanPath = currentPath.split('/').pop() || 'index.html';
            
            // Special case for root/home
            if ((cleanHref === 'index.html' && (cleanPath === '' || cleanPath === 'index.html')) ||
                currentPath.endsWith(cleanHref)) {
                link.classList.add('active');
            }
        }
    });
});

