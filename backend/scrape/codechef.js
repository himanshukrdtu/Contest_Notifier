const puppeteer = require('puppeteer');
const Contest = require('../model/contest.model');

function parseCodechefDateTime(startDate, startTime) {
  const timeMatch = startTime.match(/\d{1,2}:\d{2}/);
  if (!timeMatch) return null;
  const dateTimeStr = `${startDate} ${timeMatch[0]}`;
  const dateObj = new Date(dateTimeStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function parseDurationToSeconds(duration) {
  let totalSeconds = 0;
  if (!duration) return totalSeconds;
  const hrMatch = duration.match(/(\d+)\s*Hr/);
  const minMatch = duration.match(/(\d+)\s*Min/);
  if (hrMatch) totalSeconds += parseInt(hrMatch[1], 10) * 3600;
  if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60;
  return totalSeconds;
}

async function scrapeCodechef() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  await page.goto('https://www.codechef.com/contests', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  const contests = await page.evaluate(() => {
    const result = [];
    const titleElements = document.querySelectorAll('p._title_7s2sw_347');
    let upcomingTable;

    for (const title of titleElements) {
      if (title.innerText.trim() === 'Upcoming Contests') {
        const container = title.closest('div._contest-tables__container_7s2sw_225');
        upcomingTable = container?.querySelector('table.MuiTable-root');
        break;
      }
    }

    if (!upcomingTable) return result;

    const rows = upcomingTable.querySelectorAll('tbody tr');
    for (const row of rows) {
      const cols = row.querySelectorAll('td');
      if (cols.length < 4) continue;

      const code = cols[0].querySelector('p:last-child')?.innerText.trim() || null;
      const nameAnchor = cols[1].querySelector('a');
      const name = nameAnchor?.innerText.trim() || null;
      const url = nameAnchor?.href || null;
      const startDate = cols[2].querySelector('p:first-child')?.innerText.trim() || null;
      const startTime = cols[2].querySelector('p:last-child')?.innerText.trim() || null;
      const duration = cols[3].querySelector('p')?.innerText.trim() || null;

      if (code && name) {
        result.push({ code, name, url, startDate, startTime, duration });
      }
    }

    return result;
  });

  for (const c of contests) {
    const startTime = parseCodechefDateTime(c.startDate, c.startTime);
    if (!startTime) {
      console.warn(`Skipping contest with invalid date/time: ${c.code} - ${c.name}`);
      continue;
    }

    const durationSeconds = parseDurationToSeconds(c.duration);

    const contestData = {
      code: c.code,
      name: c.name,
      url: c.url,
      platform: 'CodeChef',
      startTime,
      durationSeconds,
      notificationSent: false,
    };

    const exists = await Contest.findOne({ code: contestData.code });
    if (!exists) {
      const contest = new Contest(contestData);
      await contest.save();
      console.log(`✅ Saved: ${contest.name}`);
    } else {
      console.log(`ℹ️ Already exists: ${contestData.name}`);
    }
  }

  await browser.close();
}

module.exports = scrapeCodechef;
