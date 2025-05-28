// scrape/codeforce.js

const mongoose = require('mongoose');
const axios = require('axios');
const Contest = require('../model/contest.model'); // ✅ adjust if needed

 
// ✅ Main function to fetch + store contests
async function  fetchCodeforces(){
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result;

    const upcomingContests = contests
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        code: contest.id.toString(),
        name: contest.name,
        url: `https://codeforces.com/contests/${contest.id}`,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000),
        durationSeconds: contest.durationSeconds,
        notificationSent: false,
      }));

    for (const contestData of upcomingContests) {
      const exists = await Contest.findOne({ code: contestData.code });
      if (!exists) {
        const contest = new Contest(contestData);
        await contest.save();
        console.log(`✅ Saved: ${contest.name}`);
      } else {
        console.log(`ℹ️ Already exists: ${contestData.name}`);
      }
    }

    // ✅ Close the connection after done
    
  } catch (error) {
    console.error('❌ Error:', error.message);
     
  }
}

// ✅ Export the function (if used elsewhere)
module.exports =  fetchCodeforces;
