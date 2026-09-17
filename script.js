// =============================================================================
// EDIT SETTINGS HERE — change these numbers to tune behavior. Everything below
// this block reads from CONFIG instead of using hardcoded numbers, so this is
// the one place to adjust timing/feel without hunting through the file.
// =============================================================================
// Google Apps Script Web App URL that the enquiry form posts to.
// PASTE_YOUR_... is a placeholder — replace it with your deployed Apps
// Script /exec URL (see README.md for setup steps) or the form will show
// a "not connected" error instead of submitting.
const SCRIPT_URL = https://script.google.com/macros/s/AKfycbzIfoXQa2Xa_11YC4MgdjcwUm40rw-Ry7LKgf42Onty63lZWmx53rlb00BJ_QKqkEKR/exec;

const CONFIG = {
  whatsappNumber: '91741122720', // used for the enquiry-form message link
  autoplayDelay: 5000,            // ms between automatic testimonial slides
  swipeThreshold: 40,             // px of horizontal swipe needed to change slide (touch)
  countUpDuration: 1100,          // ms for the hero stats "count up" animation
  cursorGlowSmoothing: 0.12,      // 0–1, how quickly the glow catches up to the cursor (higher = snappier)
  tiltStrength: 8,                // degrees of max card tilt on mouse move
};

// Detected once and reused everywhere below — these two conditions gate most
// of the "extra" effects (glow, tilt, autoplay, reveal animations).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches; // true = mouse/trackpad, false = touch


// =============================================================================
// MOBILE NAV — hamburger menu open/close + closes automatically on link click
// or Escape key. # WORKING CONDITION: only visible/relevant below the 900px
// breakpoint (see style.css .menu-toggle), but the JS itself runs everywhere.
// =============================================================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '✕' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '☰';
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.focus();
  }
});


// =============================================================================
// TESTIMONIAL SLIDER — dots, prev/next buttons, autoplay, and touch swipe.
// # WORKING CONDITION: autoplay pauses on hover/keyboard-focus and stops
// entirely if the visitor has reduced-motion enabled. Swipe only fires on
// touch events, so it's inert on desktop.
// =============================================================================
const reviews = [...document.querySelectorAll('.review')];
const dotsWrap = document.querySelector('.slider-dots');
const sliderEl = document.querySelector('.review-slider');
let reviewIndex = 0;
let autoplayTimer = null;

