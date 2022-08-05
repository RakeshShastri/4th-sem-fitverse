var express = require('express')
var app = express()
const port = 8080;

var mysql = require('mysql');

//database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test"
});

app.use(express.json());
   
// For serving static HTML files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
   
app.get("/", (req, res) => {
  res.set({
    "Allow-access-Allow-Origin": "*",
  });
     
  // res.send("Hello World");
  return res.redirect("index.html");
});

//Post Request Handler for recieving data
app.post("/SignUpForm", (req, res) => {
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.phone);

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO test VALUES ('${req.body.name}', '${req.body.email}', '${req.body.phone}' )`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    
})

//API to get Workout Data from db and send it to frontend
app.get("/getWorkoutData", (req, res) => {
  var type = req.query.type;
  var sql = `SELECT * FROM data WHERE cat = "${type}"`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
  
});

app.listen(port, () => {
    console.log(`The application started 
    successfully on port ${port}`);
  });