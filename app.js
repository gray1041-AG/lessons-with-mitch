/* ========================================
   Lessons With Mitch — JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFadeIn();
  initConditionalFields();
  initFormSubmit();
});

/* --- Fade-in on scroll --- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* --- Conditional form fields (lessons page) --- */
function initConditionalFields() {
  const interest = document.getElementById('interest');
  const lessonFields = document.getElementById('lesson-fields');
  if (!interest || !lessonFields) return;

  interest.addEventListener('change', () => {
    const val = interest.value;
    const show = val === 'lessons' || val === 'both';
    lessonFields.hidden = !show;
  });
}

/* --- Form submission (works for both contact-form and booking-form) --- */
function initFormSubmit() {
  const form = document.getElementById('contact-form') || document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.form-field--error').forEach(f => {
      f.classList.remove('form-field--error');
    });

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(input => {
      if (!input.value.trim()) {
        input.closest('.form-field').classList.add('form-field--error');
        valid = false;
      }
    });

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.source_url = window.location.href;

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        form.hidden = true;
        document.getElementById('form-success').hidden = false;
      } else {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 3000);
      }
    } catch {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  });
}
