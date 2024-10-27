//Navigation//
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("mainNav");
  let lastScroll = 0;
  let isScrolled = false;

  // Handle scroll effects
  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
      if (!isScrolled) {
        navbar.classList.add("scrolled");
        isScrolled = true;
      }
    } else {
      if (isScrolled) {
        navbar.classList.remove("scrolled");
        isScrolled = false;
      }
    }

    lastScroll = currentScroll;
  });

  // Handle mobile dropdowns
  if (window.innerWidth < 992) {
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdownToggles.forEach((otherToggle) => {
          if (otherToggle !== toggle) {
            otherToggle.nextElementSibling.classList.remove("show");
          }
        });

        // Toggle current dropdown
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle("show");
      });
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (
      !navbarCollapse.contains(e.target) &&
      !navbarToggler.contains(e.target)
    ) {
      navbarCollapse.classList.remove("show");

      // Close all dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });

  // Handle active state
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Handle window resize
  let windowWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;

      // Reset mobile menu state
      if (windowWidth >= 992) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
        });
        document.querySelector(".navbar-collapse").classList.remove("show");
      }
    }
  });
});

//close Navigation//

//hero-section
// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the carousel with custom settings
  const heroCarousel = new bootstrap.Carousel(
    document.getElementById("heroCarousel"),
    {
      interval: 6000, // Slide duration
      pause: "hover", // Pause on hover
      ride: "carousel",
      wrap: true, // Enable continuous loop
    }
  );

  // Preload videos for smoother playback
  const videos = document.querySelectorAll(".carousel-item video");
  videos.forEach((video) => {
    video.load();
  });

  // Handle video playback on slide change
  document
    .getElementById("heroCarousel")
    .addEventListener("slide.bs.carousel", function (e) {
      // Pause all videos
      videos.forEach((video) => {
        video.pause();
      });

      // Play the video in the next slide
      const nextVideo = e.relatedTarget.querySelector("video");
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play();
      }
    });

  // Optimize video playback
  videos.forEach((video) => {
    video.addEventListener("loadeddata", function () {
      video.play();
    });

    // Add error handling
    video.addEventListener("error", function () {
      console.warn("Video playback error:", video.src);
      video.closest(".carousel-item").style.backgroundColor = "#000";
    });
  });

  // Handle visibility change to pause/play videos
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      videos.forEach((video) => video.pause());
    } else {
      const activeVideo = document.querySelector(".carousel-item.active video");
      if (activeVideo) activeVideo.play();
    }
  });
});

//close hero-section************************//
// Section-2**********************
AOS.init({
  duration: 800,
  once: true,
  offset: 50,
  disable: window.innerWidth < 768
});

// Optimized counter animation
function animateCounter(element, options = {}) {
  if (!element) return;

  const { startVal = 0, suffix = "", duration = 1500 } = options;
  const targetText = element.textContent.trim();
  const endVal = parseFloat(targetText.replace(/[^0-9.]/g, ""));
  const hasPrefix = targetText.startsWith("+");
  const hasSuffix = targetText.endsWith("+") || suffix;

  let startTimestamp = null;
  const formatter = new Intl.NumberFormat("en-US");

  function updateCounter(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(startVal + (endVal - startVal) * progress);
      
      let displayValue = formatter.format(currentValue);
      if (hasPrefix) displayValue = "+" + displayValue;
      if (hasSuffix) displayValue += "+";
      
      element.textContent = displayValue;
      
      if (progress < 1) {
          requestAnimationFrame(updateCounter);
      }
  }

  requestAnimationFrame(updateCounter);
}

// Initialize observers
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      
      const numberElement = entry.target.querySelector(".stats-number");
      if (numberElement) {
          entry.target.classList.add("visible");
          animateCounter(numberElement, {
              startVal: 0,
              duration: 1500
          });
      }
      
      statsObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.2,
  rootMargin: "0px"
});

