const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
var cors = require("cors");
const axios = require("axios");
 

const port = process.env.PORT || 5003;
const app = express();
 
const userName = "admin";
const userPassword = "Anthology777";
 
const auth = Buffer.from(`${userName}:${userPassword}`).toString("base64");
 
// app.get("/", (req, res) => res.send("Vanakam.   World!"));
app.use(bodyParser.json());
app.use(cors());
 
app.get("/testproxy/products/:productname", cors(), async (req, res) => {
  console.log("req is ====", req.params.productname);
 
  const name = req.params.productname || req.body.name;
  console.log("ccc",name);
  let responseMessage;

async function sonarqubeProjectName(name) {
  if (name === "operations") {
    responseMessage = await getEngageSonarQubeMetrics();
  } else if (name === "mobile") {
    responseMessage = await getMobileOverview();
  } else if (name === "CampusNexusStudent") {
    responseMessage = await getCampusNexusStudent();
  } else if (name === "operations_overview") {
    responseMessage = await getEngageSonarQubeOverview();
  } else {
    responseMessage = "No matching product found";
  }
  await res.send({ content: responseMessage });
}

sonarqubeProjectName(name);
});
 
async function getMobileOverview() {
  const response = await axios.get(
    "https://mobile.sonar.bb-fnds.com/api/measures/component?additionalFields=period%2Cmetrics&component=my-app&metricKeys=%2Cnew_bugs%2Cnew_vulnerabilities%2Cnew_security_rating%2Cnew_security_review_rating%2Cnew_code_smells%2Cnew_coverage",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
 
  return response.data;
}
 
async function getCampusNexusStudent() {
  const response = await axios.get(
    "https://operations.sonar.bb-fnds.com/api/measures/component?additionalFields=period%2Cmetrics&component=CNS329C0F36&metricKeys=alert_status%2Cnew_bugs%2Cnew_vulnerabilities%2Cnew_security_rating%2Cnew_security_hotspots%2Cnew_security_hotspots_reviewed%2Cnew_security_review_rating%2Cnew_code_smells",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
 
  return response.data;
}
 
async function getEngageSonarQubeMetrics() {
  const response = await axios.get(
    "https://operations.sonar.bb-fnds.com/api/project_analyses/search?project=CampusNexusPortal",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
 
  return response.data;
}
async function getEngageSonarQubeOverview() {
  const response = await axios.get(
    "https://operations.sonar.bb-fnds.com/api/measures/component?additionalFields=period%2Cmetrics&component=CampusNexusPortal&metricKeys=alert_status%2Cquality_gate_details%2Cbugs%2Cnew_bugs%2Creliability_rating%2Cnew_reliability_rating%2Cvulnerabilities%2Cnew_vulnerabilities%2Csecurity_rating%2Cnew_security_rating%2Csecurity_hotspots%2Cnew_security_hotspots%2Csecurity_hotspots_reviewed%2Cnew_security_hotspots_reviewed%2Csecurity_review_rating%2Cnew_security_review_rating%2Ccode_smells%2Cnew_code_smells%2Csqale_rating%2Cnew_maintainability_rating%2Csqale_index%2Cnew_technical_debt%2Ccoverage%2Cnew_coverage%2Clines_to_cover%2Cnew_lines_to_cover%2Ctests%2Cduplicated_lines_density%2Cnew_duplicated_lines_density%2Cduplicated_blocks%2Cncloc%2Cncloc_language_distribution%2Cprojects%2Clines%2Cnew_lines",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
 
  return response.data;
}
// app.listen(port, () => console.log(`Server is listening on port ${port}.`));
 
if (process.env.ENVIRONMENT === "production") {
  //   console.log("asdasds", app);
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}
// exports.handler = serverless(app);