reviews.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Show testimonial ${i + 1} of ${reviews.length}`);
  dot.addEventListener('click', () => { showReview(i); restartAutoplay(); });
  dotsWrap.appendChild(dot);
});

function showReview(i) {
  reviewIndex = (i + reviews.length) % reviews.length;
  reviews.forEach((r, n) => r.classList.toggle('active', n === reviewIndex));
  [...dotsWrap.children].forEach((d, n) => d.classList.toggle('active', n === reviewIndex));
}

function startAutoplay() {
  if (prefersReducedMotion) return; // # condition: never autoplay if reduced-motion is on
  autoplayTimer = setInterval(() => showReview(reviewIndex + 1), CONFIG.autoplayDelay);
}
function stopAutoplay() { clearInterval(autoplayTimer); }
function restartAutoplay() { stopAutoplay(); startAutoplay(); }

document.querySelector('.review-prev')?.addEventListener('click', () => { showReview(reviewIndex - 1); restartAutoplay(); });
document.querySelector('.review-next')?.addEventListener('click', () => { showReview(reviewIndex + 1); restartAutoplay(); });
sliderEl?.addEventListener('mouseenter', stopAutoplay);
sliderEl?.addEventListener('mouseleave', startAutoplay);
sliderEl?.addEventListener('focusin', stopAutoplay);
sliderEl?.addEventListener('focusout', startAutoplay);
startAutoplay();

// Swipe left/right on the slider — # condition: only responds to touchstart/touchend,
// so it simply never fires with a mouse.
(() => {
  if (!sliderEl) return;
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; stopAutoplay(); }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > CONFIG.swipeThreshold) showReview(reviewIndex + (delta < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });
})();


// =============================================================================
// SCROLL-REVEAL — fades/slides elements with the .reveal class in as they
// enter the viewport. # WORKING CONDITION: if reduced-motion is on, every
// element is shown immediately (.show added with no animation) instead.
// =============================================================================
document.querySelectorAll('.reveal').forEach(el => {
  if (prefersReducedMotion) { el.classList.add('show'); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); }});
  }, {threshold: .12});
  observer.observe(el);
});


// =============================================================================
// SCROLLSPY — highlights the nav link matching whichever section is centered
// in the viewport. # WORKING CONDITION: always active; purely visual (adds/
// removes an .active class), no effect on reduced-motion visitors.
// =============================================================================
const sections = [...document.querySelectorAll('main [id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
if (sections.length && navAnchors.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = navAnchors.find(a => a.getAttribute('href') === '#' + entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}


// =============================================================================
// CURSOR-FOLLOW GLOW — a soft glow that trails the mouse, smoothed frame by
// frame instead of snapping straight to the pointer.
// # WORKING CONDITION: ONLY runs if (a) the device has a fine pointer (mouse/
// trackpad — checked once at the top of the file) AND (b) reduced-motion is
// OFF. On touch devices or with reduced-motion on, this whole block is
// skipped and the glow element stays invisible (see style.css opacity:0).
// =============================================================================
(() => {
  if (!isFinePointer || prefersReducedMotion) return;
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let curX = targetX, curY = targetY;
  let active = false;

  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; // # condition: ignore touch/pen pointer events
    targetX = e.clientX; targetY = e.clientY;
    if (!active) { active = true; glow.classList.add('active'); }
  });
  document.addEventListener('mouseleave', () => { active = false; glow.classList.remove('active'); });

  function loop() {
    // Lerp (linear interpolation) toward the target position each frame —
    // CONFIG.cursorGlowSmoothing controls how "laggy" vs "snappy" this feels.
    curX += (targetX - curX) * CONFIG.cursorGlowSmoothing;
    curY += (targetY - curY) * CONFIG.cursorGlowSmoothing;
    glow.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();


// =============================================================================
// 3D CARD TILT — course/benefit cards tilt toward the cursor on mousemove.
// # WORKING CONDITION: same gate as the cursor glow — fine pointer only, and
// disabled entirely under reduced-motion. Never attaches on touch devices.
// =============================================================================
if (isFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.course-card, .benefit').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const t = CONFIG.tiltStrength;
      card.style.transform = `perspective(700px) rotateX(${(-py * t).toFixed(2)}deg) rotateY(${(px * t).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}


// =============================================================================
// RIPPLE / TAP FEEDBACK — a small expanding circle on buttons and cards.
// # WORKING CONDITION: fires on "pointerdown", which covers BOTH touch taps and
// mouse clicks — this is the one effect that intentionally runs everywhere,
// since tap feedback is just as useful on desktop as on mobile.
// =============================================================================
document.querySelectorAll('.btn, .nav-cta, .whatsapp-float, .course-card, .benefit').forEach(el => {
  el.addEventListener('pointerdown', e => {
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${(e.clientX ?? r.left + r.width / 2) - r.left - size / 2}px`;
    span.style.top = `${(e.clientY ?? r.top + r.height / 2) - r.top - size / 2}px`;
    el.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  });
});


// =============================================================================
// COUNT-UP STATS — animates "500+ / 10+ / 3" from zero once scrolled into view.
// # WORKING CONDITION: triggers once, the first time the stats row is 40%
// visible. If reduced-motion is on, the final numbers are set instantly
// with no animation instead of counting up.
// =============================================================================
(() => {
  const statEls = [...document.querySelectorAll('.stats [data-count]')];
  if (!statEls.length) return;
  const animateCount = el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / CONFIG.countUpDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const statsWrap = document.querySelector('.stats');
  if (!statsWrap) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { statEls.forEach(animateCount); obs.disconnect(); }
    });
  }, { threshold: .4 });
  obs.observe(statsWrap);
})();


// =============================================================================
// ENQUIRY FORM → GOOGLE SHEETS SUBMISSION
// # WORKING CONDITION: runs on form submit; posts JSON to a Google Apps
// Script Web App (SCRIPT_URL above) instead of opening WhatsApp. Requires
// matching field names in index.html's #enquiryForm: parentName, phone,
// email, grade, board, subject, mode, message, and a hidden honeypot field
// named "website". Also requires #submitBtn (with a ".btn-label" and
// ".btn-spinner" child) and #formStatus in the markup.
// =============================================================================
const form = document.getElementById("enquiryForm");
const submitBtn = document.getElementById("submitBtn");
const btnLabel = submitBtn?.querySelector(".btn-label");
const btnSpinner = submitBtn?.querySelector(".btn-spinner");
const statusBox = document.getElementById("formStatus");

function setStatus(kind, message) {
  if (!statusBox) return;
  statusBox.hidden = false;
  statusBox.className = "form-status " + kind;
  statusBox.textContent = message;
  statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setLoading(isLoading) {
  if (!submitBtn) return;
  submitBtn.disabled = isLoading;
  if (btnSpinner) btnSpinner.hidden = !isLoading;
  if (btnLabel) btnLabel.textContent = isLoading ? "Sending…" : "Send enquiry";
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (statusBox) statusBox.hidden = true;

  // Honeypot: if this hidden field got filled in, silently drop it (likely a bot).
  // Optional chaining so this stays safe even if the field is ever removed from the HTML.
  if (form.website?.value.trim() !== "") {
    return;
  }

  // email/board/subject/mode are optional-chained: this form doesn't currently
  // collect them, so they're left blank in the Sheet unless you add the fields.
  const payload = {
    name: form.parentName.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email?.value.trim() || "",
    grade: form.grade.value,
    board: form.board?.value || "",
    subject: form.subject?.value.trim() || "",
    mode: form.mode?.value || "",
    message: form.message.value.trim(),
    page: window.location.href,
    submittedAt: new Date().toISOString()
  };

  // Basic client-side validation
  if (!payload.name || !payload.phone || !payload.grade) {
    setStatus("error", "Please fill in your name, phone number and class before sending.");
    return;
  }
  if (!isValidPhone(payload.phone)) {
    setStatus("error", "That phone number doesn't look right — please double-check it.");
    return;
  }

  if (SCRIPT_URL.startsWith("PASTE_YOUR")) {
    setStatus("error", "Enquiry form isn't connected to Google Sheets yet — see README.md for setup steps.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight; Apps Script still reads the raw JSON body fine.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    let ok = res.ok;
    try {
      const data = await res.json();
      ok = ok && data.result === "success";
    } catch (_) {
      // If the response isn't JSON for some reason, fall back to res.ok
    }

    if (ok) {
      form.reset();
      setStatus(
        "success",
        `Thanks, ${payload.name.split(" ")[0]}! We've received your enquiry and will call you at ${payload.phone} shortly. You can also message us on WhatsApp any time.`
      );
    } else {
      throw new Error("Non-success response from server");
    }
  } catch (err) {
    setStatus(
      "error",
      "We couldn't send that just now — please try again, or reach us directly on WhatsApp or by phone."
    );
  } finally {
    setLoading(false);
  }
});

/* ---------------- BACK TO TOP BUTTON ---------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
initBackToTop();

// =============================================================================
// FOOTER YEAR — # condition: runs once on load, sets the current year so the
// copyright line never goes stale.
// =============================================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// =============================================================================
// LOCAL VISIT COUNTER — a per-browser counter stored in localStorage (no
// backend/database). # WORKING CONDITION: increments by 1 every time this page
// loads in a given browser; falls back to showing "1" if localStorage is
// unavailable (e.g. private browsing in some browsers).
// =============================================================================
const visitCountEl = document.getElementById('visitCount');
if (visitCountEl) {
  try {
    const count = (parseInt(localStorage.getItem('rr_visit_count') || '0', 10) || 0) + 1;
    localStorage.setItem('rr_visit_count', String(count));
    visitCountEl.textContent = count.toLocaleString();
  } catch (err) {
    visitCountEl.textContent = '1';
  }
}
