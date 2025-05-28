const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Contest = require("../model/contest.model");

const url = "https://leetcode.com/contest/";

async function parseLeetcodeTime(timeStr) {
  console.log("⏳ Parsing time:", timeStr);

  const formats = [
    "cccc h:mm a z",       // "Sunday 2:30 AM UTC"
    "cccc h:mm a 'GMT'ZZ", // "Sunday 2:30 AM GMT+5:30"
  ];

  for (const format of formats) {
    const dt = DateTime.fromFormat(timeStr, format, { setZone: true });
    if (dt.isValid) {
      return dt.toJSDate();
    }
  }

  console.warn("⚠️ Could not parse time string:", timeStr);
  return null;
}

async function scrapeLeetcode() {
  console.log("🚀 Starting Leetcode scraping...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extend timeout and wrap in try-catch to debug
    try {
      await page.waitForSelector(".swiper-slide", { timeout: 20000 });
    } catch (e) {
      const html = await page.content();
      console.error("❌ `.swiper-slide` not found. Dumping part of HTML for debugging:");
      console.error(html.slice(0, 1000)); // Print first 1000 chars of HTML
      throw e;
    }

    const contests = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".swiper-slide"))
        .map((el) => ({
          title: el.querySelector("span")?.innerText.trim() || "",
          time: el.querySelector(".text-label-2")?.innerText.trim() || "",
          image: el.querySelector("img")?.src || "",
          link: el.querySelector("a")?.href || "",
        }))
        .filter((contest) => contest.title && contest.time && contest.image);
    });

    for (const c of contests) {
      const startTime = await parseLeetcodeTime(c.time);
      if (!startTime) {
        console.warn(`⚠️ Skipping contest with invalid time: ${c.title}, time: ${c.time}`);
        continue;
      }

      const durationSeconds = 2 * 60 * 60;
      const code = c.title;

      const contestData = {
        code,
        name: c.title,
        url: c.link,
        platform: "LeetCode",
        startTime,
        durationSeconds,
        notificationSent: false,
      };

      try {
        const exists = await Contest.findOne({ code });
        if (!exists) {
          const contest = new Contest(contestData);
          await contest.save();
          console.log(`✅ Saved: ${c.title}`);
        } else {
          console.log(`ℹ️ Already exists: ${c.title}`);
        }
      } catch (error) {
        console.error(`❌ Error saving contest ${c.title}:`, error.message);
      }
    }
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeLeetcode;
