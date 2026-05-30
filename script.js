/**
 * ☕ Euan's Coffee & Zen Portfolio Controller
 * All custom micro-interactions, theme switching, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemes();
  initMobileMenu();
  initScrollAnimations();
  initProjectFilters();
  initContactReceipt();
});

/* ==========================================================================
   ☕ THEME CONFIGURATOR ("Brew Your Theme")
   ========================================================================== */

function initThemes() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  let savedTheme = localStorage.getItem('euan-portfolio-theme') || 'americano';
  if (savedTheme !== 'americano' && savedTheme !== 'latte') {
    savedTheme = 'americano';
  }

  // Apply saved theme on load
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-value');
      applyTheme(selectedTheme);
      localStorage.setItem('euan-portfolio-theme', selectedTheme);
    });
  });
}

function applyTheme(theme) {
  // Apply data attribute to HTML tag
  document.documentElement.setAttribute('data-theme', theme);

  // Update active state in theme buttons
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme-value') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  console.log(`☕ Brewed Theme changed to: ${theme}`);
}

/* ==========================================================================
   📱 MOBILE NAVIGATION MENU
   ========================================================================== */

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navBar = document.querySelector('.nav-bar');
  const navLinks = document.querySelectorAll('.nav-item a');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navBar.classList.toggle('active');
      // Toggle menu icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navBar.classList.contains('active')) {
        navBar.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  });
}

/* ==========================================================================
   ✨ SCROLL ANIMATIONS (Skills Progress & Active Links)
   ========================================================================== */

function initScrollAnimations() {
  // 1. Skill Progress Bars Animation on Scroll
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-level');
        bar.style.width = targetPercent;
        skillObserver.unobserve(bar); // Only animate once
      }
    });
  }, { threshold: 0.1 });

  progressBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  // 2. Navigation Link Active Highlighting based on Scroll Position
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => {
    navObserver.observe(section);
  });
}

/* ==========================================================================
   🏷️ PROJECTS FILTER SYSTEM
   ========================================================================== */

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add to clicked
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardRoast = card.getAttribute('data-roast');
        
        if (filterValue === 'all' || cardRoast === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   📬 RECEIPT FORM SUBMISSION ("Grab a Cup")
   ========================================================================== */

function initContactReceipt() {
  const contactForm = document.getElementById('contactForm');
  const receiptCard = document.getElementById('receiptCard');
  const submitText = document.getElementById('submitText');
  const receiptTimestamp = document.getElementById('receiptTimestamp');

  // Set real date/time on receipt
  if (receiptTimestamp) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    receiptTimestamp.textContent = `DATE: ${dateStr} TIME: ${timeStr}`;
  }

  if (contactForm && receiptCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const message = document.getElementById('clientMessage').value.trim();

      if (!name || !email || !message) {
        alert('☕ Please fill in all fields before submitting your order!');
        return;
      }

      // Transition button to print state
      if (submitText) {
        submitText.textContent = 'PRINTING...';
      }

      // Simulate network / receipt printer sound & printing lag
      setTimeout(() => {
        // Apply class to fold / trigger stamp
        receiptCard.classList.add('submitted');
        
        if (submitText) {
          submitText.textContent = 'BREWED & DELIVERED';
        }

        // Disable all inputs
        const inputs = contactForm.querySelectorAll('.receipt-input, .receipt-textarea, .receipt-submit-btn');
        inputs.forEach(input => {
          input.disabled = true;
          input.style.opacity = '0.7';
        });

        console.log('📬 Coffee Order Submitted! Details:', { name, email, message });
        
        // Dynamic receipt alert message
        alert(`☕ Thank you, ${name}! Your message has been brewed and sent directly to Euan.`);
      }, 1500);
    });
  }
}