// Observe stat cards
document.querySelectorAll(".stats-card").forEach(card => {
  statsObserver.observe(card);
});
//Close section-2***************//
//Service-Section
document.addEventListener("DOMContentLoaded", function () {
  const regularServicesGrid = document.getElementById("regularServices");
  const premiumServicesGrid = document.getElementById("premiumServices");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const sectionTitle = document.querySelector(".section-title");

  // Initialize with regular services visible
  regularServicesGrid.style.display = "grid";
  premiumServicesGrid.style.display = "none";

  // Enhanced service switching function
  function switchServices(category) {
    const isRegular = category === "regular";
    const currentGrid = isRegular ? premiumServicesGrid : regularServicesGrid;
    const newGrid = isRegular ? regularServicesGrid : premiumServicesGrid;

    // Fancy exit animation
    const currentCards = currentGrid.querySelectorAll(".service-card");
    currentCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = "translateX(-100px) rotateY(-45deg)";
        card.style.opacity = "0";
      }, index * 50);
    });

    setTimeout(() => {
      currentGrid.style.display = "none";
      newGrid.style.display = "grid";

      // Fancy entrance animation
      const newCards = newGrid.querySelectorAll(".service-card");
      newCards.forEach((card, index) => {
        card.style.transform = "translateX(100px) rotateY(45deg)";
        card.style.opacity = "0";

        setTimeout(() => {
          card.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
          card.style.transform = "translateX(0) rotateY(0)";
          card.style.opacity = "1";
        }, index * 100);
      });
    }, 500);
  }

  // Enhanced card animation function
  function animateCards(grid) {
    const cards = grid.querySelectorAll(".service-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px) rotateX(10deg)";

      setTimeout(() => {
        card.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) rotateX(0)";
      }, index * 150);
    });
  }

  // Event listeners
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      switchServices(this.dataset.category);
    });
  });

  // Enhanced hover effects
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const angleX = (y - centerY) / 30;
      const angleY = (centerX - x) / 30;

      card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) translateZ(0)";
    });
  });

  // Initial animation
  animateCards(regularServicesGrid);
});
//close service section

