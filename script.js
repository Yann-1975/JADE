
/* CONTACT PAGE SCRIPT - ALL FEATURES INTEGRATED */
document.addEventListener("DOMContentLoaded", () => {
  // ---- Dark mode (persist) ----
  const dmToggle = document.getElementById("darkToggle");
  const root = document.documentElement;
  const currentTheme = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
  if (currentTheme === "dark") root.setAttribute("data-theme", "dark");
  dmToggle?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      dmToggle.setAttribute("aria-pressed", "false");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      dmToggle.setAttribute("aria-pressed", "true");
    }
  });

  // ---- Form handling (Formspree) ----
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const successCheck = document.getElementById("successCheck");

  if (form) {
    // Live validation: remove feedback on input if valid
    form.addEventListener("input", () => {
      if (form.checkValidity()) {
        feedback.textContent = "";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // simple client-side checks
      if (!form.checkValidity()) {
        feedback.textContent = "Please fill all required fields correctly.";
        feedback.style.color = "crimson";
        return;
      }
      feedback.textContent = "Sending...";
      feedback.style.color = "inherit";

      try {
        const fd = new FormData(form);
        const res = await fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (res.ok) {
          feedback.textContent = "";
          showSuccess();
          form.reset();
          // Optional: close success after 4s
          setTimeout(hideSuccess, 4000);
        } else {
          const data = await res.json().catch(() => null);
          feedback.textContent = (data && data.error) ? data.error : "Error sending message.";
          feedback.style.color = "crimson";
        }
      } catch (err) {
        feedback.textContent = "Network error. Please try again later.";
        feedback.style.color = "crimson";
      }
    });
  }

  function showSuccess(){
    if(successCheck){
      successCheck.style.display = "flex";
      successCheck.setAttribute("aria-hidden", "false");
    }
  }
  function hideSuccess(){
    if(successCheck){
      successCheck.style.display = "none";
      successCheck.setAttribute("aria-hidden", "true");
    }
  }

  // ---- Hours toggle ----
  const hoursBtn = document.getElementById("openHoursToggle");
  const hoursCard = document.getElementById("hoursCard");
  hoursBtn?.addEventListener("click", () => {
    if (!hoursCard) return;
    const isShown = hoursCard.style.display === "block";
    hoursCard.style.display = isShown ? "none" : "block";
    hoursCard.setAttribute("aria-hidden", String(isShown));
  });

  // ---- Chat bubble (static UI) ----
  const chatBtn = document.getElementById("chatBubble");
  chatBtn?.addEventListener("click", () => {
    // Simple behaviour: open email compose as "chat" fallback
    window.location.href = `mailto:Yannfreddy1975@gmail.com?subject=${encodeURIComponent("Chat with Yann")}`;
  });

  // ---- Small accessibility: focus outlines on keyboard nav ----
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Tab") document.body.classList.add("show-focus");
  });

  // ---- Optional: small animation to whatsapp/call floats when page loads ----
  const wa = document.getElementById("whatsappFloat");
  const call = document.getElementById("callNowFloat");
  [wa, call].forEach(el => {
    if (!el) return;
    el.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 600, easing: 'cubic-bezier(.2,.9,.3,1)'});
  });
});
