import request from 'supertest';
import { app } from '../app.js';
import User from '../models/user.js';

//TESTING USER ROUTES

describe('Testing User Login Route', function () {
  test('Valid Login Credentials for Admin', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'fatima.mujahid',
      password: 'hello123#',
    });
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Login successful');
    expect(res.body.success).toEqual(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.admin.role).toEqual('admin');
  }, 10000);

  test('Valid Login Credentials for Student', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'fmujahid.bese18seecs',
      password: 'password',
    });
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Login successful');
    expect(res.body.success).toEqual(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.student.role).toEqual('student');
  }, 10000);

  test('Invalid Credentials or Unregistered User', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'ahmed.ali',
      password: 'hello87**',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('User not registered');
    expect(res.body.success).toEqual(false);
  });

  test('Incorrect Password', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'fatima.mujahid',
      password: 'hello123',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Incorrect password');
    expect(res.body.success).toEqual(false);
  });

  test('Missing Password', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'fatima.mujahid',
    });
    expect(res.status).toEqual(404);
  });

  test('Missing Credentials', async () => {
    const res = await request(app).post('/user/login');
    expect(res.status).toEqual(404);
  });

  test('User with Admin Role but Admin does not exist', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'sidra.munir',
      password: 'friends65',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Admin does not exist');
    expect(res.body.success).toEqual(false);
  });

  test('User with Student Role but Student does not exist', async () => {
    const res = await request(app).post('/user/login').send({
      username: 'araza.bese19seecs',
      password: 'freedom1',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Student does not exist');
    expect(res.body.success).toEqual(false);
  });
});

