var mongoose = require('mongoose');
var crypto = require('crypto');
var Card = require('./Cards');

var UserSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    hashedPassword: String,
    salt: String,
    name: {type: String, unique: true, required: true},
    licenceNumber: {type: String, unique: true, required: true},
    type: {type: Number, default: 0, min: 0, max: 1},
    participate: {type: Number, default: 1, min: 0, max: 2},
    rememberLastChoice: {type: Boolean, default: false},
    removed: {type: Boolean, default: false},
    unreadMsgCounter: {type: Number, default: 0, min: 0},
    card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'},
    numberOfWins: {type: Number, default: 0, min: 0},
    numberOfAttempts: {type: Number, default: 0, min: 0}
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },

    /**
     * Validates new password length
     *
     * @param newPassword
     * @return {Boolean}
     */
    validatePasswordLength: function(newPassword) {
        return newPassword && newPassword.length >= 4 && newPassword.length <= 16;
    },

    /**
     * Validates new password by rules:
     * <br> - has number
     * <br> - has letter
     * <br> - no special characters like 'space' and double quote '"'
     *
     * @param newPassword
     * @return {Boolean}
     */
    validatePassword: function(newPassword) {
        if(!newPassword) {
            return false;
        }

        var chars = newPassword.split("");
        for(var i= 0, len = chars.length; i < len; i++) {
            var singleChar = chars[i];
            if(!singleChar.match(/\d/) && !singleChar.match(/[a-zA-Z]/) && singleChar.match(/[ \/"]/)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Compares two passwords
     *
     * @param newPassword
     * @param confirmPassword
     * @return {Boolean}
     */
    comparePasswords: function(newPassword, confirmPassword) {
        return newPassword && newPassword.localeCompare(confirmPassword) === 0;
    }
};

mongoose.model('User', UserSchema);
module.exports = UserSchema;
