'use strict';

const mongooseCrudify = require('mongoose-crudify');

const helpers = require('../services/helpers');
const User = require('../models/user');

module.exports = function (server) {

	// Docs: https://github.com/ryo718/mongoose-crudify
	server.use(
		'/api/users',
		mongooseCrudify({
			Model: User,
			//selectFields: '-__v', // Hide '__v' property
			endResponseInAction: false,

			// beforeActions: [],
			// actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
			afterActions: [
				{ middlewares: [helpers.formatResponse] },
			],
		})
	);


	server.use(
		'/api/userlogin',
		mongooseCrudify({
			Model: User,
			//selectFields: '-__v', // Hide '__v' property
			endResponseInAction: false,
			//options: {email:'vipul@yahoo.com'},
			 beforeActions: [],
			 actions: 'GET', // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
			afterActions: [
				{ middlewares: [helpers.formatResponse] },
			],
		})
	);

};