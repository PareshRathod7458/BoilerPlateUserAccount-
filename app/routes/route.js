const express = require('express');
const router = express();
const routes = require('./router/userRouter');
const categoryRoutes = require('./router/categoryRoutes')
const contactRoutes = require('./router/contactRoutes');
const testRoutes = require('./router/testRoutes');
const portfolioRoutes =require('./router/portfolioRoutes');



router.use('/',routes);
router.use('/',categoryRoutes);
router.use('/',contactRoutes);
router.use('/',testRoutes);
router.use('/',portfolioRoutes)


module.exports = router;
