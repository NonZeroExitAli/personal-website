document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (this.getAttribute('target') === '_blank' && this.href.endsWith('.pdf')) {
                window.open(this.href, '_blank');
                e.preventDefault(); 
                return;
            }

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    let headerOffset = document.querySelector('header')?.offsetHeight || 70;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Update current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Scroll-triggered animations for sections ---
    const sectionsToAnimate = document.querySelectorAll("main section[id]");
    const sectionAnimationOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, sectionAnimationOptions);

    sectionsToAnimate.forEach(section => {
        if (section.id !== 'hero') {
            sectionObserver.observe(section);
        } else {
            section.classList.add('visible');
        }
    });

    // --- Active Navigation Link Highlighting on Scroll ---
    const headerHeightForNav = document.querySelector('header')?.offsetHeight || 70;
    const sectionElementsForNav = document.querySelectorAll('main section[id]');

    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            if (scrollPosition < heroSection.offsetTop + heroSection.offsetHeight * 0.7 - headerHeightForNav) {
                currentSectionId = 'hero';
            }
        }
        
        if (!currentSectionId) {
            sectionElementsForNav.forEach(section => {
                const sectionTop = section.offsetTop - headerHeightForNav - 50;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        
        if (!currentSectionId && sectionElementsForNav.length > 0 && scrollPosition + window.innerHeight >= document.body.offsetHeight - 50) {
            currentSectionId = sectionElementsForNav[sectionElementsForNav.length -1].id;
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // --- Tabs Functionality ---
    window.openTab = function(event, tabName) {
        let i, tabcontent, tabbuttons;
        const parentSection = event.currentTarget.closest('section');

        tabcontent = parentSection.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            tabcontent[i].classList.remove("active");
        }

        tabbuttons = event.currentTarget.closest('.tabs-container').getElementsByClassName("tab-button");
        for (i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].classList.remove("active");
        }

        const currentTabContent = document.getElementById(tabName);
        if (currentTabContent) {
            currentTabContent.style.display = "block";
            setTimeout(() => {
                currentTabContent.classList.add("active");
            }, 10);
        }
        if (event.currentTarget) {
            event.currentTarget.classList.add("active");
        }
    }
    document.querySelectorAll('.tabs-container').forEach(container => {
        const firstActiveButton = container.querySelector('.tab-button.active');
        if (firstActiveButton) {
            const tabName = firstActiveButton.getAttribute('onclick').match(/'([^']+)'/)[1];
            const currentTabContent = document.getElementById(tabName);
            if (currentTabContent) {
                currentTabContent.style.display = "block";
                setTimeout(() => { currentTabContent.classList.add("active"); }, 10);
            }
        }
    });

    // --- Mobile Navigation Toggle ---
    const primaryNav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const visibility = primaryNav.getAttribute('data-visible');
            if (visibility === "false") {
                primaryNav.setAttribute('data-visible', true);
                navToggle.setAttribute('aria-expanded', true);
                navToggle.innerHTML = '×';
                document.body.style.overflowY = 'hidden';
            } else {
                primaryNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
                navToggle.innerHTML = '☰';
                document.body.style.overflowY = 'auto';
            }
        });

        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('target') !== '_blank' && primaryNav.getAttribute('data-visible') === "true") {
                    primaryNav.setAttribute('data-visible', false);
                    navToggle.setAttribute('aria-expanded', false);
                    navToggle.innerHTML = '☰';
                    document.body.style.overflowY = 'auto';
                }
            });
        });
    }
});
