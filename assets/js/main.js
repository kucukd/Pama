(() => {
  const root = document.documentElement;
  const body = document.body;
  const footerYear = document.querySelector('#footerYear');
  footerYear && (footerYear.textContent = String(new Date().getFullYear()));

  const cookieBanner = document.querySelector('#cookieBanner');
  const cookieAccept = document.querySelector('#cookieAccept');
  const cookieReject = document.querySelector('#cookieReject');
  const cookieKey = 'pama_cookie_consent';

  const showCookieBanner = () => {
    if (!cookieBanner || localStorage.getItem(cookieKey)) return;
    cookieBanner.classList.add('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'false');
  };

  const hideCookieBanner = (value) => {
    localStorage.setItem(cookieKey, value);
    cookieBanner?.classList.remove('is-visible');
    cookieBanner?.setAttribute('aria-hidden', 'true');
  };

  cookieAccept?.addEventListener('click', () => hideCookieBanner('all'));
  cookieReject?.addEventListener('click', () => hideCookieBanner('essential'));
  showCookieBanner();
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.primary-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const preloader = document.querySelector('.preloader');
  const backToTop = document.querySelector('.back-to-top');

  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle('is-scrolled', scrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.addEventListener('load', () => {
    window.setTimeout(() => preloader?.classList.add('is-hidden'), 260);
  });

  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Menüyü aç' : 'Menüyü kapat');
    nav?.classList.toggle('is-open', !isOpen);
    body.classList.toggle('nav-open', !isOpen);
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    });
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.primary-nav a')];
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    });
  }, { threshold: 0.42 });
  sections.forEach(section => activeObserver.observe(section));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      const duration = 1350;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  document.querySelectorAll('.spotlight-card, .visual-shell').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = -((y / rect.height) - 0.5) * 7;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });

  const form = document.querySelector('#contactForm');
  const formNote = document.querySelector('#formNote');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const type = data.get('type') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`PAMA proje ön değerlendirme: ${type}`);
    const body = encodeURIComponent(`Firma/Ad: ${name}\nE-posta: ${email}\nProje türü: ${type}\n\nMesaj:\n${message}`);
    formNote.textContent = 'Teşekkürler. E-posta uygulamanız üzerinden ön değerlendirme talebi hazırlanıyor.';
    window.location.href = `mailto:info@pama.com.tr?subject=${subject}&body=${body}`;
  });

  const canvas = document.querySelector('#networkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let points = [];
    const pointer = { x: -9999, y: -9999 };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(34, Math.floor((width * height) / 32000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.5 + 0.6
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(216, 189, 117, .72)';
      ctx.strokeStyle = 'rgba(105, 213, 155, .14)';
      points.forEach((p, i) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 145) {
            ctx.globalAlpha = (145 - dist) / 145;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
        const pdx = p.x - pointer.x;
        const pdy = p.y - pointer.y;
        const pd = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pd < 180) {
          ctx.globalAlpha = (180 - pd) / 180;
          ctx.strokeStyle = 'rgba(216, 189, 117, .28)';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(105, 213, 155, .14)';
          ctx.globalAlpha = 1;
        }
      });
      if (!reduced) requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('pointermove', event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    });
    canvas.addEventListener('pointerleave', () => {
      pointer.x = -9999;
      pointer.y = -9999;
    });
    resize();
    draw();
  }
})();
