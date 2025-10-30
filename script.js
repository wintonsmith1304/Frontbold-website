/* Frontbold Studio - script.js
   Purpose:
   - reveal hero text on scroll
   - enable optional auto-scroll for portfolio (toggleable)
   - handle contact form submit (Formspree)
   - smooth internal link scrolling (progressive enhancement)
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ---- HERO REVEAL (IntersectionObserver) ---- */
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          heroText.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(heroText);
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(ev){
      const tgt = document.querySelector(this.getAttribute('href'));
      if (tgt) {
        ev.preventDefault();
        tgt.scrollIntoView({ behavior:'smooth', block:'start' });
        tgt.setAttribute('tabindex','-1');
        tgt.focus({ preventScroll:true });
      }
    });
  });

  

  /* ---- CONTACT FORM: progressive enhancement AJAX to Formspree ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // simple client validation
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      // show loading / disable
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        // replace action with your Formspree endpoint (keeps form working w/o JS)
        const action = form.getAttribute('action');
        const res = await fetch(action, {
          method: form.method || 'POST',
          headers: { 'Accept': 'application/json' },
          body: fd
        });
        if (res.ok) {
          alert('Thanks — your message has been sent. We will reply within 2 business days.');
          form.reset();
        } else {
          const json = await res.json().catch(()=> null);
          const msg = (json && json.error) ? json.error : 'Submission failed. Please try again.';
          alert(msg);
        }
      } catch (err) {
        console.error(err);
        alert('Network error — please try again later.');
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

});