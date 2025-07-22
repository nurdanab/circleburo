import './App.css';
import Header from './components/Header';
import './i18n';
import './scss/main.scss';
import { useEffect, useState, useRef } from 'react';
import PhoneForm from './components/PhoneForm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabaseClient'; 
import AnimatedTitle from './components/AnimatedTitle';
gsap.registerPlugin(ScrollTrigger);


function Home() {
 const { t } = useTranslation();
  const [name, setName] = useState('');
const [phone, setPhone] = useState('');
const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    
  // Закрытие мобильного меню по клику вне
    function handleOutsideClick(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.burger')
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    
    const container = document.querySelector('.card-container');
    const wrapper = document.querySelector('.card-container-wrapper');

    const updateBlur = () => {
      if (!container || !wrapper) return;
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      wrapper.classList.toggle('blur-visible-left', scrollLeft > 10);
      wrapper.classList.toggle('blur-visible-right', scrollLeft < maxScrollLeft - 10);
    };

    container?.addEventListener('scroll', updateBlur);
    updateBlur();

    // === 3. Анимация HERO и поворот ===
    const hero = document.querySelector('.hero');
    const nextSection = document.querySelector('#next-section');
    const stone = document.querySelector('.hero-stone');
    const scrollBtn = document.querySelector('.scroll-down');
    const circle = document.querySelector('.rotating-circle');
    const heroContent = document.querySelector('.hero-content');
    const whyContent = document.querySelector('.why-content');
    const whyValues = document.querySelector('.why-values');
    const cursor = document.querySelector('.custom-cursor');
    const secondCircle = document.querySelector('.second-circle');
    const servicesSection = document.querySelector('.services-section');
    const portfolioSection = document.querySelector('.portfolio-section');

    if (stone && hero) {
      hero.addEventListener('mousemove', (e) => {
        const { width, height, left, top } = hero.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / width;
        const y = (e.clientY - top - height / 2) / height;
        stone.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      });
      hero.addEventListener('mouseleave', () => {
        stone.style.transform = 'translate(0, 0)';
      });
    }

    scrollBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      nextSection?.scrollIntoView({ behavior: 'smooth' });
    });

    function updateRotation() {
      if (!circle || !hero || !nextSection) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      const progress = Math.min(Math.max(heroBottom / windowHeight, 0), 1);
      const rotation = (1 - progress) * 120;
      circle.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
      requestAnimationFrame(updateRotation);
    }
    requestAnimationFrame(updateRotation);

    function updateVisibility() {
      if (heroContent && hero) {
        const heroRect = hero.getBoundingClientRect();
        const visible = heroRect.bottom >= window.innerHeight * 0.6;
        heroContent.classList.toggle('animate-in', visible);
        stone?.classList.toggle('hidden-on-scroll', !visible);
      }
      if (whyContent && nextSection) {
        const sectionRect = nextSection.getBoundingClientRect();
        const inView = sectionRect.top < window.innerHeight * 0.8 && sectionRect.bottom > window.innerHeight * 0.3;
        whyContent.classList.toggle('animate-in', inView);
        whyValues?.classList.toggle('animate-in', inView);
      }
      requestAnimationFrame(updateVisibility);
    }
    requestAnimationFrame(updateVisibility);

    const setupScrollTriggers = () => {
     
    };

