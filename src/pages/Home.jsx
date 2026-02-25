import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState('all');
  
  const texts = ['Web Developer', 'Web Designer', 'UI/UX Enthusiast', 'Apps Mobile Developer'];
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);

  // Dark Mode Effect
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Typing Effect
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    let timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 500);
      }
    } else {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayText, isDeleting, currentTextIndex]);

  // Initialize typing effect
  useEffect(() => {
    const startTyping = setTimeout(() => {
      setDisplayText(texts[0].charAt(0));
    }, 500);

    return () => {
      clearTimeout(startTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ["Home", "about", "skills", "projects", "certificates", "contact"];
      const offset = 100;

      let currentSection = "Home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);
    
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }, []);

  // Data Projects
  const projects = [
    {
      id: 1,
      title: "E-Ticketing Website",
      description: "A modern e-ticketing planes platform built with PHP and Tailwind CSS featuring user authentication, payment integration, and admin dashboard.",
      image: "https://mediaindonesia.gumlet.io/news/2025/07/30/1753825612_2a294aa84361f825ded5.jpg?w=376&dpr=2.6",
      category: "Web",
      technologies: ["PHP", "MySQL", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "Website About The Latest News",
      description: "Create a website project about the latest news regarding real-time case updates in the surrounding area.",
      image: "/Berita.png",
      category: "Web",
      technologies: ["React JS", "Laravel", "Tailwind CSS", "API Development"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "Mobile - Shopping App UI Figma",
      description: "Clean and modern UI design for mobile shopping app, featuring product display with multi-currency pricing and user-friendly layout.",
      image: "https://s3-alpha.figma.com/hub/file/1500292787/37912226-ed85-451f-a698-49f592a0d625-cover.png?ts=1685026550",
      category: "Design",
      technologies: ["UI Design", "Prototype", "Figma"],
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  // Data Certificates
  const certificates = [
    {
      id: 1,
      title: "Certificates - Coding Camp",
      issuer: "Alhazen Academy",
      date: "2024",
      image: "/certificates/Certificate - Fady Fadhlurrohman.jpg",
      description: "Understand the basics of web development to create a simple website.",
      skills: ["HTML", "CSS", "BOOTSTRAP"]
    },
    {
      id: 2,
      title: "Certificates - Event Cyber Security Development",
      issuer: "Binus University",
      date: "2024",
      image: "/certificates/Sertificate Fady Fadhlurrohman.png",
      description: "Participate in order to understand performance as cyber security for the security of a website or mobile app.",
      skills: ["Kali Linux", "BitLocker", "ModSecurity"]
    },
    {
      id: 3,
      title: "Certificates - Workshop",
      issuer: "Dunia Coding",
      date: "2024",
      image: "/certificates/Sertifikat-FADY FADHLURROHMAN.jpg",
      description: "Comprehensive certification in full-stack development and the practice of building websites from scratch to launch using the Laravel framework.",
      skills: ["Full Stack", "Database", "Laravel", "API Development"]
    }
  ];

  // Filter projects based on active tab
  const filteredProjects = activeProjectTab === 'all' 
    ? projects 
    : projects.filter(project => 
        project.category.toLowerCase() === activeProjectTab.toLowerCase()
      );

  // Skill Icons
  const skillIcons = {
    "React.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
    "JavaScript": "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
    "TypeScript": "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
    "Next.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
    "Tailwind CSS": "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
    "Bootstrap": "https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg",
    "CSS3": "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
    "HTML5": "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
    "PHP": "https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg",
    "Laravel": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWfitrjP8RaSyij0rDzOFvzl92--bwK-uGsw&s",
    "Python": "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
    "MySQL": "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg",
    "MongoDB": "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
    "Git": "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
    "Docker": "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
    "VS Code": "https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg",
    "GitHub": "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg",
    "Postman": "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
    "Figma": "https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg",
    "Jira": "https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-original.svg",
    "Slack": "https://raw.githubusercontent.com/devicons/devicon/master/icons/slack/slack-original.svg",
    "Vercel": "https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg",
    "Netlify": "https://raw.githubusercontent.com/devicons/devicon/master/icons/netlify/netlify-original.svg"
  };

  // Handle form submission untuk contact
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };

    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0A%0AMessage:%0A${formData.message}`;
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=fady.rohman070107@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className={`${isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'} transition-all duration-300 fixed w-full top-0 z-50 py-3`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Porto<span className="text-gray-800 dark:text-gray-200">Folio</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {["Home", "about", "skills", "projects", "certificates", "contact"].map((section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(section);
                    }}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 group ${
                      activeSection === section
                        ? "text-blue-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-green-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                      activeSection === section ? 'scale-x-100' : ''
                    }`}></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Social Icons */}
              <div className="flex items-center space-x-2">
                {[
                  { href: "https://www.instagram.com/fdyfr_/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { href: "https://github.com/FadyFr", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
                  { href: "https://www.linkedin.com/in/fady-fadhlurrohman-8258a0319/", icon: "M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:scale-110 text-gray-600 dark:text-gray-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none transition-colors border border-gray-200 dark:border-gray-700"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              <div className="space-y-1">
                {["Home", "about", "skills", "projects", "certificates", "contact"].map((section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(section);
                    }}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-300 mx-2 rounded-lg ${
                      activeSection === section
                        ? "text-blue-600 bg-blue-50 dark:bg-green-900/30 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                ))}
                
                {/* Social Media Links in Mobile Menu */}
                <div className="flex justify-center space-x-4 pt-3 pb-2 border-t border-gray-200 dark:border-gray-600 mx-4 mt-2">
                  {[
                    { href: "https://www.instagram.com/fdyfr_/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                    { href: "https://github.com/FadyFr", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
                    { href: "https://www.linkedin.com/in/fady-fadhlurrohman-8258a0319/", icon: "M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <br />

      {/* Home Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden" id="Home">
        {/* Background Decoration */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="text-center max-w-4xl w-full relative z-10">
          {/* Foto */}
          <div className="relative inline-block mb-4 sm:mb-6 group">
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600' 
                : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'
            }`}></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-green-400 dark:to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
            <img
              src="/ganteng.jpeg"
              alt="Fady Fadhlurrohman"
              className="relative w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 mx-auto rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover transform group-hover:scale-105 transition-transform duration-500"
              data-aos='zoom-in'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150?text=Fady";
              }}
            />
          </div>
          
          {/* NAMA DALAM SATU BARIS */}
          <h1 className="relative mb-3 sm:mb-4 px-4 flex flex-wrap items-center justify-center gap-2" data-aos='fade-up'>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-green-400 dark:to-green-600 animate-gradient-x">
              Fady
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300">
              Fadhlurrohman
            </span>
          </h1>
          
          {/* Typing Effect */}
          <div className={`font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 h-10 sm:h-12 px-4`} data-aos='fade-up' data-aos-delay="100">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-green-900/30 dark:to-green-800/30 backdrop-blur-sm">
              <span className={isDarkMode ? 'text-green-400' : 'text-blue-600'}>
                {displayText}
              </span>
              <span className={`inline-block w-0.5 h-5 ml-1 ${
                isDarkMode ? 'bg-green-400' : 'bg-blue-600'
              } animate-pulse`}>|</span>
            </span>
          </div>
          
          {/* Deskripsi */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg" data-aos='fade-up' data-aos-delay="200">
            <span className="text-2xl mr-1">👋</span> 
            Hello, I am a software developer who has high enthusiasm for information technology and development. And have expertise and experience in the IT field.
          </p>
          
          {/* Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-6" data-aos='fade-up' data-aos-delay="300">
            <a
              className={`relative group px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto text-center overflow-hidden ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              }`}
              href="#about"
            >
              <span className="relative z-10">About Me</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
            <a 
              className="relative group px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto text-center overflow-hidden backdrop-blur-sm"
              href="#projects"
            >
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-green-500/10 dark:to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900" id="about">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-white" data-aos="fade-down">
            About Me
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg" data-aos="fade-up">
            Transforming ideas into digital experiences
          </p>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="lg:w-1/2 w-full" data-aos="fade-right">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Hello, I'm Fady</h2>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Software Developer</h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                 Passionate about technology since childhood, I've cultivated a strong foundation through education and hands-on experience in areas like software development and digital innovation. I see tech as a catalyst for meaningful impact, and I'm currently sharpening my skills in web development, while actively seeking opportunities to collaborate on impactful, forward-thinking projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a 
                    href="/cv-fady-fadhlurrohman.pdf" 
                    download
                    className={`text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm w-full sm:w-auto text-center ${
                      isDarkMode 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Download CV
                  </a>
                  <a 
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 text-xs sm:text-sm w-full sm:w-auto text-center"
                    href="#certificates"
                  >
                    View Certificates
                  </a>
                </div>
              </div>
            </div>
            
            {/* Lanyard Container */}
            <div className="lg:w-1/2 w-full flex justify-center" data-aos="fade-left" data-aos-delay="200">
              <div className="relative">
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-gray-400 to-gray-300 rounded-t-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mx-auto -mt-0.5 sm:-mt-1 shadow-sm border border-yellow-400"></div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-2 sm:p-3 transform rotate-2 transition-all duration-300 hover:rotate-0 hover:shadow-2xl">
                  <div className="w-36 h-44 sm:w-48 sm:h-60 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src="/Foto.png"
                      alt="Fady Fadhlurrohman"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/200x250?text=Fady";
                      }}
                    />
                  </div>
                  
                  <div className={`mt-2 sm:mt-3 px-2 sm:px-3 py-1 sm:py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <p className="text-xs sm:text-sm font-bold text-white text-center">
                      Fady Fadhlurrohman
                    </p>
                    <p className="text-xs text-white/80 text-center mt-0.5 sm:mt-1">
                      Software Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden" id="skills">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-green-200 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16" data-aos="fade-up">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-green-400 bg-blue-100 dark:bg-green-900/30 rounded-full mb-4">
              Technical Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-green-400 dark:to-white">
              My Skills & Technologies
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Crafting robust solutions with modern technologies and best practices. 
              Continuously learning and adapting to industry trends.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16" data-aos="fade-up" data-aos-delay="100">
            {[
              { label: 'Projects Completed', value: '3+', icon: '🚀' },
              { label: 'Years Experience', value: '3+', icon: '💼' },
              { label: 'Technologies', value: '15+', icon: '💻' },
              { label: 'Happy Clients', value: '4+', icon: '🤝' },
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2" data-aos="fade-right">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Core Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                { name: "React.js", icon: skillIcons["React.js"], level: 50, category: "frontend", color: "from-cyan-500 to-blue-500" },
                { name: "JavaScript", icon: skillIcons["JavaScript"], level: 85, category: "frontend", color: "from-yellow-300 to-yellow-300" },
                { name: "TypeScript", icon: skillIcons["TypeScript"], level: 20, category: "frontend", color: "from-blue-600 to-blue-600" },
                { name: "Next.js", icon: skillIcons["Next.js"], level: 30, category: "frontend", color: "from-gray-700 to-gray-900" },
                { name: "Tailwind CSS", icon: skillIcons["Tailwind CSS"], level: 100, category: "frontend", color: "from-cyan-300 to-cyan-300" },
                { name: "PHP", icon: skillIcons["PHP"], level: 80, category: "backend", color: "from-indigo-600 to-indigo-800" },
                { name: "Laravel", icon: skillIcons["Laravel"], level: 90, category: "backend", color: "from-red-500 to-red-500" },
                { name: "Python", icon: skillIcons["Python"], level: 50, category: "backend", color: "from-teal-400 to-teal-400" },
                { name: "MySQL", icon: skillIcons["MySQL"], level: 100, category: "database", color: "from-blue-400 to-blue-400" },
                { name: "MongoDB", icon: skillIcons["MongoDB"], level: 20, category: "database", color: "from-green-500 to-green-500" },
                { name: "Bootstrap", icon: skillIcons["Bootstrap"], level: 90, category: "frontend", color: "from-purple-600 to-purple-800" },
                { name: "CSS3", icon: skillIcons["CSS3"], level: 60, category: "frontend", color: "from-blue-700 to-blue-700" },
                { name: "HTML5", icon: skillIcons["HTML5"], level: 100, category: "frontend", color: "from-orange-500 to-orange-700" },
                { name: "Git", icon: skillIcons["Git"], level: 60, category: "tools", color: "from-orange-300 to-orange-300" },
                { name: "Docker", icon: skillIcons["Docker"], level: 10, category: "tools", color: "from-blue-500 to-blue-500" }
              ].map((skill, index) => (
                <div 
                  key={skill.name}
                  className="group relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-green-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-transparent overflow-hidden group">
                    
                    <div className="absolute top-0 right-0 w-20 h-20">
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${skill.color} rounded-bl-full flex items-start justify-end p-2`}>
                        <span className="text-xs font-bold text-white">{skill.level}%</span>
                      </div>
                    </div>

                    <div className={`w-16 h-16 mb-4 mx-auto rounded-xl bg-gradient-to-br ${skill.color} bg-opacity-10 p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://raw.githubusercontent.com/devicons/devicon/master/icons/devicon/devicon-original.svg";
                        }}
                      />
                    </div>

                    <p className="font-bold text-gray-800 dark:text-white text-center mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-green-400 dark:group-hover:to-green-500 transition-all duration-300">
                      {skill.name}
                    </p>

                    <span className="block text-xs text-gray-500 dark:text-gray-400 text-center capitalize">
                      {skill.category}
                    </span>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16" data-aos="fade-up">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
              Tools & Technologies
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {[
                { name: "VS Code", icon: skillIcons["VS Code"] },
                { name: "GitHub", icon: skillIcons["GitHub"] },
                { name: "Postman", icon: skillIcons["Postman"] },
                { name: "Figma", icon: skillIcons["Figma"] },
                { name: "Jira", icon: skillIcons["Jira"] },
                { name: "Slack", icon: skillIcons["Slack"] },
                { name: "Vercel", icon: skillIcons["Vercel"] },
                { name: "Netlify", icon: skillIcons["Netlify"] }
              ].map((tool) => (
                <div key={tool.name} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                  <img 
                    src={tool.icon} 
                    alt={tool.name} 
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://raw.githubusercontent.com/devicons/devicon/master/icons/devicon/devicon-original.svg";
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900" id="projects">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-white" data-aos="fade-down">
            My Projects
          </h1>
          <p className="text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto" data-aos="fade-up">
            Some of my recent work and personal projects
          </p>

          {/* Project Tabs */}
          <div className="flex justify-center mb-8 sm:mb-12" data-aos="fade-up">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 shadow-inner">
              <div className="flex space-x-1">
                {['all', 'web', 'design'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProjectTab(tab)}
                    className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base capitalize overflow-hidden group ${
                      activeProjectTab === tab
                        ? `${isDarkMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'} shadow-lg`
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400'
                    }`}
                  >
                    <span className="relative z-10">{tab}</span>
                    {activeProjectTab === tab && (
                      <span className={`absolute inset-0 ${isDarkMode ? 'bg-green-600' : 'bg-blue-600'} animate-pulse`}></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=Project+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <span className={`text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        isDarkMode ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 sm:space-x-4">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm flex-1 ${
                          isDarkMode 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm flex-1"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800" id="certificates">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-white" data-aos="fade-down">
            Certificates
          </h1>
          <p className="text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto" data-aos="fade-up">
            My achievements and certifications
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {certificates.map((cert, index) => (
              <div 
                key={cert.id}
                className="group bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-600"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="relative overflow-hidden cursor-pointer" onClick={() => window.open(cert.image, '_blank')}>
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200?text=Certificate";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Klik untuk perbesar
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">{cert.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">Issued by {cert.issuer}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">{cert.date}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{cert.description}</p>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {cert.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900" id="contact">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-white" data-aos='fade-down'>
            Get In Touch
          </h2>
          <p className="text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto" data-aos='fade-down'>
            Let's discuss your next project
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-6 sm:space-y-8" data-aos='fade-right'>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Let's Connect</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  I'm always interested in new opportunities and collaborations. 
                  Whether you have a project in mind or just want to say hello, 
                  I'll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white font-bold text-sm sm:text-base">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Email</p>
                    <a href="mailto:fady.rohman070107@gmail.com" className="text-blue-600 dark:text-green-400 hover:underline text-xs sm:text-sm">
                      fady.rohman070107@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white font-bold text-sm sm:text-base">📱</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">WhatsApp</p>
                    <a 
                      href="https://wa.me/6288976267973" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-green-400 hover:underline text-xs sm:text-sm"
                    >
                      +62 889-7626-7973
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white font-bold text-sm sm:text-base">💼</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/fady-fadhlurrohman-8258a0319/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-green-400 hover:underline text-xs sm:text-sm"
                    >
                      Connect with me
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="space-y-4 sm:space-y-6" data-aos='fade-left' onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white p-3 sm:p-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white p-3 sm:p-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white p-3 sm:p-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                    placeholder="Tell me about your project..."
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`w-full text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base ${
                    isDarkMode 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Send Message via Gmail
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-gray-800 dark:bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-lg sm:text-xl font-bold text-white">
              Fady Fadhlurrohman
            </div>
            
            <div className="flex space-x-4 sm:space-x-6">
              <a 
                href="https://www.instagram.com/fdyfr_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base"
              >
                Instagram
              </a>
              <a 
                href="https://github.com/FadyFr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/fady-fadhlurrohman-8258a0319/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base"
              >
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-4 sm:mt-6 pt-4 sm:pt-6">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 Fady Fadhlurrohman. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;