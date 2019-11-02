const Sequelize = require('sequelize')
const db = require('../index.js')


const User = db.define('user', {
  // what fields will we need?
  // make sure that the password we store is salted and hashed! NEVER store the plain password
}, {
  hooks: {
    beforeCreate: setSaltAndPassword,
    beforeUpdate: setSaltAndPassword
  }
});

// instance methods
User.prototype.correctPassword = function (candidatePassword) {
  // should return true or false for if the entered password matches
};

// class methods
User.generateSalt = function () {
  // this should generate our random salt
};

User.encryptPassword = function (plainText, salt) {
  // accepts a plain text password and a salt, and returns its hash
};

function setSaltAndPassword (user) {
  // we need to salt and hash again when the user enters their password for the first time
  // and do it again whenever they change it
}

module.exports = User;