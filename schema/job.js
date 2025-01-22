const mongoose = require('mongoose');



const job_schema = new mongoose.Schema({
    name:{
        type:String
    },
data:{
campaign_id: {
    type: String,
  },
  sequence_id: {
    type: String,
  },
  trickle_id: {
    type: String,
  }},
});
module.exports = mongoose.model('Job_', job_schema)