const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const parallaxItems = document.querySelectorAll('[data-parallax]');

if (nav && navToggle) {
    const navLinks = nav.querySelectorAll('.nav-links a');
    const body = document.body;

    const setNavState = (isOpen) => {
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        body.classList.toggle('nav-open', isOpen);
    };

    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        navToggle.classList.toggle('active');
        setNavState(isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.classList.remove('active');
            setNavState(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && nav.classList.contains('open')) {
            nav.classList.remove('open');
            navToggle.classList.remove('active');
            setNavState(false);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            nav.classList.remove('open');
            navToggle.classList.remove('active');
            setNavState(false);
            navToggle.focus();
        }
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view');
        }
    });
}, {
    threshold: 0.18,
});

parallaxItems.forEach(item => observer.observe(item));