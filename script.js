/* ============================================================
   URBANISTA BISTRO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR — scroll behavior + burger
     ============================================================ */
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  const mMenu   = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link');

  // Scroll : shrink navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Burger toggle
  burger.addEventListener('click', () => {
    mMenu.classList.toggle('open');
    const isOpen = mMenu.classList.contains('open');
    // Animate burger
    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  /* ============================================================
     2. SMOOTH SCROLL for all anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ============================================================
     3. SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================================
     4. MENU INTERACTIF — switch catégories
     ============================================================ */
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const panels   = document.querySelectorAll('.menu-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade out then switch panel
      panels.forEach(panel => {
        if (panel.classList.contains('active')) {
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(10px)';
          setTimeout(() => {
            panel.classList.remove('active');
            panel.style.opacity = '';
            panel.style.transform = '';
          }, 220);
        }
      });

      setTimeout(() => {
        const target = document.querySelector(`[data-panel="${cat}"]`);
        if (target) {
          target.classList.add('active');
          target.style.opacity = '0';
          target.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            target.style.transition = 'opacity .35s ease, transform .35s ease';
            target.style.opacity    = '1';
            target.style.transform  = 'translateY(0)';
          });
        }
      }, 230);
    });
  });


  /* ============================================================
     5. GALERIE LIGHTBOX
     ============================================================ */
  const galItems  = document.querySelectorAll('.gal-item');
  const lightbox  = document.getElementById('lightbox');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbImg     = document.getElementById('lbImg');

  const galLabels = [
    'Ambiance terrasse', 'Bar cocktails', 'Brunch du matin',
    'Plats signature', 'Happy Hour', 'Façade du restaurant'
  ];
  const galColors = ['#5C6B3A','#C2613B','#8B7355','#6B4226','#3D5228','#2B2018'];

  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    updateLbImg();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLbImg() {
    lbImg.setAttribute('data-label', galLabels[currentIdx]);
    lbImg.style.setProperty('--ph-color', galColors[currentIdx]);
  }

  galItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  lbClose.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + galLabels.length) % galLabels.length;
    updateLbImg();
  });

  lbNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % galLabels.length;
    updateLbImg();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + galLabels.length) % galLabels.length; updateLbImg(); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % galLabels.length; updateLbImg(); }
  });


  /* ============================================================
     6. POPULAR CARDS — hover parallax léger
     ============================================================ */
  document.querySelectorAll('.pop-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - .5;
      const y     = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ============================================================
     7. ACTIVE NAV LINK on scroll (highlight current section)
     ============================================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ============================================================
     8. MENU ITEMS — stagger animation on panel switch
     ============================================================ */
  function animateMenuItems() {
    const activePanel = document.querySelector('.menu-panel.active');
    if (!activePanel) return;
    const items = activePanel.querySelectorAll('.menu-item');
    items.forEach((item, i) => {
      item.style.opacity   = '0';
      item.style.transform = 'translateX(-12px)';
      setTimeout(() => {
        item.style.transition = `opacity .4s ease ${i * 60}ms, transform .4s ease ${i * 60}ms`;
        item.style.opacity    = '1';
        item.style.transform  = 'translateX(0)';
      }, 50);
    });
  }

  // Run on initial load
  animateMenuItems();

  // Run on tab click (after panel transition)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(animateMenuItems, 280);
    });
  });


  /* ============================================================
     9. HAPPY HOUR — counter animation (just for vibes)
     ============================================================ */
  const reviewScore = document.querySelector('.review-score');
  if (reviewScore) {
    const target = 4.6;
    let current  = 0;
    const step   = target / 60;
    const scoreObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          reviewScore.textContent = current.toFixed(1);
          if (current >= target) clearInterval(interval);
        }, 16);
        scoreObs.disconnect();
      }
    }, { threshold: 0.5 });
    scoreObs.observe(reviewScore);
  }


  /* ============================================================
     10. TOUCH SWIPE for lightbox (mobile)
     ============================================================ */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentIdx = (currentIdx + 1) % galLabels.length;
      } else {
        currentIdx = (currentIdx - 1 + galLabels.length) % galLabels.length;
      }
      updateLbImg();
    }
  });


  /* ============================================================
     11. WhatsApp float — hide on footer hover
     ============================================================ */
  const waFloat = document.getElementById('waFloat');
  const footer  = document.querySelector('.footer');
  if (footer && waFloat) {
    const footerObs = new IntersectionObserver(entries => {
      waFloat.style.opacity = entries[0].isIntersecting ? '0' : '1';
    }, { threshold: 0.2 });
    footerObs.observe(footer);
  }

  /* ============================================================
     12. Page load animation — hero content entrance
     ============================================================ */
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 150);
  });

  console.log('🍹 Urbanista Bistro — site loaded. Happy Vibes Served Daily.');

});
