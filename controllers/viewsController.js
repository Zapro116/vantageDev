/* eslint-disable no-shadow */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getHampta = (req, res) => {
  res.render('tours/hampta', {
    title: 'hampta'
  });
};

exports.getKasol = (req, res) => {
  res.render('tours/kasol', {
    title: 'kasol'
  });
};

exports.getLahesh = (req, res) => {
  res.render('tours/lahesh', {
    title: 'lahesh'
  });
};

exports.getValley = (req, res) => {
  res.render('tours/valley', {
    title: 'valley'
  });
};

exports.getHome = (req, res) => {
  res.render('home', {
    title: 'Conquer the himalayas'
  });
};

exports.getAbout = (req, res) => {
  res.render('about', {
    title: 'About us'
  });
};
exports.postContact = catchAsync(async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.msg
  };
  mongoose.connect(DB, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    db.collection('contactus').insertOne(data);
  });
  res.redirect('/');
});

exports.getMainBlog = (req, res) => {
  res.render('blogMain', {
    title: 'Blogs'
  });
};

exports.getContactUs = (req, res) => {
  res.render('contact', {
    title: 'Contact Us'
  });
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getDest = (req, res) => {
  res.render('dest', {
    title: 'Tours'
  });
};

exports.getChandra = (req, res) => {
  res.render('tours/chandrashilla');
};

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
