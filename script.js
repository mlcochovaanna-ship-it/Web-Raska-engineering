/* ==========================================================================
   Raška engineering s.r.o. — jemná interaktivita
   1) sticky hlavička při scrollu
   2) mobilní menu
   3) scroll-reveal animace
   4) cookie lišta (Přijmout / Odmítnout / Nastavit)
   5) lightbox galerie realizací
   6) honeypot antispam kontrola formuláře
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

  /* 4) Cookie lišta ---------------------------------------------------------- */
  const CONSENT_KEY = 'raska-cookie-consent';
  const banner = document.querySelector('.cookie-banner');

  if (banner) {
    const settingsPanel = banner.querySelector('.cookie-settings');
    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const rejectBtn = banner.querySelector('[data-cookie-reject]');
    const settingsBtn = banner.querySelector('[data-cookie-settings]');
    const saveBtn = banner.querySelector('[data-cookie-save]');
    const statsCheckbox = banner.querySelector('#cookie-stats');
    const marketingCheckbox = banner.querySelector('#cookie-marketing');

    const hideBanner = () => banner.classList.remove('is-visible');

    const storeConsent = (value) => {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
      } catch (e) {
        /* localStorage nemusí být dostupný, souhlas se pak jen neuloží */
      }
      hideBanner();
    };

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(CONSENT_KEY));
    } catch (e) {
      stored = null;
    }

    if (!stored) {
      requestAnimationFrame(() => banner.classList.add('is-visible'));
    }

    acceptBtn?.addEventListener('click', () => {
      storeConsent({ statistics: true, marketing: true });
    });

    rejectBtn?.addEventListener('click', () => {
      storeConsent({ statistics: false, marketing: false });
    });

    settingsBtn?.addEventListener('click', () => {
      settingsPanel.classList.toggle('is-open');
    });

    saveBtn?.addEventListener('click', () => {
      storeConsent({
        statistics: !!statsCheckbox?.checked,
        marketing: !!marketingCheckbox?.checked,
      });
    });
  }

  /* 5) Lightbox galerie realizací -------------------------------------------- */
  const lightbox = document.querySelector('#showcase-lightbox');
  const galleryPhotos = Array.from(document.querySelectorAll('.showcase-photo > img'));

  if (lightbox && galleryPhotos.length) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav--next');
    let currentIndex = 0;

    const showPhoto = (index) => {
      if (index < 0 || index >= galleryPhotos.length) return;
      currentIndex = index;
      const photo = galleryPhotos[currentIndex];
      lightboxImg.src = photo.currentSrc || photo.src;
      lightboxImg.alt = photo.alt;
      lightboxCaption.textContent = photo.dataset.caption || '';
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === galleryPhotos.length - 1;
    };

    const openLightbox = (index) => {
      showPhoto(index);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    galleryPhotos.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => showPhoto(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showPhoto(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
      if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });
  }

  /* 6) Honeypot antispam kontrola ------------------------------------------- */
  const forms = document.querySelectorAll('form[data-honeypot]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value !== '') {
        e.preventDefault();
      }
    });
  });
})();
