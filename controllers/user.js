const { User } = require('../models/userModel')
const sha256 = require('sha256')
exports.register = async (req, h) => {
  const {
    email,
    password,
    username,
    firstname,
    lastname,
    birth,
    address
  } = req.payload
  const getEmail = await User.find({ email: email })
  const getUsername = await User.find({ username: username })
  if (getEmail.length === 0) {
    if (getUsername.length === 0) {
      await User.insertMany({
        email,
        password: sha256(password),
        username,
        firstname,
        lastname,
        birth,
        address
      })
      return h.response({ success: true }).code(201)
    } else {
      return h
        .response({
          success: false,
          message: 'Username already used'
        })
        .code(400)
    }
  } else {
    return h
      .response({
        success: false,
        message: 'Email already used'
      })
      .code(400)
  }
}

exports.login = async (req, h) => {
  const {
    email,
    password
  } = req.payload
  const getEmail = await User.find({
    email: email
  })
  const getUsername = await User.find({
    username: email
  })
  if ((getEmail !== [] &&
    sha256(password) === getEmail[0].password) || (getUsername !== [] && sha256(password) === getUsername[0].password)) {
    return h.response({ success: true, data: getEmail }).code(200)
  } else {
    return h.response({ success: false, message: 'Email or password not valid' }).code(403)
  }
}
