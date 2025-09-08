// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Fade-in on scroll for research images
const fadeImgs = document.querySelectorAll('.fade-in-on-scroll');
if (fadeImgs.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  fadeImgs.forEach(img => io.observe(img));
}

// Blog Accordion Toggle
document.addEventListener("DOMContentLoaded", () => {
  const blogHeaders = document.querySelectorAll(".blog-header");
  blogHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      parent.classList.toggle("active");
    });
  });
});
