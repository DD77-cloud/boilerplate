const Sequelize = require('sequelize')
const db = require('../index.js')


const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false

  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
        return () => this.getDataValue('password')
    }
},
salt: {
    type: Sequelize.STRING,
    get() {
        return() => this.getDataValue('salt')
    }
  }
}, {
  hooks: {
    beforeCreate: setSaltAndPassword,
    beforeUpdate: setSaltAndPassword
  }
});

// instance methods
User.prototype.correctPassword = function (candidatePassword) {
  // should return true or false for if the entered password matches
  return User.encryptPassword(enteredPassword, this.salt()) === this.password()
};

// class methods
User.generateSalt = function () {
  // this should generate our random salt
  return crypto.randomBytes(16).toString('base64')
};

User.encryptPassword = function (plainText, salt) {
  return crypto
  .createHash('RSA-SHA256')
  .update(plainText)
  .update(salt)
  .digest('hex')
};

function setSaltAndPassword (user) {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
}
}

module.exports = User;