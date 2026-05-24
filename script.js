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
    if (!productSlider) return;

    const slides = productSlider.querySelectorAll('.product-slide');
    const left = productSlider.querySelector('.product-arrow-left');
    const right = productSlider.querySelector('.product-arrow-right');
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

      let startX = null;
      productSlider.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      });
      productSlider.addEventListener('touchend', function (e) {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
          left.click();
        } else if (startX - endX > 50) {
          right.click();
        }
        startX = null;
      });
    }
  })();

  // intl-tel-input — флаг, код страны, dropdown (как на universal-pack.ru)
  let phoneIntlInstance = null;

  function initPhoneIntl() {
    const phoneIntlInput = document.getElementById('phoneIntl');

    if (!phoneIntlInput || !window.intlTelInput || phoneIntlInput.closest('.iti')) {
      return phoneIntlInstance;
    }

    phoneIntlInstance = window.intlTelInput(phoneIntlInput, {
      initialCountry: 'ru',
      separateDialCode: true,
      preferredCountries: ['ru', 'us', 'de', 'tm', 'kz', 'uz'],
      nationalMode: false,
      formatOnDisplay: true,
      autoPlaceholder: 'aggressive',
      countrySearch: true,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.0/build/js/utils.js'
    });

    return phoneIntlInstance;
  }

  initPhoneIntl();
  window.addEventListener('load', initPhoneIntl);

  // AJAX-отправка формы + модальное окно «Спасибо!»
  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('formSuccessModal');
  const successOverlay = document.getElementById('formSuccessOverlay');
  const successClose = document.getElementById('formSuccessClose');
  const successBtn = document.getElementById('formSuccessBtn');
  const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;

  function openSuccessModal() {
    if (!successModal) return;
    successModal.classList.add('is-open');
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessModal() {
    if (!successModal) return;
    successModal.classList.remove('is-open');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (successClose) successClose.addEventListener('click', closeSuccessModal);
  if (successBtn) successBtn.addEventListener('click', closeSuccessModal);
  if (successOverlay) successOverlay.addEventListener('click', closeSuccessModal);

  if (contactForm) {
    const FORM_EMAIL = 'tiktokadswemirs@gmail.com';

    async function submitContactForm(form) {
      const phoneIntlInput = document.getElementById('phoneIntl');
      if (phoneIntlInstance && phoneIntlInput) {
        phoneIntlInput.value = phoneIntlInstance.getNumber();
      }

      const formData = new FormData(form);
      const isStaticHost =
        location.hostname.includes('github.io') ||
        location.hostname.endsWith('.github.dev') ||
        location.protocol === 'file:';

      // PHP-сервер (OpenServer, хостинг с PHP)
      if (!isStaticHost) {
        try {
          const response = await fetch('send.php', { method: 'POST', body: formData });
          const data = await response.json();
          if (data && typeof data.success === 'boolean') {
            return data;
          }
        } catch (e) {
          /* fallback ниже */
        }
      }

      // GitHub Pages и статика — FormSubmit (без PHP)
      const response = await fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          phone_intl: formData.get('phone_intl'),
          _subject: 'Новая заявка с сайта Universal Pack',
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (response.ok) {
        return { success: true, message: 'Данные успешно отправлены.' };
      }

      const data = await response.json().catch(function () { return {}; });
      return {
        success: false,
        message: data.message || 'Ошибка при отправке. Проверьте почту ' + FORM_EMAIL + ' — FormSubmit мог запросить подтверждение.'
      };
    }

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const data = await submitContactForm(contactForm);

        if (data.success) {
          contactForm.reset();
          if (phoneIntlInstance) {
            phoneIntlInstance.setCountry('ru');
          }
          openSuccessModal();
        } else {
          alert(data.message || 'Ошибка при отправке.');
        }
      } catch (err) {
        alert('Не удалось отправить форму. Проверьте интернет и попробуйте снова.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }
});