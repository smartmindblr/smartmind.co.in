// =========================================================
// Smart Mind Tuition Centre - script.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCourses();
  initCounters();
  initTestimonials();
  initContactForm();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- NAVBAR (mobile toggle + active link) ---------------- */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu after clicking a link (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');

      navLinks.querySelectorAll('a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Highlight nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

/* ---------------- COURSES DATA + RENDER ---------------- */
function initCourses() {
  const courses = [
    {
      icon: '📖 STATE',
      title: 'School Tuition (Grades 1–2)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'STATE ₹2,000/month'  
    },
    {
      icon: '📖 CBSC/ICSE',
      title: 'School Tuition (Grades 1–2)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹2,500/month'  
    },
    {
      icon: '📖 STATE',
      title: 'School Tuition (Grades 3–4)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹2,500/month'
    },
    {
      icon: '📖 CBSC/ICSE',
      title: 'School Tuition (Grades 3–4)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹3,000/month'  
    },
    {
      icon: '📖 STATE',
      title: 'School Tuition (Grades 5-6)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹3,000/month'
    },
    {
      icon: '📖 CBSC/ICSE',
      title: 'School Tuition (Grades 5–6)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹4,500/month'  
    },
    {
      icon: '📖 STATE',
      title: 'School Tuition (Grades 7–8)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹3,500/month'  
    },
    {
      icon: '📖 CBSC/ICSE',
      title: 'School Tuition (Grades 7–8)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹4,500/month'  
    },
    {
      icon: '📖 STATE',
      title: 'School Tuition (Grades 9–10)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹4,000/month'  
    },
    {
      icon: '📖 CBSC/ICSE',
      title: 'School Tuition (Grades 9–10)',
      desc: 'All subjects covered with concept-based teaching, and regular tests.',
      price: 'From ₹5,000/month'  
    },
  ];

  const grid = document.getElementById('coursesGrid');
  grid.innerHTML = courses.map(course => `
    <div class="course-card">
      <div class="course-icon">${course.icon}</div>
      <h3>${course.title}</h3>
      <p>${course.desc}</p>
      <div class="price">${course.price}</div>
    </div>
  `).join('');
}

/* ---------------- ANIMATED COUNTERS ---------------- */
function initCounters() {
  const targets = {
    'stat-students': 1000,
    'stat-years': 12,
    'stat-results': 95
  };

  const els = Object.keys(targets).map(id => document.getElementById(id));
  let started = false;

  function animate(el, target) {
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count + (target === 95 ? '' : '+');
    }, 25);
  }

  function checkAndStart() {
    if (started) return;
    const hero = document.querySelector('.hero-stats');
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      started = true;
      Object.entries(targets).forEach(([id, val]) => animate(document.getElementById(id), val));
      window.removeEventListener('scroll', checkAndStart);
    }
  }

  window.addEventListener('scroll', checkAndStart);
  checkAndStart(); // in case hero is already in view on load
}

/* ---------------- TESTIMONIAL SLIDER ---------------- */
function initTestimonials() {
  const testimonials = [
    {
      text: '"Smart Mind Tuition Centre transformed my daughter\u2019s approach to Math. Her grades improved from a C to an A within one term!"',
      author: '— Mrs. Kapoor, Parent'
    },
    {
      text: '"The teachers here genuinely care about every student. The doubt-clearing sessions are a lifesaver before exams."',
      author: '— Rohan S., Grade 10 Student'
    },
    {
      text: '"Affordable, professional, and effective. I recommend Smart Mind to every parent in my neighborhood."',
      author: '— Mr. Iyer, Parent'
    },
    {
      text: '"I cleared my entrance exam thanks to the focused coaching and mock tests provided here."',
      author: '— Priya M., Student'
    }
  ];

  const textEl = document.getElementById('testimonialText');
  const authorEl = document.getElementById('testimonialAuthor');
  const dotsEl = document.getElementById('testimonialDots');

  let current = 0;

  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsEl.appendChild(dot);
  });

  function showTestimonial(index) {
    current = index;
    textEl.textContent = testimonials[current].text;
    authorEl.textContent = testimonials[current].author;
    [...dotsEl.children].forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  showTestimonial(0);

  setInterval(() => {
    showTestimonial((current + 1) % testimonials.length);
  }, 5000);
}

/* ---------------- CONTACT FORM VALIDATION ---------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const submitBtn = form.querySelector('button[type="submit"]');
  const errorBox = document.getElementById('formError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('show');
    if (errorBox) errorBox.classList.remove('show');

    let isValid = true;
    isValid = validateName() && isValid;
    isValid = validateEmail() && isValid;
    isValid = validatePhone() && isValid;

    if (!isValid) return;

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then((response) => {
        if (response.ok) {
          success.classList.add('show');
          form.reset();
          setTimeout(() => success.classList.remove('show'), 6000);
        } else {
          return response.json().then((data) => {
            throw new Error(
              (data && data.errors && data.errors.map(e => e.message).join(', ')) ||
              'Something went wrong. Please try again.'
            );
          });
        }
      })
      .catch((err) => {
        if (errorBox) {
          errorBox.textContent = '❌ ' + (err.message || 'Could not send your message. Please try again or contact us directly.');
          errorBox.classList.add('show');
        }
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });

  function validateName() {
    const val = nameInput.value.trim();
    const errorEl = document.getElementById('nameError');
    if (val.length < 2) {
      showError(nameInput, errorEl, 'Please enter your full name.');
      return false;
    }
    clearError(nameInput, errorEl);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const errorEl = document.getElementById('emailError');
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(val)) {
      showError(emailInput, errorEl, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, errorEl);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    const errorEl = document.getElementById('phoneError');
    const pattern = /^[0-9+\-\s()]{7,15}$/;
    if (!pattern.test(val)) {
      showError(phoneInput, errorEl, 'Please enter a valid phone number.');
      return false;
    }
    clearError(phoneInput, errorEl);
    return true;
  }

  function showError(input, errorEl, message) {
    input.classList.add('invalid');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  }

  // Live validation as user types
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
}

/* ---------------- BACK TO TOP BUTTON ---------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
