/**
 * Easy Labs Ltd — Modern Interactive Client Script & Enterprise Experience Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initProductTabs();
  initRoiCalculator();
  initContactForm();
  initModalHandlers();
  initSmoothScrollSpy();
  initCursorSpotlight();
  initHeroTerminal();
  initDocSignPlayground();
  initEasyLearnRoleSwitcher();
  initEsMedSimulator();
  initArchitectureWizard();
  initCaseStudyFilters();
  initAnimatedCounters();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    toggleBtn.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    });
  });
}

/* --------------------------------------------------------------------------
   3. Flagship Products Tab Switcher
   -------------------------------------------------------------------------- */
function initProductTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".product-panel");

  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      panels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.classList.add("active");
          panel.removeAttribute("hidden");
          animateBars(panel);
        } else {
          panel.classList.remove("active");
          panel.setAttribute("hidden", "true");
        }
      });
    });
  });

  function animateBars(panel) {
    const bars = panel.querySelectorAll(".mock-bar-fill");
    bars.forEach((bar) => {
      const originalHeight = bar.style.height || bar.dataset.height || "60%";
      bar.dataset.height = originalHeight;
      bar.style.height = "0%";
      setTimeout(() => {
        bar.style.height = originalHeight;
      }, 50);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Interactive Cursor Spotlight (Linear/Vercel Aesthetic)
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const cards = document.querySelectorAll(
    ".service-card, .case-card, .wizard-option-card",
  );
  if (!cards.length) return;

  cards.forEach((card) => {
    let ticking = false;
    card.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        ticking = false;
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Hero Terminal
   -------------------------------------------------------------------------- */
function initHeroTerminal() {
  const cmdButtons = document.querySelectorAll(".hero-cmd-btn");
  const consoleContainer = document.getElementById("hero-console-lines");
  if (!cmdButtons.length || !consoleContainer) return;

  const responses = {
    easyschoolflow: [
      "$ deploy easyschoolflow --cluster=eu-central",
      "> [EasySchoolFlow SIS] Connecting 42k active student records...",
      "> [AI Proctor] Anti-cheat formative neural pipeline: ACTIVE (99.98% accuracy)",
      "> Status: EasySchoolFlow Cluster operational.",
    ],
    easylearn: [
      "$ deploy easyschoolflow --cluster=eu-central",
      "> [EasySchoolFlow SIS] Connecting 42k active student records...",
      "> [AI Proctor] Anti-cheat formative neural pipeline: ACTIVE (99.98% accuracy)",
      "> Status: EasySchoolFlow Cluster operational.",
    ],
    easyworkflow: [
      "$ easyworkflow --verify-envelope 0x8F94B",
      "> [Cryptographic Engine] SHA-256 Hash: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "> [eIDAS / ESIGN] Signatures verified (2 of 2). Tamper-proof stamp: CERTIFIED",
      "> Status: EasyWorkFlow envelope legally executed.",
    ],
    tracesign: [
      "$ easyworkflow --verify-envelope 0x8F94B",
      "> [Cryptographic Engine] SHA-256 Hash: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "> [eIDAS / ESIGN] Signatures verified (2 of 2). Tamper-proof stamp: CERTIFIED",
      "> Status: EasyWorkFlow envelope legally executed.",
    ],
    docsign: [
      "$ easyworkflow --verify-envelope 0x8F94B",
      "> [Cryptographic Engine] SHA-256 Hash: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "> [eIDAS / ESIGN] Signatures verified (2 of 2). Tamper-proof stamp: CERTIFIED",
      "> Status: EasyWorkFlow envelope legally executed.",
    ],
    eserp: [
      "$ eserp --reconcile-ledger --multi-entity",
      "> [EsERP Finance] Scanning 12 regional warehouse ledgers...",
      "> [Supply Chain] Automated replenishment triggered ($2.4M inventory optimized)",
      "> Status: Real-time GAAP ledger synchronized.",
    ],
    careflowhms: [
      "$ careflowhms --triage-telemetry --emergency-queue",
      "> [CareflowHMS HealthTech] HL7 / FHIR Clinical Gateway: Connected",
      "> [EHR Diagnostic AI] 34 Inpatient beds allocated. Avg wait time: 4.5 min",
      "> Status: Hospital EHR & LIS fully operational.",
    ],
    esmed: [
      "$ careflowhms --triage-telemetry --emergency-queue",
      "> [CareflowHMS HealthTech] HL7 / FHIR Clinical Gateway: Connected",
      "> [EHR Diagnostic AI] 34 Inpatient beds allocated. Avg wait time: 4.5 min",
      "> Status: Hospital EHR & LIS fully operational.",
    ],
  };

  cmdButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmdKey = btn.dataset.cmd;
      const lines = responses[cmdKey];
      if (!lines) return;

      consoleContainer.innerHTML = "";
      lines.forEach((line, idx) => {
        const lineEl = document.createElement("div");
        lineEl.className = "console-line";
        lineEl.style.opacity = "0";
        lineEl.style.transform = "translateY(4px)";
        lineEl.style.transition = "all 0.2s ease";

        if (line.startsWith("$")) {
          lineEl.innerHTML = `<span class="console-prompt">$</span> <span class="console-text">${line.substring(2)}</span>`;
        } else if (line.includes("Status:")) {
          lineEl.innerHTML = `<span class="console-prompt">&gt;</span> <span style="color:var(--accent-primary); font-weight:600;">${line.substring(2)}</span>`;
        } else {
          lineEl.innerHTML = `<span class="console-prompt">&gt;</span> <span style="color:var(--text-secondary);">${line.substring(2)}</span>`;
        }

        consoleContainer.appendChild(lineEl);
        setTimeout(() => {
          lineEl.style.opacity = "1";
          lineEl.style.transform = "translateY(0)";
        }, idx * 120);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Interactive TraceSign Live Signature Pad & Certificate Generator
   -------------------------------------------------------------------------- */
function initDocSignPlayground() {
  const canvas = document.getElementById("easyworkflow-canvas") || document.getElementById("tracesign-canvas") || document.getElementById("docsign-canvas");
  const padWrapper = document.getElementById("easyworkflow-pad-wrapper") || document.getElementById("tracesign-pad-wrapper") || document.getElementById("docsign-pad-wrapper");
  const clearBtn = document.getElementById("easyworkflow-clear-btn") || document.getElementById("tracesign-clear-btn") || document.getElementById("docsign-clear-btn");
  const executeBtn = document.getElementById("easyworkflow-execute-btn") || document.getElementById("tracesign-execute-btn") || document.getElementById("docsign-execute-btn");
  const certStamp = document.getElementById("easyworkflow-cert-stamp") || document.getElementById("tracesign-cert-stamp") || document.getElementById("docsign-cert-stamp");
  const certHash = document.getElementById("easyworkflow-cert-hash") || document.getElementById("tracesign-cert-hash") || document.getElementById("docsign-cert-hash");
  const certTime = document.getElementById("easyworkflow-cert-time") || document.getElementById("tracesign-cert-time") || document.getElementById("docsign-cert-time");

  if (!canvas || !clearBtn || !executeBtn) return;

  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let hasSigned = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  resizeCanvas();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  });

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    hasSigned = true;
    padWrapper.classList.add("signed");
    const pos = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPointerPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", stopDrawing);

  canvas.addEventListener("touchstart", startDrawing, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  window.addEventListener("touchend", stopDrawing);

  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    padWrapper.classList.remove("signed");
    hasSigned = false;
    if (certStamp) certStamp.classList.remove("active");
  });

  executeBtn.addEventListener("click", () => {
    if (!hasSigned) {
      alert("Please draw a signature on the pad first.");
      return;
    }

    executeBtn.disabled = true;
    executeBtn.innerHTML = "Verifying Hash...";

    setTimeout(() => {
      executeBtn.disabled = false;
      executeBtn.innerHTML = "Executed ✓";

      // Generate random simulated hash and ISO timestamp
      const randomHash = Array.from({ length: 48 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
      if (certHash) certHash.textContent = `sha256:${randomHash}`;
      if (certTime) certTime.textContent = new Date().toUTCString();
      if (certStamp) certStamp.classList.add("active");
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   7. Interactive EasyLearn Role Switcher
   -------------------------------------------------------------------------- */
function initEasyLearnRoleSwitcher() {
  const roleButtons = document.querySelectorAll(".role-pill-btn");
  const roleTitle = document.getElementById("easyschoolflow-role-title") || document.getElementById("easylearn-role-title");
  const roleMetric1 = document.getElementById("easyschoolflow-kpi-1") || document.getElementById("easylearn-kpi-1");
  const roleMetric2 = document.getElementById("easyschoolflow-kpi-2") || document.getElementById("easylearn-kpi-2");
  const roleMetric3 = document.getElementById("easyschoolflow-kpi-3") || document.getElementById("easylearn-kpi-3");

  if (!roleButtons.length) return;

  const roleData = {
    student: {
      title: "Student Dashboard — Active Semester",
      kpi1: { val: "6 Enrolled", trend: "Next Exam in 3d" },
      kpi2: { val: "3.92 GPA", trend: "Top 5% Formative" },
      kpi3: { val: "100% On-Time", trend: "Zero Missed Tasks" },
    },
    faculty: {
      title: "Faculty Assessment & Grading Queue",
      kpi1: { val: "42 Submissions", trend: "Auto-Grading 89%" },
      kpi2: { val: "4.8 hrs Saved", trend: "Weekly Faculty Admin" },
      kpi3: { val: "98.4% Attendance", trend: "Biometric Verified" },
    },
    dean: {
      title: "Dean & Campus Operational Telemetry",
      kpi1: { val: "42,850 Students", trend: "↑ 14% this semester" },
      kpi2: { val: "98.2% Retention", trend: "Predictive Intervention" },
      kpi3: { val: "$14.2M Collected", trend: "Automated Ledger Sync" },
    },
  };

  roleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      roleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const role = btn.dataset.role;
      const data = roleData[role];
      if (!data) return;

      if (roleTitle) roleTitle.textContent = data.title;
      if (roleMetric1) {
        roleMetric1.querySelector(".mock-kpi-val").textContent = data.kpi1.val;
        roleMetric1.querySelector(".mock-kpi-trend").textContent =
          data.kpi1.trend;
      }
      if (roleMetric2) {
        roleMetric2.querySelector(".mock-kpi-val").textContent = data.kpi2.val;
        roleMetric2.querySelector(".mock-kpi-trend").textContent =
          data.kpi2.trend;
      }
      if (roleMetric3) {
        roleMetric3.querySelector(".mock-kpi-val").textContent = data.kpi3.val;
        roleMetric3.querySelector(".mock-kpi-trend").textContent =
          data.kpi3.trend;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Interactive CareflowHMS / EsMed Clinical Simulator
   -------------------------------------------------------------------------- */
function initEsMedSimulator() {
  const triageBtn = document.getElementById("careflowhms-triage-action") || document.getElementById("esmed-triage-action");
  const triageWait = document.getElementById("careflowhms-wait-val") || document.getElementById("esmed-wait-val");
  const triageBeds = document.getElementById("careflowhms-bed-val") || document.getElementById("esmed-bed-val");

  if (!triageBtn || !triageWait || !triageBeds) return;

  let count = 0;
  triageBtn.addEventListener("click", () => {
    count++;
    triageBtn.disabled = true;
    triageBtn.innerHTML = "Routing Patient...";

    setTimeout(() => {
      triageBtn.disabled = false;
      triageBtn.innerHTML = "Simulate ER Admission +";

      const waitTimes = ["3.8 min", "4.1 min", "2.9 min", "4.5 min"];
      const availableBeds = [
        "33 Available Beds",
        "32 Available Beds",
        "35 Available Beds",
      ];

      triageWait.textContent = waitTimes[count % waitTimes.length];
      triageBeds.textContent = availableBeds[count % availableBeds.length];
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   9. 30-Second Solution Architecture Wizard
   -------------------------------------------------------------------------- */
function initArchitectureWizard() {
  const panes = document.querySelectorAll(".wizard-step-pane");
  const stepNodes = document.querySelectorAll(".wizard-step-node");
  const optionCards = document.querySelectorAll(".wizard-option-card");
  const nextBtn1 = document.getElementById("wiz-next-1");
  const nextBtn2 = document.getElementById("wiz-next-2");
  const prevBtn2 = document.getElementById("wiz-prev-2");
  const prevBtn3 = document.getElementById("wiz-prev-3");
  const applyBtn = document.getElementById("wiz-apply-form");

  let userDomain = "AI & Enterprise ERP";
  let userScale = "Mid-Market (100–1000 users)";
  let userDeployment = "Cloud Managed SaaS";

  optionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const parent = card.closest(".wizard-options-grid");
      parent
        .querySelectorAll(".wizard-option-card")
        .forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      const group = card.dataset.group;
      const value = card.dataset.value;

      if (group === "domain") userDomain = value;
      if (group === "scale") userScale = value;
      if (group === "deployment") userDeployment = value;
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "radio");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  function goToStep(stepNumber) {
    panes.forEach((pane) => {
      if (pane.id === `wizard-step-${stepNumber}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    stepNodes.forEach((node) => {
      const step = parseInt(node.dataset.step, 10);
      if (step <= stepNumber) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });

    if (stepNumber === 3) {
      updateBlueprint();
    }
  }

  function updateBlueprint() {
    const titleEl = document.getElementById("blueprint-title");
    const stackEl = document.getElementById("blueprint-stack");
    const timeEl = document.getElementById("blueprint-time");

    if (titleEl)
      titleEl.textContent = `${userDomain} — Recommended Architecture`;
    if (stackEl)
      stackEl.textContent = `Tailored for ${userScale} on ${userDeployment}`;
    if (timeEl) {
      const timeMap = {
        "EasyWorkFlow e-Signature": "3–4 Weeks MVP / 6 Weeks Full Production",
        "TraceSign e-Signature": "3–4 Weeks MVP / 6 Weeks Full Production",
        "DocSign e-Signature": "3–4 Weeks MVP / 6 Weeks Full Production",
        "EasySchoolFlow EdTech": "6–8 Weeks Pilot / 12 Weeks Campus Deployment",
        "EasyLearn EdTech": "6–8 Weeks Pilot / 12 Weeks Campus Deployment",
        "CareflowHMS Healthcare": "8–12 Weeks HIPAA & EHR Pilot",
        "EsMed Healthcare": "8–12 Weeks HIPAA & EHR Pilot",
        "AI & Enterprise ERP": "8–14 Weeks Agile Sprint Delivery",
      };
      timeEl.textContent = timeMap[userDomain] || "6–10 Weeks Delivery";
    }
  }

  if (nextBtn1) nextBtn1.addEventListener("click", () => goToStep(2));
  if (nextBtn2) nextBtn2.addEventListener("click", () => goToStep(3));
  if (prevBtn2) prevBtn2.addEventListener("click", () => goToStep(1));
  if (prevBtn3) prevBtn3.addEventListener("click", () => goToStep(2));

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      // Map to contact form
      const interestSelect = document.getElementById("contact-interest");
      const messageBox = document.getElementById("contact-message");

      const domainSlugMap = {
        "EasyWorkFlow e-Signature": "easyworkflow",
        "TraceSign e-Signature": "easyworkflow",
        "DocSign e-Signature": "easyworkflow",
        "EasySchoolFlow EdTech": "easyschoolflow",
        "EasyLearn EdTech": "easyschoolflow",
        "CareflowHMS Healthcare": "careflowhms",
        "EsMed Healthcare": "careflowhms",
        "AI & Enterprise ERP": "eserp",
        "Custom Web & Mobile": "web-mobile",
      };

      if (interestSelect && domainSlugMap[userDomain]) {
        interestSelect.value = domainSlugMap[userDomain];
      }

      if (messageBox) {
        messageBox.value = `[Architecture Blueprint Scoping]\nDomain: ${userDomain}\nTarget Scale: ${userScale}\nDeployment Model: ${userDeployment}\n\nPlease provide full architectural specifications and sprint delivery schedule.`;
      }

      // Smooth scroll to contact
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. Filterable Case Studies
   -------------------------------------------------------------------------- */
function initCaseStudyFilters() {
  const filterBtns = document.querySelectorAll(".case-filter-btn");
  const caseCards = document.querySelectorAll(".case-card");

  if (!filterBtns.length || !caseCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      caseCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden-case");
        } else {
          card.classList.add("hidden-case");
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Smooth Animated Numbers on Scroll
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();
          // Extract numeric value and any prefix/suffix
          const match = rawText.match(/^([^\d]*?)(\d[\d,.]*)(.*?)$/);
          if (!match) return;

          const prefix = match[1]; // e.g. '$'
          const numStr = match[2]; // e.g. '45'
          const suffix = match[3]; // e.g. 'M+'
          const hasDecimal = numStr.includes(".");
          const target = parseFloat(numStr.replace(/,/g, ""));
          const duration = 1800;
          const start = performance.now();

          function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            // Preserve original formatting
            let formatted;
            if (hasDecimal) {
              const decimals = numStr.split(".")[1]?.length || 1;
              formatted = current.toFixed(decimals);
            } else {
              formatted = Math.floor(current).toLocaleString("en-US");
            }

            // Reconstruct with accent spans
            const accentSpan = el.querySelector(".stat-accent");
            if (accentSpan) {
              // Keep the accent span, update text before it
              const textNode = el.firstChild;
              if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = prefix + formatted;
              }
            } else {
              el.textContent = prefix + formatted + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              // Ensure final value matches original exactly
              if (accentSpan) {
                const textNode = el.firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  textNode.textContent = prefix + numStr;
                }
              } else {
                el.textContent = prefix + numStr + suffix;
              }
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (
    !revealEls.length ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   12. Interactive ROI & Project Scope Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const teamSizeRange = document.getElementById("calc-team-size");
  const teamSizeVal = document.getElementById("team-size-val");
  const scopePills = document.querySelectorAll(".calc-scope-pill");
  const cloudPills = document.querySelectorAll(".calc-cloud-pill");

  const estimatedSavings = document.getElementById("calc-savings");
  const timeSaved = document.getElementById("calc-time");
  const efficiencyGain = document.getElementById("calc-efficiency");

  if (!teamSizeRange || !estimatedSavings) return;

  let currentScopeMultiplier = 1.0;

  function calculateResults() {
    const users = parseInt(teamSizeRange.value, 10);
    if (teamSizeVal)
      teamSizeVal.textContent = users >= 500 ? "500+ users" : `${users} users`;

    const baseSavingsPerUser = 480;
    const totalSavings = Math.round(
      users * baseSavingsPerUser * currentScopeMultiplier,
    );
    const monthsAccelerated = (3.5 * currentScopeMultiplier).toFixed(1);
    const efficiency = Math.min(
      94,
      Math.round(45 + users * 0.08 * currentScopeMultiplier),
    );

    estimatedSavings.textContent = `$${totalSavings.toLocaleString()}/yr`;
    if (timeSaved)
      timeSaved.textContent = `${monthsAccelerated}x Faster Launch`;
    if (efficiencyGain)
      efficiencyGain.textContent = `+${efficiency}% Operational Speed`;
  }

  teamSizeRange.addEventListener("input", calculateResults);

  scopePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      scopePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentScopeMultiplier = parseFloat(pill.dataset.multiplier || 1.0);
      calculateResults();
    });
    pill.setAttribute("tabindex", "0");
    pill.setAttribute("role", "radio");
    pill.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pill.click();
      }
    });
  });

  cloudPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      cloudPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      calculateResults();
    });
    pill.setAttribute("tabindex", "0");
    pill.setAttribute("role", "radio");
    pill.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pill.click();
      }
    });
  });

  calculateResults();
}

/* --------------------------------------------------------------------------
   13. Consultation & Contact Form Submission Handler (Brevo API)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("consultation-form");
  const feedback = document.getElementById("form-feedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add("btn-loading");
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById("contact-name")?.value || "",
      email: document.getElementById("contact-email")?.value || "",
      company: document.getElementById("contact-company")?.value || "",
      interest: document.getElementById("contact-interest")?.value || "",
      message: document.getElementById("contact-message")?.value || "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        submitBtn.classList.remove("btn-loading");
        submitBtn.disabled = false;
        feedback.className = "form-feedback success form-feedback-enter";
        feedback.innerHTML = `
          <strong>Inquiry Successfully Dispatched!</strong><br>
          Thank you, ${formData.name}. We've sent a confirmation email to <em>${formData.email}</em>. Our Solutions Engineering team will review your specifications and contact you within 24 hours.
        `;
        form.reset();
      } else {
        throw new Error(data.error || "Failed to submit form.");
      }
    } catch (err) {
      console.warn("Backend API notice:", err.message);
      submitBtn.classList.remove("btn-loading");
      submitBtn.disabled = false;
      feedback.innerHTML =
        "<strong>Submission Error</strong> — Please check your connection and try again, or email us directly at info@easylabsltd.com";
      feedback.className = "form-feedback error form-feedback-enter";
      form.reset();
    }
  });
}

/* --------------------------------------------------------------------------
   14. Native Accessible Modal Dialog Handlers
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  const modal = document.getElementById("demo-modal");
  const openButtons = document.querySelectorAll(".open-demo-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalProductTitle = document.getElementById("modal-product-title");
  const modalForm = modal ? modal.querySelector("form") : null;

  if (!modal) return;

  let activeProduct = "Easy Labs Product Suite";

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeProduct = btn.dataset.product || "Easy Labs Product Suite";
      if (modalProductTitle)
        modalProductTitle.textContent = `Schedule Live Demo — ${activeProduct}`;
      modal.showModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.close();
    });
  }

  if (modalForm) {
    modalForm.addEventListener("submit", async (e) => {
      const submitter = e.submitter;
      if (submitter && submitter.value === "confirm") {
        const demoEmail = document.getElementById("demo-email")?.value;
        const demoTime = document.getElementById("demo-time")?.value;

        if (demoEmail) {
          try {
            await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Live Demo Requester",
                email: demoEmail,
                company: "Demo Request via Modal",
                interest: activeProduct,
                message: `User requested a live demo walkthrough for ${activeProduct}. Preferred timeline: ${demoTime}.`,
              }),
            });
          } catch (err) {
            console.log("Demo request processed locally:", err);
          }
        }
      }
    });
  }

  modal.addEventListener("click", (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

/* --------------------------------------------------------------------------
   15. Smooth Scroll & Active Nav Highlighting
   -------------------------------------------------------------------------- */
function initSmoothScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}
