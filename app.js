import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';
// import Admin from './models/admin.js';
// import Student from './models/student.js';
import userRoutes from './routes/users.js';
import pollRoutes from './routes/polls.js';

//APP CONFIG

dotenv.config({ path: '.env' });
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
  })
);
app.use(morgan('tiny'));
app.use(passport.initialize());

//DATABASE CONNECT

mongoose.connect(process.env.CONNECTION_URL).then((connection) => {
  console.log(
    `Connected to Mongo database "${connection.connections[0].name}"`
  );
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err, false, { message: err.message });
      }
      if (!user) {
        return done(null, false, { message: 'User not registered' });
      }
      if (!User.checkPassword(password, user.password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user, { message: 'Login successful' });
    });
  })
);

// app.get('/', (req, res, next) => {
//   res.send('Hello World');
// });

// app.post('/user', (req, res, next) => {
//   console.log('in post');
//   User.create(req.body)
//     .then((data) => {
//       res.status(200).json({ data: data });
//     })
//     .catch((error) => {
//       res.status(500).json({ message: error.message });
//     });
// });

// app.get('/user', (req, res, next) => {
//   User.find({})
//     .then((data) => {
//       res.send(data);
//       console.log(data);
//     })
//     .catch((error) => {
//       res.send(error);
//       console.log(error);
//     });
// });

//SAMPLE DATABASE RECORDS

// User.create({
//   firstName: 'Fatima',
//   lastName: 'Mujahid',
//   email: 'fatimamujahid12@gmail.com',
//   username: 'fatima.mujahid12',
//   password: 'password',
//   role: 'admin',
// })
//   .then((data) => {
//     console.log(data);
//     Admin.create({ admin: data._id, title: 'DD in NUST Main Office' })
//       .then((data) => {
//         console.log('SUCCESS', data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// User.create({
//   firstName: 'Fatima',
//   lastName: 'Mujahid',
//   email: 'fmujahid.msds21seecs@seecs.edu.pk',
//   username: 'fmujahid.msds21seecs',
//   password: 'password',
//   role: 'student',
// })
//   .then((data) => {
//     console.log(data);
//     Student.create({
//       student: data._id,
//       batch: '2021',
//       degree: 'MSDS',
//       section: '6B',
//       school: 'SEECS',
//       department: 'DoC',
//       status: 'Dayscholar',
//       transport: { pickAndDrop: true, route: 'IJP Road' },
//       societies: [{name: 'NXC' , designation: 'Executive'}]
//     })
//       .then((data) => {
//         console.log('SUCCESS', data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//ROUTES

app.use('/user', userRoutes);
app.use('', pollRoutes);

//SERVER LISTEN

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

console.log("run")
export { app };


//DATABASE ERROR

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error ${err}`);
  server.close(() => {
    process.exit(1);
  });
});


