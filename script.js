// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenus = document.querySelectorAll(".nav-menu");
const mobileOverlay = document.querySelector(".mobile-menu-overlay");

function toggleMobileMenu() {
    hamburger.classList.toggle("active");
    navMenus.forEach((menu) => menu.classList.toggle("active"));
    mobileOverlay.classList.toggle("active");

    // Prevent body scroll when menu is open
    if (hamburger.classList.contains("active")) {
        document.body.style.overflow = "hidden";
        hamburger.setAttribute("aria-expanded", "true");
    } else {
        document.body.style.overflow = "";
        hamburger.setAttribute("aria-expanded", "false");
    }
}

hamburger.addEventListener("click", toggleMobileMenu);

// Start Investing modal (popup form)
(function initStartInvestingModal() {
    function isStartInvestingEl(el) {
        if (!el) return false;
        const txt = (el.textContent || "").trim().toUpperCase();
        return txt === "START INVESTING";
    }

    const triggers = Array.from(document.querySelectorAll("a.footer-cta-button, button.footer-cta-button")).filter(isStartInvestingEl);
    if (!triggers.length) return;

    // Create modal once
    if (document.getElementById("investModal")) {
        triggers.forEach((t) =>
            t.addEventListener("click", (e) => {
                e.preventDefault();
                openInvestModal();
            })
        );
        return;
    }

    const modal = document.createElement("div");
    modal.id = "investModal";
    modal.className = "invest-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "investModalTitle");
    modal.innerHTML = `
      <div class="invest-modal-dialog" role="document">
        <div class="invest-modal-header">
          <h3 class="invest-modal-title" id="investModalTitle">Start Investing — Private Enquiry</h3>
          <button type="button" class="invest-modal-close" aria-label="Close">✕</button>
        </div>
        <div class="invest-modal-body">
          <form id="investModalForm">
            <div class="invest-form-grid">
              <div class="invest-field">
                <label for="investName">Name</label>
                <input id="investName" name="name" type="text" autocomplete="name" required />
              </div>
              <div class="invest-field">
                <label for="investEmail">Email</label>
                <input id="investEmail" name="email" type="email" autocomplete="email" required />
              </div>
              <div class="invest-field">
                <label for="investPhone">Phone</label>
                <input id="investPhone" name="phone" type="tel" autocomplete="tel" />
              </div>
              <div class="invest-field">
                <label for="investInterest">Interest</label>
                <select id="investInterest" name="interest">
                  <option value="Apartments">Apartments</option>
                  <option value="Villas">Villas</option>
                  <option value="Both" selected>Both</option>
                </select>
              </div>
              <div class="invest-field full">
                <label for="investMessage">Message</label>
                <textarea id="investMessage" name="message" required placeholder="Tell us what you’re looking for…"></textarea>
              </div>
            </div>
            <div class="invest-actions">
              <button type="submit" class="invest-submit">Send Enquiry</button>
            </div>
            <div class="invest-note">Submitting will open your email client with the enquiry details.</div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".invest-modal-close");
    const form = modal.querySelector("#investModalForm");

    function openInvestModal() {
        modal.classList.add("show");
        document.body.classList.add("modal-open");
        window.setTimeout(() => {
            const name = modal.querySelector("#investName");
            name && name.focus();
        }, 50);
    }

    function closeInvestModal() {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
    }

    triggers.forEach((t) =>
        t.addEventListener("click", (e) => {
            e.preventDefault();
            openInvestModal();
        })
    );

    closeBtn?.addEventListener("click", closeInvestModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeInvestModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeInvestModal();
        }
    });

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = String(data.get("name") || "");
        const email = String(data.get("email") || "");
        const phone = String(data.get("phone") || "");
        const interest = String(data.get("interest") || "");
        const message = String(data.get("message") || "");
        const page = window.location.pathname.split("/").pop() || "site";

        const subject = `Start Investing Enquiry (${interest})`;
        const body = `Name: ${name}\n` + `Email: ${email}\n` + (phone ? `Phone: ${phone}\n` : "") + `Interest: ${interest}\n` + `Page: ${page}\n\n` + `${message}\n`;

        // mailto works for static sites (no backend)
        const to = "hello@oaksliving.com";
        const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        closeInvestModal();
        form.reset();
    });
})();

// Close mobile menu when clicking on overlay
mobileOverlay.addEventListener("click", toggleMobileMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((n) =>
    n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenus.forEach((menu) => menu.classList.remove("active"));
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
    })
);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Image Modal Functionality
(function initImageModal() {
    document.querySelectorAll(".project-detail-layout .gallery-mosaic").forEach((mosaic) => {
        const mainImage = mosaic.querySelector(".gallery-item.large img");
        const thumbs = Array.from(mosaic.querySelectorAll(".gallery-item:not(.large) img"));
        if (!mainImage || !thumbs.length) return;

        thumbs[0].closest(".gallery-item")?.classList.add("active-thumb");
        thumbs.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                mainImage.src = thumb.src;
                mainImage.alt = thumb.alt || mainImage.alt;
                mosaic.querySelectorAll(".gallery-item.active-thumb").forEach((item) => item.classList.remove("active-thumb"));
                thumb.closest(".gallery-item")?.classList.add("active-thumb");
            });
        });
    });

    const galleryImages = document.querySelectorAll(".gallery-thumb, .gallery-mosaic .gallery-item.large img");
    if (!galleryImages.length) return;

    let imageModal = document.getElementById("imageModal");
    if (!imageModal) {
        imageModal = document.createElement("div");
        imageModal.id = "imageModal";
        imageModal.className = "image-modal";
        imageModal.innerHTML = `
            <span class="image-modal-close" aria-label="Close image preview">&times;</span>
            <img id="modalImage" class="image-modal-content" alt="">
        `;
        document.body.appendChild(imageModal);
    }

    const modalImage = imageModal.querySelector("#modalImage");
    const modalClose = imageModal.querySelector(".image-modal-close");
    if (!modalImage || !modalClose) return;

    function openModal(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt || "Gallery image";
        imageModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        imageModal.classList.remove("show");
        document.body.style.overflow = "";
    }

    galleryImages.forEach((img) => {
        img.addEventListener("click", function () {
            openModal(this.src, this.alt);
        });
    });

    modalClose.addEventListener("click", closeModal);
    imageModal.addEventListener("click", function (e) {
        if (e.target === imageModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && imageModal.classList.contains("show")) {
            closeModal();
        }
    });
})();

// Promise Tab Functionality - BRAND NEW
const promiseTabs = document.querySelectorAll(".tab-new");
const promiseImage = document.querySelector(".img-new");
const promiseTitle = document.querySelector(".heading-new");
const promiseDescription = document.querySelector(".desc-new");

// Scroll-triggered tab switching
let currentTabIndex = 0;
const totalTabs = promiseTabs.length;
let isScrolling = false;

// Promise content data
const promiseContent = {
    innovative: {
        title: "Innovative Design",
        description: "Maximising space and functionality with modern, forward-thinking layouts.",
        image: "images/Modern Simplicity.jpg",
    },
    strategic: {
        title: "Strategic Locations",
        description: "Positioned in high-growth areas to secure lasting value and accessibility.",
        image: "images/Strategic Locations.jpg",
    },
    modern: {
        title: "Modern Simplicity",
        description: "Clean, contemporary designs tailored for today's diverse lifestyles.",
        image: "images/Modern Simplicity.jpg",
    },
    sustainable: {
        title: "Sustainable Living",
        description: "Energy-efficient technologies and eco-friendly materials for greener communities.",
        image: "images/Sustainable Living.jpg",
    },
    green: {
        title: "Green Connections",
        description: "Integrating open spaces that connect residents with nature and wellbeing.",
        image: "images/Green Connections.jpg",
    },
    safety: {
        title: "Safety First",
        description: "Secure, high-standard construction for comfort and peace of mind.",
        image: "images/contractor-worker-assembling-skeleton-steel-frame-2025-03-14-00-07-01-utc.jpg",
    },
    built: {
        title: "Built to Endure",
        description: "Quality craftsmanship ensures durability, longevity, and reduced maintenance.",
        image: "images/Built to Endure.jpg",
    },
    community: {
        title: "Community Focus",
        description: "Developments designed to foster belonging, interaction, and shared growth.",
        image: "images/Community Focus.jpg",
    },
    accessible: {
        title: "Accessible Ownership",
        description: "A streamlined buying process makes investing and owning simpler for all.",
        image: "images/Accessible Ownership.jpg",
    },
    wealth: {
        title: "Growing Wealth",
        description: "Properties chosen to strengthen financial security and build long-term equity.",
        image: "images/Growing Wealth.jpg",
    },
};

// Function to update content with smooth reveal animations
function updatePromiseContent(tabId) {
    const content = promiseContent[tabId];
    if (!content) return;

    // Get elements
    const imageContainer = document.querySelector(".image-new");
    const contentContainer = document.querySelector(".content-new");
    const heading = document.querySelector(".heading-new");
    const description = document.querySelector(".desc-new");
    const buttons = document.querySelector(".buttons-new");

    // Start reveal animation - hide elements
    if (imageContainer) imageContainer.classList.add("reveal");
    if (contentContainer) contentContainer.classList.add("reveal");
    if (heading) heading.classList.add("reveal");
    if (description) description.classList.add("reveal");
    if (buttons) buttons.classList.add("reveal");

    // Update content after a short delay
    setTimeout(() => {
        // Update title
        if (promiseTitle) {
            promiseTitle.textContent = content.title;
        }

        // Update description
        if (promiseDescription) {
            promiseDescription.textContent = content.description;
        }

        // Update image with fade effect
        if (promiseImage) {
            promiseImage.classList.add("fade");
            setTimeout(() => {
                promiseImage.src = content.image;
                promiseImage.alt = content.title;
                promiseImage.classList.remove("fade");
            }, 300);
        }

        // Reveal elements with staggered timing
        setTimeout(() => {
            if (imageContainer) imageContainer.classList.remove("reveal");
        }, 100);

        setTimeout(() => {
            if (contentContainer) contentContainer.classList.remove("reveal");
        }, 200);

        setTimeout(() => {
            if (heading) heading.classList.remove("reveal");
        }, 300);

        setTimeout(() => {
            if (description) description.classList.remove("reveal");
        }, 400);

        setTimeout(() => {
            if (buttons) buttons.classList.remove("reveal");
        }, 500);
    }, 300);
}

// Function to switch to next tab
function switchToNextTab() {
    if (isScrolling) return;

    isScrolling = true;
    currentTabIndex = (currentTabIndex + 1) % totalTabs;

    // Remove active class from all tabs
    promiseTabs.forEach((tab) => tab.classList.remove("active-new"));

    // Add active class to current tab
    const currentTab = promiseTabs[currentTabIndex];
    currentTab.classList.add("active-new");

    // Update content
    const tabId = currentTab.getAttribute("data-tab");
    updatePromiseContent(tabId);

    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Function to switch to previous tab
function switchToPreviousTab() {
    if (isScrolling) return;

    isScrolling = true;
    currentTabIndex = (currentTabIndex - 1 + totalTabs) % totalTabs;

    // Remove active class from all tabs
    promiseTabs.forEach((tab) => tab.classList.remove("active-new"));

    // Add active class to current tab
    const currentTab = promiseTabs[currentTabIndex];
    currentTab.classList.add("active-new");

    // Update content
    const tabId = currentTab.getAttribute("data-tab");
    updatePromiseContent(tabId);

    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Add click event listeners to tabs
promiseTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        if (isScrolling) return;

        isScrolling = true;
        currentTabIndex = index;

        // Remove active class from all tabs
        promiseTabs.forEach((t) => t.classList.remove("active-new"));

        // Add active class to clicked tab
        tab.classList.add("active-new");

        // Update content
        const tabId = tab.getAttribute("data-tab");
        updatePromiseContent(tabId);

        // Reset scrolling flag
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    });
});

// Scroll event listener for automatic tab switching
let scrollTimeout;
window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const promiseSection = document.querySelector(".investor-promise-new");
        if (!promiseSection) return;

        const rect = promiseSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !isScrolling) {
            // Check scroll direction
            const scrollDelta = window.scrollY - (window.lastScrollY || 0);
            window.lastScrollY = window.scrollY;

            if (Math.abs(scrollDelta) > 50) {
                // Minimum scroll distance
                if (scrollDelta > 0) {
                    // Scrolling down - next tab
                    switchToNextTab();
                } else {
                    // Scrolling up - previous tab
                    switchToPreviousTab();
                }
            }
        }
    }, 150); // Debounce scroll events
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    const promiseSection = document.querySelector(".investor-promise-new");
    if (!promiseSection) return;

    const rect = promiseSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            switchToNextTab();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            switchToPreviousTab();
        }
    }
});

// Active nav link highlighting based on scroll position
function updateActiveNav() {
    const links = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
    const offset = 140; // account for navbar height
    let currentId = "";
    const scrollPos = window.scrollY + offset;
    sections.forEach((sec) => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            currentId = "#" + sec.id;
        }
    });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === currentId));
}

// Navbar sticky toggle and active link update
window.addEventListener(
    "scroll",
    () => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            if (window.scrollY > 10) navbar.classList.add("sticky");
            else navbar.classList.remove("sticky");
        }
        updateActiveNav();
    },
    { passive: true }
);

window.addEventListener("load", updateActiveNav);

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

// SVG animations for solutions disabled: keep static SVG images only.

// Arrow transition effects between sections
function createArrowTransitions() {
    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {
        if (index > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Show arrow pointing to current section
                            const arrow = entry.target.querySelector(".section-content::before");
                            if (arrow) {
                                arrow.style.opacity = "1";
                            }
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(section);
        }
    });
}

// Initialize arrow transitions
createArrowTransitions();

// Ultra-smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

// Parallax effect for hero section
window.addEventListener("scroll", () => {
    // Disable heavy transforms on small screens for smoother mobile performance
    if (window.innerWidth <= 768) return;
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Hero video — local MP4, play immediately on page open
function initializeVideo() {
    const video = document.querySelector(".hero-video video");
    if (!video) return;
    video.play().catch(() => {});

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
        });
    }, { threshold: 0.25 });
    observer.observe(video);
}

// Lazy-load videos with data-lazy-video attribute
function initializeLazyVideos() {
    const lazyVideos = document.querySelectorAll("video[data-lazy-video]");
    if (!lazyVideos.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            video.querySelectorAll("source[data-src]").forEach((source) => {
                source.src = source.dataset.src;
            });
            video.load();
            video.play().catch(() => {});
            observer.unobserve(video);
        });
    }, { rootMargin: "200px" });

    lazyVideos.forEach((v) => observer.observe(v));
}

// Insights section Vimeo — play/pause based on scroll position
function initVimeoBackground() {
    const iframe = document.querySelector(".insights-card-video .vimeo-cover iframe");
    if (!iframe || !window.Vimeo) return;

    const player = new Vimeo.Player(iframe);

    new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                player.play().catch(() => {});
            } else {
                player.pause().catch(() => {});
            }
        });
    }, { threshold: 0.25 }).observe(iframe);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeVideo();
});

window.addEventListener("load", () => {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
    initializeLazyVideos();
    initVimeoBackground();
});

// Ultra-clean hover effects
document.querySelectorAll(".principle-item, .experience-item, .promise-item, .feature-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
        this.style.transition = "transform 0.3s ease";
    });

    item.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
    });
});

// Luxury cards: scroll reveal
const luxuryCards = document.querySelectorAll(".luxury-card");
if (luxuryCards.length) {
    const luxuryObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                }
            });
        },
        { threshold: 0.2 }
    );

    luxuryCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 80}ms`;
        luxuryObserver.observe(card);

        // Subtle 3D tilt
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = (x / rect.width - 0.5) * 6; // -3deg to 3deg
            const rotateX = (y / rect.height - 0.5) * -6; // -3deg to 3deg
            card.style.transform = `translateY(0) scale(1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

// Improved masonry sizing based on actual image height
function sizeLuxuryMasonry() {
    const grid = document.querySelector(".luxury-grid");
    if (!grid) return;
    const row = parseInt(getComputedStyle(grid).gridAutoRows) || 12;
    const gap = parseInt(getComputedStyle(grid).gap) || 16;
    grid.querySelectorAll(".luxury-card").forEach((card) => {
        const img = card.querySelector("img");
        const h = img && img.naturalHeight ? img.naturalHeight * (card.clientWidth / (img.naturalWidth || card.clientWidth)) : card.getBoundingClientRect().height;
        const span = Math.max(1, Math.ceil((h + gap) / (row + gap)));
        card.style.gridRowEnd = `span ${span}`;
    });
}

window.addEventListener("load", sizeLuxuryMasonry);
window.addEventListener("resize", () => requestAnimationFrame(sizeLuxuryMasonry));

document.querySelectorAll(".luxury-card img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", sizeLuxuryMasonry, { once: true });
});

// Luxury center-focus on scroll
(function refineLuxuryFocus() {
    const grid = document.querySelector(".luxury-grid");
    if (!grid) return;
    const section = grid.closest(".luxury");
    const cards = Array.from(grid.querySelectorAll(".luxury-card"));
    if (!cards.length) return;

    function sectionInView() {
        const r = section.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
    }

    function centerCard(card) {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const viewportCenterX = window.innerWidth / 2;
        let dx = viewportCenterX - cardCenterX;
        dx = Math.max(Math.min(dx, 200), -200); // clamp
        card.style.transform = `translateY(0) translateX(${dx}px) scale(1.08)`;
    }

    let ticking = false;
    function update() {
        if (!sectionInView()) {
            cards.forEach((c) => {
                c.classList.remove("focus");
                c.style.transform = "";
            });
            ticking = false;
            return;
        }
        const viewportCenter = window.innerHeight / 2;
        let closest = null;
        let dmin = Infinity;
        cards.forEach((c) => {
            const rc = c.getBoundingClientRect();
            const dc = Math.abs(rc.top + rc.height / 2 - viewportCenter);
            if (dc < dmin) {
                dmin = dc;
                closest = c;
            }
        });
        cards.forEach((c) => {
            if (c === closest) {
                c.classList.add("focus");
                centerCard(c);
            } else {
                c.classList.remove("focus");
                c.style.transform = "";
            }
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();

// GSAP ScrollTrigger: center-pin and scrub animation for luxury cards
document.addEventListener("DOMContentLoaded", () => {
    try {
        luxuryGsapInit && luxuryGsapInit();
    } catch (e) {
        /* no-op */
    }
});

// Disable previous GSAP luxury effects to keep layout stable
function luxuryGsapInit() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".luxury");
    const grid = document.querySelector(".luxury-grid");
    const cards = Array.from(document.querySelectorAll(".luxury-card"));
    if (!section || !grid || !cards.length) return;

    // Pin section while scrubbing
    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight, 800) + cards.length * 500}`,
        pin: true,
        anticipatePin: 1,
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${cards.length * 500}`,
            scrub: 1,
            onUpdate: () => grid.classList.add("animating"),
        },
    });

    cards.forEach((card, i) => {
        tl.add(() => {
            cards.forEach((c) => c.classList.remove("is-active"));
            card.classList.add("is-active");
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const viewportCenterX = window.innerWidth / 2;
            const dx = viewportCenterX - cardCenterX;
            gsap.to(card, { x: dx, scale: 1.08, duration: 0.8, ease: "power2.out" });
        }, i);
        tl.add(() => {
            gsap.to(card, { x: 0, scale: 1, duration: 0.6, ease: "power2.in" });
        }, i + 0.7);
    });
}

// Luxury image fallback for missing banners
(function fixLuxuryImages() {
    const imgs = document.querySelectorAll(".luxury-card img");
    imgs.forEach((img, i) => {
        img.addEventListener(
            "error",
            () => {
                const fallbacks = ["images/image-1.jpeg", "images/Mask-group.png"];
                const src = fallbacks[i % fallbacks.length];
                img.src = src;
                img.removeAttribute("srcset");
                if (typeof sizeLuxuryMasonry === "function") {
                    setTimeout(sizeLuxuryMasonry, 50);
                }
            },
            { once: true }
        );
    });
})();

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: #000;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

// Initialize scroll progress
createScrollProgress();

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

// Native center-focus scroll (no external libs)
(function initNativeLuxuryScroll() {
    const section = document.querySelector(".luxury");
    const grid = document.querySelector(".luxury-grid");
    const cards = Array.from(document.querySelectorAll(".luxury-card"));
    if (!section || !grid || !cards.length) return;

    let ticking = false;

    function inView() {
        const r = section.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
    }

    function update() {
        if (!inView()) {
            ticking = false;
            return;
        }
        grid.classList.add("animating");
        const viewportCenter = window.innerHeight / 2;
        let closest = null;
        let min = Infinity;
        cards.forEach((c) => {
            const rc = c.getBoundingClientRect();
            const dc = Math.abs(rc.top + rc.height / 2 - viewportCenter);
            if (dc < min) {
                min = dc;
                closest = c;
            }
        });
        cards.forEach((c) => {
            if (c === closest) {
                c.classList.add("is-active");
                const rect = c.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const viewportCenterX = window.innerWidth / 2;
                let dx = viewportCenterX - cardCenterX;
                dx = Math.max(-240, Math.min(240, dx));
                c.style.transform = `translateX(${dx}px) scale(1.06)`;
            } else {
                c.classList.remove("is-active");
                c.style.transform = "";
            }
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
})();

// Animate ref-style lux-box elements into view
(function initLuxBoxes() {
    const boxes = document.querySelectorAll(".lux-box-1, .lux-box-2, .lux-box-3, .lux-box-4");
    if (!boxes.length) return;
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add("in-view");
            });
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    boxes.forEach((b) => obs.observe(b));
})();

// Promise section interaction removed per request; keep static content with new styles only.

// Simple modern vertical tabs for Our Promise to Investors
(function initSimplePromiseTabs() {
    const section = document.querySelector(".investor-promise .section-content");
    if (!section) return;
    // Prevent duplicate init
    if (section.querySelector(".promise-tabs-layout")) return;

    const items = Array.from(document.querySelectorAll(".investor-promise .promise-item .promise-content"));
    if (!items.length) return;

    const layout = document.createElement("div");
    layout.className = "promise-tabs-layout";

    const tabs = document.createElement("div");
    tabs.className = "promise-tabs";

    const detail = document.createElement("div");
    detail.className = "promise-detail-panel";
    detail.innerHTML = "<h3></h3><p></p>";

    layout.appendChild(tabs);
    layout.appendChild(detail);

    // Insert layout before the original list
    const list = section.querySelector(".promise-list");
    section.insertBefore(layout, list);
    // Hide original list to avoid duplicate visible content
    if (list) {
        list.style.display = "none";
    }

    function setActive(idx) {
        tabs.querySelectorAll(".promise-tab-btn").forEach((b, i) => {
            b.classList.toggle("active", i === idx);
        });
        const item = items[idx];
        const title = item.querySelector(".promise-title")?.textContent?.trim() || "";
        const desc = item.querySelector(".promise-description")?.textContent?.trim() || "";
        detail.querySelector("h3").textContent = title;
        detail.querySelector("p").textContent = desc;
    }

    items.forEach((item, idx) => {
        const title = item.querySelector(".promise-title")?.textContent?.trim() || `Item ${idx + 1}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "promise-tab-btn" + (idx === 0 ? " active" : "");
        btn.innerHTML = `<span class="promise-tab-title">${title}</span>`;
        btn.addEventListener("click", () => setActive(idx));
        tabs.appendChild(btn);
    });

    setActive(0);
})();

