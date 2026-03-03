const r = () => {
  console.log("[Tsukuyomi] Framework Initialized.");
}, m = () => {
  const a = document.querySelectorAll("[data-tk-dialog-target]"), i = document.querySelectorAll(".tk-dialog-close-btn");
  a.forEach((t) => {
    t.addEventListener("click", () => {
      const e = t.getAttribute("data-tk-dialog-target"), s = document.getElementById(e);
      s && (s.classList.add("is-active"), document.body.classList.add("tk-dialog-open"));
    });
  }), i.forEach((t) => {
    t.addEventListener("click", (e) => {
      const s = e.target.closest(".tk-dialog-overlay");
      s && o(s);
    });
  }), document.querySelectorAll(".tk-dialog-overlay").forEach((t) => {
    t.addEventListener("click", (e) => {
      e.target === t && o(t);
    });
  });
  function o(t) {
    t.classList.remove("is-active"), document.body.classList.remove("tk-dialog-open");
  }
  const n = document.getElementById("demo-cancel-dialog");
  return n && n.addEventListener("click", () => {
    const t = document.getElementById("demo-dialog");
    o(t);
  }), { closeDialog: o };
}, u = () => {
  let a = document.querySelector(".tk-toast-container");
  a || (a = document.createElement("div"), a.className = "tk-toast-container", document.body.appendChild(a));
  const i = (o, n = "primary", t = 4e3) => {
    const e = document.createElement("div");
    e.className = `tk-toast ${n === "accent" ? "tk-toast-accent" : ""}`, e.innerHTML = `
            <button class="tk-toast-close" aria-label="Close">&times;</button>
            <div class="tk-toast-content">${o}</div>
        `, a.appendChild(e), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        e.classList.add("is-active");
      });
    });
    const s = e.querySelector(".tk-toast-close"), c = () => {
      e.classList.remove("is-active"), e.addEventListener("transitionend", (l) => {
        l.propertyName === "transform" && e.remove();
      });
    };
    s.addEventListener("click", c), t > 0 && setTimeout(c, t);
  };
  return document.querySelectorAll("[data-tk-toast]").forEach((o) => {
    o.addEventListener("click", () => {
      const n = o.getAttribute("data-tk-toast-msg") || "System notification.", t = o.getAttribute("data-tk-toast-type") || "primary";
      i(n, t);
    });
  }), { showToast: i };
};
document.addEventListener("DOMContentLoaded", () => {
  r(), m(), u();
});
