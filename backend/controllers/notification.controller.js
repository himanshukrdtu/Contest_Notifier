const Contest = require('../model/contest.model');
const User = require('../model/user.model');
const sendMail = require('../utils/mailer'); // your nodemailer helper

const sendContestNotifications = async (req, res) => {
  try {
    const now = new Date();
    const fourhourLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    // 1. Find contests starting within next 4 hours AND notificationSent=false
    const contestsToNotify = await Contest.find({
      startTime: { $gte: now, $lte: fourhourLater },
      notificationSent: false,
    });

    if (contestsToNotify.length === 0) {
      return res.status(200).json({ message: "No contests to notify in next 4 hours." });
    }

    // 2. Fetch all users
    const users = await User.find({}, 'name email');

    // 3. Send notification for each contest to each user
    for (const contest of contestsToNotify) {
      // Format start time in IST timezone for user-friendly display
      const startTimeIST = contest.startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

      const subject = `Upcoming Contest: ${contest.name} starts soon!`;
      const message = `Hello,\n\nThe contest "${contest.name}" on ${contest.platform} will start at ${startTimeIST}.\nCheck it out here: ${contest.url}\n\nGood luck!`;

      for (const user of users) {
        await sendMail({ to: user.email, subject, html: message });
      }

      contest.notificationSent = true;
      await contest.save();
    }

    res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  sendContestNotifications,
};
