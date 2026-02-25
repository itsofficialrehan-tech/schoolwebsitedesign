

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger missing");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // =======================
  // SECTION DEPTH REVEAL
  // =======================

  gsap.utils.toArray(".reveal-section").forEach((section) => {
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 120,
        scale: 0.95,
        filter: "blur(14px)"
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true
        }
      }
    );
  });

  // =======================
  // HEADING LETTER STAGGER
  // =======================

  document.querySelectorAll(".reveal-section h2").forEach((heading) => {
    // Prevent double split
    if (heading.dataset.split === "true") return;
    heading.dataset.split = "true";

    const text = heading.textContent;
    heading.textContent = "";

    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.classList.add("letter");
      span.textContent = char === " " ? "\u00A0" : char;
      heading.appendChild(span);
    });

    gsap.fromTo(
      heading.querySelectorAll(".letter"),
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true
        }
      }
    );
  });

  // =======================
  // IMAGE PARALLAX DEPTH
  // =======================

  gsap.utils.toArray(".parallax-img").forEach((img) => {
    gsap.to(img, {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  // =======================
  // FINAL SAFETY REFRESH
  // =======================

  ScrollTrigger.refresh();
});