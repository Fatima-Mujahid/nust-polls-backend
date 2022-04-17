import express from 'express';
import { getPolls, createPoll, editPoll, populatePoll } from '../controllers/polls.js';

const pollRoutes = express.Router({ mergeParams: true });


pollRoutes.post('/polls/create', createPoll);

pollRoutes.post('/polls/edit/:id', editPoll);

pollRoutes.post('/polls/populate', populatePoll)

pollRoutes.get('/polls/:adminId', getPolls);


export default pollRoutes;
