/* ========================================
   Lessons With Mitch — JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFadeIn();
  initConditionalFields();
  initFormSubmit();
  initHiddenFields();
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

/* --- Conditional form fields --- */
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

/* --- Form submission --- */
function initFormSubmit() {
  const form = document.getElementById('contact-form');
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

    // Update hidden lead type
    const interest = form.querySelector('#interest');
    const leadType = form.querySelector('[name="_lead_type"]');
    if (interest && leadType) {
      leadType.value = interest.value;
    }

    // Submit
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
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

/* --- Set hidden fields --- */
function initHiddenFields() {
  const sourceUrl = document.querySelector('[name="_source_url"]');
  if (sourceUrl) {
    sourceUrl.value = window.location.href;
  }
}
