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
        console.log('Incorrect Username and/or Password!')
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


//Add workouts
app.post('/putWorkout', (req, res) => {

  var fdetails = `INSERT INTO content values('${req.session.username}','${req.body.WorkoutName}','${req.body.GIFPath}','${req.body.Sets}','${req.body.Reps}','${req.body.rdbCategory}')`;

  con.query(fdetails, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  
  res.redirect('/drills/drills_user.html')

  
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

//Get All WorkoutData
app.get("/getAllWorkoutData", (req, res) => {
  var sql = `SELECT * FROM content`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
  
});

//API to redirect to login or add content page
app.get("/addContentRedirect", (req, res) => {
  if(req.session.loggedin){
    res.redirect('/drills/Add_workouts.html');
  }
  else res.redirect('/login/login-page.html');
});

//Check Mod access and redirect
app.get("/moderateRedirect", (req, res) => {

  if(req.session.loggedin) {
    con.query(`SELECT * FROM mods WHERE email= "${req.session.username}";`, function (err, result) {
      if (err) throw err;
      if (result.length > 0) res.redirect('/drills/modtools.html');
      else { 
        res.send("You are not a moderator. Only users with moderator role can moderate content.");
      }
    });
  }

  else res.redirect('/login/login-page.html');
  
});


//Get List of Users for Moderation
app.get('/getUserList', (req, res) => {
  var sql = `SELECT * FROM credentials`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
})

//Delete Users Using ModTools
app.get('/deleteUser', (req, res) => {
  var user = req.query.username;

  var query = `DELETE FROM credentials WHERE email = "${user}";`

  con.query(query, function (err, result) {
    if (err) throw err;
    console.log(`Deleted User ${user}`);
  });


  res.redirect('/drills/modtools.html');
})

//Get Posts from a particulat user
app.get('/getUserPosts', (req, res) => {
  var user = req.query.username;
  var sql = `SELECT * FROM content WHERE email = "${user}"`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

//Delete a Post
app.get('/deleteUserPosts', (req, res) => {
  var post = req.query.postname;
  var sql = `DELETE FROM content WHERE name = "${post}"`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

app.listen(port, () => {
    console.log(`The application started 
    successfully on port ${port}`);
  });