const Contest = require('../model/contest.model'); // adjust path if needed

// 1️⃣ GET upcoming contests & delete old ones inline (when user requests)
const getUpcomingContests = async (req, res) => {
  try {
    const now = new Date();

    // Delete old contests
    await Contest.deleteMany({ startTime: { $lt: now } });

    // Fetch upcoming contests
    const upcomingContests = await Contest.find({ startTime: { $gte: now } }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      message: "Upcoming contests fetched successfully.",
      data: upcomingContests,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 2️⃣ DELETE old contests only (for scheduled GitHub Action)
const cleanupOldContests = async (req, res) => {
  try {
    const now = new Date();

    const result = await Contest.deleteMany({ startTime: { $lt: now } });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old contests.`,
    });
  } catch (error) {
    console.error("Error cleaning up contests:", error);
    res.status(500).json({
      success: false,
      message: "Error during cleanup.",
    });
  }
};

module.exports = {
  getUpcomingContests,
  cleanupOldContests,
};
