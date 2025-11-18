
// site JS: navigation active state, reservation modal -> mailto builder, contact mailto form
document.addEventListener("DOMContentLoaded", () => {
  // mark active nav link
  const links = document.querySelectorAll(".main-nav .nav-link");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach(a => { if (a.getAttribute("href") === current) a.classList.add("active"); });

  // Reservation modal controls
  const reserveBtn = document.getElementById("reserveBtn");
  const reserveBtn2 = document.getElementById("reserveBtn2");
  const modal = document.getElementById("reserveModal");
  const modalClose = document.getElementById("modalClose");
  const modalCancel = document.getElementById("modalCancel");
  const reserveForm = document.getElementById("reserveForm");
  const reserveStatus = document.getElementById("reserveStatus");

  function openModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const first = document.getElementById("r-name");
    if (first) first.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (reserveStatus) reserveStatus.textContent = "";
    if (reserveForm) reserveForm.reset();
  }

  [reserveBtn, reserveBtn2].forEach(b => b?.addEventListener("click", openModal));
  modalClose?.addEventListener("click", closeModal);
  modalCancel?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // Reservation -> mailto
  reserveForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("r-name").value.trim();
    const email = document.getElementById("r-email").value.trim();
    const phone = document.getElementById("r-phone").value.trim();
    const datetime = document.getElementById("r-datetime").value;
    const party = document.getElementById("r-party").value;
    const notes = document.getElementById("r-notes").value.trim();

    if (!name || !email || !datetime || !party) {
      if (reserveStatus) reserveStatus.textContent = "Please complete required fields.";
      return;
    }

    const to = "Yannfreddy1975@gmail.com";
    const subject = encodeURIComponent(`La Bella Vita reservation — ${name}`);
    const body = encodeURIComponent(
      `Reservation request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nDate/Time: ${datetime}\nParty size: ${party}\nNotes: ${notes || "-"}`
    );
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    if (reserveStatus) reserveStatus.textContent = "Opening your email client...";
    setTimeout(() => closeModal(), 800);
  });

  // Contact page mailto form
  const contactForm = document.getElementById("contactMailtoForm");
  const contactStatus = document.getElementById("contactStatus");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const message = document.getElementById("c-message").value.trim();
    if (!name || !email || !message) {
      if (contactStatus) contactStatus.textContent = "Please fill all fields.";
      return;
    }
    const to = "Yannfreddy1975@gmail.com";
    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    if (contactStatus) contactStatus.textContent = "Opening your email client...";
  });
});
