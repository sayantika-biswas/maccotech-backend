
const router = require("express").Router();

const ContactRoute = require('./contactRoutes');
const Application = require('./applicationRoutes');
const GetQuote = require('./getQuote');
const Employee = require('./employeeRoutes');
const authRoutes = require('./authRoutes');
const validateTokenRouter  = require('./validateToken');
const userRoute = require('./user');
const blogroute = require('./blogRoutes');
const jobopening = require('./opening');
const JobPostRoute = require('./jobPostRoutes');
const projectRoutes = require('./projectRoutes');
const auth = require('./auth')
const PrivacyPolicy = require('./privacyPolicy');
const TermsCondition = require('./termsCon');
const sociallinks = require('./socialLinks')
router.use('/privacy-policy', PrivacyPolicy);
router.use('/terms-condition', TermsCondition);

router.use('/jobopening',jobopening);
router.use('/blog',blogroute)
router.use('/contact', ContactRoute);
router.use('/applications', Application);
router.use('/getquote', GetQuote);
router.use('/employees', Employee);
router.use('/register', authRoutes);
router.use('/login', authRoutes);
router.use('/user', userRoute);
// router.use('/logout', authRoutes);
router.use('/validate-token', validateTokenRouter );
router.use('/v1/jobs', JobPostRoute);
router.use('/projects', projectRoutes);
router.use('/auth', auth);
router.use("/Social-links",sociallinks)

module.exports = router;