describe('Testing Forgot Password Route', function () {
  test('Valid Email to Send Reset Password Link', async () => {
    const res = await request(app).post('/user/forgotpassword').send({
      email: 'fmujahid.bese19seecs@seecs.edu.pk',
    });
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Email sent');
    expect(res.body.success).toEqual(true);
  });

  test('User with this Email does not exist', async () => {
    const res = await request(app).post('/user/forgotpassword').send({
      email: 'fatimamujahid.bese19seecs@seecs.edu.pk',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Email is not correct');
    expect(res.body.success).toEqual(false);
  });

  test('Invalid Email Format', async () => {
    const res = await request(app).post('/user/forgotpassword').send({
      email: 'fmujahid.bese19seecs',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Email is not correct');
    expect(res.body.success).toEqual(false);
  });

  test('Invalid Email Format', async () => {
    const res = await request(app).post('/user/forgotpassword').send({
      email: 'fmujahid.bese19seecs@seecs',
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Email is not correct');
    expect(res.body.success).toEqual(false);
  });
});

describe('Testing Reset Password Route', function () {
  test('Valid Reset Token and Password', async () => {
    let resetToken;
    await request(app)
      .post('/user/forgotpassword')
      .send({
        email: 'fmujahid.bese19seecs@seecs.edu.pk',
      })
      .expect(200)
      .then((res) => {
        resetToken = res.body.resetToken;
      });
    const res = await request(app)
      .put(`/user/resetpassword/${resetToken}`)
      .send({
        password: 'friends1#',
      });
    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual('Password reset success');
    expect(res.body.success).toEqual(true);
  }, 10000);

  test('Invalid Password Length', async () => {
    let resetToken;
    await request(app)
      .post('/user/forgotpassword')
      .send({
        email: 'fmujahid.bese19seecs@seecs.edu.pk',
      })
      .expect(200)
      .then((res) => {
        resetToken = res.body.resetToken;
      });
    const res = await request(app)
      .put(`/user/resetpassword/${resetToken}`)
      .send({
        password: 'friend1',
      });
    expect(res.status).toEqual(404);
  }, 10000);

  test('Invalid Password Reset Token', async () => {
    let resetToken = 'invalidtoken';
    const res = await request(app)
      .put(`/user/resetpassword/${resetToken}`)
      .send({
        password: 'friend11',
      });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Invalid token');
  }, 10000);

  test('Expired Password Reset Token', async () => {
    let resetToken;
    let email = 'fmujahid.bese19seecs@seecs.edu.pk';
    await request(app)
      .post('/user/forgotpassword')
      .send({ email })
      .expect(200)
      .then((res) => {
        resetToken = res.body.resetToken;
      });
    const user = await User.findOne({ email });
    user.resetPasswordExpire = Date.now();
    await user.save();
    const res = await request(app)
      .put(`/user/resetpassword/${resetToken}`)
      .send({
        password: 'friends2#',
      });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Invalid token');
  }, 10000);
});

//TESTING POLLS ROUTES

describe('Testing Poll Fetching Route', function () {
  test('ID with Invalid Length', async () => {
    await request(app)
      .get('/polls/62cd4fee7418ba78')
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('ID with Invalid Format', async () => {
    await request(app)
      .get('/polls/62cd4fee?,.,;418ba78')
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Correct Admin ID', async () => {
    await request(app)
      .get('/polls/6238cd51ee7418ba7890b087')
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  test('ID with a valid format that does not exist', async () => {
    await request(app)
      .get('/polls/6238cd4fee7418ba2890b983')
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });
});

describe('Testing Edit Route', function () {
  test('Editing Poll Name with Correct Length', async () => {
    await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ poll_name: 'Restoring GPA Scholarship' })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  
  test('Invalid keys in request body', async () => {
    await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ created_on: '02-02-2026', modified: true })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Editing Poll with Valid Deadline', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '02-02-2029' })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  test('Entering Invalid Poll ID in terms of length', async () => {
    await request(app)
      .post('/polls/edit/625183c6a5922c18b96')
      .send({ poll_name: 'Restoring GPA Scholarship' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Entering Invalid Poll ID in terms of format', async () => {
    await request(app)
      .post('/polls/edit/625183c6a5.,,,;;922c18b96')
      .send({ poll_name: 'Restoring GPA Scholarship' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Editing Description with Correct Length', async () => {
    await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({
        description:
          'This poll has been generated to determine whether the students of SEECS are in favour of restoring GPA scholarships.',
      })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  test('Editing Poll Name with Incorrect Length', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ poll_name: 'Restor' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Editing Description with Incorrect Length', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ description: 'Lorem Ipsum hagsi' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Editing Deadline which is before Creation Date', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '02-02-2020' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });



  test('Editing Deadline which is before Current Date', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '02-02-2000' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Entering Deadline in Invalid Format', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '02-33-20020' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Entering Deadline in Invalid Format', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '02-aa-20020' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Entering Deadline in Invalid Format', async () => {
    const res = await request(app)
      .post('/polls/edit/625183c6a5922ce026818b96')
      .send({ deadline: '2020-12-12' })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });
});

describe('Testing Creation Route', function () {
  test('Correct Poll', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '625181b7d3ebdaecde92c8f1',
        poll_name: 'Greatness is at its peak',
        description:
          'Lorem Ipsum hagsi id sjkdhjg whafhaw hfailhukka whawhlfchawh',
        deadline: '11-11-2024',
      })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  test('Description Short in Length', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        description: 'Lorem Ipshags',
        deadline: '11-11-2024',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Poll Name Short in Length', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Great',
        description: 'Lorem Ipshags wkdhqw hadhiah ihecjwejc',
        deadline: '11-11-2024',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Deadline before Creation', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        description: 'Lorem Ipshags hdgsvcs whvcwh',
        deadline: '11-11-2020',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Invalid Deadline format', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        description: 'Lorem Ipshags',
        deadline: '11-111-2024',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Invalid Deadline format', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        description: 'Lorem Ipshagnksc whciuwhcwhis',
        deadline: '11-2024-11',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Invalid Deadline Format', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        description: 'Lorem Ipshag nwkcwkch ssschwiechis',
        deadline: '11-11..-2024acc',
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Invalid Keys', async () => {
    const res = await request(app)
      .post('/polls/create')
      .send({
        admin: '6238cd4fee7418ba7890b083',
        poll_name: 'Greatness is peaking',
        modified: true,
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test('Invalid Admin ID', async () => {
    const res = await request(app).post('/polls/create').send({
      admin: '6238cd4fee748ba7...b083',
      poll_name: 'Greatness is peaking',
      description: 'Lorem Ipshag nwkcwkch ssschwiechis',
      deadline: '11-11..-2024acc',
    });
  });
});
