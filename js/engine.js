/* Hook Roaster scoring engine.
   Fully local: power words, numbers, length, questions, filler, clichés, and "you" focus.
   Each signal is 0–20. The total is their sum, out of 100.
   Rewrites are templates filled from the topic, role, and numbers in the opener. */

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.HookRoaster = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const EXAMPLES = [
    {
      id: "announce",
      label: "Announcement",
      text: "Excited to announce that I'm thrilled to share some thoughts on leadership and personal growth in today's fast-paced world!",
    },
    {
      id: "years",
      label: "3 quiet years",
      text: "I spent 3 years writing LinkedIn posts nobody read. Then I changed the first line.",
    },
    {
      id: "calls",
      label: "11 calls",
      text: "I rewrote one cold email subject line and booked 11 calls in 9 days. The sentence was 7 words.",
    },
    {
      id: "mindset",
      label: "Mindset poster",
      text: "Success is all about mindset. Just believe in yourself and great things will happen.",
    },
    {
      id: "scroll",
      label: "Scroll question",
      text: "What if your content is fine and your hook is the reason people scroll?",
    },
  ];

  const HARD_CLICHES = [
    "excited to announce",
    "thrilled to share",
    "pleased to announce",
    "happy to share",
    "humbled to",
    "i'm humbled",
    "i am humbled",
    "in today's fast-paced",
    "in today's world",
    "let that sink in",
    "believe in yourself",
    "great things will happen",
    "unlock your potential",
    "just wanted to share",
    "wanted to hop on",
    "hop on here",
    "game changer",
    "game-changer",
    "thoughts?",
    "agree?",
  ];

  const BUZZ = [
    "synergy",
    "leverage",
    "circle back",
    "move the needle",
    "deep dive",
    "thought leader",
    "holistic",
    "utilize",
    "ecosystem",
    "bandwidth",
  ];

  const FILLERS = [
    "just",
    "really",
    "very",
    "basically",
    "literally",
    "simply",
    "somehow",
    "stuff",
    "a lot",
    "kind of",
    "sort of",
    "in order to",
  ];

  const CURIOSITY_WORDS = [
    "secret",
    "mistake",
    "truth",
    "nobody",
    "no one",
    "wrong",
    "hidden",
    "myth",
    "lie",
    "unexpected",
    "surprising",
    "quit",
    "failed",
    "failure",
    "before you",
    "most people",
    "ignored",
    "wasted",
    "hard truth",
    "i was wrong",
    "scroll",
    "silence",
    "quiet",
    "unread",
    "broke",
    "broken",
    "ghosted",
    "rejected",
  ];

  const EMOTION_WORDS = [
    "love",
    "hate",
    "scared",
    "afraid",
    "fear",
    "proud",
    "angry",
    "frustrated",
    "embarrassed",
    "grateful",
    "obsessed",
    "burned",
    "burnt",
    "quit",
    "fired",
    "cried",
    "exhausted",
    "anxious",
    "hurt",
    "lonely",
    "nervous",
    "ashamed",
    "regret",
    "wish",
    "failed",
    "failure",
    "won",
    "lost",
    "terrified",
    "stuck",
    "jealous",
    "relief",
    "panic",
    "furious",
    "heartbroken",
    "worry",
    "worried",
    "sorry",
    "confess",
    "admitted",
    "wrong",
  ];

  const VAGUE = [
    "success",
    "growth",
    "journey",
    "things",
    "stuff",
    "amazing",
    "great",
    "awesome",
    "incredible",
    "many people",
    "some people",
    "thoughts",
    "mindset",
    "potential",
    "synergy",
  ];

  const CONCRETE = [
    "client",
    "customer",
    "email",
    "subject line",
    "cold email",
    "resume",
    "interview",
    "headline",
    "hook",
    "revenue",
    "pipeline",
    "salary",
    "post",
    "posts",
    "call",
    "calls",
    "sentence",
    "word",
    "words",
    "line",
    "manager",
    "founder",
    "recruiter",
  ];

  const THEMES = [
    { key: "cold email", label: "cold email", audience: "salespeople" },
    { key: "subject line", label: "subject lines", audience: "salespeople" },
    { key: "personal growth", label: "personal growth", audience: "professionals" },
    { key: "leadership", label: "leadership", audience: "managers", word: true },
    { key: "linkedin", label: "LinkedIn", audience: "creators", word: true },
    { key: "mindset", label: "mindset", audience: "professionals", word: true },
    { key: "storytelling", label: "storytelling", audience: "writers", word: true },
    { key: "headline", label: "headlines", audience: "writers", word: true },
    { key: "newsletter", label: "newsletters", audience: "writers", word: true },
    { key: "freelance", label: "freelancing", audience: "freelancers" },
    { key: "resume", label: "resumes", audience: "job seekers", word: true },
    { key: "interview", label: "interviews", audience: "job seekers", word: true },
    { key: "hiring", label: "hiring", audience: "recruiters", word: true },
    { key: "recruit", label: "recruiting", audience: "recruiters" },
    { key: "pricing", label: "pricing", audience: "freelancers", word: true },
    { key: "burnout", label: "burnout", audience: "managers", word: true },
    { key: "productivity", label: "productivity", audience: "professionals", word: true },
    { key: "marketing", label: "marketing", audience: "marketers", word: true },
    { key: "branding", label: "branding", audience: "marketers", word: true },
    { key: "sales", label: "sales", audience: "salespeople", word: true },
    { key: "founder", label: "founding", audience: "founders", word: true },
    { key: "startup", label: "startups", audience: "founders", word: true },
    { key: "career", label: "a career", audience: "professionals", word: true },
    { key: "promotion", label: "a promotion", audience: "professionals", word: true },
    { key: "salary", label: "salary", audience: "professionals", word: true },
    { key: "remote", label: "remote work", audience: "professionals", word: true },
    { key: "management", label: "management", audience: "managers", word: true },
    { key: "feedback", label: "feedback", audience: "managers", word: true },
    { key: "meeting", label: "meetings", audience: "managers", word: true },
    { key: "writing", label: "writing", audience: "writers", word: true },
    { key: "content", label: "content", audience: "creators", word: true },
    { key: "hook", label: "hooks", audience: "writers", word: true },
    { key: "blogging", label: "blogging", audience: "writers", word: true },
    { key: "blog", label: "blogging", audience: "writers", word: true },
    { key: "ai", label: "AI", audience: "professionals", word: true },
  ];

  const ADVICE_TAKES = {
    mindset: {
      bold: "Mindset did not save the meeting. A sentence I could say out loud on Monday did.",
      story: "I told someone to believe in themselves. They still froze. What helped was one line they could actually use.",
      question: "If mindset is the whole answer, why do prepared people still stumble on the first sentence?",
    },
    leadership: {
      bold: "Leadership is not a speech about potential. It is handing someone the decision and living with the result.",
      story: "I used to open meetings by talking about empowering people. The room woke up when I stopped talking and handed over the call.",
      question: "If leadership is about other people, why do so many posts about it start with the leader?",
    },
    "personal growth": {
      bold: "Personal growth is a private change with a public receipt. Post the receipt.",
      story: "I called it personal growth for a year. The useful version was smaller: one habit I could point to on a Tuesday.",
      question: "What changed last month that a stranger could verify — not feel, verify?",
    },
    productivity: {
      bold: "Productivity advice fails in the first line when it forgets the hour the system broke.",
      story: "I had a perfect morning routine and a chaotic Tuesday. The post that landed started with the Tuesday.",
      question: "What does your system do on the day it falls apart?",
    },
    content: {
      bold: "More content is not a strategy. A first line people cannot scroll past is.",
      story: "I published on a schedule and still heard nothing. The post that traveled was the one that opened on a cost.",
      question: "If you stopped posting for a month, which single line would you miss?",
    },
    hooks: {
      bold: "A hook is not a louder hello. It is the one detail a stranger cannot skip.",
      story: "I used to warm up for three lines. The day I led with the uncomfortable part, people finally replied.",
      question: "What are you saving for sentence three that belongs in sentence one?",
    },
  };

  const STOP = new Set(
    "a an the and or but if so to of in on for with from at by as is are was were be been being it this that these those i you we they he she my your our their me us them just really very too not no yes about into over after before than then also can could should would will i'm i've i'd don't didn't it's its let's let am do did does have has had that".split(
      " "
    )
  );

  const VERBS = new Set(
    "spent writing changed started think want wanted share sharing announce announced believe happen happens make making get getting got going went read reading rewrote rewrite booked say saying said know knew feel feels felt use used using help helps helped work working worked post posting posted need needs try trying tried keep keeps come came see saw look looking tell told give gave take took made done doing told wanted hopping share".split(
      " "
    )
  );

  const UNITS =
    "percent|calls|call|days|day|years|year|months|month|weeks|week|hours|hour|minutes|minute|seconds|second|words|word|clients|client|customers|customer|emails|email|posts|post|people|replies|reply|meetings|meeting|demos|demo|deals|deal|hires|hire|interviews|interview|leads|lead|sales|users|signups|signup|points|offers|offer|proposals|proposal|contracts|contract";

  const ROASTS = {
    tiny: [
      "That is a wave from across the room, not a hook. Give us a stake.",
      "Short can slap. This one left before the sentence did.",
    ],
    cliche: [
      "This opener is wearing a uniform. Feelings about the news are not the news.",
      "I have met this sentence a thousand scrolls ago. It is polite, and it is invisible.",
    ],
    curiosity: [
      "Polite, clear, and about as surprising as a calendar hold. Give them a reason to wonder.",
      "Nothing here snags the thumb. A contrast, a mistake, or a question would.",
    ],
    clarity: [
      "There is a good idea in here wearing three coats. One claim, then stop.",
      "I had to reread it to find the point. Your reader will not.",
    ],
    specificity: [
      "I can feel the vibe. I cannot see the proof. One number would do more than another adjective.",
      "This could be about anyone. Name the moment, the count, or the object.",
    ],
    emotion: [
      "It is correct, and a little cold. A stake — pride, fear, a miss — gives the line a pulse.",
      "The idea arrives with a tie on. Loosen it. What did this cost a person?",
    ],
    scan: [
      "There is a hook in here, standing behind a paragraph. Move the sharpest sentence forward.",
      "LinkedIn shows a breath, not a speech. Cut until the preview can hold the point.",
    ],
    hot: [
      "I brought a roast and found a line that already knows where it is going. I would only sand an edge.",
      "This one has heat. Specific, human, and short enough to survive the preview.",
    ],
    warm: [
      "This can stop a scroll. I would still trade one soft word for a harder detail.",
      "Close. The shape is right, and one sharper stake would make it unfair to the posts around it.",
    ],
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function hash(value) {
    let h = 2166136261;
    const s = String(value);
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function normalize(text) {
    return String(text || "")
      .replace(/\u2019/g, "'")
      .replace(/\u2018/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2014\u2013]/g, " - ")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  function finish(text) {
    let t = String(text || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim();
    t = t.replace(/\.\.+/g, ".").replace(/!\./g, "!").replace(/\?\./g, "?");
    if (!/[.!?]$/.test(t)) t += ".";
    return t;
  }

  function capitalize(text) {
    const s = String(text || "");
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function tidyClip(text, maxWords) {
    let words = String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.!?]+$/g, "")
      .split(" ")
      .filter(Boolean);
    if (words.length > maxWords) words = words.slice(0, maxWords);
    while (words.length) {
      const last = words[words.length - 1].toLowerCase().replace(/[^a-z']/g, "");
      if (!STOP.has(last)) break;
      words.pop();
    }
    return words.join(" ");
  }

  function countTerm(haystack, term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(term.includes(" ") ? escaped : `\\b${escaped}\\b`, "gi");
    return (haystack.match(re) || []).length;
  }

  function contentWords(text) {
    return (String(text).toLowerCase().match(/[a-z][a-z'-]*/g) || []).filter(
      (word) => !STOP.has(word) && !VERBS.has(word) && word.length > 2
    );
  }

  function findThemes(text) {
    const lower = text.toLowerCase();
    const hits = [];
    THEMES.forEach((theme) => {
      if (theme.word) {
        const re = new RegExp(`\\b${theme.key}\\b`, "i");
        const match = re.exec(lower);
        if (match) hits.push({ ...theme, index: match.index });
        return;
      }
      const index = lower.indexOf(theme.key);
      if (index >= 0) hits.push({ ...theme, index });
    });
    hits.sort((a, b) => b.key.length - a.key.length);
    const kept = [];
    hits.forEach((hit) => {
      const end = hit.index + hit.key.length;
      const inside = kept.some((other) => hit.index >= other.index && end <= other.index + other.key.length);
      if (!inside) kept.push(hit);
    });
    kept.sort((a, b) => a.index - b.index);
    return kept;
  }

  function composeTopic(text, themes) {
    const lower = text.toLowerCase();
    if (lower.includes("cold email") && lower.includes("subject line")) return "cold email subject lines";
    if (/\blinkedin\b/.test(lower) && /\bposts?\b/.test(lower)) return "LinkedIn posts";
    if (/\bhooks?\b/.test(lower) && /\bcontent\b/.test(lower)) return "hooks";
    if (!themes.length) {
      const first = text.split(/[\n.!?]/)[0];
      const words = contentWords(first).slice(0, 4);
      return words.length >= 2 ? words.join(" ") : "this idea";
    }
    return themes
      .slice(0, 2)
      .map((theme) => theme.label)
      .join(" and ");
  }

  function extractNumberPhrases(text) {
    const patterns = [
      /\$\d[\d,]*(?:\.\d+)?(?:\s+(?:in|of)\s+[a-z]+)?/gi,
      new RegExp(`\\b\\d[\\d,]*(?:\\.\\d+)?\\s+(?:${UNITS})\\b`, "gi"),
      /\b\d[\d,]*(?:\.\d+)?%/gi,
    ];
    const found = [];
    const taken = [];
    patterns.forEach((re) => {
      for (const match of text.matchAll(re)) {
        const start = match.index || 0;
        const end = start + match[0].length;
        if (taken.some(([s, e]) => start < e && end > s)) continue;
        taken.push([start, end]);
        found.push({ phrase: match[0].replace(/\s+/g, " ").trim(), start });
      }
    });
    found.sort((a, b) => a.start - b.start);
    return found.slice(0, 4).map((item) => item.phrase);
  }

  function splitNumbers(phrases) {
    const timeRe = /\b(year|years|month|months|week|weeks|day|days|hour|hours|minute|minutes|second|seconds)\b/i;
    return {
      times: phrases.filter((phrase) => timeRe.test(phrase)),
      results: phrases.filter((phrase) => !timeRe.test(phrase)),
    };
  }

  function extractRole(text) {
    const patterns = [
      /\b(?:new position|new role|position|role)\s+as\s+(?:a |an |the )?([^.\n!]{3,80})/i,
      /\b(?:joining|joined|starting|started|hired)\s+(?:as\s+)?(?:a |an |the )?([^.\n!]{3,80})/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (!match) continue;
      let chunk = match[1].replace(/\s+/g, " ").trim();
      chunk = chunk.replace(/\b(?:and i|and i'm|and i am|where i|which i|to share|thoughts).*/i, "").trim();
      chunk = chunk.replace(/[,].*$/, "").trim();
      if (!chunk || /^(excited|thrilled|happy|humbled)\b/i.test(chunk)) continue;
      const at = chunk.match(/^(.*?)\s+at\s+(.+)$/i);
      if (at) {
        return { title: cleanNoun(at[1]), company: cleanNoun(at[2]) };
      }
      return { title: cleanNoun(chunk), company: "" };
    }
    return null;
  }

  function cleanNoun(value) {
    return String(value || "")
      .replace(/^(a|an|the)\s+/i, "")
      .replace(/[.!?]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanClaim(text) {
    let t = text.replace(/\s+/g, " ").trim();
    const prefixes = [
      /^(hey[,!]?\s+)?(everyone|folks|friends|linkedin)[,!]?\s+/i,
      /^i(?:'m| am) (?:so |very )?(?:excited|thrilled|happy|humbled|grateful|pleased|delighted) to (?:announce|share|tell you)(?: that)?\s+/i,
      /^(?:just )?(?:wanted to|want to) (?:share|say|hop on(?: here)?)(?: that)?\s+/i,
      /^(?:so,? )?today i (?:want to|wanted to) talk about\s+/i,
      /^hot take:?\s*/i,
      /^unpopular opinion:?\s*/i,
      /^let me tell you(?: something)?:?\s*/i,
      /^just a reminder that\s+/i,
      /^excited to announce that\s+/i,
    ];
    prefixes.forEach((pattern) => {
      t = t.replace(pattern, "");
    });
    t = t.replace(/^(that|about)\s+/i, "");
    const first = t.split(/(?<=[.!?])\s/)[0].trim();
    return tidyClip(first || t, 18);
  }

  function detectKind(ctx) {
    if (/\bhiring\b/.test(ctx.lower) && /\b(we|i'm|i am|we're|we are)\b/.test(ctx.lower)) return "hiring";
    const announceCliche = ctx.cliches.some((phrase) =>
      /announce|thrilled to share|happy to share|humbled|hop on|wanted to share/.test(phrase)
    );
    if (announceCliche) return "announcement";
    if (ctx.numberCount && /\b(i|i'm|i've|my|we|our)\b/i.test(ctx.text)) return "proof";
    if (ctx.role) return "announcement";
    if (ctx.question && !ctx.weakQuestion && ctx.wordCount <= 50) return "question";
    if (/\b(success is|leadership is|mindset|you should|always remember|the key is|it is important|believe in yourself|personal growth is)\b/i.test(ctx.lower)) {
      return "advice";
    }
    return "general";
  }

  function analyze(raw) {
    const text = normalize(raw);
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const themes = findThemes(text);
    const numbers = extractNumberPhrases(text);
    const numberIndex = text.search(/\d|\$\d/);
    const cliches = HARD_CLICHES.filter((phrase) => lower.includes(phrase));
    const ctx = {
      text,
      lower,
      words,
      wordCount: words.length,
      chars: text.length,
      lines: text.split(/\n/).map((line) => line.trim()).filter(Boolean),
      themes,
      topic: composeTopic(text, themes),
      audience: themes.find((theme) => theme.audience)?.audience || "readers",
      numbers,
      numberCount: (text.match(/\b\d[\d,]*(?:\.\d+)?%?/g) || []).length,
      numberBuried: numberIndex >= 150,
      role: extractRole(text),
      cliches,
      youFocus: /\b(you|your|you're|yours|yourself)\b/i.test(text),
      question: (text.match(/\?/g) || []).length,
      weakQuestion: /\b(agree|thoughts)\s*\?\s*$/i.test(text),
    };
    ctx.claim = cleanClaim(text);
    ctx.kind = detectKind(ctx);
    return ctx;
  }

  function scoreCuriosity(ctx) {
    let score = 4;
    if (ctx.wordCount >= 8 && !ctx.cliches.length) score += 2;
    if (ctx.question && !ctx.weakQuestion) score += 6;
    if (/\bwhat if\b/.test(ctx.lower)) score += 2;
    const hits = CURIOSITY_WORDS.reduce((total, word) => total + (ctx.lower.includes(word) ? 1 : 0), 0);
    score += Math.min(8, hits * 4);
    if (/\b(but|however|instead|until)\b/.test(ctx.lower)) score += 3;
    if (/\bthen\b/.test(ctx.lower)) score += 3;
    if (/\b(never|only|stop)\b/.test(ctx.lower)) score += 2;
    if (ctx.numberCount) score += Math.min(6, ctx.numberCount * 2);
    if (ctx.numberCount && /\b(calls|clients|revenue|hired|interviews|replies|customers|demos|deals|booked|rewrote)\b/.test(ctx.lower)) {
      score += 3;
    }
    if (/\b(booked|rewrote|quit|failed|fired|shipped|doubled)\b/.test(ctx.lower)) score += 2;
    if (ctx.cliches.length) score -= Math.min(8, ctx.cliches.length * 4);
    if (ctx.weakQuestion) score -= 2;
    return clamp(score, 0, 20);
  }

  function scoreClarity(ctx) {
    let score = 14;
    const sentences = ctx.text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
    const average = ctx.wordCount / Math.max(1, sentences.length);
    if (ctx.wordCount >= 6 && average <= 18 && sentences.length >= 1 && sentences.length <= 4) score += 4;
    else if (average > 28) score -= 6;
    else if (average > 22) score -= 3;
    if (ctx.wordCount < 5) score -= 6;
    const fillerHits = FILLERS.reduce((total, word) => total + countTerm(ctx.lower, word), 0);
    score -= Math.min(8, fillerHits * 2);
    const buzzHits = BUZZ.reduce((total, word) => total + (ctx.lower.includes(word) ? 1 : 0), 0);
    score -= Math.min(6, buzzHits * 2);
    if (ctx.wordCount > 80) score -= 4;
    return clamp(score, 0, 20);
  }

  function scoreSpecificity(ctx) {
    let score = 3;
    if (ctx.numberCount) score += Math.min(9, ctx.numberCount * 4);
    if (/[$€£]|%|\bpercent\b/.test(ctx.text)) score += 2;
    if (/\b\d+\s+(year|years|month|months|week|weeks|day|days|hour|hours|minute|minutes)\b/i.test(ctx.text)) score += 3;
    if (/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|yesterday|last week|last month|last year|this morning)\b/i.test(ctx.text)) {
      score += 3;
    }
    if (ctx.role) score += 4;
    const concreteHits = CONCRETE.reduce((total, word) => total + (countTerm(ctx.text, word) > 0 ? 1 : 0), 0);
    score += Math.min(6, concreteHits * 2);
    const vagueHits = VAGUE.reduce((total, word) => total + (countTerm(ctx.lower, word) > 0 ? 1 : 0), 0);
    score -= Math.min(8, vagueHits * 3);
    if (ctx.themes.length) score += Math.min(3, ctx.themes.length);
    return clamp(score, 0, 20);
  }

  function scoreEmotion(ctx) {
    let score = 4;
    const hits = EMOTION_WORDS.reduce((total, word) => total + (countTerm(ctx.text, word) > 0 ? 1 : 0), 0);
    score += Math.min(8, hits * 4);
    if (/\b(i|i'm|i've|i'd|my|me|we|our)\b/i.test(ctx.text)) score += 3;
    if (ctx.youFocus) score += 4;
    if (/\bnobody\b|\bno one\b|\bnothing\b/.test(ctx.lower)) score += 3;
    if (/\b(nobody|no one|nothing|failed|wrong|quit|fired)\b/.test(ctx.lower) && /\b(i|my|we)\b/i.test(ctx.text)) {
      score += 3;
    }
    if (/\b(booked|earned|shipped|doubled|grew|saved)\b/i.test(ctx.text)) score += 4;
    if (/\b(excited|thrilled|humbled|delighted|pleased)\b/.test(ctx.lower) && ctx.cliches.length) score -= 4;
    if (ctx.cliches.some((phrase) => /believe in yourself|great things/.test(phrase))) score -= 3;
    if (!ctx.youFocus && !/\b(i|we|my|our)\b/i.test(ctx.text)) score -= 2;
    return clamp(score, 0, 20);
  }

  function scoreScan(ctx) {
    let score = 6;
    const n = ctx.wordCount;
    if (n >= 10 && n <= 32) score += 8;
    else if (n >= 7 && n <= 45) score += 5;
    else if (n < 5) score -= 3;
    else if (n > 70) score -= 8;
    else if (n > 50) score -= 5;
    else if (n > 36) score -= 3;
    if (ctx.chars <= 190 && n >= 8) score += 3;
    else if (ctx.chars > 340) score -= 4;
    if (ctx.lines.length >= 2 && ctx.lines.length <= 3) score += 3;
    else if (ctx.lines.length > 6) score -= 3;
    const sentences = ctx.text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
    if (sentences.length >= 2 && sentences.every((sentence) => sentence.split(/\s+/).length <= 22)) score += 2;
    const letters = ctx.text.replace(/[^A-Za-z]/g, "");
    if (letters.length > 12 && letters === letters.toUpperCase()) score -= 5;
    const bangs = (ctx.text.match(/!/g) || []).length;
    if (bangs > 2) score -= 3;
    else if (bangs === 2) score -= 1;
    const emoji = ctx.text.match(/\p{Extended_Pictographic}/gu) || [];
    if (emoji.length > 3) score -= 3;
    return clamp(score, 0, 20);
  }

  function dimensionNote(id, score, ctx) {
    if (id === "curiosity" && ctx.cliches.length) return "A familiar opener, with the surprise sanded off.";
    if (id === "curiosity" && ctx.question && !ctx.weakQuestion) return "A real question gives the thumb a reason to pause.";
    if (id === "specificity" && ctx.numberCount > 1) return "The numbers are doing real work.";
    if (id === "specificity" && ctx.numberCount === 1) return "A number gives the line a spine.";
    if (id === "emotion" && ctx.youFocus && score >= 10) return "The reader has a seat in the line.";
    if (id === "emotion" && /\b(i|my|we)\b/i.test(ctx.text) && score >= 12) return "A person, not a billboard, is speaking.";
    if (id === "scan" && ctx.wordCount > 45) return "The preview will fold this before the point.";
    if (id === "scan" && ctx.wordCount < 5) return "Too little ink to earn the pause.";
    const high = score >= 15;
    const mid = score >= 9;
    const notes = {
      curiosity: high ? "There is a reason to keep reading." : mid ? "A spark, not yet a snag." : "Easy to agree with, easy to pass.",
      clarity: high ? "One read is enough." : mid ? "The point is in there." : "The point is wearing extra coats.",
      specificity: high ? "We can see the proof." : mid ? "A detail or two is doing the work." : "This could be about anyone.",
      emotion: high ? "There is a pulse in the line." : mid ? "Some warmth, still a bit guarded." : "Correct, and a little cold.",
      scan: high ? "The preview can hold it." : mid ? "Close to a scroll-stopping length." : "Too thin, or too much coat.",
    };
    return notes[id];
  }

  function verdictFor(score) {
    if (score >= 90) return "Untouchable";
    if (score >= 75) return "Scorching";
    if (score >= 58) return "Solid heat";
    if (score >= 38) return "Simmering";
    return "Needs fire";
  }

  function kindLabel(kind) {
    return {
      announcement: "Reads like an announcement",
      hiring: "Reads like a hiring note",
      question: "Reads like a question",
      proof: "Reads like proof",
      advice: "Reads like advice",
      general: "Reads like an opener",
    }[kind];
  }

  function pickRoast(ctx, dimensions, score) {
    const variant = hash(ctx.text) % 2;
    const pick = (list) => list[variant % list.length];
    if (ctx.wordCount < 5) return pick(ROASTS.tiny);
    if (ctx.cliches.length && score < 68) return pick(ROASTS.cliche);
    if (score >= 88) return pick(ROASTS.hot);
    if (score >= 74) return pick(ROASTS.warm);
    const priority = ["curiosity", "specificity", "emotion", "clarity", "scan"];
    const weakest = dimensions
      .slice()
      .sort((a, b) => a.score - b.score || priority.indexOf(a.id) - priority.indexOf(b.id))[0];
    return pick(ROASTS[weakest.id] || ROASTS.curiosity);
  }

  function pickTips(ctx, dimensions, score) {
    const tips = [];
    const push = (tip) => {
      if (tip && !tips.includes(tip)) tips.push(tip);
    };
    if (score >= 85) {
      push("Keep the proof in the first line. The next line should be the lesson, not a second introduction.");
    }
    if (ctx.cliches.length) {
      const quoted = ctx.cliches.slice(0, 2).map((phrase) => `“${phrase}”`);
      const list = quoted.length === 1 ? quoted[0] : `${quoted[0]} and ${quoted[1]}`;
      push(`Retire ${list}. Start with the fact, not the costume.`);
    }
    if (score >= 74 && score < 90) {
      push("Sand one soft edge. The shape is already strong enough to stop a scroll.");
    }
    if (ctx.numberBuried) {
      push("A number is sitting past the preview. Move it into the first 150 characters.");
    }
    const letters = ctx.text.replace(/[^A-Za-z]/g, "");
    if (letters.length > 12 && letters === letters.toUpperCase()) {
      push("Come down to sentence case. A line of capitals reads as shouting, and shouting is easy to pass.");
    }
    if ((ctx.text.match(/!/g) || []).length > 2) {
      push("Keep a single exclamation point, or none. The sentence should do the insisting.");
    }
    if (!ctx.youFocus && (ctx.kind === "advice" || ctx.kind === "question")) {
      push("Put “you” or “your” in line one when you are teaching, so the reader sees themselves in the stake.");
    }
    const tipById = {
      curiosity: "Open a loop in the first line: a mistake, a contrast, or a question you do not answer yet.",
      clarity: "Cut filler (just, really, very, basically) and keep one claim per sentence.",
      specificity: "Add a number, a timeframe, or a named object. “11 calls in 9 days” beats “a lot of growth.”",
      emotion: "Name the stake. What did it cost a person, or what does the reader risk by scrolling?",
      scan:
        ctx.wordCount < 8
          ? "Give it about 12–30 words. A hook needs a stake, not just a greeting."
          : "Aim for about 12–30 words across one or two short lines. Move the sharpest sentence to the front.",
    };
    const priority = ["curiosity", "specificity", "emotion", "clarity", "scan"];
    dimensions
      .slice()
      .sort((a, b) => a.score - b.score || priority.indexOf(a.id) - priority.indexOf(b.id))
      .forEach((dimension) => {
        if (dimension.score < 15) push(tipById[dimension.id]);
      });
    push("Read the line out loud. If you run out of breath, the preview will too.");
    return tips.slice(0, 3);
  }

  function pack(bold, story, question) {
    return [
      { id: "bold", style: "Bold claim", kicker: "Say the stake", text: finish(bold) },
      { id: "story", style: "Story", kicker: "Open on a scene", text: finish(story) },
      { id: "question", style: "Question", kicker: "Leave a loop open", text: finish(question) },
    ];
  }

  function adviceTake(ctx) {
    const match = ctx.themes.find((theme) => ADVICE_TAKES[theme.key] || ADVICE_TAKES[theme.label]);
    if (!match) return null;
    const take = ADVICE_TAKES[match.key] || ADVICE_TAKES[match.label];
    return pack(take.bold, take.story, take.question);
  }

  function proofRewrites(ctx) {
    const topic = ctx.topic;
    const { times, results } = splitNumbers(ctx.numbers);
    const wordNum = ctx.numbers.find((phrase) => /\bwords?\b/i.test(phrase));
    const failure = (ctx.lower.match(/\b(nobody|no one|nothing|failed|ghosted|rejected|fired)\b/) || [])[0];

    if (results[0] && times[0]) {
      const bold = wordNum
        ? `${capitalize(results[0])} in ${times[0]}. The line was ${wordNum}.`
        : `${capitalize(results[0])} in ${times[0]}. One specific change to ${topic} did that.`;
      const story = wordNum
        ? `The old version was polite. I cut ${topic} down to ${wordNum}. That brought ${results[0]} in ${times[0]}.`
        : `I changed one thing about ${topic}. Afterward the count was ${results[0]} in ${times[0]}.`;
      const verb = /\b(calls?|meetings?|demos?|clients?)\b/i.test(results[0]) ? "booked" : "produced";
      const question = wordNum
        ? `What if ${topic} only needed ${wordNum}? That version ${verb} ${results[0]} in ${times[0]}.`
        : `What changed in ${topic} to make ${results[0]} in ${times[0]} possible?`;
      return pack(bold, story, question);
    }

    if (times[0] && failure) {
      const quiet = failure === "nobody" || failure === "no one" || failure === "nothing";
      const bold = quiet
        ? `${capitalize(times[0])} of ${topic}, and almost nobody to show for it.`
        : `${capitalize(times[0])} of ${topic}, and then it ${failure}.`;
      const story = `For ${times[0]} I kept publishing ${topic}. The result was quieter than the effort. The version that traveled opened on that quiet.`;
      const question = `What if ${times[0]} of work on ${topic} was lost in the first line, not in the effort?`;
      return pack(bold, story, question);
    }

    if (results[0]) {
      return pack(
        `${capitalize(results[0])}. That is the opener, and ${topic} is the reason it happened.`,
        `I almost led with context. The fact came first instead: ${results[0]}, because of ${topic}.`,
        `What would you cut from a story about ${topic} if you had to keep ${results[0]} in the first line?`
      );
    }

    if (times[0]) {
      return pack(
        `${capitalize(times[0])} changed how I see ${topic}. The lesson is smaller than the time it took.`,
        `I gave ${topic} ${times[0]}. The useful part was not the grind. It was the moment something finally shifted.`,
        `What actually changed about ${topic} in those ${times[0]}?`
      );
    }

    return pack(
      `Lead with the result, then the path. ${capitalize(topic)} can take sentence two.`,
      `I had a story about ${topic} and I hid the turn. The turn is the hook.`,
      `What is the one result a stranger should remember about ${topic}?`
    );
  }

  function announcementRewrites(ctx) {
    const topic = ctx.topic;
    const role = ctx.role;
    const variant = hash(ctx.text) % 2;
    if (ctx.numberCount && ctx.numbers.length) return proofRewrites(ctx);
    if (role && role.title) {
      const place = role.company ? `${role.title} at ${role.company}` : role.title;
      if (variant === 0) {
        return pack(
          `I joined as ${place}. The title is the footnote. The post starts with the problem this seat is here to answer.`,
          `I said yes to ${place} and almost led with a feeling. The truer opening is the work I want to change.`,
          `What should a new ${role.title} prove first: the title, or the judgment?`
        );
      }
      return pack(
        `${place}. Day one is for the work, not the confetti.`,
        `The offer was ${place}. Before I told anyone, I wrote down the result that would make the title mean something.`,
        `If you could not say excited, what would day one as ${role.title} be for?`
      );
    }
    if (variant === 0) {
      return pack(
        `A note about ${topic} does not need a drumroll. Lead with the opinion you are slightly afraid to sign.`,
        `I started typing that I was thrilled to share thoughts on ${topic}. I deleted it. Thoughts are not a hook. A scene is.`,
        `If you only had one sentence on ${topic}, which part would you be nervous to publish?`
      );
    }
    return pack(
      `Skip the welcome speech. Say the stake of ${topic} before you say how the milestone feels.`,
      `The draft opened with a feeling and a trophy. I moved the trophy down. What belonged up top was the problem ${topic} is supposed to solve.`,
      `What is the fact under this announcement, and why would a stranger stop for it?`
    );
  }

  function hiringRewrites(ctx) {
    const topic = ctx.topic === "this idea" ? "the work" : ctx.topic;
    return pack(
      "We are hiring. The pitch is not the culture deck. It is the problem this person will own in month one.",
      "I opened a role and almost wrote a poem about the team. The people who replied wanted the work, named plainly.",
      `What will this hire do in the first 30 days that the current team cannot, especially around ${topic}?`
    );
  }

  function questionRewrites(ctx) {
    const topic = ctx.topic;
    let bold = "";
    const withoutMark = ctx.text.split("?")[0].trim();
    if (/^what if\b/i.test(withoutMark)) {
      const body = withoutMark.replace(/^what if\s+/i, "");
      const parts = body.split(/\s+and\s+/i).map((part) => part.trim()).filter(Boolean);
      if (parts.length === 2 && parts[0].split(" ").length <= 14 && parts[1].split(" ").length <= 18) {
        bold = `${finish(capitalize(parts[0]))} ${finish(capitalize(parts[1]))}`;
      }
    }
    if (!bold) {
      bold = `People do not leave because of ${topic}. They leave because the first line never gives them a stake.`;
    }
    const story = `I watched a useful post about ${topic} die in the preview. The body was fine. The opening let everyone leave.`;
    const question = `Would you bet a stranger stops for your first line on ${topic}, or only for the second?`;
    return pack(bold, story, question);
  }

  function adviceRewrites(ctx) {
    const topic = ctx.topic;
    const variant = hash(ctx.text) % 2;
    if (variant === 0) {
      return pack(
        `Most advice about ${topic} is easy to like and easy to forget. Open with the price of getting it wrong.`,
        `I wrote a neat line about ${topic} and watched people agree and leave. They stayed when I started with a scene from a bad day.`,
        `If ${topic} is the answer, what expensive mistake is your reader making this week?`
      );
    }
    return pack(
      `${capitalize(topic)} is not a mood. Name the behavior you want a reader to change before lunch.`,
      `A client asked me for thoughts on ${topic}. I gave them a principle. They needed the sentence to use on Monday.`,
      `Which word in a post about ${topic} could a skeptic underline, and which word would they trust?`
    );
  }

  function generalRewrites(ctx) {
    const topic = ctx.topic;
    const variant = hash(`${ctx.text}::general`) % 2;
    const claimWords = ctx.claim ? ctx.claim.split(" ").length : 0;
    const claimOk = ctx.claim && !ctx.cliches.length && claimWords >= 6 && claimWords <= 16;
    if (variant === 0 && claimOk) {
      return pack(
        `${capitalize(ctx.claim)}. Context can wait until the second line.`,
        `The moment that taught me about ${topic} was smaller than the slogan. I would open on that moment.`,
        `What is the part about ${topic} you would still say if you had to cut every adjective?`
      );
    }
    return pack(
      `Start with the consequence of ${topic}. A warm-up is where a good point goes to be scrolled past.`,
      `I buried the point about ${topic} under a polite first line. When I moved the point up, the post finally had a job.`,
      `What does a stranger lose by not knowing what you know about ${topic}?`
    );
  }

  function tinyRewrites() {
    return pack(
      "Name the result, the person, and the stake. A greeting is not a hook.",
      "I opened with hello once. The readers who stayed were the ones I gave a scene, in the very first line.",
      "What happened, to whom, and why should a stranger care? Answer that before you say hello."
    );
  }

  function buildRewrites(ctx) {
    if (ctx.wordCount < 5) return tinyRewrites();
    if (ctx.kind === "hiring") return hiringRewrites(ctx);
    if (ctx.kind === "announcement") return announcementRewrites(ctx);
    if (ctx.kind === "proof") return proofRewrites(ctx);
    if (ctx.kind === "question") return questionRewrites(ctx);
    const take = ctx.kind === "advice" || ctx.cliches.length ? adviceTake(ctx) : null;
    if (take) return take;
    if (ctx.kind === "advice") return adviceRewrites(ctx);
    return generalRewrites(ctx);
  }

  function roast(input) {
    const text = normalize(input);
    if (!text) return { ok: false, error: "Paste an opening line first. Even a bad one roasts well." };

    const ctx = analyze(text);
    const dimensions = [
      ["curiosity", "Curiosity", scoreCuriosity(ctx)],
      ["clarity", "Clarity", scoreClarity(ctx)],
      ["specificity", "Specificity", scoreSpecificity(ctx)],
      ["emotion", "Emotion", scoreEmotion(ctx)],
      ["scan", "Length / scannability", scoreScan(ctx)],
    ].map(([id, label, score]) => ({
      id,
      label,
      score,
      max: 20,
      note: dimensionNote(id, score, ctx),
    }));
    const score = dimensions.reduce((total, dimension) => total + dimension.score, 0);

    return {
      ok: true,
      score,
      verdict: verdictFor(score),
      roast: pickRoast(ctx, dimensions, score),
      kind: ctx.kind,
      kindLabel: kindLabel(ctx.kind),
      words: ctx.wordCount,
      topic: ctx.topic,
      dimensions,
      tips: pickTips(ctx, dimensions, score),
      rewrites: buildRewrites(ctx),
    };
  }

  return { roast, EXAMPLES };
});