(function enhancePromiseDetail() {
    const section = document.querySelector(".investor-promise .section-content");
    if (!section) return;
    const layout = section.querySelector(".promise-tabs-layout");
    if (!layout) return;

    // Create center visual if missing
    let visual = layout.querySelector(".promise-visual");
    if (!visual) {
        visual = document.createElement("div");
        visual.className = "promise-visual";
        const img = document.createElement("img");
        img.src = "images/image-1.jpeg";
        visual.appendChild(img);
        layout.insertBefore(visual, layout.children[1]);
    }

    // Add themed buttons to detail
    let detail = layout.querySelector(".promise-detail-panel");
    if (detail && !detail.querySelector(".promise-buttons")) {
        const buttons = document.createElement("div");
        buttons.className = "promise-buttons";
        const a = document.createElement("a");
        a.href = "#properties";
        a.className = "contact-button";
        a.innerHTML = '<span class="button-text">Apartments</span><span class="button-icon">→</span>';
        const b = document.createElement("a");
        b.href = "#properties";
        b.className = "contact-button";
        b.innerHTML = '<span class="button-text">Villas</span><span class="button-icon">→</span>';
        buttons.appendChild(a);
        buttons.appendChild(b);
        detail.appendChild(buttons);
    }

    // Image fade on tab change
    const img = visual.querySelector("img");
    const tabs = layout.querySelectorAll(".promise-tab-btn");
    tabs.forEach((t, idx) => {
        t.addEventListener("click", () => {
            img.classList.add("is-fading");
            setTimeout(() => {
                // Cycle through available images as placeholders
                const sources = ["images/banner-1.jpeg", "images/banner-2.jpeg", "images/banner-3.jpeg", "images/banner-4.jpeg", "images/banner-5.jpeg"];
                img.src = sources[idx % sources.length];
                img.classList.remove("is-fading");
            }, 180);
        });
    });
})();

