/* Serene Travel - script chính */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  /* ---------- Menu hamburger (điện thoại & máy tính bảng) ---------- */
  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!header.classList.contains("menu-open"));
    });
  }

  // Đóng menu khi bấm vào liên kết cuối cùng (không phải nút dropdown)
  if (nav) {
    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      if (link.classList.contains("nav-dropdown-toggle")) return;
      setMenu(false);
    });
  }

  // Phím Esc đóng menu
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setMenu(false);
      closeDropdowns();
    }
  });

  /* ---------- Dropdown ---------- */
  var isTouchLayout = function () {
    return window.matchMedia("(max-width: 1180px)").matches;
  };

  function closeDropdowns(except) {
    document.querySelectorAll(".nav-dropdown").forEach(function (d) {
      if (d === except) return;
      d.classList.remove("open");
      var t = d.querySelector(".nav-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".nav-dropdown-toggle").forEach(function (toggleLink) {
    toggleLink.addEventListener("click", function (e) {
      var li = this.closest(".nav-dropdown");
      var willOpen = !li.classList.contains("open");

      // Trên điện thoại/máy tính bảng: chạm lần đầu để mở, lần hai mới đi tới trang
      if (isTouchLayout()) {
        if (willOpen) {
          e.preventDefault();
          closeDropdowns(li);
          li.classList.add("open");
          this.setAttribute("aria-expanded", "true");
        }
        return;
      }
      // Trên máy tính: đã mở nhờ hover, cho phép đi tới trang luôn
    });
  });

  // Bấm ra ngoài thì đóng dropdown
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-dropdown")) closeDropdowns();
  });

  /* ---------- Đổi nền header khi cuộn ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hiệu ứng hiện khi cuộn ---------- */
  document.documentElement.classList.add("js");
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Slideshow ảnh trang chủ ---------- */
  var slides = document.querySelectorAll(".hero-slideshow .slide");
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 4500);
  }

  /* ---------- Form tư vấn -> Telegram (qua Netlify Function) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector(".form-submit");
    var originalLabel = submitBtn.textContent;

    function setStatus(message, type) {
      statusEl.textContent = message;
      statusEl.className = "form-status " + (type || "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var phone = form.elements.phone;
      var phoneOk = /^[0-9+\s().-]{8,15}$/.test(phone.value.trim());

      name.classList.toggle("invalid", !name.value.trim());
      phone.classList.toggle("invalid", !phoneOk);
      if (!name.value.trim() || !phoneOk) {
        setStatus("Vui lòng nhập họ tên và số điện thoại hợp lệ.", "error");
        (name.value.trim() ? phone : name).focus();
        return;
      }

      var payload = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        service: form.elements.service.value,
        note: form.elements.note.value.trim(),
        website: form.elements.website.value, // honeypot
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
      setStatus("");

      fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.ok) throw new Error(data.error || "Lỗi không xác định");
          });
        })
        .then(function () {
          form.reset();
          setStatus("Cảm ơn anh/chị! Serene Travel sẽ liên hệ trong vòng 24 giờ.", "ok");
        })
        .catch(function (err) {
          setStatus("Gửi chưa thành công (" + err.message + "). Anh/chị vui lòng thử lại hoặc chat Zalo 0327 818 196.", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
})();
