/* GLOBAL JS - UNHOLY DEVOTION */

document.addEventListener('DOMContentLoaded', () => {
    // 1. NAVIGATION HAMBURGER
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelectorAll('span').forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'translateY(7px) rotate(45deg)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'translateY(-7px) rotate(-45deg)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelectorAll('span').forEach(span => span.style.transform = 'none');
                hamburger.querySelectorAll('span').forEach(span => span.style.opacity = '1');
            });
        });
    }

    // 2. SCROLL EFFECT FOR NAV
    const nav = document.querySelector('nav');
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // 3. MEDIA FILTERS (Reusable)
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.dataset.group || 'default';
                const filter = btn.dataset.filter || 'all';
                const containerSelector = btn.dataset.target || '.item';

                // Toggle active class on buttons in the same group
                document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                document.querySelectorAll(containerSelector).forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        // Restore display based on tagName or data-display attribute
                        const targetDisplay = item.dataset.display || (item.tagName === 'DIV' ? 'block' : (item.tagName === 'ARTICLE' ? 'block' : 'flex'));
                        item.style.display = targetDisplay;
                        item.classList.remove('item-hidden');
                        item.classList.add('item-visible');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('item-hidden');
                        item.classList.remove('item-visible');
                    }
                });
            });
        });
    }

    // 4. ANIMATIONS ON SCROLL (SimpleFade)
    const fadeItems = document.querySelectorAll('.fade-in');
    if (fadeItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeItems.forEach(item => observer.observe(item));
    }
});