(function enhancePromiseVisualAnim() {
    const img = document.querySelector(".promise-visual img");
    const tabs = document.querySelectorAll(".promise-tab-btn");
    if (!img || !tabs.length) return;
    tabs.forEach((t, idx) => {
        t.addEventListener("click", () => {
            img.classList.add("is-fading");
            setTimeout(() => {
                const sources = ["images/banner-1.jpeg", "images/banner-2.jpeg", "images/banner-3.jpeg", "images/banner-4.jpeg", "images/banner-5.jpeg"];
                img.src = sources[idx % sources.length];
                img.classList.remove("is-fading");
                img.classList.add("scale-in");
                setTimeout(() => img.classList.remove("scale-in"), 320);
            }, 160);
        });
    });
})();

(function addPromiseTabIcons() {
    const tabs = document.querySelectorAll(".promise-tab-btn");
    if (!tabs.length) return;
    const icons = {
        innovative:
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v4'/><path d='M6.3 4.8l2.8 2.8'/><path d='M17.7 4.8l-2.8 2.8'/><path d='M12 8a6 6 0 0 0-6 6v2h12v-2a6 6 0 0 0-6-6Z'/><path d='M9 18h6'/></svg>",
        strategic: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='M7 15l4-4 3 3 5-6'/></svg>",
        modern: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='7' height='14' rx='2'/><rect x='14' y='5' width='7' height='10' rx='2'/></svg>",
        sustainable: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v6'/><path d='M4 14c4-2 8-2 12 0'/><path d='M6 22c0-4 3-8 6-8s6 4 6 8'/></svg>",
        green: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22V8'/><path d='M6 12c3-2 9-2 12 0'/><path d='M8 8c2-2 6-2 8 0'/></svg>",
        safety: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z'/></svg>",
        endure: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16v4H4z'/><path d='M8 8v12'/><path d='M16 8v12'/></svg>",
        community: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><circle cx='7' cy='7' r='3'/><circle cx='17' cy='7' r='3'/><path d='M2 21v-2a5 5 0 0 1 5-5h2'/><path d='M22 21v-2a5 5 0 0 0-5-5h-2'/></svg>",
        accessible: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/><path d='M9 21l3-7 4 7'/><path d='M5 12h14'/></svg>",
        wealth: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='9'/><path d='M8 13h8'/><path d='M12 7v10'/></svg>",
    };
    const pickIcon = (text) => {
        const t = text.toLowerCase();
        if (t.includes("innovative")) return icons.innovative;
        if (t.includes("strategic")) return icons.strategic;
        if (t.includes("modern")) return icons.modern;
        if (t.includes("sustainable")) return icons.sustainable;
        if (t.includes("green")) return icons.green;
        if (t.includes("safety")) return icons.safety;
        if (t.includes("endure") || t.includes("built")) return icons.endure;
        if (t.includes("community")) return icons.community;
        if (t.includes("accessible") || t.includes("ownership")) return icons.accessible;
        if (t.includes("wealth")) return icons.wealth;
        return icons.modern;
    };

    tabs.forEach((tab) => {
        const titleEl = tab.querySelector(".promise-tab-title");
        if (!titleEl) return;
        const svg = pickIcon(titleEl.textContent || "");
        const span = document.createElement("span");
        span.className = "promise-tab-icon";
        span.style.backgroundImage = `url("data:image/svg+xml;utf8,${svg}")`;
        tab.insertBefore(span, titleEl);
    });
})();

