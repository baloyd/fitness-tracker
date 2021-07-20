const express = require("express");
const logger = require("morgan");
const mongojs = require("mongojs")
const mongoose = require("mongoose");
const path = require("path")
const Workout = require("./models/workout.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true,useCreateIndex: true,
useFindAndModify: false,useUnifiedTopology: true  });


//home routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/exercise', (req, res) => res.sendFile(path.join(__dirname, '/public/exercise.html')));

app.get('/stats', (req, res) => res.sendFile(path.join(__dirname, '/public/stats.html')));


//api routes

//get workouts
app.get("/api/workouts", async (req, res) => {
try{
  const workouts=await Workout.find({}).sort({day:-1});
  res.json(workouts.map(workout=>{
    return {
    ...workout.toObject(),
    totalDuration:workout.exercises.reduce((total,exercise)=>total+exercise.duration,0)
 }
 }));
} catch (err){
  console.log(err)
  res.status(500).json(err)

}

})



//create workout
app.post("/api/workouts", async (req, res) => {
  try {
    const newWorkoutData = await Workout.create(req.body);
    console.log(newWorkoutData);
    res.status(200).json(newWorkoutData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add to existing workout
app.put("/api/workouts/:id", (req, res) =>{
 Workout.findByIdAndUpdate(
    {_id: req.params.id},
    {
      $inc: {totalDuration: req.body.duration},
      $push: {exercises:req.body}
    },
    {new:true}
  ).then(workoutData =>{
    res.json(workoutData);
  }).catch(err =>{
    res.json(err)
  })
})

//get workouts in range

app.get("/api/workouts/range",async (req, res) => {

  try{
    const workouts=await Workout.find({}).sort({day:-1}).limit(7);
    
    res.json(workouts.map(workout=>{
      return {
      ...workout.toObject(),
      totalDuration:workout.exercises.reduce((total,exercise)=>total+exercise.duration,0)
   }
   }));
  } catch (err){
    console.log(err)
    res.status(500).json(err)
  
  }
  
  })


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
