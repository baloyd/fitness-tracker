const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({

  day: {
    type: Date,
    default: () => new Date()
  },

  exercises: [
    {
  name: {
    type: String,
    trim:true,
    required:"Name of exercise is required"
  },

  type: {
    type:String,
    trim:true,
    required:"type of exercise is required",
    
  },

  duration: {
    type: Number,
    required:"duration of exercise is required",
  },

  weight: {
    type:Number,
    required:"weight of exercise is required",
    
  },

  sets: {
    type: Number,
    required:"number of sets is required",
  },

  reps: {
    type: Number,
    required:"number of reps is required",
  },


  
  }
]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
