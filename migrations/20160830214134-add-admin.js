'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

var hashPassword = function (password, cb) {
    bcrypt.hash(password, 10, function (err, hash) {
      cb(hash);
    });
}

exports.up = function(db, callback) {
	// callback();
	var bcrypt = require('bcryptjs');
	var password = process.env.ADMIN_PASSWORD;
	console.log ('++++++++++++++ supplied password = ', password);
	bcrypt.hash (password, 10, function (err, hash) {
		var sql = 'insert into midas_user (username, "isAdmin", name, "isAgencyAdmin") values (\'admin@admin.com\', true, \'admin\', true);\n'+
				'insert into passport (protocol, password, "user") values (\'local\', \''+hash+'\', currval(\'midas_user_id_seq\'));';
		console.log (sql);
		if (err) console.log (err);
		else {
			db.runSql (sql, callback);
		}
	});
};

exports.down = function(db, callback) {
  // nothing to do here
};
