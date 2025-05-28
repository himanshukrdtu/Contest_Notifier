const User = require('../model/user.model');
const sendMail = require('../utils/mailer'); 

// @desc    Add a new user
// @route   POST /api/users
// @access  Public or restricted based on your auth
const addUser = async (req, res) => {
  try {
    const { name, email } = req.body;

     

    if (!name || !email) {
       
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const newUser = new User({ name, email });
    await newUser.save();
    

    const subject = "Welcome to Contest Notifier!";
    const message = `
Hi ${name},

Welcome to Contest Notifier! We're excited to have you onboard.

You will get notified about upcoming contests on LeetCode, Codeforces, and CodeChef — 4 hours before they start — so you never miss a chance to participate and compete.

Stay tuned and happy coding!

Best regards,
The Contest Notifier Team
    `;

     

    try {
      await sendMail({
        to: email,
        subject,
        html: message,
      });
      
    } catch (mailError) {
      console.error("Error occurred while sending email:", mailError);
      // Optionally, you could respond with error here or continue as success
    }

    res.status(201).json({
      success: true,
      message: "User added successfully and welcome email sent.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { addUser };
