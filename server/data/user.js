const bcrypt = require('bcrypt');
const users = [
  {
    name: "Selvi",
    email: "selvi@example.com",
    password: bcrypt.hashSync("password123", 10),
  },
  {
    name: "Senthil",
    email: "senthil@gmail.com",
    password: bcrypt.hashSync("password456", 10),
  },
];

module.exports= users;
