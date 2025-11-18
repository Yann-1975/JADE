
// Simple site JS: active nav, mailto builders and Problem-Solving mail generation
document.addEventListener("DOMContentLoaded", () => {
  // activate current nav link
  const links = document.querySelectorAll(".main-nav .nav-link");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach(a => {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
    }
  });

  // Contact page: build mailto from contact form
  const mailForm = document.getElementById("mailtoForm");
  if (mailForm) {
    mailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("fullname").value.trim();
      const email = document.getElementById("emailaddr").value.trim();
      const message = document.getElementById("messagebody").value.trim();

      if (!name || !email || !message) {
        document.getElementById("mailStatus").textContent = "Please fill all fields.";
        return;
      }

      const to = "Yannfreddy1975@gmail.com";
      const subject = encodeURIComponent(`Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

      // open mail client (user's email app)
      window.location.href = mailto;
      document.getElementById("mailStatus").textContent = "Opening your email client...";
    });
  }

  // Problem-Solving page: booking/feedback mail generation
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("custName").value.trim();
      const email = document.getElementById("custEmail").value.trim();
      const datetime = document.getElementById("bookingDate").value;
      const size = document.getElementById("partySize").value;
      const notes = document.getElementById("notes").value.trim();

      if (!name || !email || !datetime || !size) {
        document.getElementById("bookingStatus").textContent = "Please complete required fields.";
        return;
      }

      const to = "Yannfreddy1975@gmail.com";
      const subject = encodeURIComponent(`Booking request from ${name}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Date/Time: ${datetime}`,
        `Party size: ${size}`,
        `Notes: ${notes || "-"}`,
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

      // Open mail client with pre-filled email
      window.location.href = mailto;
      document.getElementById("bookingStatus").textContent = "Opening your email client to send the booking...";
    });
  }
});
