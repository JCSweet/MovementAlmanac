import express from "express";
import axios from "axios";

// const port = 3000;
const port = process.env.PORT;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let equipment;
let filteredResult;
let availableEquipment = [
  "band",
  "barbell",
  "body weight",
  "dumbbell",
  "kettlebell",
  "olympic barbell",
  "resistance band",
];

app.get("/", (req, res) => {
  res.render("index.ejs", { movement: filteredResult });
});

function filterResultsByEquipment(result, equipment) {
  switch (equipment) {
    case "barbell":
      result.map((exercise) => {
        if (
          exercise.equipment === "barbell" ||
          exercise.equipment === "olympic barbell"
        ) {
          return filteredResult.push(exercise);
        }
      });
      break;
    case "resistance band":
      result.map((exercise) => {
        if (
          exercise.equipment === "resistance band" ||
          exercise.equipment === "band"
        ) {
          return filteredResult.push(exercise);
        }
      });
      break;
    default:
      result.map((exercise) => {
        if (exercise.equipment === equipment) {
          return filteredResult.push(exercise);
        }
      });
      break;
  }
}

function filterResultsWithoutEquipment(result) {
  result.map((exercise) => {
    if (availableEquipment.includes(exercise.equipment)) {
      return filteredResult.push(exercise);
    }
  });
}

app.post("/searchMovement", async (req, res) => {
  const apiEndpoint = "/name/";
  const apiParams = req.body.searchMovement;
  filteredResult = [];
  equipment = req.body.equipment;
  const apiURL = `https://exercisedb.p.rapidapi.com/exercises${apiEndpoint}${apiParams}`;
  const options = {
    method: "GET",
    url: apiURL,
    params: { limit: "100" },
    headers: {
      "X-RapidAPI-Key": "41613474f1mshba26fc3ffafdfcdp12fc43jsn96ff6c9c7661",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };
  console.log(
    `Console Log: Sending API request to: ${apiURL}. Search Term: "${apiParams}". Equipment: ${equipment}`
  );
  try {
    const response = await axios.request(options);
    const result = response.data;
    if (equipment) {
      filterResultsByEquipment(result, equipment);
    } else {
      filterResultsWithoutEquipment(result);
    }
    res.redirect("/");
  } catch (error) {
    console.error(`Console Log: There is an error: ${error.response}`);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server engaged on port ${port}`);
});


// API Equipment List []
// 0:"assisted"
// 1:"band"
// 2:"barbell"
// 3:"body weight"
// 4:"bosu ball"
// 5:"cable"
// 6:"dumbbell"
// 7:"elliptical machine"
// 8:"ez barbell"
// 9:"hammer"
// 10:"kettlebell"
// 11:"leverage machine"
// 12:"medicine ball"
// 13:"olympic barbell"
// 14:"resistance band"
// 15:"roller"
// 16:"rope"
// 17:"skierg machine"
// 18:"sled machine"
// 19:"smith machine"
// 20:"stability ball"
// 21:"stationary bike"
// 22:"stepmill machine"
// 23:"tire"
// 24:"trap bar"
// 25:"upper body ergometer"
// 26:"weighted"
// 27:"wheel roller"





// API Body Part List []
// 0:"back"
// 1:"cardio"
// 2:"chest"
// 3:"lower arms"
// 4:"lower legs"
// 5:"neck"
// 6:"shoulders"
// 7:"upper arms"
// 8:"upper legs"
// 9:"waist"