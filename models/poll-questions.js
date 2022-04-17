import mongoose from 'mongoose';

const pollQSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
  },
  text_based: {
    type: mongoose.Schema.Types.Array
  },
  mcq: {
    type: mongoose.Schema.Types.Array
    
  }
  
});

const PollQues = mongoose.model('Poll-questions', pollQSchema);

export default PollQues;
