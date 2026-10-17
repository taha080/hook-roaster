const assert = require("assert");
const { roast } = require("../js/engine");

function words(value) {
  return value.split(/\s+/).filter(Boolean).length;
}

const samples = {
  announce:
    "Excited to announce that I'm thrilled to share some thoughts on leadership and personal growth in today's fast-paced world!",
  years: "I spent 3 years writing LinkedIn posts nobody read. Then I changed the first line.",
  calls: "I rewrote one cold email subject line and booked 11 calls in 9 days. The sentence was 7 words.",
  mindset: "Success is all about mindset. Just believe in yourself and great things will happen.",
  scroll: "What if your content is fine and your hook is the reason people scroll?",
  lead: "Leadership is about empowering people to be their best selves.",
  role: "Excited to announce that I started a new position as Marketing Manager at Acme!",
  hi: "Hi",
};

const results = {};

Object.entries(samples).forEach(([name, text]) => {
  const report = roast(text);
  results[name] = report;
  assert.strictEqual(report.ok, true, name);
  assert.ok(report.score >= 0 && report.score <= 100, `${name} score ${report.score}`);
  assert.strictEqual(
    report.dimensions.reduce((total, dimension) => total + dimension.score, 0),
    report.score,
    name
  );
  report.dimensions.forEach((dimension) => {
    assert.ok(dimension.score >= 0 && dimension.score <= 20, `${name} ${dimension.id}`);
  });
  assert.deepStrictEqual(
    report.rewrites.map((item) => item.style),
    ["Bold claim", "Story", "Question"],
    name
  );
  assert.strictEqual(new Set(report.rewrites.map((item) => item.text)).size, 3, name);
  report.rewrites.forEach((item) => {
    assert.ok(!/undefined|null|\bNaN\b/.test(item.text), item.text);
    assert.ok(/[.!?]$/.test(item.text), item.text);
    assert.ok(words(item.text) <= 60, `${name} ${item.style} (${words(item.text)}): ${item.text}`);
    assert.ok(item.text.length > 24, item.text);
  });
  assert.strictEqual(report.tips.length, 3, name);
  const again = roast(text);
  assert.strictEqual(again.score, report.score);
  assert.strictEqual(again.rewrites[0].text, report.rewrites[0].text);
  assert.strictEqual(again.roast, report.roast);

  console.log(`\n== ${name} ${report.score} ${report.verdict} · ${report.kindLabel} · ${report.topic}`);
  console.log(report.roast);
  console.log(report.dimensions.map((dimension) => `${dimension.label} ${dimension.score}`).join(" | "));
  report.tips.forEach((tip) => console.log(` - ${tip}`));
  report.rewrites.forEach((item) => console.log(`${item.style}: ${item.text}`));
});

assert.ok(results.calls.score >= 80, `calls ${results.calls.score}`);
assert.ok(/believe in yourself/i.test(results.mindset.tips.join(" ")), results.mindset.tips.join(" | "));
assert.ok(!/cut filler/i.test(results.calls.tips.join(" ")), results.calls.tips.join(" | "));
assert.ok(!/12–30 words/.test(results.scroll.tips.join(" ")), results.scroll.tips.join(" | "));
assert.ok(results.years.score >= 70, `years ${results.years.score}`);
assert.ok(results.calls.score > results.years.score, "proof should outscore the quieter story");
assert.ok(results.years.score > results.scroll.score, "the story should outscore the question");
assert.ok(results.scroll.score > results.announce.score);
assert.ok(results.scroll.score > results.mindset.score);
assert.ok(results.announce.score <= 55, `announce ${results.announce.score}`);
assert.ok(results.mindset.score <= 50, `mindset ${results.mindset.score}`);
assert.ok(results.hi.score <= 35, `hi ${results.hi.score}`);
assert.ok(results.calls.score > results.announce.score + 30);

assert.ok(results.calls.rewrites.some((item) => item.text.includes("11 calls")));
assert.ok(results.calls.rewrites.some((item) => item.text.includes("7 words")));
assert.ok(results.years.rewrites.some((item) => /3 years/i.test(item.text)));
assert.ok(!/^excited to announce/i.test(results.announce.rewrites[0].text));
assert.strictEqual(results.role.kind, "announcement");
assert.ok(
  results.role.rewrites.some((item) => /Marketing Manager/.test(item.text) && /Acme/.test(item.text)),
  JSON.stringify(results.role.rewrites, null, 2)
);
assert.ok(results.mindset.rewrites.some((item) => /Monday|meeting|first sentence/i.test(item.text)));
assert.ok(/^Your content is fine\./.test(results.scroll.rewrites[0].text), results.scroll.rewrites[0].text);

const you = roast("You keep rewriting your headline and your reader still does not stop.");
const them = roast("People keep rewriting headlines and readers still do not stop.");
const youEmotion = you.dimensions.find((dimension) => dimension.id === "emotion").score;
const themEmotion = them.dimensions.find((dimension) => dimension.id === "emotion").score;
assert.ok(youEmotion > themEmotion, `you ${youEmotion} them ${themEmotion}`);

const numbered = roast("We closed 4 clients after rewriting the offer.");
const vague = roast("We closed some clients after rethinking the offer.");
assert.ok(
  numbered.dimensions.find((dimension) => dimension.id === "specificity").score >
    vague.dimensions.find((dimension) => dimension.id === "specificity").score
);

const buried = roast(
  "I want to talk about leadership for a while before I get anywhere near the useful part of this story because the preview is short and people leave early and only then will I mention the 40% lift in replies."
);
assert.ok(buried.tips.some((tip) => /150 characters/.test(tip)), buried.tips.join("\n"));

assert.strictEqual(roast("   ").ok, false);
assert.doesNotThrow(() => roast("<script>alert(1)</script>"));

console.log("\nAll tests passed.");
