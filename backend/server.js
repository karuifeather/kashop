import mongoose from 'mongoose';
import dotenv from 'dotenv';
import 'colors';

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception! Shutting down...');
  console.log(err.name, err.message);
  console.log(err);

  process.exit(1);
});

dotenv.config();

import app from './app.js';

const DB = process.env.MONGO_URI.replace(
  '<password>',
  process.env.MONGO_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((res) =>
    console.log(`DB Connected: ${res.connection.host}`.cyan.bold.underline)
  );

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(
    `Server is now running in ${process.env.NODE_ENV} mode on port ${port}...`
      .italic.yellow
  );
});

process.on('unhandledRejection', (err) => {
  console.log('Promise rejection! Shutting down...'.bgRed);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM!!! Shutting down...'.red);
  server.close(() => {
    console.log('Processes terminated!!');
  });
});
