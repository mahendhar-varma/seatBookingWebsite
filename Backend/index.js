const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "seatingArrangementDB.db");

const app = express();
app.use(express.json());

module.exports = app;

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server started successfully at http://localhost:3001");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/seats", async (request, response) => {
  const getSeatsDetailsQuery = `
        SELECT * 
        FROM seats;
    `;

  const seatsArray = await db.all(getSeatsDetailsQuery);
  const QRowData = seatsArray.filter((item) => item.row === "Q");
  const PRowData = seatsArray.filter((item) => item.row === "P");
  const NRowData = seatsArray.filter((item) => item.row === "N");
  const MRowData = seatsArray.filter((item) => item.row === "M");
  const LRowData = seatsArray.filter((item) => item.row === "L");
  const KRowData = seatsArray.filter((item) => item.row === "K");
  const JRowData = seatsArray.filter((item) => item.row === "J");
  const HRowData = seatsArray.filter((item) => item.row === "H");
  const GRowData = seatsArray.filter((item) => item.row === "G");
  const FRowData = seatsArray.filter((item) => item.row === "F");
  const ERowData = seatsArray.filter((item) => item.row === "E");
  const dataToSendUser = [
    { rowName: "Q", rowData: QRowData },
    { rowName: "P", rowData: PRowData },
    { rowName: "N", rowData: NRowData },
    { rowName: "M", rowData: MRowData },
    { rowName: "L", rowData: LRowData },
    { rowName: "K", rowData: KRowData },
    { rowName: "J", rowData: JRowData },
    { rowName: "H", rowData: HRowData },
    { rowName: "G", rowData: GRowData },
    { rowName: "F", rowData: FRowData },
    { rowName: "E", rowData: ERowData },
  ];
  console.log(dataToSendUser);
  response.send(dataToSendUser);
});

app.put("/book-seats", async (request, response) => {
  const requestBody = request.body;
  const idList = Object.values(requestBody);
  const status = true;
  idList.map(item => {
        const updateQuery = `
        UPDATE 
            seats 
        SET 
           status = '${status}'
        WHERE 
           id = '${item}';
    `;

  await db.run(updateQuery);
  })
  response.send("Updated Successfully");
});
