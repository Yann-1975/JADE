
/* === existing site nav & contact code should remain above or below this block === */

document.addEventListener("DOMContentLoaded", () => {
  // --- Carousel implementation ---
  const track = document.getElementById("menuTrack");
  const carousel = document.getElementById("menuCarousel");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const dotsContainer = document.getElementById("carouselDots");

  if (track) {
    const cards = Array.from(track.children);
    let cardWidth = cards[0].getBoundingClientRect().width + 14; // 14 = gap
    let currentIndex = 0;

    // build dots
    function buildDots() {
      dotsContainer.innerHTML = "";
      const pages = Math.max(1, Math.ceil((cards.length * cardWidth) / carousel.clientWidth));
      // create a dot per card for simpler mapping
      cards.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "dot";
        d.dataset.index = i;
        d.addEventListener("click", () => goToIndex(i));
        dotsContainer.appendChild(d);
      });
      updateDots();
    }

    function updateDots() {
      const all = dotsContainer.querySelectorAll(".dot");
      all.forEach(dot => dot.classList.remove("active"));
      const idx = Math.min(currentIndex, all.length - 1);
      if (all[idx]) all[idx].classList.add("active");
    }

    function goToIndex(i) {
      currentIndex = Math.max(0, Math.min(i, cards.length - 1));
      const x = -currentIndex * cardWidth;
      track.style.transform = `translateX(${x}px)`;
      updateDots();
    }

    // prev/next
    prevBtn?.addEventListener("click", () => goToIndex(currentIndex - 1));
    nextBtn?.addEventListener("click", () => goToIndex(currentIndex + 1));

    // resize handling
    window.addEventListener("resize", () => {
      cardWidth = cards[0].getBoundingClientRect().width + 14;
      goToIndex(currentIndex);
    });

    // basic drag / touch support
    let isDown = false, startX = 0, scrollX = 0;
    carousel.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      carousel.setPointerCapture(e.pointerId);
      carousel.style.cursor = "grabbing";
    });
    carousel.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.style.transform = `translateX(${ -currentIndex * cardWidth + dx }px)`;
    });
    carousel.addEventListener("pointerup", (e) => {
      if (!isDown) return;
      isDown = false;
      carousel.releasePointerCapture(e.pointerId);
      carousel.style.cursor = "default";
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goToIndex(currentIndex + 1); else goToIndex(currentIndex - 1);
      } else {
        goToIndex(currentIndex);
      }
    });
    carousel.addEventListener("pointercancel", () => goToIndex(currentIndex));

    // init
    buildDots();
    goToIndex(0);
  }

  // --- PDF generation using html2canvas + jsPDF ---
  // We'll dynamically load the libraries from CDN the first time download is clicked.
  const downloadBtn = document.getElementById("downloadPdf");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      downloadBtn.disabled = true;
      downloadBtn.textContent = "Preparing PDF...";

      // load scripts if not present
      async function loadScript(src){ return new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) return res();
        const s = document.createElement("script");
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });}

      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      } catch (err) {
        alert("Failed to load PDF libraries. Check your connection.");
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download Menu (PDF)";
        return;
      }

      // capture each card as image and add to PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const cards = Array.from(document.querySelectorAll(".menu-card"));
      const margin = 28;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      let y = margin;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        // temporarily create a clone to better control width
        const clone = card.cloneNode(true);
        clone.style.width = "600px"; // consistent size for better capture
        clone.style.boxShadow = "none";
        clone.style.transform = "scale(1)";
        clone.style.margin = "0";
        clone.style.background = "#fff";
        clone.querySelectorAll("img").forEach(img => { img.style.maxWidth = "100%"; img.style.height = "auto"; });

        document.body.appendChild(clone);
        // use html2canvas to capture clone
        // eslint-disable-next-line no-undef
        const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#ffffff" });
        document.body.removeChild(clone);

        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        // calculate image dimensions preserving aspect ratio
        const imgW = pageW - margin*2;
        const imgH = (canvas.height * imgW) / canvas.width;

        if (y + imgH > pageH - margin) {
          doc.addPage();
          y = margin;
        }

        doc.addImage(imgData, "JPEG", margin, y, imgW, imgH, undefined, "FAST");
        y += imgH + 16;
      }

      // Add small footer on last page
      const footerText = "Menu — Yann Tchamba • © " + new Date().getFullYear();
      doc.setFontSize(10);
      doc.text(footerText, margin, pageH - 20);

      // save PDF (download)
      doc.save("YannTchamba_Menu.pdf");

      downloadBtn.disabled = false;
      downloadBtn.textContent = "Download Menu (PDF)";
    });
  }
});