// Solutions carousel: auto-scroll one card at a time, loop smoothly (infinite)
(function initSolutionsCarousel() {
    const root = document.querySelector('.new-development-focus .focus-carousel-wrap[data-auto-carousel="solutions"]');
    const carousel = root?.querySelector(".focus-carousel");
    const track = carousel?.querySelector(".focus-grid");
    if (!root || !carousel || !track) return;
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    let cleanupActive = null;
    let resizeTimer = null;
    let dotsCleanup = null;

    function getGapPx() {
        const s = getComputedStyle(track);
        const gap = parseFloat(s.columnGap || s.gap || "0");
        return Number.isFinite(gap) ? gap : 0;
    }

    function getSlidesPerView() {
        const w = window.innerWidth || 1200;
        if (w <= 560) return 1;
        if (w <= 900) return 2;
        return 3;
    }

    function setup() {
        // teardown previous listeners/timer
        if (typeof cleanupActive === "function") cleanupActive();
        cleanupActive = null;
        if (typeof dotsCleanup === "function") dotsCleanup();
        dotsCleanup = null;

        // remove old clones
        track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());

        const originals = Array.from(track.children).filter((el) => el.classList && el.classList.contains("focus-item"));
        if (originals.length < 2) return;

        const perView = getSlidesPerView();
        const cloneCount = Math.min(perView, originals.length);

        // clone tail -> prepend
        originals
            .slice(-cloneCount)
            .map((el) => el.cloneNode(true))
            .forEach((clone) => {
                clone.dataset.clone = "true";
                track.insertBefore(clone, track.firstChild);
            });

        // clone head -> append
        originals
            .slice(0, cloneCount)
            .map((el) => el.cloneNode(true))
            .forEach((clone) => {
                clone.dataset.clone = "true";
                track.appendChild(clone);
            });

        // start in the "real" first item position
        function getStepPx() {
            const first = track.querySelector(".focus-item");
            if (!first) return 0;
            return first.getBoundingClientRect().width + getGapPx();
        }

        function getWrapState() {
            const step = getStepPx();
            const originalWidth = step * originals.length;
            const start = step * cloneCount;
            return { step, originalWidth, start };
        }

        function jumpToRealStart() {
            const { step, start } = getWrapState();
            if (!step) return;
            carousel.scrollLeft = start;
        }

        requestAnimationFrame(jumpToRealStart);

        let paused = false;
        const pause = () => (paused = true);
        const resume = () => (paused = false);

        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let userInteracting = false;
        let isAnimating = false;
        let rafId = 0;

        // Dots
        const dotsWrap = root.querySelector('.carousel-dots[data-carousel-dots="solutions"]');
        const dots = [];
        function getActiveIndex() {
            const { step, start } = getWrapState();
            if (!step) return 0;
            const raw = Math.round((carousel.scrollLeft - start) / step);
            return ((raw % originals.length) + originals.length) % originals.length;
        }
        function setActiveDot(idx) {
            dots.forEach((b, i) => {
                const active = i === idx;
                b.classList.toggle("is-active", active);
                b.setAttribute("aria-current", active ? "true" : "false");
            });
        }
        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = "";
            originals.forEach((_, i) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "carousel-dot" + (i === 0 ? " is-active" : "");
                btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
                btn.setAttribute("aria-current", i === 0 ? "true" : "false");
                btn.addEventListener("click", () => {
                    const { step, start } = getWrapState();
                    if (!step) return;
                    paused = true;
                    animateTo(start + step * i, 850);
                    window.setTimeout(() => {
                        paused = false;
                    }, 900);
                });
                dots.push(btn);
                dotsWrap.appendChild(btn);
            });
            setActiveDot(getActiveIndex());
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function wrapIfNeeded() {
            const { step, originalWidth, start } = getWrapState();
            if (!step) return;
            // wrap thresholds with a small buffer to avoid oscillation
            const buffer = step * 0.35;
            if (carousel.scrollLeft < start - buffer) {
                carousel.scrollLeft += originalWidth;
            } else if (carousel.scrollLeft >= start + originalWidth + buffer) {
                carousel.scrollLeft -= originalWidth;
            }
        }

        function animateTo(targetLeft, durationMs = 850) {
            if (isAnimating) return;
            isAnimating = true;
            // Disable snap during animation to avoid "snap-jank"
            const prevSnap = carousel.style.scrollSnapType;
            carousel.style.scrollSnapType = "none";

            const startLeft = carousel.scrollLeft;
            const delta = targetLeft - startLeft;
            const startTime = performance.now();

            function frame(now) {
                const t = Math.min(1, (now - startTime) / durationMs);
                carousel.scrollLeft = startLeft + delta * easeInOutCubic(t);
                if (dots.length) setActiveDot(getActiveIndex());
                if (t < 1) {
                    rafId = requestAnimationFrame(frame);
                } else {
                    cancelAnimationFrame(rafId);
                    rafId = 0;
                    // Wrap AFTER animation so it stays visually smooth
                    wrapIfNeeded();
                    if (dots.length) setActiveDot(getActiveIndex());
                    // Restore snap after the wrap so manual scrolling still snaps to cards
                    requestAnimationFrame(() => {
                        carousel.style.scrollSnapType = prevSnap || "";
                        isAnimating = false;
                    });
                }
            }

            rafId = requestAnimationFrame(frame);
        }

        const tick = () => {
            if (prefersReduced) return;
            if (paused || userInteracting || isAnimating) return;
            const { step } = getWrapState();
            if (!step) return;
            animateTo(carousel.scrollLeft + step, 850);
        };

        const intervalMs = 2800;
        const timer = prefersReduced ? 0 : window.setInterval(tick, intervalMs);

        // If user drags/scrolls manually, only wrap AFTER they stop interacting.
        let scrollEndTimer = 0;
        const onScroll = () => {
            if (isAnimating || userInteracting) return;
            window.clearTimeout(scrollEndTimer);
            scrollEndTimer = window.setTimeout(() => wrapIfNeeded(), 120);
            if (dots.length) setActiveDot(getActiveIndex());
        };

        const onPointerDown = () => (userInteracting = true);
        const onPointerUp = () => {
            userInteracting = false;
            wrapIfNeeded();
        };

        const onVisibility = () => {
            // Pause when tab is hidden to avoid weird jumps when coming back
            if (document.visibilityState === "hidden") pause();
            else resume();
        };

        carousel.addEventListener("scroll", onScroll, { passive: true });
        carousel.addEventListener("focusin", pause);
        carousel.addEventListener("focusout", resume);
        carousel.addEventListener("touchstart", onPointerDown, { passive: true });
        carousel.addEventListener("touchend", onPointerUp, { passive: true });
        carousel.addEventListener("pointerdown", onPointerDown, { passive: true });
        carousel.addEventListener("pointerup", onPointerUp, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);

        cleanupActive = () => {
            if (timer) window.clearInterval(timer);
            if (rafId) cancelAnimationFrame(rafId);
            carousel.removeEventListener("scroll", onScroll);
            carousel.removeEventListener("focusin", pause);
            carousel.removeEventListener("focusout", resume);
            carousel.removeEventListener("touchstart", onPointerDown);
            carousel.removeEventListener("touchend", onPointerUp);
            carousel.removeEventListener("pointerdown", onPointerDown);
            carousel.removeEventListener("pointerup", onPointerUp);
            document.removeEventListener("visibilitychange", onVisibility);
            track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());
        };

        buildDots();
        dotsCleanup = () => {
            if (dotsWrap) dotsWrap.innerHTML = "";
        };

        // Kick once after layout settles
        if (!prefersReduced) {
            window.setTimeout(() => {
                tick();
            }, 1200);
        }
    }

    setup();

    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setup, 250);
    });
})();

