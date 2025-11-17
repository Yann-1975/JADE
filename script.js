
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const successBox = document.getElementById("successAnimation");

  if (form) {
    form.addEventListener("input", () => {
      if (form.checkValidity()) {
        feedback.textContent = "";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      feedback.textContent = "Sending...";
      feedback.style.color = "#444";

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          successBox.style.display = "block";
          feedback.textContent = "";
          form.reset();
          setTimeout(() => {
            successBox.style.display = "none";
          }, 5000);
        } else {
          feedback.textContent = "Error sending message.";
          feedback.style.color = "red";
        }
      } catch (err) {
        feedback.textContent = "Network error.";
        feedback.style.color = "red";
      }
    });
  }
});
