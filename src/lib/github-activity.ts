import snapshot from "../app/activity.json" with { type: "json" };

type Activity = typeof snapshot;
const githubCalendar = "https://github.com/users/abhi1693/contributions";

function parseCalendar(html: string): Activity {
  const total = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?\b/i)?.[1];
  const days = [...html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bdata-level="([0-4])"[^>]*>/g)]
    .map(([, date, level]) => ({ date, level }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!total || days.length < 365 || days.length > 371) throw new Error("Incomplete GitHub calendar");
  const start = days[0].date;
  const first = Date.parse(start);
  let levels = " ".repeat(new Date(first).getUTCDay());
  for (const [index, day] of days.entries()) {
    if (Date.parse(day.date) !== first + index * 86400000) throw new Error("Missing GitHub calendar day");
    levels += day.level;
  }
  return { start, end: days[days.length - 1].date, total: Number(total.replaceAll(",", "")), weeks: levels.match(/.{1,7}/g)! };
}

let lastGood = snapshot;
let refreshAfter = 0;
let pending: Promise<Activity> | undefined;

async function refresh(): Promise<Activity> {
  try {
    const response = await fetch(githubCalendar, {
      cache: "no-store", signal: AbortSignal.timeout(5000), headers: { "Accept-Language": "en" },
    });
    if (!response.ok) throw new Error("GitHub returned HTTP " + response.status);
    lastGood = parseCalendar(await response.text());
    const midnight = new Date();
    refreshAfter = midnight.setUTCHours(24, 0, 0, 0);
  } catch (error) {
    console.warn("GitHub activity refresh failed", error instanceof Error ? error.message : error);
    refreshAfter = Date.now() + 5 * 60_000;
  } finally {
    pending = undefined;
  }
  return lastGood;
}

export async function getGithubActivity(): Promise<Activity> {
  if (Date.now() < refreshAfter) return lastGood;
  pending ??= refresh();
  return pending;
}