// Вызов после первого кадра рендера, чтобы AnimatedTitle успел смонтироваться
requestAnimationFrame(() => {
  setupScrollTriggers();
});
window.addEventListener('resize', setupScrollTriggers);


    // === 5. Кастомный курсор ===
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const speed = 0.2;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (currentX === 0 && currentY === 0) {
        currentX = mouseX;
        currentY = mouseY;
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
      }
    });
    function animateCursor() {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, .hover-target').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
    let inactivityTimer;
    document.addEventListener('mousemove', () => {
      cursor.classList.remove('cursor-hidden');
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        cursor.classList.add('cursor-hidden');
      }, 2500);
    });

    const sections = document.querySelectorAll("section[id]");
    const homeLink = document.querySelector('a[href="#home-section"]');
    
    function setActiveNavLink() {
      const navLinks = document.querySelectorAll(".nav-link");
      let index = sections.length;
    
      while (--index >= 0) {
        const sectionTop = sections[index].getBoundingClientRect().top;
    
        if (sectionTop <= window.innerHeight / 2) {
          navLinks.forEach(link => link.classList.remove("active"));
    
          const currentId = sections[index].id;
    
          if (currentId === "hero" || currentId === "next-section") {
            homeLink?.classList.add("active");
          } else {
            const activeLinks = document.querySelectorAll(`a[href="#${currentId}"]`);
            activeLinks.forEach(link => link.classList.add("active"));
          }
    
          break;
        }
      }
    
      requestAnimationFrame(setActiveNavLink);
    }
    
    requestAnimationFrame(setActiveNavLink);

    requestAnimationFrame(() => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300); 
      
        const aboutSection = document.querySelector('.about-section');
        const aboutContainer = document.querySelector('.about-section .container');
        const aboutText = document.querySelector('.about-text');
        const statBoxes = document.querySelectorAll('.stat-box');
        const aboutParagraphs = document.querySelectorAll('.about-text p');
      
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                aboutContainer?.classList.add('animate-in');
                aboutText?.classList.add('animate-in');
      
                aboutParagraphs.forEach((p, i) => {
                  p.style.transitionDelay = `${i * 200}ms`;
                  p.style.opacity = '1';
                  p.style.transform = 'translateY(0)';
                });
      
                statBoxes.forEach((box, i) => {
                  setTimeout(() => box.classList.add('animate-in'), i * 200);
                });
      
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.3 }
        );
      
        if (aboutSection) observer.observe(aboutSection);
  
    });
    
  }, []);

  return (
    <>
     <Header />

      <main className="main-container">
        <img src="/img/back.png" alt="Stone" className="hero-stone" />
        <img src="/img/circle-vector.png" alt="Rotating Circle" className="rotating-circle" />

{/* HERO - SECTION */}
<section id="home-section">
<section className="hero" id="hero">
    <div className="hero-content">
      <h2 className="scroll-from-right">{t('hero.title')}<br /><span className="inline">{t('hero.subtitle1')}</span></h2>
      <p className="scroll-from-right">{t('hero.subtitle2')}</p>
      <div className="button-and-arrow">
        <a href="#" className="learn-more-btn scroll-from-right">{t('hero.button')}</a>
        <div className="scroll-down scroll-from-right">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67" />
          </svg>
        </div>
      </div>
    </div>
  </section>

{/* WHY - SECTION */}

<section className="why-section" id="next-section">
    <div className="container scroll-animate">
      <div className="why-content">
        <h2>{t('why.title')}</h2>
        <p>
          {t('why.text1')}<br />
          {t('why.text2')}<br />
          {t('why.text3')}
        </p>
      </div>
      <div className="why-values">
        <div className="value-item">{t('why.values.result')}<span className="tooltip">{t('why.tooltips.result')}</span></div>
        <div className="value-item">{t('why.values.growth')}<span className="tooltip">{t('why.tooltips.growth')}</span></div>
        <div className="value-item">{t('why.values.transparency')}<span className="tooltip">{t('why.tooltips.transparency')}</span></div>
        <div className="value-item">{t('why.values.responsibility')}<span className="tooltip">{t('why.tooltips.responsibility')}</span></div>
      </div>
    </div>
  </section></section>

{/* SERVICES - SECTION  */}
<section className="services-section" id="services">
  <div className="services-title-wrapper">
    <AnimatedTitle text={t('services.title')} />
  </div>
  <div className="services-cards-wrapper">
    <div className="services-cards">
      
      {/* Semi Circle Card */}
      <Link to="/services/semicircle">
        <div className="service-card semi-card">
          <p className="card-type">{t('services.cards.single')}</p>
          <h3 className="card-title">
            {t('services.names.semicircle')} <span className="icon semi"></span>
          </h3>
          <p className="card-desc">{t('services.descriptions.single')}</p>
          <p className="card-ideal">{t('services.ideal.single')}</p>
          <div className="card-arrow"><svg
  className="arrow-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor" 
  viewBox="0 0 16 16"
>
  <path
    fillRule="evenodd"
    d="M1.5 8a.5.5 0 0 1 .5-.5h10.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L12.793 8.5H2a.5.5 0 0 1-.5-.5z"
/>
</svg></div>
        </div>
      </Link>

      {/* Circle Card */}
      <Link to="/services/circle">
        <div className="service-card circle-card">
          <p className="card-type">{t('services.cards.full')}</p>
          <h3 className="card-title">
            {t('services.names.circle')} <span className="icon circle-1"></span>
          </h3>
          <p className="card-desc">{t('services.descriptions.full')}</p>
          <p className="card-ideal">{t('services.ideal.full')}</p>
          <div className="card-arrow"><svg
  className="arrow-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor" 
  viewBox="0 0 16 16"
>
  <path
    fillRule="evenodd"
    d="M1.5 8a.5.5 0 0 1 .5-.5h10.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L12.793 8.5H2a.5.5 0 0 1-.5-.5z"
/>
</svg></div>
        </div>
      </Link>

      {/* Cycle Card */}
      <Link to="/services/cycle">
        <div className="service-card cycle-card">
          <p className="card-type">{t('services.cards.monthly')}</p>
          <h3 className="card-title">
            {t('services.names.cycle')} <span className="icon cycle"></span>
          </h3>
          <p className="card-desc">{t('services.descriptions.monthly')}</p>
          <p className="card-ideal">{t('services.ideal.monthly')}</p>
          <div className="card-arrow"><svg
  className="arrow-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor" 
  viewBox="0 0 16 16"
>
  <path
    fillRule="evenodd"
    d="M1.5 8a.5.5 0 0 1 .5-.5h10.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L12.793 8.5H2a.5.5 0 0 1-.5-.5z"
/>
</svg></div>
        </div>
      </Link>

    </div>
  </div>
</section>

  {/* ABOUT - SECTION  */}
  <section className="about-section" id="about">
  <div className="container">
    <h2 className="about-title">{t('about.title')}</h2>

    <div className="about-content">
      <div className="about-text">
        <p>{t('about.text1')}</p>
        <p>{t('about.text2')}</p>
        <p>{t('about.text3')}</p>
        <p>{t('about.text4')}</p>
      </div>

      <div className="about-stats">
        <div className="stat-box">
          <strong>{t('about.phases.discovery.title')}</strong>
          <span>{t('about.phases.discovery.desc')}</span>
        </div>

        <div className="stat-box">
          <strong>{t('about.phases.ideation.title')}</strong>
          <span>{t('about.phases.ideation.desc')}</span>
        </div>

        <div className="stat-box">
          <strong>{t('about.phases.production.title')}</strong>
          <span>{t('about.phases.production.desc')}</span>
        </div>

        <div className="stat-box">
          <strong>{t('about.phases.implementation.title')}</strong>
          <span>{t('about.phases.implementation.desc')}</span>
        </div>

        <div className="stat-box">
          <strong>{t('about.phases.delivery.title')}</strong>
          <span>{t('about.phases.delivery.desc')}</span>
        </div>
      </div>

      <div className="img-about">
        <img src="/img/circle-vectorrr-w2.png" alt="Decorative Element" className="about-image" />
      </div>
    </div>
  </div>
</section>

{/* PORTFOLIO - SECTION  */}
<section className="portfolio-section" id="portfolio">
  <AnimatedTitle text={t('portfolio.title')} />
  <div className="card-container-wrapper">
    <div className="card-container">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div key={index} className="project-card">
          <div
            className="project-image"
            style={{
              '--bg-image': `url('/img/project${index + 1}.png')`,
              '--bg-hover': `url('/img/project${index + 1}_hover.png')`
            }}
          >
            <div className="image-overlay">
              <button className="view-button">{t('portfolio.view')}</button>
            </div>
          </div>
          <div className="project-content">
            <h3 className="project-title">{t(`portfolio.projects.${index + 1}.title`)}</h3>
            <p className="project-description">{t(`portfolio.projects.${index + 1}.description`)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


{/* FORM - SECTION  */}

<section className="form-section" id="form">
<PhoneForm />
  </section>

      </main>

{/* FOOTER  */}
<footer className="footer-distributed">

  <div className="footer-left">
    <div className="foot-logo"><img src="/img/Header-logo.png" /></div>
    <p className="footer-links">
      <a href="#hero" className="link-1">{t('nav.home')}</a>
      <a href="#services">{t('nav.services')}</a>
      <a href="#about">{t('nav.about')}</a>
      <a href="#portfolio">{t('nav.portfolio')}</a>
    </p>
    <p className="footer-company-name">Circle © 2025</p>
  </div>

  <div className="footer-center">
    <div>
      <i className="fa fa-map-marker"></i>
      <p><span>{t('footer.address.street')}</span> {t('footer.address.city')}</p>
    </div>
    <div>
      <i className="fa fa-phone"></i>
      <p>{t('footer.phone')}</p>
    </div>
    <div>
      <i className="fa fa-envelope"></i>
      <p>{t('footer.email')}</p>
    </div>
  </div>

  <div className="footer-right">
    <p className="footer-company-about">
      <span>{t('footer.aboutTitle')}</span>
      {t('footer.aboutText')}
    </p>
    <div class="footer-icons">
					<a href='https://www.instagram.com/circle.creativeburo?igsh=MXJjM2hmb2lpd2NjNQ%3D%3D&utm_source=qr'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg> </a>
					<a href='https://wa.me/77019321333'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
</svg> </a>
<a href="tel:+77019321333"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-telephone-plus-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5"/>
</svg></a>
				</div>
  </div>
</footer>
      <div className="custom-cursor"></div>
    </>
  );
}

export default Home;