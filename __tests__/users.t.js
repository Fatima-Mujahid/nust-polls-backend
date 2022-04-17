// import request from 'supertest';
// import { app } from '../app';

// describe('GET /user/login', function () {
//   test('Valid login credentials for admin', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'fatima.mujahid',
//       password: 'hello123#',
//     });
//     expect(res.status).toEqual(200);
//     expect(res.body.message).toEqual('Login successful');
//     expect(res.body.success).toEqual(true);
//     expect(res.body).toHaveProperty('data');
//     expect(res.body).toHaveProperty('token');
//   });

//   test('Valid login credentials for student', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'fatima.mujahid',
//       password: 'hello123#',
//     });
//     expect(res.status).toEqual(200);
//     expect(res.body.message).toEqual('Login successful');
//     expect(res.body.success).toEqual(true);
//     expect(res.body).toHaveProperty('data');
//     expect(res.body).toHaveProperty('token');
//   });

//   test('Invalid credentials or unregistered user', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'ahmed.ali',
//       password: 'hello87**',
//     });
//     expect(res.status).toEqual(404);
//     expect(res.body.message).toEqual('User not registered');
//     expect(res.body.success).toEqual(false);
//   });

//   test('Incorrect password', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'fatima.mujahid',
//       password: 'hello123',
//     });
//     expect(res.status).toEqual(404);
//     expect(res.body.message).toEqual('Incorrect password');
//     expect(res.body.success).toEqual(false);
//   });

//   test('Missing password', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'fatima.mujahid',
//     });
//     expect(res.status).toEqual(404);
//   });

//   test('Missing credentials', async () => {
//     const res = await request(app).post('/user/login');
//     expect(res.status).toEqual(404);
//   });

//   test('User with admin role but admin does not exist', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'sidra.munir',
//       password: 'friends65',
//     });
//     expect(res.status).toEqual(404);
//     expect(res.body.message).toEqual('Admin does not exist');
//     expect(res.body.success).toEqual(false);
//   });

//   test('User with student role but student does not exist', async () => {
//     const res = await request(app).post('/user/login').send({
//       username: 'araza.bese19seecs',
//       password: 'freedom1',
//     });
//     expect(res.status).toEqual(404);
//     expect(res.body.message).toEqual('Student does not exist');
//     expect(res.body.success).toEqual(false);
//   });
// });
