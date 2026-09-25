/* ==========================================================================
   Raška engineering s.r.o. — jemná interaktivita
   1) sticky hlavička při scrollu
   2) mobilní menu
   3) scroll-reveal animace
   4) lightbox galerie realizací + mini-lightbox certifikátu (O nás)
   5) honeypot antispam kontrola formuláře
   6) carousel recenzí (O nás)
   ========================================================================== */

(function () {
  'use strict';

  /* 1) Sticky hlavička ---------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 2) Mobilní menu -------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navToggle && mobileNav) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      navToggle.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* 3) Scroll-reveal animace ------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* 4) Lightbox galerie realizací + mini-lightbox certifikátu ---------------- */
  /* Společný "engine" pro libovolný .lightbox element — otevře se se seznamem
     fotek {src, alt, caption} a indexem, na kterém se má otevřít. Použito
     dvakrát níž: #showcase-lightbox (fotky z DOM, .showcase-photo > img) a
     #cert-lightbox na o-nas.html (fotky z JSON v data-photos, jen 2 strany
     jednoho dokumentu). */
  const createLightbox = (lightbox) => {
    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav--next');
    let photos = [];
    let currentIndex = 0;

    const showPhoto = (index) => {
      if (index < 0 || index >= photos.length) return;
      currentIndex = index;
      const photo = photos[currentIndex];
      img.src = photo.src;
      img.alt = photo.alt || '';
      caption.textContent = photo.caption || '';
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === photos.length - 1;
    };

    const open = (newPhotos, startIndex) => {
      photos = newPhotos;
      showPhoto(startIndex || 0);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => showPhoto(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showPhoto(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
      if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });

    return { open };
  };

  const showcaseLightboxEl = document.querySelector('#showcase-lightbox');
  const galleryPhotos = Array.from(document.querySelectorAll('.showcase-photo > img'));

  if (showcaseLightboxEl && galleryPhotos.length) {
    const showcaseLightbox = createLightbox(showcaseLightboxEl);
    const photos = galleryPhotos.map((photo) => ({
      src: photo.currentSrc || photo.src,
      alt: photo.alt,
      caption: photo.dataset.caption || '',
    }));

    galleryPhotos.forEach((photoImg, index) => {
      photoImg.addEventListener('click', () => showcaseLightbox.open(photos, index));
    });
  }

  const certLightboxEl = document.querySelector('#cert-lightbox');
  const certTrigger = document.querySelector('.cert-gallery-trigger');

  if (certLightboxEl && certTrigger) {
    const certLightbox = createLightbox(certLightboxEl);
    const certPhotos = JSON.parse(certTrigger.dataset.photos);

    certTrigger.addEventListener('click', () => certLightbox.open(certPhotos, 0));
  }

  /* 5) Odeslání formuláře + honeypot antispam -------------------------------- */
  /* Vlastní děkovací stránku (Formspree _next) umí Formspree jen na placených
     plánech, proto se formulář odesílá přes fetch (AJAX, dostupné na všech
     plánech) a na děkovací stránku (data-thanks) přesměruje až tenhle skript.
     Když fetch selže (síť, 403 např. kvůli reCAPTCHA na formuláři), spadne to
     na běžné odeslání formuláře, takže poptávka se neztratí. */
  /* Formulář má novalidate, povinnost polí hlídá tenhle skript: každá
     .form-group s .form-error-msg je povinná (skupina s data-required-group =
     aspoň jedno zaškrtnuté políčko). Texty hlášek jsou v HTML, ať skript
     nezávisí na jazyce. */
  const validateGroup = (group) => {
    const err = group.querySelector('.form-error-msg');
    if (!err) return true;
    let ok;
    if (group.hasAttribute('data-required-group')) {
      ok = !!group.querySelector('input:checked');
    } else {
      const field = group.querySelector('input, textarea');
      ok = field.value.trim() !== '' && (field.type !== 'email' || /\S+@\S+\.\S+/.test(field.value));
      /* Zpráva bez odkazů: spam téměř vždy obsahuje URL. E-mailové adresy se
         před kontrolou vyřadí, ať je běžný člověk (třeba podpis s e-mailem)
         neblokuje. */
      if (ok && field.hasAttribute('data-no-links')) {
        err.dataset.defaultText = err.dataset.defaultText || err.textContent;
        const text = field.value.replace(/\S+@\S+/g, ' ');
        const hasLink = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|cz|sk|eu|li|io|ru|info|biz|xyz|top|shop|site|online|co|de|pl|ly|me|cc|club|app)\b)/i.test(text);
        if (hasLink) { ok = false; err.textContent = field.dataset.linkMsg; }
        else err.textContent = err.dataset.defaultText;
      }
      field.setAttribute('aria-invalid', String(!ok));
    }
    group.classList.toggle('has-error', !ok);
    err.classList.toggle('visible', !ok);
    return ok;
  };

  const forms = document.querySelectorAll('form[data-honeypot]');
  forms.forEach((form) => {
    const alertBox = form.querySelector('.form-alert-box');

    form.addEventListener('input', (e) => {
      const group = e.target.closest('.form-group');
      if (!group || !group.classList.contains('has-error')) return;
      validateGroup(group);
      if (alertBox && !form.querySelector('.has-error')) alertBox.textContent = '';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value !== '') return;

      const invalid = Array.from(form.querySelectorAll('.form-group')).filter((g) => !validateGroup(g));
      if (invalid.length) {
        if (alertBox) alertBox.textContent = form.dataset.msgIncomplete || '';
        const first = invalid[0];
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const target = first.querySelector('input, textarea');
        if (target) target.focus({ preventScroll: true });
        return;
      }
      if (alertBox) alertBox.textContent = '';

      const thanksUrl = form.dataset.thanks;
      if (!thanksUrl || !window.fetch) {
        form.submit();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then((res) => {
          if (res.ok) {
            try { sessionStorage.setItem('formReturn', location.pathname + location.search + '#poptavka'); } catch (e) {}
            window.location.href = thanksUrl;
          } else {
            console.warn('Formspree odmítl odeslání přes fetch, HTTP', res.status);
            form.submit();
          }
        })
        .catch((err) => {
          console.warn('Odeslání přes fetch selhalo', err);
          form.submit();
        });
    });
  });

  /* 6) Carousel recenzí (O nás) ---------------------------------------------- */
  /* .review-track je nativně scrollovatelný (scroll-snap, funguje i bez JS
     přes swipe/trackpad) – šipky jen posunou o šířku 1 karty a hlídají
     disabled stav na začátku/konci, ať carousel funguje i bez myši s
     trackpadem/dotykem. */
  const reviewTrack = document.querySelector('.review-track');
  if (reviewTrack) {
    const prevBtn = document.querySelector('.review-carousel-nav--prev');
    const nextBtn = document.querySelector('.review-carousel-nav--next');

    const updateNavState = () => {
      const maxScroll = reviewTrack.scrollWidth - reviewTrack.clientWidth;
      if (prevBtn) prevBtn.disabled = reviewTrack.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = reviewTrack.scrollLeft >= maxScroll - 4;
    };

    const scrollByCard = (direction) => {
      const card = reviewTrack.querySelector('.review-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
      reviewTrack.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    prevBtn?.addEventListener('click', () => scrollByCard(-1));
    nextBtn?.addEventListener('click', () => scrollByCard(1));
    reviewTrack.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);
    updateNavState();
  }

  /* 7) Děkovací stránka: tlačítko zpět vede na místo s formulářem, ze kterého
     návštěvník přišel (adresu si uložil formulář výše). Bez uložené adresy
     zůstane výchozí odkaz na úvodní stránku. */
  const returnBtn = document.querySelector('[data-return]');
  if (returnBtn) {
    let back = null;
    try { back = sessionStorage.getItem('formReturn'); } catch (e) {}
    if (back && /^\/(?!\/)/.test(back)) {
      returnBtn.setAttribute('href', back);
    }
  }
})();