//section-3
document.addEventListener("DOMContentLoaded", function () {
  const section3 = document.querySelector("#section-3");
  const packageCards = section3.querySelectorAll(".package-card");

  function animateCard(card, direction) {
    gsap.to(card, {
      y: direction === "in" ? -12 : 0,
      boxShadow:
        direction === "in"
          ? "0 12px 25px rgba(0, 0, 0, 0.2)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
      scale: direction === "in" ? 1.03 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  packageCards.forEach((card) => {
    card.addEventListener("mouseenter", () => animateCard(card, "in"));
    card.addEventListener("mouseleave", () => animateCard(card, "out"));

    const bookNowBtn = card.querySelector(".book-now-btn");
    bookNowBtn.addEventListener("click", () => {
      const packageName = card.querySelector("h4").textContent;
      gsap.to(bookNowBtn, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          alert(`Thank you for subscribing to ${packageName}!`);
        },
      });
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(packageCards, {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section3,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  const packageTags = section3.querySelectorAll(".package-tag");
  packageTags.forEach((tag) => {
    gsap.to(tag, {
      y: -4,
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
});
//close section-3

//Section-4
// Import GSAP and its plugins at the top of your script or in your HTML file
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Heading animation
  gsap.from(".custom-heading", {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
          trigger: "#section-4",
          start: "top 90%",
          end: "top 20%",
          toggleActions: "play none none reverse"
      }
  });

  // Left column content animation
  const leftColumnElements = document.querySelectorAll("#section-4 .col-lg-6:first-child > *");
  gsap.from(leftColumnElements, {
      opacity: 0,
      x: -50,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
          trigger: "#section-4 .col-lg-6:first-child",
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
      }
  });

  // Image animation
  gsap.from(".custom-image", {
      opacity: 0,
      scale: 0.8,
      rotation: 5,
      duration: 1,
      scrollTrigger: {
          trigger: ".custom-image",
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
      }
  });

  // List items animation
  const listItems = document.querySelectorAll(".custom-list-item");
  listItems.forEach((item, index) => {
      gsap.from(item, {
          opacity: 0,
          x: index % 2 === 0 ? -30 : 30,
          duration: 0.6,
          scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
          }
      });
  });

  // Button animation and interaction
  const button = document.querySelector(".custom-button");
  gsap.from(button, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
          trigger: button,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
      }
  });

  // Button hover effects
  button.addEventListener("mouseenter", () => {
      gsap.to(button, {
          scale: 1.05,
          duration: 0.2
      });
  });

  button.addEventListener("mouseleave", () => {
      gsap.to(button, {
          scale: 1,
          duration: 0.2
      });
  });

  // Subtle background parallax
  gsap.to("#section-4", {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
          trigger: "#section-4",
          start: "top bottom",
          end: "bottom top",
          scrub: true
      }
  });
});
// Close section-4
//section-5
// Import GSAP and its plugins at the top of your script or in your HTML file
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>

document.addEventListener("DOMContentLoaded", function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Animate the main titles
  gsap.from(".section-title, .main-title", {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#section-5",
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  });

  // Animate journey cards
  const journeyCards = document.querySelectorAll(".journey-card");
  journeyCards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      rotation: 5,
      duration: 0.8,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Add hover effect and color change
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        backgroundColor: "#f0f0f0", // Change this to your desired hover color
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundColor: "#ffffff", // Change this to your original card color
        duration: 0.3,
      });
    });
  });

  // Animate team image
  gsap.from(".team-image", {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    scrollTrigger: {
      trigger: ".team-image",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  // Animate team content
  const teamContentElements = document.querySelectorAll(
    ".col-md-6:last-child > *"
  );
  gsap.from(teamContentElements, {
    opacity: 0,
    x: 50,
    stagger: 0.2,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".col-md-6:last-child",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  // Animate highlight span
  gsap.from(".highlight", {
    color: "#000000",
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // Add hover effect to the "BOOK SERVICES" button
  const bookServicesBtn = document.querySelector(".btn-book-services");
  bookServicesBtn.addEventListener("mouseenter", () => {
    gsap.to(bookServicesBtn, {
      scale: 1.05,
      backgroundColor: "#0056b3", // Change this to your desired hover color
      duration: 0.3,
    });
  });
  bookServicesBtn.addEventListener("mouseleave", () => {
    gsap.to(bookServicesBtn, {
      scale: 1,
      backgroundColor: "#007bff", // Change this to your original button color
      duration: 0.3,
    });
  });

  // Parallax effect for the background
  gsap.to("#section-5", {
    backgroundPosition: "50% 100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#section-5",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
// Close section-5

// section-6
// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Animate section title and subtitle
  gsap.from("#section-6 .section-title, #section-6 .section-subtitle", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
          trigger: "#section-6",
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
      }
  });

  // Animate "LEARN MORE" button
  gsap.from(".btn-learn-more", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
          trigger: ".btn-learn-more",
          start: "top 90%",
          toggleActions: "play none none reverse"
      }
  });

  // Add hover effect to "LEARN MORE" button
  const learnMoreBtn = document.querySelector(".btn-learn-more");
  learnMoreBtn.addEventListener("mouseenter", () => {
      gsap.to(learnMoreBtn, {
          scale: 1.05,
          backgroundColor: "#003d82",
          duration: 0.3
      });
  });
  learnMoreBtn.addEventListener("mouseleave", () => {
      gsap.to(learnMoreBtn, {
          scale: 1,
          backgroundColor: "#0056b3",
          duration: 0.3
      });
  });

  // Animate recognition logos
  gsap.from(".recognition-logos img", {
      opacity: 0,
      scale: 0.8,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
          trigger: ".recognition-logos",
          start: "top 80%",
          toggleActions: "play none none reverse"
      }
  });

  // Animate blog cards
  gsap.from(".blog-card-wrapper", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
          trigger: "#blog-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
      }
  });

  // Add hover effect to blog cards
  document.querySelectorAll(".blog-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
          gsap.to(card, {
              y: -10,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              duration: 0.3
          });
      });
      card.addEventListener("mouseleave", () => {
          gsap.to(card, {
              y: 0,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              duration: 0.3
          });
      });
  });
});
//close section-6

