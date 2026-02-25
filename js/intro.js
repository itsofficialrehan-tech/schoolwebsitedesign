
// INTRO SCREEN + AUDIO 

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const audio = document.getElementById("introAudio");
  const enterBtn = document.getElementById("enter-site");

  // SAFETY CHECKS 
  if (!intro || !audio || !enterBtn) {
    console.warn("Intro elements missing");
    return;
  }

  let started = false;

  enterBtn.addEventListener("click", () => {
    if (started) return;
    started = true;

    // AUDIO START (BROWSER SAFE)
    audio.volume = 0;
    audio.loop = true;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          let vol = 0;
          const fade = setInterval(() => {
            vol += 0.02;
            audio.volume = Math.min(vol, 0.35);
            if (vol >= 0.35) clearInterval(fade);
          }, 100);
        })
        .catch(err => {
          console.error("Audio play blocked:", err);
        });
    }

    // INTRO FADE OUT
    intro.style.transition = "opacity 1.2s ease";
    intro.style.opacity = "0";

    setTimeout(() => {
      intro.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1200);
  });
});
// FORCE SCROLL ENABLE (safety)
setTimeout(() => {
  document.body.style.overflow = "auto";
}, 1500);