import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Patrick Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
  {
    name: 'Albert Jane',
    email: 'albert@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
  {
    name: 'Nikola Jane',
    email: 'nikola@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
  {
    name: 'Mark Jake',
    email: 'jake@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
];

export default users;