//section-7***************************//
// Services Section JavaScript Implementation
class ServicesSection {
  constructor() {
    this.section = document.getElementById("services");
    this.cards = document.querySelectorAll(".service-card");
    this.counters = document.querySelectorAll(".counter");
    this.init();
  }

  init() {
    this.initializeAnimations();
    this.setupEventListeners();
    this.initializeCounters();
    this.initializeParallax();
    this.initializeCardRotation();
    this.initializeServiceStats();
  }

  initializeAnimations() {
    // Custom entrance animations for cards
    this.cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px)";

      setTimeout(() => {
        card.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 200 * index);
    });
  }

  setupEventListeners() {
    // Card hover effects
    this.cards.forEach((card) => {
      card.addEventListener("mouseenter", (e) => this.handleCardHover(e, true));
      card.addEventListener("mouseleave", (e) =>
        this.handleCardHover(e, false)
      );
      card.addEventListener("mousemove", (e) => this.handleCardTilt(e));
    });

    // Scroll-based animations
    window.addEventListener("scroll", () => this.handleScroll());

    // Button click effects
    document.querySelectorAll(".btn-hover-scale").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleButtonClick(e));
    });
  }

  handleCardHover(event, isEntering) {
    const card = event.currentTarget;
    const icon = card.querySelector(".service-icon");
    const title = card.querySelector(".card-title");
    const features = card.querySelector(".service-features");

    if (isEntering) {
      // Enhanced hover state
      card.style.transform = "translateY(-15px) scale(1.02)";
      card.style.boxShadow = "0 25px 50px rgba(0,0,0,0.15)";

      // Animate icon
      icon.style.transform = "rotateY(180deg) scale(1.1)";

      // Animate title
      title.style.color = "#2563eb";
      title.style.transform = "scale(1.05)";

      // Animate features
      Array.from(features.children).forEach((item, index) => {
        item.style.transform = "translateX(10px)";
        item.style.transition = `transform 0.3s ${index * 0.1}s ease`;
      });
    } else {
      // Reset states
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
      icon.style.transform = "rotateY(0) scale(1)";
      title.style.color = "";
      title.style.transform = "scale(1)";

      Array.from(features.children).forEach((item) => {
        item.style.transform = "translateX(0)";
      });
    }
  }

  handleCardTilt(event) {
    const card = event.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    const rotateX = (mouseY / centerY) * 10;
    const rotateY = -(mouseX / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  initializeCounters() {
    const observerOptions = {
      threshold: 0.5,
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          this.animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, observerOptions);

    this.counters.forEach((counter) => counterObserver.observe(counter));
  }

  animateCounter(counter) {
    const target = parseInt(counter.innerText);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const updateCounter = () => {
      current += target / steps;
      counter.innerText = Math.round(current);

      if (current < target) {
        setTimeout(updateCounter, stepDuration);
      } else {
        counter.innerText = target;

        // Add completion animation
        counter.style.transform = "scale(1.2)";
        setTimeout(() => {
          counter.style.transform = "scale(1)";
        }, 200);
      }
    };

    updateCounter();
  }

  initializeParallax() {
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const direction = scrollTop > lastScrollTop ? "down" : "up";
      const diff = Math.abs(scrollTop - lastScrollTop);

      this.cards.forEach((card, index) => {
        const speed = 0.05 * (index + 1);
        const yOffset = direction === "down" ? diff * speed : -(diff * speed);

        card.style.transform = `translateY(${yOffset}px)`;
      });

      lastScrollTop = scrollTop;
    });
  }

  initializeCardRotation() {
    this.cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 20;
        const angleY = -(x - centerX) / 20;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      });
    });
  }

  initializeServiceStats() {
    const stats = document.querySelectorAll(".service-stats");

    stats.forEach((stat) => {
      const items = stat.querySelectorAll(".stat-item");

      items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";

        setTimeout(() => {
          item.style.transition = "all 0.5s ease";
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 300 * index);
      });
    });
  }

  handleButtonClick(event) {
    const button = event.currentTarget;

    // Create ripple effect
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    button.appendChild(ripple);

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const sectionTop = this.section.offsetTop;
    const sectionHeight = this.section.offsetHeight;

    if (
      scrolled > sectionTop - window.innerHeight / 2 &&
      scrolled < sectionTop + sectionHeight
    ) {
      this.cards.forEach((card, index) => {
        const speed = 0.1;
        const yPos = -(scrolled * speed * (index + 1));
        card.style.transform = `translateY(${yPos}px)`;
      });
    }
  }
}

