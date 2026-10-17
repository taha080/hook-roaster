(function () {
  const engine = window.HookRoaster;
  const form = document.querySelector("#composer");
  const input = document.querySelector("#hook");
  const count = document.querySelector("#count");
  const error = document.querySelector("#form-error");
  const chips = document.querySelector("#chips");
  const placeholder = document.querySelector("#placeholder");
  const result = document.querySelector("#result");
  const scoreEl = document.querySelector("#score");
  const dial = document.querySelector("#dial");
  const verdictEl = document.querySelector("#verdict");
  const roastEl = document.querySelector("#roast-line");
  const kindEl = document.querySelector("#kind");
  const meters = document.querySelector("#meters");
  const tips = document.querySelector("#tips");
  const rewrites = document.querySelector("#rewrites");
  const ticket = document.querySelector("#ticket");
  let activeExample = "";

  engine.EXAMPLES.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = example.label;
    button.dataset.example = example.id;
    button.addEventListener("click", () => {
      activeExample = example.id;
      input.value = example.text;
      syncCount();
      markChips();
      run();
    });
    chips.appendChild(button);
  });

  function markChips() {
    chips.querySelectorAll(".chip").forEach((chip) => {
      const on = chip.dataset.example === activeExample;
      chip.classList.toggle("is-on", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function syncCount() {
    const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
    const chars = input.value.length;
    count.textContent = `${words} ${words === 1 ? "word" : "words"} · ${chars}/700`;
    count.classList.toggle("is-long", chars > 220);
  }

  function band(score) {
    if (score >= 75) return "high";
    if (score >= 38) return "mid";
    return "low";
  }

  function prefersStill() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function animateScore(target) {
    if (prefersStill()) {
      scoreEl.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 680;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      scoreEl.textContent = String(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function render(report) {
    placeholder.hidden = true;
    result.hidden = false;
    ticket.dataset.band = band(report.score);
    dial.style.setProperty("--p", String(report.score));
    animateScore(report.score);
    verdictEl.textContent = report.verdict;
    roastEl.textContent = report.roast;
    kindEl.textContent = `${report.words} ${report.words === 1 ? "word" : "words"} · ${report.kindLabel}`;

    clear(meters);
    report.dimensions.forEach((dimension) => {
      const row = document.createElement("div");
      row.className = "meter";
      const label = document.createElement("div");
      label.className = "meter-label";
      const name = document.createElement("span");
      name.textContent = dimension.label;
      const value = document.createElement("span");
      value.textContent = `${dimension.score}/20`;
      label.append(name, value);
      const track = document.createElement("div");
      track.className = "track";
      track.setAttribute("role", "meter");
      track.setAttribute("aria-label", dimension.label);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "20");
      track.setAttribute("aria-valuenow", String(dimension.score));
      const fill = document.createElement("div");
      fill.className = "fill";
      fill.style.width = `${(dimension.score / 20) * 100}%`;
      track.appendChild(fill);
      const note = document.createElement("p");
      note.className = "meter-note";
      note.textContent = dimension.note;
      row.append(label, track, note);
      meters.appendChild(row);
    });

    clear(tips);
    report.tips.forEach((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      tips.appendChild(item);
    });

    clear(rewrites);
    report.rewrites.forEach((rewrite) => {
      const card = document.createElement("article");
      card.className = "rewrite";
      const head = document.createElement("div");
      head.className = "rewrite-head";
      const titles = document.createElement("div");
      const style = document.createElement("p");
      style.className = "style";
      style.textContent = rewrite.style;
      const kicker = document.createElement("p");
      kicker.className = "kicker-sm";
      kicker.textContent = rewrite.kicker;
      titles.append(style, kicker);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", `Copy ${rewrite.style} rewrite`);
      button.addEventListener("click", () => copyRewrite(rewrite.text, button));
      head.append(titles, button);
      const body = document.createElement("p");
      body.className = "rewrite-text";
      body.textContent = rewrite.text;
      card.append(head, body);
      rewrites.appendChild(card);
    });

    if (window.matchMedia("(max-width: 900px)").matches) {
      ticket.scrollIntoView({ behavior: prefersStill() ? "auto" : "smooth", block: "start" });
    }
  }

  async function copyRewrite(text, button) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const previous = button.textContent;
    button.textContent = "Copied";
    button.classList.add("is-copied");
    window.setTimeout(() => {
      button.textContent = previous;
      button.classList.remove("is-copied");
    }, 1600);
  }

  function run() {
    const report = engine.roast(input.value);
    if (!report.ok) {
      error.hidden = false;
      error.textContent = report.error;
      input.classList.add("is-shaking");
      window.setTimeout(() => input.classList.remove("is-shaking"), 420);
      input.focus();
      return;
    }
    error.hidden = true;
    render(report);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    activeExample = "";
    markChips();
    run();
  });

  input.addEventListener("input", () => {
    activeExample = "";
    markChips();
    syncCount();
    if (!error.hidden) error.hidden = true;
  });

  input.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");
  if (demo) {
    const example = engine.EXAMPLES.find((item) => item.id === demo) || engine.EXAMPLES[2];
    activeExample = example.id;
    input.value = example.text;
    markChips();
    run();
  }

  syncCount();
})();
