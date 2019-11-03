const router = require('express').Router();
const User = require('../database/models/user.js')
const passport = require('passport')

router.get('/me', function (req, res, next) { 
    res.json(req.user);
});
router.get('/auth/google', passport.authenticate('google', { scope: 'email' }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
router.post('/signup', async function (req, res, next) { 

     try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
    //try {
    // console.log(req.body)
    // const newuser = await User.create(req.body)
    
    // if(newuser) {
    //     req.login(newuser, err => (err ? next(err) : res.json(newuser)))
    // }
    // else res.sendStatus(406)
    // } catch (error) {
    // next(error)}

});

router.put('/login', async function (req, res, next) { 
    try {
    const user = await User.findOne({
            where:{
                email: req.body.email
            }
        })
    if(!user) res.sendStatus(404);
    else if(!user.correctPassword(req.body.password)) res.sendStatus(401);
    else res.json(user)
    } catch (error) {
        next(error)       
    }
   
    });


router.delete('/logout', function (req, res, next) { 
    req.logout();
    req.session.destroy();
    res.sendStatus(204);
 });

module.exports = router;