// Additional utility functions
const utils = {
  lerp: (start, end, factor) => {
    return start + (end - start) * factor;
  },

  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  },

  mapRange: (value, min1, max1, min2, max2) => {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
  },
};

// Initialize the services section
document.addEventListener("DOMContentLoaded", () => {
  const servicesSection = new ServicesSection();
});

// Add required CSS for animations
const style = document.createElement("style");
style.textContent = `
  .ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 1s linear;
      pointer-events: none;
  }

  @keyframes ripple-animation {
      to {
          transform: scale(4);
          opacity: 0;
      }
  }

  .service-card {
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .service-icon, .card-title {
      transition: transform 0.3s ease, color 0.3s ease;
  }

  .service-features li {
      transition: transform 0.3s ease;
  }
`;
document.head.appendChild(style);
//close section-7**********************//

// section-8**********************//
// Testimonial Section Controller
// Create a self-executing function to avoid global scope pollution
(function initializeTestimonialSection() {
    // Create a unique namespace for this section
    const TestimonialManager = {
        // Configuration
        config: {
            sectionId: 'testimonial-section',
            cardClass: 'testimonial-card',
            radioName: 'testimonial-nav',
            viewMoreBtn: 'view-more-btn',
            cardsPerPage: 3,
            autoplayInterval: 5000,
            animationDuration: 500,
        },

        // State management
        state: {
            currentPage: 0,
            totalCards: 0,
            isAutoplaying: true,
            autoplayTimer: null,
            isAnimating: false,
        },

        // Cache DOM elements
        elements: {
            section: null,
            cards: [],
            radioInputs: [],
            viewMoreBtn: null,
            wrapper: null,
        },

        // Initialize the testimonial section
        init() {
            this.cacheElements();
            if (!this.elements.section) return;
            
            this.setupState();
            this.bindEvents();
            this.initializeCards();
            this.startAutoplay();
        },

        // Cache all required DOM elements
        cacheElements() {
            this.elements.section = document.querySelector(`.${this.config.sectionId}`);
            if (!this.elements.section) return;

            this.elements.cards = Array.from(
                this.elements.section.getElementsByClassName(this.config.cardClass)
            );
            this.elements.radioInputs = Array.from(
                this.elements.section.querySelectorAll(`input[name="${this.config.radioName}"]`)
            );
            this.elements.viewMoreBtn = this.elements.section.querySelector(
                `.${this.config.viewMoreBtn}`
            );
            this.elements.wrapper = this.elements.section.querySelector('.testimonial-wrapper');
        },

        // Set up initial state
        setupState() {
            this.state.totalCards = this.elements.cards.length;
            this.state.totalPages = Math.ceil(
                this.state.totalCards / this.config.cardsPerPage
            );
        },

        // Bind all event listeners
        bindEvents() {
            // Radio button navigation
            this.elements.radioInputs.forEach((radio, index) => {
                radio.addEventListener('change', () => this.handleRadioChange(index));
            });

            // View More button
            if (this.elements.viewMoreBtn) {
                this.elements.viewMoreBtn.addEventListener('click', () => this.handleViewMore());
            }

            // Pause autoplay on hover
            this.elements.section.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.elements.section.addEventListener('mouseleave', () => this.resumeAutoplay());

            // Handle intersection observer for animations
            this.setupIntersectionObserver();
        },

        // Initialize cards with stagger effect
        initializeCards() {
            this.elements.cards.forEach((card, index) => {
                const delay = index * 150;
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, delay);
            });
        },

        // Handle radio button changes
        handleRadioChange(index) {
            if (this.state.isAnimating) return;
            this.state.isAnimating = true;
            this.state.currentPage = index;

            // Animate cards out
            this.elements.cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            });

            // Animate new cards in
            setTimeout(() => {
                this.updateVisibleCards();
                this.state.isAnimating = false;
            }, this.config.animationDuration);
        },

        // Handle View More button click
        handleViewMore() {
            const nextPage = (this.state.currentPage + 1) % this.state.totalPages;
            this.elements.radioInputs[nextPage].checked = true;
            this.handleRadioChange(nextPage);
        },

        // Update visible cards based on current page
        updateVisibleCards() {
            const startIdx = this.state.currentPage * this.config.cardsPerPage;
            const endIdx = startIdx + this.config.cardsPerPage;

            this.elements.cards.forEach((card, index) => {
                const isVisible = index >= startIdx && index < endIdx;
                const delay = (index - startIdx) * 150;

                card.style.display = isVisible ? 'block' : 'none';
                if (isVisible) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        },

        // Autoplay functionality
        startAutoplay() {
            if (!this.state.isAutoplaying) return;
            
            this.state.autoplayTimer = setInterval(() => {
                if (this.state.isAutoplaying) {
                    this.handleViewMore();
                }
            }, this.config.autoplayInterval);
        },

        pauseAutoplay() {
            this.state.isAutoplaying = false;
            if (this.state.autoplayTimer) {
                clearInterval(this.state.autoplayTimer);
            }
        },

        resumeAutoplay() {
            this.state.isAutoplaying = true;
            this.startAutoplay();
        },

        // Setup intersection observer for animations
        setupIntersectionObserver() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.initializeCards();
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            observer.observe(this.elements.section);
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        TestimonialManager.init();
    });
})();