// Experience carousel: reliable one-by-one slider (single visible) + dots + smooth loop
(function initExperienceCarousel() {
    const root = document.querySelector('.experience .experience-carousel-wrap[data-auto-carousel="experience"]');
    const carousel = root?.querySelector(".experience-carousel");
    const track = carousel?.querySelector(".experience-track");
    if (!root || !carousel || !track) return;
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    let cleanupActive = null;
    let resizeTimer = null;

    function setup() {
        if (typeof cleanupActive === "function") cleanupActive();
        cleanupActive = null;

        // Reset clones
        track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());

        const realSlides = Array.from(track.children).filter((el) => el.classList && el.classList.contains("experience-slide") && !el.dataset.clone);
        if (realSlides.length < 2) return;

        // Append one clone (first slide) for seamless forward loop
        const firstClone = realSlides[0].cloneNode(true);
        firstClone.dataset.clone = "true";
        track.appendChild(firstClone);

        const slidesAll = Array.from(track.querySelectorAll(".experience-slide"));
        const dotsWrap = root.querySelector('.carousel-dots[data-carousel-dots="experience"]');
        const dots = [];

        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let paused = false;
        let userInteracting = false;
        let currentIndex = 0; // 0..realSlides.length-1

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function setActiveDot(idx) {
            dots.forEach((b, i) => {
                const active = i === idx;
                b.classList.toggle("is-active", active);
                b.setAttribute("aria-current", active ? "true" : "false");
            });
        }

        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = "";
            realSlides.forEach((_, i) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "carousel-dot" + (i === 0 ? " is-active" : "");
                btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
                btn.setAttribute("aria-current", i === 0 ? "true" : "false");
                btn.addEventListener("click", () => {
                    paused = true;
                    goTo(i, true);
                    window.setTimeout(() => (paused = false), 950);
                });
                dots.push(btn);
                dotsWrap.appendChild(btn);
            });
            setActiveDot(currentIndex);
        }

        function setTransition(enabled) {
            track.style.transition = enabled ? "" : "none";
        }

        function applyIndex(i, smooth) {
            const target = slidesAll[i];
            if (!target) return;
            const x = -target.offsetLeft;
            if (!smooth || prefersReduced) setTransition(false);
            track.style.transform = `translate3d(${x}px, 0, 0)`;
            if (!smooth || prefersReduced) requestAnimationFrame(() => setTransition(true));
        }

        function nearestRealIndex() {
            // determine nearest by comparing target offsets vs current transform position
            const m = getComputedStyle(track).transform;
            const tx = m && m !== "none" ? parseFloat(m.split(",")[4] || "0") : 0;
            const base = -tx;
            let best = 0;
            let bestD = Infinity;
            for (let i = 0; i < realSlides.length; i++) {
                const d = Math.abs(realSlides[i].offsetLeft - base);
                if (d < bestD) {
                    bestD = d;
                    best = i;
                }
            }
            return best;
        }

        function wrapIfOnClone() {
            // If we are on the clone (last slide), jump instantly back to first real slide.
            const cloneIdx = realSlides.length; // last item in slidesAll
            const clone = slidesAll[cloneIdx];
            if (!clone) return;
            const m = getComputedStyle(track).transform;
            const tx = m && m !== "none" ? parseFloat(m.split(",")[4] || "0") : 0;
            const base = -tx;
            const d = Math.abs(base - clone.offsetLeft);
            if (d < 2) {
                setTransition(false);
                applyIndex(0, false);
                requestAnimationFrame(() => setTransition(true));
            }
        }

        function tick() {
            if (prefersReduced) return;
            if (paused || userInteracting) return;
            const next = currentIndex + 1;
            if (next === realSlides.length) {
                // animate to clone, then jump back to start
                applyIndex(next, true);
                currentIndex = 0;
                // jump back after transition completes
                window.setTimeout(wrapIfOnClone, 920);
            } else {
                applyIndex(next, true);
                currentIndex = next;
            }
            setActiveDot(currentIndex);
        }

        // Initial position
        requestAnimationFrame(() => {
            applyIndex(0, false);
        });

        const intervalMs = 3200;
        const timer = prefersReduced ? 0 : window.setInterval(tick, intervalMs);

        let scrollEndTimer = 0;
        const onScroll = () => {
            if (userInteracting) return;
            window.clearTimeout(scrollEndTimer);
            scrollEndTimer = window.setTimeout(() => {
                wrapIfOnClone();
                currentIndex = nearestRealIndex();
                setActiveDot(currentIndex);
            }, 140);
        };

        const onPointerDown = () => (userInteracting = true);
        const onPointerUp = () => {
            userInteracting = false;
            wrapIfOnClone();
            currentIndex = nearestRealIndex();
            setActiveDot(currentIndex);
        };

        const onVisibility = () => {
            if (document.visibilityState === "hidden") paused = true;
            else paused = false;
        };

        // No scrollLeft carousel anymore; keep only interaction pauses
        carousel.addEventListener("touchstart", onPointerDown, { passive: true });
        carousel.addEventListener("touchend", onPointerUp, { passive: true });
        carousel.addEventListener("pointerdown", onPointerDown, { passive: true });
        carousel.addEventListener("pointerup", onPointerUp, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);

        buildDots();

        // Kick once after layout settles
        if (!prefersReduced) window.setTimeout(tick, 1200);

        cleanupActive = () => {
            if (timer) window.clearInterval(timer);
            carousel.removeEventListener("touchstart", onPointerDown);
            carousel.removeEventListener("touchend", onPointerUp);
            carousel.removeEventListener("pointerdown", onPointerDown);
            carousel.removeEventListener("pointerup", onPointerUp);
            document.removeEventListener("visibilitychange", onVisibility);
            track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());
            if (dotsWrap) dotsWrap.innerHTML = "";
            track.style.transform = "";
        };
    }

    setup();
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setup, 250);
    });
})();

