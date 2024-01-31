const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const axios = require("axios");
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

// app.get("/", (req, res) => res.send("Vanakam.   World!"));

app.get("/testproxy/products/:productname", async (req, res) => {
  console.log("req is ====", req.params.productname);

  const name = req.params.productname || req.body.name;

  let responseMessage;

  if (name === "operations") {
    responseMessage = await getEngageSonarQubeMetrics();
  } else {
    responseMessage = "No matching product found";
  }
  res.send({ content: responseMessage });
});

async function getEngageSonarQubeMetrics() {
  const userName = "admin";
  const userPassword = "Anthology777";

  const auth = Buffer.from(`${userName}:${userPassword}`).toString("base64");

  const response = await axios.get(
    "https://operations.sonar.bb-fnds.com/api/project_analyses/search?project=CampusNexusPortal",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  return response.data;
}

// app.listen(port, () => console.log(`Server is listening on port ${port}.`));

if (process.env.ENVIRONMENT === "production") {
  console.log("asdasds", app);
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}
// exports.handler = serverless(app);
