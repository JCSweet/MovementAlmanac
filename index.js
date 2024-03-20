import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let equipment;
let filteredResult = [];
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
  switch (exercise.equipment) {
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
