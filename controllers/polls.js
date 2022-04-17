import Poll from '../models/poll.js';
import PollQues from '../models/poll-questions.js';
import Admin from '../models/admin.js'
import mongoose from 'mongoose';
import { request } from 'express';

const getPolls = async (request, response) => {
  var ObjectId = mongoose.Types.ObjectId;
 
  try {

    let admin = await Admin.findById(request.params.adminId)
    if(!admin){
      throw error
    }
    let polls = await Poll.find({ admin: new ObjectId(request.params.adminId) });
    response.send(polls);

  } catch (error) {
    response.status(500).send(error);

  }
};


async function validate(request, mode){

    if('poll_name' in request.body){
      if( request.body.poll_name.length < 15 || request.body.poll_name.length > 70){
        throw error
      }
    }

    if('description' in request.body){
      if( request.body.description.length < 25 || request.body.description.length > 200){
        console.log("Length: " + request.body.poll_name.length)
        throw error
      }
    }

    if('deadline' in request.body){
      

      let creation = null
      if(mode === "edit"){

        let poll = await Poll.findById(request.params.id);
        creation = new Date(poll.created_on);

      }
      else{
        creation = new Date(request.body.created_on);
      }

      let deadline = new Date(request.body.deadline)
      let today = new Date()
      if(deadline <= creation || deadline<today){
        throw error
      }
      

    }


}

const editPoll = async (request, response) => {

  try {
    var keys = ['poll_name', 'description','deadline']


    for(let key in request.body){
      if(!keys.includes(key)){
        throw error
      }
    }

    await validate(request,"edit")
    

    let poll = await Poll.findByIdAndUpdate(request.params.id, request.body);
    console.log(poll)
    response.send('Done');


  } catch (error) {
    response.status(500).send(error);
  }

};

const createPoll = async (request, response) => {
  var keys = ['poll_name', 'description','deadline','admin']

try{
    for(let key in request.body){
        if(!keys.includes(key)){
          throw error
        }
      }

    await validate(request,"create")

    

    var ObjectId = mongoose.Types.ObjectId;
    await Poll.create({
      admin: new ObjectId(request.body.admin),
      poll_name: request.body.poll_name,
      description: request.body.description,
      deadline: request.body.deadline,
      created_on: new Date,
    });

    response.send('Done');
  }

  catch(error){
    
    response.status(500).send(error);    

  }
  
};

const populatePoll = async (request, response) => {
  try{

    await PollQues.create(
      request.body
    )
    response.send("Done")

  } catch(err){

    console.log(err)
    response.status(500).send(error);    

  }


}

export { getPolls, createPoll, editPoll, populatePoll };
