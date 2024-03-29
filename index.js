const { request } = require('express');
var express = require('express');
const session = require('express-session');
var app = express()
const port = 8080;


var mysql = require('mysql');


app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "fitverse"
});


app.use(express.json());

//Login

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('SELECT * FROM credentials WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/index.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get("/checkLogin", (req,res) => {
  if(req.session.loggedin){
    res.send({"isLoggedIn": true});
  }
  else res.send({"isLoggedIn": false})

});
app.get("/getLoginDetails", (req, res) => {
  res.send({"username": req.session.username});
});

app.get("/LogOut", (req, res) => {
  req.session.loggedin = false;
  return res.redirect("/index.html");
});
   
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
    console.log(req.body.phone)
    console.log(req.body.password);

    
        var creds = `INSERT INTO credentials VALUES ('${req.body.email}', '${req.body.password}')`;
        var userDetails = `INSERT INTO user_details VALUES ('${req.body.email}','${req.body.name}','${req.body.phone}', 0)`;
        con.query(creds, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
        con.query(userDetails, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
     
      return res.redirect('/login/login-page.html');
    
})

app.post("/putFitnessData", (req, res) => {
  var username = req.session.username;
  console.log(req.body.username);
  var calories = req.body.Daily_calories;
  var frequency = req.body.Workout_Frequency;
  var height = req.body.Height;
  var weight = req.body.Weight;
  var bmi = req.body.bmi
  var health = req.body.Health_Conditions;

  var fdetails = `INSERT INTO fitness_data values('${username}','${calories}','${frequency}','${height}','${weight}','${bmi}','${health}')`;
 
  con.query(fdetails, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  res.send("Details Updated");
});


//API to get Workout Data from db and send it to frontend
app.get("/getWorkoutData", (req, res) => {
  var type = req.query.type;
  var sql = `SELECT * FROM content WHERE cat = "${type}"`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
  
});

app.listen(port, () => {
    console.log(`The application started 
    successfully on port ${port}`);
  });