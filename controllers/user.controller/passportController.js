const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, cb) {
            const { email, given_name, family_name } = profile._json;

            const userDetails = {
                googleId: profile.id,
                email,
                firstName: given_name,
                lastName: family_name,
                isVerified: {
                    email: true,
                },
                verified: new Date(Date.now()),
            };

            const user = await User.findOne({ email, googleId: profile.id });
            if (user) {
                return cb(null, user);
            } else {
                const existingUser = await User.findOne({ email });
                if (existingUser)
                    throw new customApiError.BadRequestError(
                        "User with this email already exists"
                    );

                const newUser = await User.create(userDetails);
                return cb(null, newUser);
            }
        }
    )
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = passport;
