// Database user model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name				: String, // user name
	provider		: String, // Twitter, Facebook, etc
	provider_id : {type: String, unique: true}, // id returned by Twitter, Facebook, etc.
	photo			 : String, // user's photo or avatar
	createdAt	 : {type: Date, default: Date.now} 
});

var User = mongoose.model('User', UserSchema);
