// =======================
// NAVBAR SHRINK + SCROLL PROGRESS
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const progressBar = document.getElementById("scroll-progress");

  // Safety check
  if (!navbar || !progressBar) {
    console.warn("Navbar or scroll progress bar missing");
    return;
  }

  let ticking = false;

  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    // Prevent divide-by-zero on short pages
    const scrollPercent = maxScroll > 0
      ? (scrollTop / maxScroll) * 100
      : 0;

    progressBar.style.width = `${scrollPercent}%`;

    // Navbar shrink
    if (scrollTop > 80) {
      navbar.classList.add("shrink");
    } else {
      navbar.classList.remove("shrink");
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  // Initial state (page refresh / anchor links)
  updateOnScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
});
// =======================
// ACADEMICS POPUP SYSTEM
// =======================

const academicBanners = document.querySelectorAll(".academic-banner");
const academicsPopup = document.getElementById("academics-popup");
const academicsPopupImg = document.getElementById("academics-popup-img");
const academicsClose = document.getElementById("academics-close");

academicBanners.forEach(banner => {
  banner.addEventListener("click", () => {

    if (banner.classList.contains("primary")) {
      academicsPopupImg.src = "assets/images/academics/primary.jpg";
    }
    if (banner.classList.contains("middle")) {
      academicsPopupImg.src = "assets/images/academics/middle.jpg";
    }
    if (banner.classList.contains("secondary")) {
      academicsPopupImg.src = "assets/images/academics/secondary.jpg";
    }
    if (banner.classList.contains("senior")) {
      academicsPopupImg.src = "assets/images/academics/senior.jpg";
    }

    academicsPopup.classList.add("active");
  });
});

academicsClose.addEventListener("click", () => {
  academicsPopup.classList.remove("active");
});

// Close when clicking outside image
academicsPopup.addEventListener("click", (e) => {
  if (e.target === academicsPopup) {
    academicsPopup.classList.remove("active");
  }
});
// =======================
// FACILITIES POPUP
// =======================

const facilityImages = {
  "AUDITORIUM": "assets/images/facilities/auditorium.jpg",
  "SPORTS COMPLEX": "assets/images/facilities/sports.jpg",
  "COMPUTER LAB": "assets/images/facilities/computer.jpg",
  "SCIENCE LAB": "assets/images/facilities/science.jpg",
  "LIBRARY": "assets/images/facilities/library.jpg"
};

const popup = document.getElementById("facility-popup");
const popupTitle = document.getElementById("popup-title");
const popupImage = document.getElementById("popup-image");
const closeBtn = document.querySelector(".popup-close");
const overlay = document.querySelector(".popup-overlay");

document.querySelectorAll(".facility-card").forEach(card => {
  card.addEventListener("click", () => {
    const title = card.innerText.trim();
    popupTitle.innerText = title;
    popupImage.src = facilityImages[title];
    popup.style.display = "block";
    document.body.style.overflow = "hidden";
  });
});

function closePopup() {
  popup.style.display = "none";
  document.body.style.overflow = "auto";
}

closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
// =======================
// CONTACT FORM FIX
// =======================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // ⛔ page reload stop

    // Temporary success feedback
    alert("Message sent successfully!");

    contactForm.reset();
  });
}
