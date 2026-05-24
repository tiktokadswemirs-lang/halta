document.addEventListener('DOMContentLoaded', () => {

  // Hamburger / mobile nav toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav    = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close mobile menu when any nav link is clicked
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Accordion Logic
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      const currentlyActive = document.querySelector('.accordion-item.active');
      
      // Close currently active if it's not the clicked one
      if (currentlyActive && currentlyActive !== item) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.accordion-content').style.maxHeight = null;
      }
      
      // Toggle current
      item.classList.toggle('active');
      const content = item.querySelector('.accordion-content');
      
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset (if any)
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Hero slider logic
  (function () {
    const slides = document.querySelectorAll('.hero-slide');
    const left = document.querySelector('.hero-arrow-left');
    const right = document.querySelector('.hero-arrow-right');
    let current = 0;

    function showSlide(idx) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
      });
    }

    if (left && right) {
      left.addEventListener('click', function () {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
      right.addEventListener('click', function () {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }

    // Optional: swipe support for mobile
    let startX = null;
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      });
      slider.addEventListener('touchend', function(e) {
        if (startX === null) return;
        let endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
          left.click();
        } else if (startX - endX > 50) {
          right.click();
        }
        startX = null;
      });
    }
  })();

  // Product slider logic
  (function () {
    const productSlider = document.querySelector('.product-slider');
    if (productSlider) {
      const slides = productSlider.querySelectorAll('.product-slide');
      const left = productSlider.querySelector('.product-arrow-left');
      const right = productSlider.querySelector('.product-arrow-right');
      let current = 0;

      function showSlide(idx) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === idx);
        });
      }

      left.addEventListener('click', function () {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
      right.addEventListener('click', function () {
        current = (current + 1) % slides.length;
        showSlide(current);
      });

      // Optional: swipe support for mobile
      let startX = null;
      productSlider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      });
      productSlider.addEventListener('touchend', function(e) {
        if (startX === null) return;
        let endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
          left.click();
        } else if (startX - endX > 50) {
          right.click();
        }
        startX = null;
      });
    }
  })();

  // Custom Country Select Logic
  const countrySelect = document.getElementById('countrySelect');
  if (countrySelect && typeof countriesData !== 'undefined') {
    const selected = countrySelect.querySelector('.select-selected');
    const items = countrySelect.querySelector('.select-items');
    const phoneInput = document.getElementById('phoneInput');

    // Build items
    countriesData.forEach(country => {
      const div = document.createElement('div');
      div.setAttribute('data-code', country.code);
      div.setAttribute('data-flag', country.flag);
      
      div.innerHTML = `
        <span class="country-name">${country.name}</span>
        <span class="country-code">${country.code}</span>
        <span class="country-flag">${country.flag}</span>
      `;
      
      div.addEventListener('click', function(e) {
        e.stopPropagation();
        selected.innerHTML = `<span class="flag">${country.flag}</span><span class="arrow">▼</span>`;
        phoneInput.value = country.code + ' ';
        items.classList.add('select-hide');
        countrySelect.classList.remove('open');
        phoneInput.focus();
      });
      items.appendChild(div);
    });

    selected.addEventListener('click', function(e) {
      e.stopPropagation();
      items.classList.toggle('select-hide');
      countrySelect.classList.toggle('open');
      // Scroll to top when opened
      if (!items.classList.contains('select-hide')) {
        items.scrollTop = 0;
      }
    });

    document.addEventListener('click', function() {
      items.classList.add('select-hide');
      countrySelect.classList.remove('open');
    });
  }
});
