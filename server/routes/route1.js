const router = require('express').Router();
const {User} = require('../database/models/user.js')
// matches GET requests to /api/puppies/
router.get('/me', function (req, res, next) { 
    res.json(req.user);
});
// matches POST requests to /api/puppies/
router.post('/signup', async function (req, res, next) { 
try {
    const [newuser, created] = await User.create(req.body)
    if(created) {
        res.login(newuser)
        res.json(newuser)
    }
    else res.sendStatus(406)
    } catch (error) {
    next(error)
}
    
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