// Add custom event dispatcher for other sections to communicate with
window.dispatchTestimonialEvent = function(eventName, data) {
    const customEvent = new CustomEvent('testimonial-' + eventName, { detail: data });
    document.dispatchEvent(customEvent);
};
//close section-8**********************//

//section-9// complain section//

document.addEventListener("DOMContentLoaded", function () {
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const stateSelect = document.getElementById("state");
  indianStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  const form = document.getElementById("complaintForm");
  const successMessage = document.querySelector(".success-message");

  // Input validation functions
  const validators = {
    name: (value) => value.trim().length >= 3,
    mobile: (value) => /^[6-9]\d{9}$/.test(value),
    state: (value) => value.trim() !== "",
    whatsapp: (value) => value.trim() === "" || /^[6-9]\d{9}$/.test(value),
    email: (value) =>
      value.trim() === "" || /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value),
    remarks: (value) => value.trim().length >= 10,
  };

  // Real-time validation
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      validateField(this);
    });

    input.addEventListener("blur", function () {
      validateField(this);
    });
  });

  function validateField(field) {
    const validator = validators[field.id];
    if (validator) {
      const isValid = validator(field.value);
      field.classList.toggle("is-invalid", !isValid);
      field.classList.toggle("is-valid", isValid);
    }
  }

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.required) {
        const validator = validators[field.id];
        if (validator && !validator(field.value)) {
          isValid = false;
          field.classList.add("is-invalid");
        }
      }
    });

    if (isValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

      setTimeout(() => {
        successMessage.style.display = "block";
        form.reset();
        form.querySelectorAll(".is-valid").forEach((field) => {
          field.classList.remove("is-valid");
        });
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Complaint";

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 5000);
      }, 1500);
    }
  });
});



