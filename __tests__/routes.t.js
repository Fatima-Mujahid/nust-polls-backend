import request from 'supertest';
import { app } from "../app.js"




describe('Testing Poll Fetching Route', function () {

  test('ID with Invalid Length', async () => {

    await request(app).get('/polls/62cd4fee7418ba78').then((res) => {
      expect(res.statusCode).toBe(500);

    });
    
  });

  test('ID with Invalid Format', async () => {

    await request(app).get('/polls/62cd4fee?,.,;418ba78').then((res) => {
      expect(res.statusCode).toBe(500);

    });
    
  });
  
  test('Correct Admin ID', async () => {

    await request(app).get('/polls/6238cd51ee7418ba7890b087').then((res) => {
      expect(res.statusCode).toBe(200);

    });

  });

  test('ID with a valid format that does not exist', async () => {

    await request(app).get('/polls/6238cd4fee7418ba2890b983').then((res) => {
      expect(res.statusCode).toBe(500);

    });
  
    
  });



});



describe('Testing Edit Route', function(){

  test('Editing Poll Name with Correct Length', async () => {

    await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({poll_name:"Restoring GPA Scholarship"}).then(
      (res) => {
        expect(res.statusCode).toBe(200);
      }
    );
    
  });

  test('Invalid keys in request body', async () => {

    await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({ created_on:"02-02-2026", modified:true }).then(
      (res) => {
        expect(res.statusCode).toBe(500);
      }
    );
    
  });

  test('Entering Invalid Poll ID in terms of length', async () => {

    await request(app).post('/polls/edit/625183c6a5922c18b96').send({poll_name:"Restoring GPA Scholarship"}).then(
      (res) => {
        expect(res.statusCode).toBe(500);
      }
    );
    
  });

  test('Entering Invalid Poll ID in terms of format', async () => {

    await request(app).post('/polls/edit/625183c6a5.,,,;;922c18b96').send({poll_name:"Restoring GPA Scholarship"}).then(
      (res) => {
        expect(res.statusCode).toBe(500);
      }
    );
    
  });

  test('Editing Description with Correct Length', async () => {

    await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({description:"This poll has been generated to determine whether the students of SEECS are in favour of restoring GPA scholarships."}).then(
      (res) => {
        expect(res.statusCode).toBe(200);
      }
    );
    
  });

  test('Editing Poll Name with Incorrect Length', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({poll_name:"Restor"}).then((res)=>{
      expect(res.statusCode).toBe(500);

    });
    
  });

  test('Editing Description with Incorrect Length', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({description:"Lorem Ipsum hagsi"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });
    
  });

  test('Editing Deadline which is before Creation Date', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"02-02-2020"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });
    
  });

  test('Editing Deadline which is before Current Date', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"02-02-2000"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });
    
     


  });

  test('Editing Deadline which is before Current Date', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"02-02-2000"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });


  test('Entering Deadline in Invalid Format', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"02-33-20020"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Entering Deadline in Invalid Format', async () => {

    const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"02-aa-20020"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Entering Deadline in Invalid Format', async () => {

      const res = await request(app).post('/polls/edit/625183c6a5922ce026818b96').send({deadline:"2020-12-12"}).then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });






})

describe("Testing Creation Route", function(){

  test('Correct Poll', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"625181b7d3ebdaecde92c8f1",
      poll_name:"Greatness is at its peak",
      description:"Lorem Ipsum hagsi id sjkdhjg whafhaw hfailhukka whawhlfchawh",
      deadline:"11-11-2024"
    })
    .then((res) => {
      expect(res.statusCode).toBe(200);

    });

  });

  test('Description Short in Length', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshags",
      deadline:"11-11-2024"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Poll Name Short in Length', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Great",
      description:"Lorem Ipshags wkdhqw hadhiah ihecjwejc",
      deadline:"11-11-2024"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Deadline before Creation', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshags hdgsvcs whvcwh",
      deadline:"11-11-2020"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Invalid Deadline format', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshags",
      deadline:"11-111-2024"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Invalid Deadline format', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshagnksc whciuwhcwhis",
      deadline:"11-2024-11"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Invalid Deadline Format', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshag nwkcwkch ssschwiechis",
      deadline:"11-11..-2024acc"
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Invalid Keys', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee7418ba7890b083",
      poll_name:"Greatness is peaking",
      modified:true
    })
    .then((res) => {
      expect(res.statusCode).toBe(500);

    });

  });

  test('Invalid Admin ID', async () => {

    const res = await request(app).post('/polls/create')
    .send({
      admin:"6238cd4fee748ba7...b083",
      poll_name:"Greatness is peaking",
      description:"Lorem Ipshag nwkcwkch ssschwiechis",
      deadline:"11-11..-2024acc"
    });

  });
 

})