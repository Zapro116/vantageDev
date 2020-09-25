const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getHome);
router.get('/tours', authController.isLoggedIn, viewsController.getDest);
router.get('/about', authController.isLoggedIn, viewsController.getAbout);
router.get('/blogs', authController.isLoggedIn, viewsController.getMainBlog);
router.get('/contact', authController.isLoggedIn, viewsController.getContactUs);
router.post('/contact', authController.isLoggedIn, viewsController.postContact);
router.get(
  '/tour/valley-of-flowers',
  authController.protect,
  viewsController.getValley
);
router.get('/tour/hampta', authController.protect, viewsController.getHampta);
router.get('/tour/kasol', authController.protect, viewsController.getKasol);
router.get('/tour/lahesh', authController.protect, viewsController.getLahesh);
router.get(
  '/tour/chandrishilla',
  authController.protect,
  viewsController.getChandra
);

router.get('/tour/dayara', (req, res) => {
  res.render('tours/dayara');
});

router.get('/tour/kedarkanth', (req, res) => {
  res.render('tours/kedarkanth');
});
// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
