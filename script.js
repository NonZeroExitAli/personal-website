document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('header')?.offsetHeight || 70), // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Update current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Scroll-triggered animations for sections ---
    const sections = document.querySelectorAll("section");
    const options = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Optional: unobserve after it's been animated once
                // observer.unobserve(entry.target);
            }
            // Optional: remove class if you want animation to repeat when scrolling out and back in
            // else {
            //     entry.target.classList.remove("visible");
            // }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });


    // --- Active Navigation Link Highlighting on Scroll ---
    const headerHeight = document.querySelector('header')?.offsetHeight || 70;
    const sectionElements = document.querySelectorAll('main section[id]');

    function updateActiveNavLink() {
        let currentSectionId = '';
        sectionElements.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Add a small offset
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call to set active link on page load

});
