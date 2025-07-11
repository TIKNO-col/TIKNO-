import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import emailjs from '@emailjs/browser';
import './App.css';
function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState('Todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [language, setLanguage] = useState('es');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const heroRef = useRef(null);

  
  const translations = {
    es: {
      nav: {
        inicio: 'Inicio',
        proyectos: 'Proyectos',
        tecnologias: 'Tecnologías',
        precios: 'Precios',
        equipo: 'Equipo',
        contacto: 'Contacto'
      },
      hero: {
        greeting: 'Hola, somos',
        studio: 'Studio',
        mission: 'Creamos experiencias digitales que transforman ideas en realidad.',
        btnProjects: 'Ver Proyectos',
        btnContact: 'Contactar',
        scroll: 'Scroll'
      },
      contact: {
        title: 'Contacto',
        subtitle: '¿Tienes un proyecto en mente? Hablemos y hagamos realidad tu idea',
        info: 'Información de Contacto',
        namePlaceholder: 'Tu nombre',
        emailPlaceholder: 'Tu email',
        subjectPlaceholder: 'Asunto',
        messagePlaceholder: 'Tu mensaje',
        sendButton: 'Enviar Mensaje',
        sending: 'Enviando...',
        successMessage: '¡Mensaje enviado correctamente!',
        errorMessage: 'Error al enviar el mensaje. Inténtalo de nuevo.'
      }
    },
    en: {
      nav: {
        inicio: 'Home',
        proyectos: 'Projects',
        tecnologias: 'Technologies',
        precios: 'Pricing',
        equipo: 'Team',
        contacto: 'Contact'
      },
      hero: {
        greeting: 'Hello, we are',
        studio: 'Studio',
        mission: 'We create digital experiences that transform ideas into reality.',
        btnProjects: 'View Projects',
        btnContact: 'Contact',
        scroll: 'Scroll'
      },
      contact: {
        title: 'Contact',
        subtitle: 'Do you have a project in mind? Let\'s talk and make your idea a reality',
        info: 'Contact Information',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'Your email',
        subjectPlaceholder: 'Subject',
        messagePlaceholder: 'Your message',
        sendButton: 'Send Message',
        sending: 'Sending...',
        successMessage: 'Message sent successfully!',
        errorMessage: 'Error sending message. Please try again.'
      }
    }
  };

  const t = translations[language];
  const projectsRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorTrailRef = useRef(null);

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_dsc3mv6';
  const EMAILJS_TEMPLATE_ID = 'template_13ce9d7';
  const EMAILJS_PUBLIC_KEY = 'KGXORJXBD5OISg81s'; // Necesitarás añadir tu clave pública

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // Email sending function
   const sendEmail = async (formData) => {
     try {
       // Verificar que las variables de entorno estén disponibles
       if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
         console.error('EmailJS configuration missing');
         return { success: false, message: 'Error de configuración. Por favor contacta al administrador.' };
       }
       
       const currentTime = new Date().toLocaleString('es-ES', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
       });
       
       const templateParams = {
         name: formData.name,
         email: formData.email,
         title: formData.title,
         message: formData.message,
         time: currentTime,
       };
       
       console.log('Sending email with params:', templateParams);
       
       const result = await emailjs.send(
         EMAILJS_SERVICE_ID,
         EMAILJS_TEMPLATE_ID,
         templateParams
       );
       
       console.log('Email sent successfully:', result);
       return { success: true, message: t.contact.successMessage };
     } catch (error) {
       console.error('Error sending email:', error);
       return { success: false, message: t.contact.errorMessage + ': ' + error.message };
     }
   };

   // Handle form input changes
   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: value
     }));
   };

   // Handle form submission
   const handleSubmit = async (e) => {
     e.preventDefault();
     e.stopPropagation();
     
     // Prevent multiple submissions
     if (isSubmitting) {
       return false;
     }
     
     setIsSubmitting(true);
     setSubmitMessage('');

     try {
       const result = await sendEmail(formData);
       
       setSubmitMessage(result.message);
       
       if (result.success) {
         // Reset form on success
         setFormData({
           name: '',
           email: '',
           title: '',
           message: ''
         });
         // Clear success message after 5 seconds
         setTimeout(() => setSubmitMessage(''), 5000);
       }
     } catch (error) {
       console.error('Form submission error:', error);
       setSubmitMessage(t.contact.errorMessage);
     } finally {
       setIsSubmitting(false);
     }
     
     return false;
   };
  
  const typewriterTexts = [
    'Creando experiencias digitales excepcionales',
    'Innovación cercana, software a tu alcance',
    'Hacemos simple lo digital'
  ];
  
  const projectCategories = [
    'Todos', 'Sostenibilidad', 'Administración', 'Creatividad', 'Analytics', 
    'Social', 'Seguridad', 'E-commerce', 'Educación', 'Salud', 'Fintech', 'IoT', 'Gaming'
  ];
  
  const projects = [
    {
      id: 1,
      title: 'EcoTech Solutions',
      category: 'Sostenibilidad',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'IoT'],
      status: '✅ COMPLETADO',
      description: 'Plataforma integral para monitoreo ambiental y gestión sostenible de recursos.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Dashboard en tiempo real', 'Sensores IoT', 'Análisis predictivo', 'Reportes automáticos'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'CloudNine Dashboard',
      category: 'Analytics',
      technologies: ['Vue.js', 'Express', 'PostgreSQL', 'TensorFlow', 'Redis'],
      status: '⏳ EN PROGRESO',
      description: 'Dashboard avanzado para análisis de datos empresariales con IA integrada.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Machine Learning', 'Visualización avanzada', 'API REST', 'Cache inteligente'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'PixelCraft Studio',
      category: 'Creatividad',
      technologies: ['React', 'Three.js', 'Firebase', 'WebGL', 'Blender'],
      status: '🎨 Creatividad',
      description: 'Estudio digital para creación y edición de contenido 3D interactivo.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Editor 3D', 'Renderizado en tiempo real', 'Colaboración online', 'Export múltiple'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 4,
      title: 'DataFlow Analytics',
      category: 'Analytics',
      technologies: ['Angular', 'Python', 'Redis', 'Kafka', 'Spark'],
      status: '📊 Analytics',
      description: 'Sistema de análisis de big data para empresas con procesamiento en tiempo real.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Big Data', 'Streaming', 'Visualización', 'APIs escalables'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 5,
      title: 'MindBridge Connect',
      category: 'Social',
      technologies: ['React Native', 'GraphQL', 'ML', 'WebRTC'],
      status: '🔬 BETA',
      description: 'Plataforma de comunicación inteligente con funciones de IA para equipos remotos.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Video conferencias', 'IA conversacional', 'Traducción automática', 'Análisis de sentimientos'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 6,
      title: 'TechVault Security',
      category: 'Seguridad',
      technologies: ['Next.js', 'Blockchain', 'Docker', 'Supabase', 'SonarQube'],
      status: '✅ COMPLETADO',
      description: 'Suite de seguridad empresarial con blockchain y análisis de vulnerabilidades.',
      image: '/api/placeholder/400/300',
      year: '2024',
      features: ['Blockchain security', 'Análisis de código', 'Monitoreo 24/7', 'Compliance automático'],
      liveUrl: '#',
      githubUrl: '#'
    }
  ];
  
  const technologies = [
    {
      name: 'React',
      icon: '⚛️',
      description: 'Biblioteca para interfaces de usuario modernas y reactivas'
    },
    {
      name: 'Node.js',
      icon: '🟢',
      description: 'Runtime de JavaScript para desarrollo backend escalable'
    },
    {
      name: 'MongoDB',
      icon: '🍃',
      description: 'Base de datos NoSQL flexible y de alto rendimiento'
    },
    {
      name: 'AWS',
      icon: '☁️',
      description: 'Servicios en la nube para infraestructura robusta'
    },
    {
      name: 'Python',
      icon: '🐍',
      description: 'Lenguaje versátil para IA, ML y desarrollo backend'
    },
    {
      name: 'React Native',
      icon: '📱',
      description: 'Framework para aplicaciones móviles multiplataforma'
    }
  ];
  
  const pricingPlans = [
    {
      name: 'Básico',
      price: '$150-250',
      icon: '🌱',
      description: 'Sitios web estáticos y landing pages',
      features: ['Diseño responsive', 'SEO básico', '3 páginas incluidas', 'Formulario de contacto', 'Hosting por 1 año']
    },
    {
      name: 'Professional',
      price: '$350-600',
      icon: '🚀',
      description: 'Apps con backend + IA',
      features: ['Base de datos', 'Panel de administración', 'API REST', 'Integración IA', 'Soporte 6 meses'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$800+',
      icon: '🏢',
      description: 'Soluciones corporativas completas',
      features: ['Arquitectura escalable', 'Microservicios', 'DevOps completo', 'Soporte 24/7', 'Mantenimiento incluido']
    }
  ];
  
  const teamMembers = [
    {
      name: 'Nicolas Moreno',
      role: 'Co-Fundador & Full Stack Developer',
      skills: ['React', 'Node.js', 'AWS', 'MongoDB'],
      avatar: '👨‍💻',
      description: 'Especialista en desarrollo frontend y arquitectura de aplicaciones'
    },
    {
      name: 'Esteban Lozano',
      role: 'Co-Fundador & Backend Developer',
      skills: ['Python', 'PostgreSQL', 'Docker', 'DevOps'],
      avatar: '👨‍💻',
      description: 'Experto en backend, bases de datos y infraestructura cloud'
    }
  ];
  
  // Efecto de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animación de entrada del hero
      anime({
        targets: '.hero-content > *',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200),
        duration: 1000,
        easing: 'easeOutExpo'
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Efecto máquina de escribir
  useEffect(() => {
    if (!isLoading) {
      let currentTextIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      
      const typeWriter = () => {
        const currentText = typewriterTexts[currentTextIndex];
        
        if (isDeleting) {
          setTypewriterText(currentText.substring(0, currentCharIndex - 1));
          currentCharIndex--;
        } else {
          setTypewriterText(currentText.substring(0, currentCharIndex + 1));
          currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentText.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
          typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
      };
      
      typeWriter();
    }
  }, [isLoading]);
  
  // Cursor personalizado
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorTrail = cursorTrailRef.current;
    
    const moveCursor = (e) => {
      if (cursor && cursorTrail) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
          cursorTrail.style.left = e.clientX + 'px';
          cursorTrail.style.top = e.clientY + 'px';
        }, 100);
      }
    };
    
    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);
  
  // Efecto de scroll reveal mejorado
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Hacer visible la sección inmediatamente
          target.style.opacity = '1';
          target.style.visibility = 'visible';
          
          // Animaciones específicas por sección
          if (target.classList.contains('projects')) {
            // Animar filtros primero
            setTimeout(() => {
              anime({
                targets: '.filter-btn',
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(50),
                duration: 600,
                easing: 'easeOutExpo'
              });
            }, 100);
            
            // Luego las tarjetas
            setTimeout(() => {
              anime({
                targets: '.project-card',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(120),
                duration: 800,
                easing: 'easeOutExpo'
              });
            }, 300);
          }
          
          if (target.classList.contains('technologies')) {
            setTimeout(() => {
              anime({
                targets: '.tech-card',
                scale: [0.8, 1],
                opacity: [0, 1],
                delay: anime.stagger(150),
                duration: 600,
                easing: 'easeOutExpo'
              });
            }, 100);
          }
          
          if (target.classList.contains('pricing')) {
            setTimeout(() => {
              anime({
                targets: '.pricing-card',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(200),
                duration: 800,
                easing: 'easeOutExpo'
              });
            }, 100);
          }
          
          if (target.classList.contains('team')) {
            setTimeout(() => {
              anime({
                targets: '.team-card',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(200),
                duration: 800,
                easing: 'easeOutExpo'
              });
            }, 100);
          }
          
          if (target.classList.contains('contact')) {
            setTimeout(() => {
              anime({
                targets: '.contact-content > *',
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 600,
                easing: 'easeOutExpo'
              });
            }, 100);
          }
          
          // Añadir clases de animación CSS
          target.classList.add('animate-up');
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);
    
    // Observar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
    
    // Observador adicional para títulos de sección
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-glow');
          anime({
            targets: entry.target,
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
          });
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => titleObserver.observe(title));
    
    return () => {
      observer.disconnect();
      titleObserver.disconnect();
    };
  }, []);
  
  // Filtrar proyectos
  const filteredProjects = projectFilter === 'Todos' 
    ? projects 
    : projects.filter(project => project.category === projectFilter);
  
  // Navegación suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };
  
  // Abrir modal de proyecto
  const openProjectModal = (project) => {
    setSelectedProject(project);
    anime({
      targets: '.project-modal',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo'
    });
  };
  
  // Cerrar modal de proyecto
  const closeProjectModal = () => {
    anime({
      targets: '.project-modal',
      scale: [1, 0.8],
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInExpo',
      complete: () => setSelectedProject(null)
    });
  };
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <h1>TIKNO</h1>
            <div className="loading-tagline">Innovación cercana, software a tu alcance</div>
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="App">
      {/* Cursor personalizado */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorTrailRef} className="custom-cursor-trail"></div>
      
      {/* Header/Navigation */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <h2>TIKNO</h2>
          </div>
          
          <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <li><a href="#inicio" onClick={() => scrollToSection('inicio')} className={activeSection === 'inicio' ? 'active' : ''}>{t.nav.inicio}</a></li>
            <li><a href="#proyectos" onClick={() => scrollToSection('proyectos')} className={activeSection === 'proyectos' ? 'active' : ''}>{t.nav.proyectos}</a></li>
            <li><a href="#tecnologias" onClick={() => scrollToSection('tecnologias')} className={activeSection === 'tecnologias' ? 'active' : ''}>{t.nav.tecnologias}</a></li>
            <li><a href="#precios" onClick={() => scrollToSection('precios')} className={activeSection === 'precios' ? 'active' : ''}>{t.nav.precios}</a></li>
            <li><a href="#equipo" onClick={() => scrollToSection('equipo')} className={activeSection === 'equipo' ? 'active' : ''}>{t.nav.equipo}</a></li>
            <li><a href="#contacto" onClick={() => scrollToSection('contacto')} className={activeSection === 'contacto' ? 'active' : ''}>{t.nav.contacto}</a></li>
            <li className="language-switcher">
              <button 
                className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
              >
                ES
              </button>
              <span className="lang-separator">|</span>
              <button 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </li>
          </ul>
          
          <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>
      
      {/* Hero Section - Minimal & Impactful */}
      <section id="inicio" className="hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        
        {/* Partículas flotantes decorativas */}
        <div className="hero-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
        
        {/* Elementos geométricos flotantes */}
        <div className="hero-geometric">
          <div className="geometric-shape shape-1"></div>
          <div className="geometric-shape shape-2"></div>
          <div className="geometric-shape shape-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-intro">
              <span className="hero-greeting">{t.hero.greeting}</span>
              <h1 className="hero-title">
                <span className="title-main">TIKNO</span>
                <span className="title-accent">{t.hero.studio}</span>
              </h1>
            </div>
            
            <div className="hero-mission">
              <p className="mission-text">
                {t.hero.mission}
              </p>
            </div>
            
            <div className="hero-actions">
              <button className="btn-minimal btn-primary" onClick={() => scrollToSection('proyectos')}>
                {t.hero.btnProjects}
              </button>
              <button className="btn-minimal btn-outline" onClick={() => scrollToSection('contacto')}>
                {t.hero.btnContact}
              </button>
            </div>
            
            <div className="hero-scroll">
              <div className="scroll-line"></div>
              <span className="scroll-label">{t.hero.scroll}</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Proyectos Section */}
      <section id="proyectos" className="section">
        <div className="container">
          <h2 className="section-title">Nuestros Proyectos</h2>
          <p className="section-subtitle">
            Descubre las soluciones innovadoras que hemos desarrollado para nuestros clientes
          </p>
          
          {/* Filtros */}
          <div className="project-filters">
            {projectCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${projectFilter === category ? 'active' : ''}`}
                onClick={() => setProjectFilter(category)}
              >
                {category}
                <span className="filter-count">
                  {category === 'Todos' ? projects.length : projects.filter(p => p.category === category).length}
                </span>
              </button>
            ))}
          </div>
          
          {/* Grid de proyectos */}
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card" onClick={() => openProjectModal(project)}>
                <div className="project-image">
                  <div className="project-image-placeholder">
                    <span className="project-icon">💻</span>
                  </div>
                  <div className="project-overlay">
                    <button className="project-view-btn">Ver Proyecto</button>
                  </div>
                </div>
                <div className="project-info">
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-tag">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                  <div className="project-status">{project.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tecnologías Section */}
      <section id="tecnologias" className="section">
        <div className="container">
          <h2 className="section-title">Tecnologías & Expertise</h2>
          <p className="section-subtitle">
            Utilizamos las tecnologías más modernas y confiables del mercado
          </p>
          
          <div className="technologies-grid">
            {technologies.map(tech => (
              <div key={tech.name} className="tech-card">
                <div className="tech-icon">{tech.icon}</div>
                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-description">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Precios Section */}
      <section id="precios" className="section">
        <div className="container">
          <h2 className="section-title">Planes y Precios</h2>
          <p className="section-subtitle">
            Soluciones accesibles adaptadas a tu presupuesto y necesidades
          </p>
          
          <div className="pricing-grid">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Más Popular</div>}
                <div className="pricing-header">
                  <div className="pricing-icon">{plan.icon}</div>
                </div>
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">{plan.price}</div>
                <p className="pricing-description">{plan.description}</p>
                <ul className="pricing-features">
                  {plan.features.map(feature => (
                    <li key={feature}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pricing-action">
                  <button className="btn btn-primary pricing-btn">
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Equipo Section */}
      <section id="equipo" className="section">
        <div className="container">
          <h2 className="section-title">Nuestro Equipo</h2>
          <p className="section-subtitle">
            Conoce a los fundadores de TIKNO, apasionados por la tecnología y la innovación
          </p>
          
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.name} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-description">{member.description}</p>
                <div className="team-skills">
                  {member.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contacto Section */}
      <section id="contacto" className="section">
        <div className="container">
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">
            {t.contact.subtitle}
          </p>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>{t.contact.info}</h3>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>contacto@tikno.dev</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>Teléfono</strong>
                  <p>+57 (350) 232-8517</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Ubicación</strong>
                  <p>Colombia</p>
                </div>
              </div>
              
              <div className="social-links">
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {submitMessage && (
                <div className={`form-message ${submitMessage.includes('Error') || submitMessage.includes('error') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.contact.namePlaceholder} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.contact.emailPlaceholder} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t.contact.subjectPlaceholder} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.contact.messagePlaceholder} 
                  rows="5" 
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.contact.sending : t.contact.sendButton}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>TIKNO</h3>
              <p>Innovación cercana, software a tu alcance</p>
              <p>"Hacemos simple lo digital"</p>
            </div>
            <div className="footer-links">
              <h4>Enlaces</h4>
              <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#proyectos">Proyectos</a></li>
                <li><a href="#tecnologias">Tecnologías</a></li>
                <li><a href="#precios">Precios</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>contacto@tikno.dev</p>
              <p>+57 (350) 232-8517</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TIKNO. Todos los derechos reservados.</p>
            <p>Desarrollado con ❤️ por Nicolas Moreno & Esteban Lozano</p>
          </div>
        </div>
      </footer>
      
      {/* Modal de Proyecto */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeProjectModal}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProjectModal}>×</button>
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedProject.title}</h2>
                <div className="modal-category">{selectedProject.category}</div>
                <div className="modal-status">{selectedProject.status}</div>
              </div>
              
              <div className="modal-body">
                <div className="modal-image">
                  <div className="modal-image-placeholder">
                    <span className="modal-icon">💻</span>
                  </div>
                </div>
                
                <div className="modal-info">
                  <p className="modal-description">{selectedProject.description}</p>
                  
                  <div className="modal-technologies">
                    <h4>Tecnologías utilizadas:</h4>
                    <div className="tech-tags">
                      {selectedProject.technologies.map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="modal-features">
                    <h4>Características principales:</h4>
                    <ul>
                      {selectedProject.features.map(feature => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="modal-actions">
                    <a href={selectedProject.liveUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                      Ver en vivo
                    </a>
                    <a href={selectedProject.githubUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                      Ver código
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;