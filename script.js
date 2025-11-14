
// Navigation active link highlight (simple)
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".main-nav .nav-link");
  navLinks.forEach(link => {
    if (link.href && link.href.endsWith(location.pathname.split("/").pop())) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });

  // Contact form handling: if Formspree action still is the placeholder, prevent default and show a friendly message.
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      const feedback = document.getElementById("formFeedback");
      // If the action contains "formspree.io/f/yourformid" then it's a placeholder - use JS fallback
      const action = (form.getAttribute("action") || "").trim();
      if (action.includes("yourformid") || action === "") {
        e.preventDefault();
        feedback.textContent = "This site is running locally. To receive messages, replace the form action with your Formspree endpoint. (See instructions in README.)";
        // simple UX: simulate success
        setTimeout(() => {
          feedback.textContent = "Message received locally. Thank you — Yann will get back to you.";
          form.reset();
        }, 600);
        return;
      }

      // If a real Formspree endpoint is used, optionally show progress and let the browser submit
      feedback.textContent = "Sending...";
      // Let the browser proceed with default submit (no e.preventDefault()) so Formspree receives the POST.
      // If you prefer AJAX to Formspree, implement fetch here.
    });
  }
});
