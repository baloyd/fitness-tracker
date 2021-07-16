const express = require("express");
const logger = require("morgan");
const mongojs = require("mongojs")
const mongoose = require("mongoose");
const path = require("path")
const Workout = require("./models/workout.js");

const PORT = process.env.PORT || 3000;


const { db } = require("./models/workout.js");

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
app.get("/api/workouts", (req, res) => {
  db.Workout.find({}, (err, data) =>{
    dbWorkout.forEach(workout =>{
      var total=0;
      workout.exercises.forEach(e =>{
        total += e.duration;
      });
      workout.totalDuration = total;
    });
    if(err) {
      res.sendStatus(500);
    }else {
      res.json(data)
    }
  })
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
  db.Workout.findOneAndUpdate(
    {_id: req.params.id},
    {
      $inc: {totalDuration: req.body.duration},
      $push: {exercises:req.body}
    },
    {new:true}
  ).then(dbWorkout =>{
    res.json(dbWorkout);
  }).catch(err =>{
    res.json(err)
  })
})

//get workouts in range

// app.get("/api/workouts/range", (req, res) =>{

// })

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
