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

  /* 5) Honeypot antispam kontrola ------------------------------------------- */
  const forms = document.querySelectorAll('form[data-honeypot]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value !== '') {
        e.preventDefault();
      }
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
})();
