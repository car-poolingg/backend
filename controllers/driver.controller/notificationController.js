const Notification = require("../../models/driver.model/notification");

const fetchNotifications = async (req, res) => {
    const { driverId } = req.driver;
    const notifications = await Notification.find({ driver: driverId }).populate("request").sort({ created_at: "desc" });

    res.status(200).json({
        notifications,
        message: "Success",
    });
};

module.exports = { fetchNotifications };
