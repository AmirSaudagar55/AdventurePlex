// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set in your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in your .env file
      callbackURL:
        "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        console.log("Profile:", profile);
        const email = profile.emails[0].value;
        // Find existing user or create new one
        let user = await User.findOne({ where: { email } });
        const photoUrl =
          profile.photos && profile.photos.length ? profile.photos[0].value : null;

        if (user) {
          // Optionally update profilePicture if it's changed
          if (photoUrl && user.profilePicture !== photoUrl) {
            user.profilePicture = photoUrl;
            await user.save();
          }
          return done(null, user);
        } else {
          // Create a new user (password is left blank for OAuth users)
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: '', // Not used for Google OAuth
            phone: null,
            role: 'user',
            profilePicture: photoUrl,
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
