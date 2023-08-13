const Notification = require("../../models/user.model/notification");

const fetchNotifications = async (req, res) => {
    const { userId } = req.user;
    const notifications = await Notification.find({ user: userId }).sort({ created_at: "desc" });

    res.status(200).json({
        notifications,
        message: "Success",
    });
};

module.exports = { fetchNotifications };
