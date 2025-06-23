// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed header height
                behavior: 'smooth'
            });

            // Optional: Update active class on nav links
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Update current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Optional: Basic scroll animations (add a class when element is in view)
// You might want a library like AOS (Animate on Scroll) for more complex animations
const scrollElements = document.querySelectorAll("section"); // Or more specific elements

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled"); // You'll define .scrolled styles in CSS
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) { // Adjust 1.25 for when animation triggers
      displayScrollElement(el);
    } // else { hideScrollElement(el); } // Optional: remove class when out of view
  });
};

window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

// Initial check in case elements are already in view on load
handleScrollAnimation();

// Add this to your style.css for the basic scroll animation:
/*
section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
section.scrolled {
    opacity: 1;
    transform: translateY(0);
}
*/
