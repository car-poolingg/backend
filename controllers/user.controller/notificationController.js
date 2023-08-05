const Notification = require("../../models/Notification");
const useractivity = require("../helper/useractivity");

const fetchNotifications = async (req, res) => {
    // const {
    //     user: { _id: userId },
    //     query: { read }
    // } = req
    // let notifications
    // if (read === "true") {
    //     notifications = await Notification.find({ userId, read: true }).sort({ created_at: "desc" });
    // } else {
    //     notifications = await Notification.find({ userId, read: false }).sort({ created_at: "desc" });
    // }
    // await useractivity(req.user._id, "View my notifications");
    // res.status(200).json({
    //     notifications,
    //     message: "Success",
    // });
};

const updateNotification = async (req, res) => {
    // const {
    //     user: { _id: userId },
    //     params: { id: NotificationId },
    //     query: { read }
    // } = req;
    // const notifications = await Notification.findOne({ _id: NotificationId, userId })
    // notifications.read = read
    // await notifications.save()
    // res.status(200).json({
    //     notifications,
    //     message: "Success",
    // });
};

module.exports = { fetchNotifications, updateNotification };
