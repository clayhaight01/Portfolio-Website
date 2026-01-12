document.addEventListener('DOMContentLoaded', () => {
    // Handle initial active state
    updateActiveState();
    
    // Handle multiple-pictures sizing
    adjustMultiplePictures();
    window.addEventListener('resize', adjustMultiplePictures);

    // Intercept all clicks on anchor tags
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        
        // Check if it's a valid link we should handle
        if (shouldHandleLink(link, e)) {
            e.preventDefault();
            const url = link.href;
            navigateTo(url);
        }
    });

    // Handle Back/Forward browser buttons
    window.addEventListener('popstate', () => {
        // If state is null, we might be back at initial page, just reload content
        loadContent(window.location.href, false);
    });
});

function shouldHandleLink(link, e) {
    if (!link || !link.href) return false;
    
    // Ignore if opening in new tab/window
    if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return false;
    
    // Check if internal link (same origin)
    // Note: On file:// protocol, origin might be "null" or "file://", we handle this loosely
    try {
        const linkUrl = new URL(link.href);
        const currentUrl = new window.location.constructor(window.location.href);
        
        // If origins match, or both are file protocol
        if (linkUrl.origin === currentUrl.origin || (linkUrl.protocol === 'file:' && currentUrl.protocol === 'file:')) {
            // Ensure it's not a hash link on same page
            if (linkUrl.pathname === currentUrl.pathname && linkUrl.search === currentUrl.search) {
                if (linkUrl.hash) return false; // Let default hash behavior happen
            }
            return true;
        }
    } catch (err) {
        // If URL parsing fails, let default behavior happen
        return false;
    }
    
    return false;
}

function navigateTo(url) {
    history.pushState(null, null, url);
    loadContent(url, true);
}

async function loadContent(url, scroll) {
    try {
        // Use fetch to get content
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // 1. Update Title
        document.title = newDoc.title;
        
        // 2. Swap Main Content
        const newMain = newDoc.querySelector('main');
        const oldMain = document.querySelector('main');
        
        if (newMain && oldMain) {
            oldMain.innerHTML = newMain.innerHTML;
            oldMain.className = newMain.className; // Preserve layout classes
            
            // Re-execute scripts found in main (if any widgets need it)
            const scripts = oldMain.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        }

        // 3. Update Active Navigation State (Header is outside main, so we update classes)
        updateActiveState();
        
        // 4. Adjust images
        adjustMultiplePictures();

        // 5. Scroll to top
        if (scroll) {
            window.scrollTo(0, 0);
        }

    } catch (error) {
        console.error('SPA Navigation failed, falling back to reload:', error);
        // Fallback: Force full page reload
        window.location.href = url;
    }
}

function updateActiveState() {
    // Get current path filename (e.g. "index.html" or "about.html")
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.classList.remove('active');

        // Get href relative to current page is tricky, better to use link.pathname
        try {
            const linkUrl = new URL(link.href);

            // Skip external links (different origin) - they should never be "active"
            if (linkUrl.origin !== window.location.origin) {
                return;
            }

            const linkPath = linkUrl.pathname.split('/').pop() || 'index.html';

            // Compare filenames
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        } catch (e) {
            // Fallback for relative hrefs if URL parsing fails (unlikely in browser)
            const href = link.getAttribute('href');
            if (href && (href.includes(currentPath) || (currentPath === 'index.html' && (href === './' || href === '.')))) {
                link.classList.add('active');
            }
        }
    });
}

function adjustMultiplePictures() {
    const containers = document.querySelectorAll('.multiple-pictures');
    
    containers.forEach(container => {
        const images = Array.from(container.querySelectorAll('img'));
        if (images.length === 0) return;

        // Reset styles if on mobile
        if (window.innerWidth < 600) {
            images.forEach(img => {
                img.style.height = '';
                img.style.width = '';
                img.style.flex = '';
            });
            return;
        }

        // Check if all images are loaded
        const allLoaded = images.every(img => img.complete && img.naturalHeight !== 0);

        if (!allLoaded) {
            images.forEach(img => {
                // Ensure we only attach one listener
                if (!img.hasAttribute('data-listener-attached')) {
                    img.addEventListener('load', adjustMultiplePictures);
                    img.setAttribute('data-listener-attached', 'true');
                }
            });
            return; 
        }

        // Get container width (subtract gap)
        const gap = 16; 
        const totalGap = gap * (images.length - 1);
        const containerWidth = container.getBoundingClientRect().width - totalGap;
        
        if (containerWidth <= 0) return;

        // Calculate total aspect ratio
        let totalAspectRatio = 0;
        images.forEach(img => {
            totalAspectRatio += img.naturalWidth / img.naturalHeight;
        });

        // Calculate target height
        const targetHeight = containerWidth / totalAspectRatio;

        // Apply styles
        images.forEach(img => {
            img.style.height = `${targetHeight}px`;
            img.style.width = 'auto';
            img.style.flex = 'none';
        });
    });
}
