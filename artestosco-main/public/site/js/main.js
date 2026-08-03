/**
 * ARTETOSCO — main.js
 * Módulos ES6: navegación, revelado al scroll, parallax sutil,
 * filtros de portafolio, lightbox y validación de formularios.
 * Cada módulo se auto-desactiva si su marcado no está presente,
 * de modo que el mismo archivo sirve para todas las plantillas.
 */

/* ---------------------------------------------------- Header y navegación */
const initHeader = () => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
};

/* ------------------------------------------------- Revelado suave (fade) */
const initReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  items.forEach((item) => observer.observe(item));
};

/* ------------------------------------------------------ Parallax sutil */
const initParallax = () => {
  const layers = [...document.querySelectorAll('[data-parallax]')];
  if (!layers.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.parallax) || 0.12;
      const rect = layer.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.08)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
};

/* --------------------------------------------------- Filtros portafolio */
const initFilters = () => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const items = [...document.querySelectorAll('[data-category]')];
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.filter;
      buttons.forEach((b) => b.classList.toggle('is-active', b === button));
      items.forEach((item) => {
        const match = value === 'todos' || item.dataset.category === value;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });
};

/* ------------------------------------------------------------- Lightbox */
const initLightbox = () => {
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;

  const image = lightbox.querySelector('[data-lightbox-image]');
  const caption = lightbox.querySelector('[data-lightbox-caption]');
  const triggers = [...document.querySelectorAll('[data-lightbox-trigger]')];
  if (!triggers.length) return;

  let index = 0;

  const visibleTriggers = () => triggers.filter((t) => !t.classList.contains('is-hidden'));

  const render = () => {
    const list = visibleTriggers();
    const trigger = list[index];
    if (!trigger) return;
    const source = trigger.dataset.full || trigger.querySelector('img')?.src;
    image.src = source;
    image.alt = trigger.dataset.title || '';
    caption.textContent = [trigger.dataset.title, trigger.dataset.meta].filter(Boolean).join(' · ');
  };

  const open = (trigger) => {
    index = Math.max(0, visibleTriggers().indexOf(trigger));
    render();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const step = (direction) => {
    const list = visibleTriggers();
    index = (index + direction + list.length) % list.length;
    render();
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', () => open(trigger)));
  lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', close);
  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => step(-1));
  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  });
};

/* ------------------------------------------------- Formularios de contacto */
const initForms = () => {
  const forms = [...document.querySelectorAll('[data-form]')];
  if (!forms.length) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach((field) => {
        const error = form.querySelector(`[data-error-for="${field.name}"]`);
        let message = '';

        if (!field.value.trim()) {
          message = 'Este campo es obligatorio.';
        } else if (field.type === 'email' && !emailPattern.test(field.value.trim())) {
          message = 'Ingresa un correo válido.';
        }

        if (message) valid = false;
        if (error) error.textContent = message;
      });

      if (!valid) {
        if (status) status.textContent = '';
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      // WordPress: reemplazar por wp_mail / Contact Form 7 / admin-ajax.
      console.info('Solicitud ARTETOSCO', data);

      if (status) {
        status.textContent = 'Gracias por escribir. Te responderemos dentro de las próximas 24 horas hábiles.';
      }
      form.reset();
    });
  });
};

/* --------------------------------------------- Prefiltro desde la URL (?cat=) */
const initQueryFilter = () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat');
  if (!category) return;
  document.querySelector(`[data-filter="${category}"]`)?.click();
};

/* ------------------------------------------------------ Prellenado producto */
const initQuotePrefill = () => {
  const params = new URLSearchParams(window.location.search);
  const product = params.get('producto');
  if (!product) return;
  const message = document.querySelector('[name="mensaje"]');
  if (message && !message.value) {
    message.value = `Hola, me interesa cotizar: ${product}. Me gustaría conocer opciones de madera, medidas y plazos.`;
  }
};

/* ------------------------------------------------------------------ Año actual */
const initYear = () => {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initParallax();
  initFilters();
  initLightbox();
  initForms();
  initQueryFilter();
  initQuotePrefill();
  initYear();
});
