const ensureAuthenticated = require('../Middlewares/Auth');


const router = require('express').Router();


router.get('/', ensureAuthenticated,(res,req) => {
    res.status(200).json([
        {
  name:"Mobile",
  price:1000
  },
  {
    name:"Tv",
    price:2000
    }

    ])
});


module.exports = router;