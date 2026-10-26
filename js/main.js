/**
 * Portfolio Interaction and Editorial Modal Logic
 * Shwaans Gaba Portfolio
 */

(function () {
  'use strict';

  // --- Real Project Data for Modal Deep-Dives ---
  const projectDetails = {
    'ekman': {
      title: 'Ekman by Ekta',
      category: 'E-Commerce & Herbal Skincare',
      year: '2025',
      image: 'assets/project-ekman.png',
      link: 'https://www.ekmanbyekta.com',
      overview: 'An e-commerce website for a herbal skincare startup in Delhi featuring inventory management, custom payment gateway integration, and luxury editorial catalog design.',
      problem: 'Artisanal herbal skincare requires conveying botanical authenticity and tactile luxury while maintaining real-time inventory synchronization across multi-variant cosmetic SKUs.',
      solution: 'Engineered an editorial e-commerce platform with automated stock alerts, razor-fast checkout flows, and responsive luxury photography galleries.',
      stack: ['React', 'Next.js', 'Razorpay Gateway', 'Inventory API', 'TailwindCSS'],
      metrics: ['100% automated payment reconciliations', 'Zero cart checkout dropouts', 'Delivering to customers nationwide']
    },
    'soundfinance': {
      title: 'Sound Finance Pvt. Ltd.',
      category: 'NBFC Corporate Architecture & Fleet Finance',
      year: '2025',
      image: 'assets/project-soundfinance.png',
      link: 'https://sankalpdigitech.github.io/SoundFinance/',
      overview: 'A dedicated digital platform for an RBI-registered NBFC firm in Delhi providing end-to-end commercial vehicle loans, eNACH mandate processing, and online EMI schedules.',
      problem: 'Commercial vehicle fleet operators require instant visibility into on-road funding ratios, repayment schedules, and automated online EMI payments without tedious paperwork.',
      solution: 'Built a financial architecture featuring a real-time EMI calculation engine, fleet eligibility lookup tools, automated eNACH mandate onboarding, and streamlined loan inquiry workflows.',
      stack: ['JavaScript', 'Financial Algorithms', 'TailwindCSS', 'eNACH Integration', 'Responsive UI'],
      metrics: ['Up to 90% on-road funding support', '34+ years NBFC legacy digitized', 'Instant EMI calculation results']
    },
    'grynd': {
      title: 'Grynd',
      category: 'Student Talent & Freelance Marketplace',
      year: '2025',
      image: 'assets/project-grynd.png',
      link: 'https://sankalpdigitech.github.io/Grynd/',
      overview: 'A prototype online freelance marketplace empowering student creators and teens to monetize creative skills like video editing, fest poster design, and academic tutoring.',
      problem: 'Teen and student freelancers face high barrier-to-entry and predatory commission fees on traditional freelancing platforms like Upwork and Fiverr.',
      solution: 'Designed an intuitive, youth-oriented marketplace prototype with low-friction student onboarding, verified portfolio badges, client hiring portals, and instant gig matching.',
      stack: ['HTML5', 'Modern CSS', 'JavaScript ES6+', 'Prototyping Tools'],
      metrics: ['Zero commission barriers for student creators', 'Curated categories for campus gigs', 'Rapid client-to-freelancer matchmaking']
    }
  };

  // --- Modal Logic ---
  const modalBackdrop = document.getElementById('case-study-modal');
  const modalContent = document.getElementById('modal-content-area');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCaseStudy(projectId) {
    const data = projectDetails[projectId];
    if (!data || !modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <span style="font-size: 0.76rem; color: var(--text-navy-accent); text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600;">${data.category} : ${data.year}</span>
          <h2 class="modal-title" style="margin-top: 8px;">${data.title}</h2>
        </div>
      </div>
      <div class="modal-image-stage">
        <img src="${data.image}" alt="${data.title}" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 28px; line-height: 1.7; color: var(--text-secondary); font-size: 1rem;">
        <div>
          <h4 style="color: #ffffff; font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 8px;">Overview</h4>
          <p>${data.overview}</p>
        </div>
        <div>
          <h4 style="color: #ffffff; font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 8px;">The Design Challenge</h4>
          <p>${data.problem}</p>
        </div>
        <div>
          <h4 style="color: #ffffff; font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 8px;">Engineering Architecture</h4>
          <p>${data.solution}</p>
        </div>
        <div>
          <h4 style="color: #ffffff; font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 12px;">Core Technologies</h4>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${data.stack.map(tech => `<span style="font-size: 0.8rem; color: var(--text-primary); background: rgba(147, 197, 253, 0.08); border: 1px solid var(--border-navy); padding: 6px 14px; border-radius: var(--radius-pill); font-weight: 500;">${tech}</span>`).join('')}
          </div>
        </div>
        <div style="padding: 24px; background: rgba(5, 10, 23, 0.5); border: 1px solid var(--border-navy); border-radius: var(--radius-curvy-md);">
          <h4 style="color: #ffffff; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; font-weight: 600;">Verified Metrics</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
            ${data.metrics.map(m => `<li style="font-size: 0.92rem; color: var(--text-primary); display: flex; align-items: baseline; gap: 10px;"><span style="color: var(--text-navy-accent); font-size: 0.75rem;">•</span> ${m}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      openCaseStudy(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCaseStudy);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeCaseStudy();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeCaseStudy();
    }
  });

  // --- 1-Click Email Copy ---
  const emailBox = document.getElementById('email-copy-capsule');
  const toast = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  if (emailBox) {
    emailBox.addEventListener('click', () => {
      const email = emailBox.getAttribute('data-email') || 'shwaansgaba@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard');
      }).catch(() => {
        showToast('Direct contact: ' + email);
      });
    });
  }

  // --- Contact Transmission Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-form-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Transmitting inquiry...';
        submitBtn.style.opacity = '0.7';
        setTimeout(() => {
          submitBtn.textContent = 'Message Received';
          submitBtn.style.background = '#93c5fd';
          submitBtn.style.color = '#050a17';
          submitBtn.style.opacity = '1';
          contactForm.reset();
          showToast('Inquiry received. Shwaans Gaba will respond promptly.');
          setTimeout(() => {
            submitBtn.textContent = 'Send Transmission';
            submitBtn.style.background = '#ffffff';
          }, 3500);
        }, 800);
      }
    });
  }

  // --- 3D Spiral Helix Animator ---
  // --- Smooth Anchor Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Nav Section Tracking ---
  const sections = document.querySelectorAll('section[id], div[id="intro"]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 250;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --- Ambient Floating Luminous Blue Orbs (Continuous Scroll Parallax & Breathing) ---
  const orb1 = document.getElementById('ambient-orb-1');
  const orb2 = document.getElementById('ambient-orb-2');
  const orb3 = document.getElementById('ambient-orb-3');
  const orb4 = document.getElementById('ambient-orb-4');
  const orb5 = document.getElementById('ambient-orb-5');

  let orbTargetScroll = 0;
  let orbCurrentScroll = 0;

  function animateAmbientOrbs() {
    orbTargetScroll = window.scrollY || window.pageYOffset || 0;
    orbCurrentScroll += (orbTargetScroll - orbCurrentScroll) * 0.10;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? Math.max(0, Math.min(1, orbCurrentScroll / docHeight)) : 0;
    const time = performance.now() * 0.00125;

    // Organic hover breathing (25% faster pacing)
    const float1X = Math.sin(time * 0.7) * 26;
    const float1Y = Math.cos(time * 0.5) * 20;

    const float2X = Math.cos(time * 0.6) * 30;
    const float2Y = Math.sin(time * 0.8) * 24;

    const float3X = Math.sin(time * 0.5 + 1.2) * 34;
    const float3Y = Math.cos(time * 0.7 + 1.2) * 28;

    const float4X = Math.cos(time * 0.8 + 2.4) * 26;
    const float4Y = Math.sin(time * 0.6 + 2.4) * 20;

    const float5X = Math.sin(time * 0.6 + 3.6) * 26;
    const float5Y = Math.cos(time * 0.5 + 3.6) * 24;

    // Parallax displacements as user scrolls down
    if (orb1) {
      const x = float1X - p * 160;
      const y = float1Y + p * 280;
      orb1.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    if (orb2) {
      const x = float2X + p * 180;
      const y = float2Y - p * 220;
      orb2.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    if (orb3) {
      const x = float3X - p * 220;
      const y = float3Y + p * 340;
      orb3.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    if (orb4) {
      const x = float4X + p * 200;
      const y = float4Y - p * 260;
      orb4.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    if (orb5) {
      const x = float5X - p * 150;
      const y = float5Y - p * 240;
      orb5.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    requestAnimationFrame(animateAmbientOrbs);
  }

  requestAnimationFrame(animateAmbientOrbs);
})();