// Projects carousel: show three (desktop), slide one-by-one, loop smoothly
(function initProjectsCarousel() {
    const root = document.querySelector('.projects-portfolio .projects-carousel-wrap[data-auto-carousel="projects"]');
    const carousel = root?.querySelector(".projects-carousel");
    const track = carousel?.querySelector(".projects-track");
    if (!root || !carousel || !track) return;
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    let cleanupActive = null;
    let resizeTimer = null;
    let dotsCleanup = null;

    function getSlidesPerView() {
        const w = window.innerWidth || 1200;
        if (w <= 768) return 1;
        if (w <= 968) return 2;
        return 3;
    }

    function setup() {
        if (typeof cleanupActive === "function") cleanupActive();
        cleanupActive = null;
        if (typeof dotsCleanup === "function") dotsCleanup();
        dotsCleanup = null;

        track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());

        const realCards = Array.from(track.children).filter((el) => el.classList && el.classList.contains("project-card-simple") && !el.dataset.clone);
        if (realCards.length < 2) return;

        const perView = Math.min(getSlidesPerView(), realCards.length);

        // Append clones (first perView cards) for seamless forward loop
        realCards.slice(0, perView).forEach((c) => {
            const clone = c.cloneNode(true);
            clone.dataset.clone = "true";
            track.appendChild(clone);
        });

        const cardsAll = Array.from(track.querySelectorAll(".project-card-simple"));
        const dotsWrap = root.querySelector('.carousel-dots[data-carousel-dots="projects"]');
        const dots = [];

        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let paused = false;
        let userInteracting = false;
        let currentIndex = 0; // 0..realCards.length-1

        const pause = () => (paused = true);
        const resume = () => (paused = false);

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Dots
        function setActiveDot(idx) {
            dots.forEach((b, i) => {
                const active = i === idx;
                b.classList.toggle("is-active", active);
                b.setAttribute("aria-current", active ? "true" : "false");
            });
        }
        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = "";
            realCards.forEach((_, i) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "carousel-dot" + (i === 0 ? " is-active" : "");
                btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
                btn.setAttribute("aria-current", i === 0 ? "true" : "false");
                btn.addEventListener("click", () => {
                    paused = true;
                    goTo(i, true);
                    window.setTimeout(() => {
                        paused = false;
                    }, 900);
                });
                dots.push(btn);
                dotsWrap.appendChild(btn);
            });
            setActiveDot(currentIndex);
        }

        function setTransition(enabled) {
            track.style.transition = enabled ? "" : "none";
        }

        function applyIndex(i, smooth) {
            const target = cardsAll[i];
            if (!target) return;
            const x = -target.offsetLeft;
            if (!smooth || prefersReduced) setTransition(false);
            track.style.transform = `translate3d(${x}px, 0, 0)`;
            if (!smooth || prefersReduced) requestAnimationFrame(() => setTransition(true));
        }

        function goTo(i, smooth) {
            applyIndex(i, smooth);
        }

        function nearestRealIndex() {
            const m = getComputedStyle(track).transform;
            const tx = m && m !== "none" ? parseFloat(m.split(",")[4] || "0") : 0;
            const base = -tx;
            let best = 0;
            let bestD = Infinity;
            for (let i = 0; i < realCards.length; i++) {
                const d = Math.abs(realCards[i].offsetLeft - base);
                if (d < bestD) {
                    bestD = d;
                    best = i;
                }
            }
            return best;
        }

        function wrapIfOnClone() {
            const cloneStartIndex = realCards.length;
            const cloneStart = cardsAll[cloneStartIndex];
            if (!cloneStart) return;
            const m = getComputedStyle(track).transform;
            const tx = m && m !== "none" ? parseFloat(m.split(",")[4] || "0") : 0;
            const base = -tx;
            if (base >= cloneStart.offsetLeft - 2) {
                setTransition(false);
                applyIndex(0, false);
                requestAnimationFrame(() => setTransition(true));
            }
        }

        const tick = () => {
            if (prefersReduced) return;
            if (paused || userInteracting) return;
            const next = currentIndex + 1;
            if (next >= realCards.length) {
                // animate into clones then jump back
                const target = cardsAll[realCards.length]; // first clone
                if (!target) return;
                applyIndex(realCards.length, true);
                currentIndex = 0;
                window.setTimeout(wrapIfOnClone, 880);
            } else {
                goTo(next, true);
                currentIndex = next;
            }
            setActiveDot(currentIndex);
        };

        const intervalMs = 2800;
        const timer = prefersReduced ? 0 : window.setInterval(tick, intervalMs);

        let scrollEndTimer = 0;
        const onScroll = () => {
            if (userInteracting) return;
            window.clearTimeout(scrollEndTimer);
            scrollEndTimer = window.setTimeout(() => {
                wrapIfOnClone();
                currentIndex = nearestRealIndex();
                setActiveDot(currentIndex);
            }, 140);
        };

        const onPointerDown = () => (userInteracting = true);
        const onPointerUp = () => {
            userInteracting = false;
            wrapIfOnClone();
            currentIndex = nearestRealIndex();
            setActiveDot(currentIndex);
        };

        const onVisibility = () => {
            if (document.visibilityState === "hidden") paused = true;
            else paused = false;
        };

        // No scrollLeft carousel anymore
        carousel.addEventListener("focusin", pause);
        carousel.addEventListener("focusout", resume);
        carousel.addEventListener("touchstart", onPointerDown, { passive: true });
        carousel.addEventListener("touchend", onPointerUp, { passive: true });
        carousel.addEventListener("pointerdown", onPointerDown, { passive: true });
        carousel.addEventListener("pointerup", onPointerUp, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);

        cleanupActive = () => {
            if (timer) window.clearInterval(timer);
            carousel.removeEventListener("focusin", pause);
            carousel.removeEventListener("focusout", resume);
            carousel.removeEventListener("touchstart", onPointerDown);
            carousel.removeEventListener("touchend", onPointerUp);
            carousel.removeEventListener("pointerdown", onPointerDown);
            carousel.removeEventListener("pointerup", onPointerUp);
            document.removeEventListener("visibilitychange", onVisibility);
            track.querySelectorAll('[data-clone="true"]').forEach((n) => n.remove());
            track.style.transform = "";
        };

        buildDots();
        dotsCleanup = () => {
            if (dotsWrap) dotsWrap.innerHTML = "";
        };
    }

    setup();
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setup, 250);
    });
})();

