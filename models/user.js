const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Минимальная длина поля "name" должна быть 2 символа'],
    maxLength: [30, 'Максимальная длина поля "name" должна быть 30 символов'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Поле email обязательно должно быть адресом электронной почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
