/* ===========================================
   LoveScript Studio – script.js
   =========================================== */

// ── Theme Toggle ──────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('ls-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ls-theme', next);
});

// ── Navbar scroll effect ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ── Mobile Hamburger ──────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// ── Floating Petals ───────────────────────
const petalEmojis = ['🌸', '🌺', '🌹', '🌼', '✿', '❀', '🍃'];
const petalsContainer = document.getElementById('petals');
const PETAL_COUNT = 16;

function createPetal() {
    const petal = document.createElement('span');
    petal.classList.add('petal');
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (8 + Math.random() * 10) + 's';
    petal.style.animationDelay = (Math.random() * 8) + 's';
    petal.style.fontSize = (10 + Math.random() * 14) + 'px';
    petal.style.opacity = (0.2 + Math.random() * 0.4).toString();
    petalsContainer.appendChild(petal);

    // Remove petal after animation ends to keep DOM clean
    const duration = parseFloat(petal.style.animationDuration) * 1000 +
        parseFloat(petal.style.animationDelay) * 1000 + 500;

    setTimeout(() => {
        petal.remove();
        createPetal(); // replace it
    }, duration);
}

for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal();
}

// ── Intersection Observer (Fade animations) ──
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-right, .card, .step-card, .testi-card, .price-card, .info-card').forEach(el => {
    fadeObserver.observe(el);
});

// Staggered delay for grids
document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.35s cubic-bezier(0.4,0,0.2,1)';
});

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(card => cardObserver.observe(card));

// ── Counter Animation ──────────────────────
function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-target]');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counterEls.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
            });
        }
    });
}, { threshold: 0.5 });

if (counterEls.length > 0) {
    counterObserver.observe(counterEls[0].closest('.hero-stats') || counterEls[0]);
}

// ── Filter Cards ─────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach((card, idx) => {
            const category = card.getAttribute('data-category');
            const show = filter === 'all' || category === filter;

            if (show) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(24px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, idx * 60);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ── Testimonials Carousel ────────────────
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function goToSlide(index) {
    currentSlide = index;
    const cards = track.querySelectorAll('.testi-card');
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
});

// Auto-advance testimonials
setInterval(() => {
    const total = document.querySelectorAll('.testi-card').length;
    goToSlide((currentSlide + 1) % total);
}, 5000);

// ── Contact Form ─────────────────────────
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span> <span class="btn-icon">⏳</span>';

    // Simulate sending (replace with real API call)
    setTimeout(() => {
        btn.innerHTML = '<span>¡Enviado!</span> <span class="btn-icon">✅</span>';
        showToast();
        contactForm.reset();

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<span>Enviar Consulta</span> <span class="btn-icon">💌</span>';
        }, 3500);
    }, 1500);
});

function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Smooth scroll for nav links ───────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = navbar.offsetHeight + 16;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Active nav link highlight ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(l => {
                const href = l.getAttribute('href');
                l.style.color = href === `#${id}` ? 'var(--accent)' : '';
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Marquee duplicate for infinite scroll ─
const featuresContainer = document.querySelector('.features-container');
if (featuresContainer) {
    featuresContainer.innerHTML += featuresContainer.innerHTML;
}

// ── Ripple effect on buttons ─────────────
document.querySelectorAll('.btn-primary, .btn-outline, .btn-card').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
        this.style.position = this.style.position || 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// Ripple keyframe (injected dynamically)
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ── Card flip demo modal (simple preview) ─
document.querySelectorAll('.btn-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const name = card.querySelector('.card-name').textContent;

        // Short preview animation
        card.style.transform = 'scale(0.97)';
        setTimeout(() => {
            card.style.transform = '';
            alert(`✨ Demo de "${name}" — Pronto disponible. Contáctanos para ver una vista previa completa.`);
        }, 150);
    });
});

console.log('💌 LoveScript Studio — Loaded with love');