// Sticky Navigation Functionality
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const scrollToTopBtn = document.getElementById("scrollToTop");

    if (!navbar) {
        console.log("Navbar not found");
        return;
    }

    // Sticky navbar on scroll
    function handleScroll() {
        const scrollY = window.pageYOffset;

        if (scrollY > 100) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }

        // Show/hide scroll to top button
        if (scrollToTopBtn) {
            if (scrollY > 300) {
                scrollToTopBtn.classList.add("show");
            } else {
                scrollToTopBtn.classList.remove("show");
            }
        }
    }

    // Simple scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Smooth scroll to top when button is clicked
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }

    // Test the functionality
    console.log("Sticky navigation initialized");
});

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

// Enhanced smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const targetPosition = target.offsetTop - 80; // Account for navbar height

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });
});

// Parallax scroll effects for enhanced visual flow
document.addEventListener("DOMContentLoaded", function () {
    const parallaxElements = document.querySelectorAll(".hero, .investment-innovation");
    let ticking = false;

    function updateParallax() {
        if (window.innerWidth <= 768) {
            // Reset transforms on mobile
            parallaxElements.forEach((el) => {
                el.style.transform = "";
            });
            ticking = false;
            return;
        }
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.2; // Slower parallax for smoother effect
            element.style.transform = `translateY(${rate}px)`;
        });

        ticking = false;
    }

    function onParallaxScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onParallaxScroll, { passive: true });
});

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

