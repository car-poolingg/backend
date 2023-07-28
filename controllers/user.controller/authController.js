const passport = require("passport");

const google = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallBack = passport.authenticate("google", {
    // successRedirect: "",
    failureRedirect: "",
    successFlash: true,
});
