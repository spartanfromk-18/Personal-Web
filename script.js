
const brandName   = document.getElementById("brandName");
const ambientGrid = document.getElementById("ambientGrid");
const glowA       = document.getElementById("glowA");
const glowB       = document.getElementById("glowB");
const hamburger   = document.getElementById("hamburger");
const mobileNav   = document.getElementById("mobileNav");
const heroTitle   = document.getElementById("heroTitle");

const parallaxLayers = [ambientGrid, glowA, glowB];

let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}

function updateOnScroll() {
  const y = lastScrollY;

  const shrink = Math.min(y / 500, 1);         
  const scale = 1 - shrink * 0.42;              
  const translateY = shrink * -4;             
  brandName.style.transform = `translateY(${translateY}px) scale(${scale})`;
  brandName.style.opacity = `${1 - shrink * 0.15}`;


  parallaxLayers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed || 0.2);
    const offset = y * speed;
    layer.style.transform = `translate3d(0, ${offset * -1}px, 0)`;
  });

  ticking = false;
}

window.addEventListener("scroll", onScroll, { passive: true });
updateOnScroll(); 


const revealItems = document.querySelectorAll(".reveal");


const staggerGroups = [".project-grid", ".timeline", ".skills-grid", ".certificates-grid"];

revealItems.forEach((item) => {
  const group = item.closest(staggerGroups.join(","));
  if (group) {
    const siblings = Array.from(group.children).filter((el) => el.classList.contains("reveal"));
    const index = siblings.indexOf(item);
    if (index > -1) item.style.setProperty("--stagger", index);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target); 
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (heroTitle) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  heroObserver.observe(heroTitle);
}

document.querySelectorAll("[data-target]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.target);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    
    if (mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });
});


function openMobileNav() {
  mobileNav.classList.add("open");
  hamburger.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; 
}

function closeMobileNav() {
  mobileNav.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  const isOpen = mobileNav.classList.contains("open");
  isOpen ? closeMobileNav() : openMobileNav();
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileNav.classList.contains("open")) {
    closeMobileNav();
  }
});


const supportsCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (supportsCustomCursor) {
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  const cursorRing = document.createElement("div");
  cursorRing.className = "cursor-ring";
  document.body.append(cursorDot, cursorRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
   
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });


  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

 
  const interactiveSelector = "a, button, .project-link, .social-link, .hotspot, .tag";
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
  });
}


if (supportsCustomCursor) {
  const projectCards = document.querySelectorAll(".project-card");
  const MAX_TILT = 6; 

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => card.classList.add("tilting"));

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width; 
      const relY = (e.clientY - rect.top) / rect.height;  

      const rotateY = (relX - 0.5) * MAX_TILT * 2;  
      const rotateX = (0.5 - relY) * MAX_TILT * 2; 

      card.style.transform =
        `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilting");
      card.style.transform = ""; 
    });
  });
}
