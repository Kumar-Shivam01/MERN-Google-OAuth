const router = require('express').Router();
const {googleLogin} = require('../controllers/googleLogin')

router.route('/test').get((req,res)=>{
    res.send('test passed!')
})
router.route('/google').post(googleLogin)

module.exports = router;
