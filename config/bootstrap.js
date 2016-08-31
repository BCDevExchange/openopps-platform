console.log('Loading... ', __filename);

var fs = require('fs'),
    p = require('path');

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var buildDictionary = require('sails-build-dictionary');

var createAdmin = function (cb) {
  var name = 'Admin'
    , username = 'admin@admin.com'
    , password = 'admin1234'
    , email = 'admin@admin.com'
    , tags = ['admin'];

  if (!username) {
    req.flash('error', 'Error.Passport.Username.Missing');
    return next(new Error('No username was entered.'));
  }

  if (!password) {
    req.flash('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  User.create ({
    isAdmin : true,
    username : email,
    name: name,
    tags: tags,
    email: email
  }, function (err, user) {
    if (err) {
      if (err.code === 'E_VALIDATION') {
        req.flash('error', 'Error.Passport.User.Exists');
      }

      return next(err);
    }

    // Generating accessToken for API authentication
    var token = crypto.randomBytes(48).toString('base64');

    Passport.create ({
      protocol    : 'local'
    , password    : password
    , user        : user.id
    , accessToken : token
    , email       : email
    }, function (err, passport) {
      if (err) {
        if (err.code === 'E_VALIDATION') {
          req.flash('error', 'Error.Passport.Password.Invalid');
        }

        return user.destroy(function (destroyErr) {
          next(destroyErr || err);
        });
      }

      next(null, user);
    });
  });
};




module.exports.bootstrap = function (cb) {

  // If upload directory is missing, create it
  var config = sails.config.fileStore || {},
      dir = config.local.dirname || '/assets/uploads',
      path = p.join(sails.config.appPath, dir);
  if (!fs.existsSync(path)) fs.mkdirSync(path);

  // Load authentication strategies
  sails.services.passport.loadStrategies();

  buildDictionary.optional({
        dirname     : sails.config.paths.services,
        filter      : /(.+)\.(js|coffee|litcoffee)$/,
        depth     : 2,
        caseSensitive : true
      }, function (err, modules) {
           sails.services = modules;

           // User.create ({

           // }).exec (function (err, newuser) {
           //  if (err) {
           //    console.log ('Error creating admin user:', err);
           //  } else {
           //    console.log ('created admin user:', newuser);
           //  }
            cb();
           // });

         });
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
};
