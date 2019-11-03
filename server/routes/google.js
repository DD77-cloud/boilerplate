const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
if (process.env.NODE_ENV === 'development') {
    require('../../secrets.js')
  }
const User = require('../database/models/user')

// // configuring the strategy (credentials + verification callback)
// passport.use(
//   new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/verify'
//   },
//   (token, refreshToken, profile, done) => {
//     const info = {
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       photo: profile.photos ? profile.photos[0].value : undefined
//     }

//     User.findOrCreate({
//       where: {googleId: profile.id},
//       defaults: info
//     })
//       .spread((user) => done(null, user))
//       .catch(done)
//   })
// )
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Google client ID / secret not found. Skipping Google OAuth.')
  } else {
    const googleConfig = {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    }
  
    const strategy = new GoogleStrategy(
      googleConfig,
      (token, refreshToken, profile, done) => {
        const googleId = profile.id
        const email = profile.emails[0].value
        const imgUrl = profile.photos[0].value
        const firstName = profile.name.givenName
        const lastName = profile.name.familyName
        const fullName = profile.displayName
  
        User.findOrCreate({
          where: {googleId},
          defaults: {email, imgUrl, firstName, lastName, fullName}
        })
          .then(([user]) => done(null, user))
          .catch(done)
      }
    )
  
    passport.use(strategy)
// Google authentication and login
router.get('/', passport.authenticate('google', { scope: 'email' }))

// handle the callback after Google has authenticated the user
router.get('/verify',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`/home`)
  }
)
  }

module.exports = router