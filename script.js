document.addEventListener("DOMContentLoaded", () => {
  /* ===== Contact Form (Formspree) ===== */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        status.textContent = "⚠️ Please fill in all fields.";
        status.className = "error";
        return;
      }
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
      if (!email.match(emailPattern)) {
        status.textContent = "⚠️ Enter a valid email address.";
        status.className = "error";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Sending...";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          status.textContent = "✅ Message sent successfully!";
          status.className = "success";
          form.reset();
        } else {
          status.textContent = "❌ Oops! Something went wrong. Please try again.";
          status.className = "error";
        }
      } catch (err) {
        status.textContent = "❌ Network error. Please try again later.";
        status.className = "error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  /* ===== Project Modals ===== */
  const modalOpenButtons = document.querySelectorAll(".modal-open");
  const projectCards = document.querySelectorAll(".project-card");
  const modals = document.querySelectorAll(".modal");

  function openModalById(id) {
    const modal = document.querySelector(id);
    if (modal) modal.classList.add("open");
  }
  function closeModal(modal) {
    modal.classList.remove("open");
  }

  // Open modal from "Details" buttons
  modalOpenButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      // try to get data-modal-target from closest project-card
      const card = e.currentTarget.closest(".project-card");
      const target = card && card.getAttribute("data-modal-target");
      if (target) openModalById(target);
    })
  );

  // Also open when clicking a card (optional)
  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Avoid opening when action button clicked
      if (e.target.closest("a") || e.target.closest("button")) return;
      const target = card.getAttribute("data-modal-target");
      if (target) openModalById(target);
    });
  });

  // Close logic (backdrop click or close button)
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal") || e.target.closest(".modal-close")) {
        closeModal(modal);
      }
    });
    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal(modal);
    });
  });

  /* ===== Reveal on Scroll (Intersection Observer) ===== */
  const revealables = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );
  revealables.forEach((el) => io.observe(el));

  /* ===== Skills Bar Chart (Chart.js) ===== */
  const ctx = document.getElementById("skillsChart");
  if (ctx) {
    const labels = ["Python", "SQL", "Java", "C++", "JavaScript", "Data Viz", "Machine Learning", "Git/GitHub"];
    const values = [90, 80, 70, 65, 70, 85, 60, 80];

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Proficiency (%)",
            data: values,
            backgroundColor: "rgba(0,170,255,0.9)",
            borderColor: "rgba(0,170,255,1)",
            borderWidth: 1
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { intersect: false, mode: "index" } },
        scales: {
          x: { ticks: { color: "#e2e8f0" }, grid: { color: "rgba(255,255,255,0.06)" } },
          y: { beginAtZero: true, max: 100, ticks: { color: "#e2e8f0" }, grid: { color: "rgba(255,255,255,0.06)" } },
        },
      },
    });

    const chartWrap = document.querySelector(".chart-wrap");
    if (chartWrap) chartWrap.style.height = "380px";
  }
});
