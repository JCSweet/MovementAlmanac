import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let result;

app.get("/", (req, res) => {
  res.render("index.ejs", { movement: result });
});

app.post("/searchMovement", async (req, res) => {
  const apiEndpoint = "/name/";
  const apiParams = req.body.searchMovement;
  const apiURL = `https://exercisedb.p.rapidapi.com/exercises${apiEndpoint}${apiParams}`;
  const options = {
    method: "GET",
    url: apiURL,
    params: { limit: "10" },
    headers: {
        'X-RapidAPI-Key': '41613474f1mshba26fc3ffafdfcdp12fc43jsn96ff6c9c7661',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    },
  };
  console.log(`Console Log: Sending API request to: ${apiURL}`);
  try {
    const response = await axios.request(options);
    result = response.data;
    // console.log(`Console Log: API Response: ${result}`);
    res.redirect("/");
  } catch (error) {
    console.error(`Console Log: There is an error: ${error.response}`);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server engaged on port ${port}`);
});
