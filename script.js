document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('nav a'); // Select all nav links

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Handle links opening in a new tab (like resume or external links)
            if (this.getAttribute('target') === '_blank') {
                // Allow default behavior for _blank links
                return;
            }

            // Handle internal anchor links (smooth scroll)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); // Prevent default jump only for anchor links
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    let headerOffset = document.querySelector('header')?.offsetHeight || 70;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }
            // For any other type of link in the nav (if any), let default behavior occur
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
        threshold: 0.1 // Element is 10% visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
            // Optional: remove class to re-animate if scrolling up
            // else {
            //     if (entry.target.id !== 'hero') { // Don't remove from hero
            //         entry.target.classList.remove("visible");
            //     }
            // }
        });
    }, sectionAnimationOptions);

    sectionsToAnimate.forEach(section => {
        if (section.id !== 'hero') { // Hero is visible by default via CSS
            sectionObserver.observe(section);
        } else {
            section.classList.add('visible'); // Ensure hero has class
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
            // Consider hero active if less than, say, 70% of its height is scrolled past OR if at top of page
            if (scrollPosition < (heroSection.offsetTop + heroSection.offsetHeight * 0.7 - headerHeightForNav) || scrollPosition < headerHeightForNav + 50) {
                currentSectionId = 'hero';
            }
        }
        
        if (!currentSectionId) { // Only check other sections if hero isn't the current one
            sectionElementsForNav.forEach(section => {
                // Adjust sectionTop to be slightly higher for earlier activation
                const sectionTop = section.offsetTop - headerHeightForNav - Math.min(100, section.offsetHeight * 0.3); // Activate earlier
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        
        // If at the very bottom of the page, past all sections, make the last section active
        if (!currentSectionId && sectionElementsForNav.length > 0 && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { // Near bottom of document
            currentSectionId = sectionElementsForNav[sectionElementsForNav.length -1].id;
        }

        // Fallback to hero if no other section is matched (e.g., if there's space between footer and last section)
        if (!currentSectionId && heroSection) {
             currentSectionId = 'hero'; // Default to hero if nothing else is active
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the currentSectionId (ignoring the #)
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    // Add a slight delay to initial call to ensure layout is fully calculated
    setTimeout(updateActiveNavLink, 100);


    // --- Tabs Functionality ---
    window.openTab = function(event, tabName) { // Make it global for HTML onclick
        let i, tabcontent, tabbuttons;
        const parentSection = event.currentTarget.closest('section');

        // Hide all tab content within the same parent section
        if (parentSection) {
            tabcontent = parentSection.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                tabcontent[i].classList.remove("active");
            }
        }

        // Remove active class from all tab buttons within the same tabs-container
        const tabsContainer = event.currentTarget.closest('.tabs-container');
        if (tabsContainer) {
            tabbuttons = tabsContainer.getElementsByClassName("tab-button");
            for (i = 0; i < tabbuttons.length; i++) {
                tabbuttons[i].classList.remove("active");
            }
        }

        // Show the current tab content and set active class on button
        const currentTabContent = document.getElementById(tabName);
        if (currentTabContent) {
            currentTabContent.style.display = "block";
            // Timeout allows display:block to take effect before adding class for CSS animation
            setTimeout(() => {
                currentTabContent.classList.add("active");
            }, 10);
        }
        if (event.currentTarget) {
            event.currentTarget.classList.add("active");
        }
    }
    // Initialize first active tabs as defined in HTML
    document.querySelectorAll('.tabs-container').forEach(container => {
        const firstActiveButton = container.querySelector('.tab-button.active');
        if (firstActiveButton) {
            // Extract tabName from the onclick attribute
            const onclickAttribute = firstActiveButton.getAttribute('onclick');
            if (onclickAttribute) {
                const match = onclickAttribute.match(/'([^']+)'/); // Extracts 'tabName' from "openTab(event, 'tabName')"
                if (match && match[1]) {
                    const tabName = match[1];
                    const currentTabContent = document.getElementById(tabName);
                    if (currentTabContent) {
                        currentTabContent.style.display = "block";
                        setTimeout(() => { currentTabContent.classList.add("active"); }, 10);
                    }
                }
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
                navToggle.innerHTML = '×'; // Close icon
                document.body.style.overflowY = 'hidden'; // Prevent scrolling of body
            } else {
                primaryNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
                navToggle.innerHTML = '☰'; // Hamburger icon
                document.body.style.overflowY = 'auto'; // Restore scrolling
            }
        });

        // Close mobile menu when an internal link is clicked
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's an internal page link (starts with #) and menu is visible
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && primaryNav.getAttribute('data-visible') === "true") {
                    primaryNav.setAttribute('data-visible', false);
                    navToggle.setAttribute('aria-expanded', false);
                    navToggle.innerHTML = '☰';
                    document.body.style.overflowY = 'auto';
                }
                // The smooth scroll logic for navLinks will be handled by the other event listener
            });
        });
    }

});