// Animated Counter for Key Metrics
function animateCounters() {
    const counters = document.querySelectorAll(".metric-number");

    counters.forEach((counter) => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ""));
        const suffix = counter.textContent.replace(/[0-9]/g, "");
        let current = 0;
        const increment = target / 50;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };

        updateCounter();
    });
}

// Observe key metrics section for counter animation
const metricsSection = document.querySelector(".key-metrics");
if (metricsSection) {
    const metricsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    metricsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    metricsObserver.observe(metricsSection);
}

// Enhanced hover effects for solution items
document.querySelectorAll(".solution-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
        this.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });

    item.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
    });
});

// Investment Chart Animation
function animateChart() {
    const chartBars = document.querySelectorAll(".bar-fill");

    chartBars.forEach((bar, index) => {
        const height = bar.style.height;
        bar.style.height = "0%";

        setTimeout(() => {
            bar.style.height = height;
            bar.style.transition = "height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        }, index * 200);
    });
}

// Observe investment chart for animation
const chartSection = document.querySelector(".investment-performance");
if (chartSection) {
    const chartObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateChart();
                    chartObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    chartObserver.observe(chartSection);
}

// Enhanced performance card animations
document.querySelectorAll(".performance-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
        card.style.transition = "all 0.6s ease-out";
    }, index * 150);
});

// Staggered animation for market items
const marketItems = document.querySelectorAll(".market-item");
if (marketItems.length > 0) {
    const marketObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }, index * 200);
                    marketObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    marketItems.forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "all 0.6s ease-out";
        marketObserver.observe(item);
    });
}

// Enhanced project card interactions
document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
        const overlay = this.querySelector(".project-overlay");
        if (overlay) {
            overlay.style.opacity = "0.9";
        }

        const image = this.querySelector(".project-img");
        if (image) {
            image.style.transform = "scale(1.05)";
        }
    });

    card.addEventListener("mouseleave", function () {
        const overlay = this.querySelector(".project-overlay");
        if (overlay) {
            overlay.style.opacity = "0.7";
        }

        const image = this.querySelector(".project-img");
        if (image) {
            image.style.transform = "scale(1)";
        }
    });
});

// NOTE: Section move/reveal animations disabled (they can interfere with carousels/layout)

/**
 * Auckland's Growth Destination Section Scripting
 * Features: Growth card reveals and architectural image effects
 */
(function initAucklandGrowthSection() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".auckland-section");
    if (!section) return;

    // 1. Image Parallax for the architectural frame
    const img = section.querySelector(".arch-img");
    if (img) {
        gsap.to(img, {
            scale: 1.15,
            y: 30,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // 2. Growth Cards Reveal - simplified to ensure visibility
    const cards = section.querySelectorAll(".growth-point-card");
    if (cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "opacity,transform", // Ensure they stay visible after animation
            scrollTrigger: {
                trigger: ".auckland-grid-main",
                start: "top 90%", // Trigger earlier
                toggleActions: "play none none none" // Play once and stay
            }
        });

        // 3D Hover refinement
        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotX = (y - centerY) / 15;
                const rotY = (centerX - x) / 15;

                gsap.to(card, {
                    rotateX: rotX,
                    rotateY: rotY,
                    duration: 0.4,
                    ease: "power1.out",
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });
    }

    // 3. Header Text Reveal
    const header = section.querySelector(".auckland-header-block");
    if (header) {
        gsap.from(header, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: header,
                start: "top 90%"
            }
        });
    }
})();

/* ── Philosophy section: typewriter carousel (type → pause → delete → next) ── */
(function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.querySelector(".investment-innovation");
    if (!section) return;

    var slot = section.querySelector(".philosophy-slot");
    var sourceEls = section.querySelectorAll(".philosophy-source span");
    if (!slot || !sourceEls.length) return;

    var lines = [];
    sourceEls.forEach(function (el) { lines.push(el.textContent); });

    var TYPE_SPEED = 35;      // ms per character typing
    var DELETE_SPEED = 20;    // ms per character deleting
    var PAUSE_AFTER = 2200;   // ms to hold the full line
    var PAUSE_BETWEEN = 500;  // ms pause after deleting before next line
    var running = false;

    function sleep(ms) {
        return new Promise(function (r) { setTimeout(r, ms); });
    }

    function typeLine(text) {
        return new Promise(function (resolve) {
            var i = 0;
            function next() {
                if (i > text.length) { resolve(); return; }
                slot.textContent = text.substring(0, i);
                i++;
                setTimeout(next, TYPE_SPEED);
            }
            next();
        });
    }

    function deleteLine(text) {
        return new Promise(function (resolve) {
            var i = text.length;
            function next() {
                if (i < 0) { resolve(); return; }
                slot.textContent = text.substring(0, i);
                i--;
                setTimeout(next, DELETE_SPEED);
            }
            next();
        });
    }

    async function loop() {
        while (running) {
            for (var idx = 0; idx < lines.length; idx++) {
                var text = lines[idx];
                await typeLine(text);
                await sleep(PAUSE_AFTER);
                await deleteLine(text);
                await sleep(PAUSE_BETWEEN);
            }
        }
    }

    ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        once: true,
        onEnter: function () {
            running = true;
            // Fade in title first
            var title = section.querySelector(".philosophy-title");
            if (title) {
                gsap.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    ease: "power3.out",
                    onComplete: function () { setTimeout(loop, 500); }
                });
            } else {
                loop();
            }
        }
    });
})();

/* ── Solutions showcase: staggered reveal (header + each card) ── */
(function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.querySelector(".solutions-showcase");
    if (!section) return;

    var header = section.querySelector(".solutions-showcase-header");
    var cards = section.querySelectorAll(".solutions-card");
    if (!header || !cards.length) return;

    // Set initial states
    gsap.set(header, { opacity: 0, y: 40 });
    cards.forEach(function (card) {
        gsap.set(card, { opacity: 0, y: 60 });
    });

    ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: function () {
            var tl = gsap.timeline();

            // Header reveals first — slow and cinematic
            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: "power3.out"
            });

            // Pause before cards begin
            tl.addLabel("cards", "+=0.3");

            // Each card reveals one by one with generous spacing
            cards.forEach(function (card, i) {
                tl.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }, "cards+=" + (i * 0.35));
            });
        }
    });
})();

/* ── Global: smooth scroll-reveal for every section ── */
(function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    var sections = document.querySelectorAll(
        ".metrics-after-hero, .home-investment-cta, .newsletter-section, .development-insights, footer"
    );

    sections.forEach(function (section) {
        gsap.set(section, { opacity: 0, y: 80 });

        ScrollTrigger.create({
            trigger: section,
            start: "top 90%",
            once: true,
            onEnter: function () {
                gsap.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out"
                });
            }
        });
    });
})();

