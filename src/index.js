const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require('mongoose')

// const dbConnection = require('./mongodb');
// const path = require ("path");
// const Collection = require("./mongodb")
// const Voter = require("./mongodb")
// const Election = require("./mongodb");

const { Election, Login, Voter, Candidate, Admin } = require("./mongodb");

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/src")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/portal", async (req, res) => {
  res.render("portal");
});

app.get("/portal1", async (req, res) => {
  res.render("portal1");
});

app.get("/indexx", async (req, res) => {
  res.render("indexx");
});

// app.get("/admin", async (req, res) => {
//   res.render("admin");
// });

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/signup", async (req, res) => {
  console.log("a");
  console.log(req.body.username);
  bcrypt.hash(req.body.spassword,10,function (err,hash) {
    const newUser = new Login({
      email: req.body.semail,
      name: req.body.name,
      password: hash,
      confirmPassword: hash,
    });
    async function saveUser() {
      try {
        await newUser.save();
        // console.log("nearly inside");
        res.render("indexx");
        // res.send("yoo")
      } catch (err) {
        res.status(400).json("validation error");
  
        console.log(err);
      }
    }
    saveUser();
    
  })
  //   res.render("home");
});

app.post("/login", async (req, res) => {
  try {
    const user = await Login.findOne({ email: req.body.lemail });
    
    if (!user) {
      return res.render("index", { message: "Login failed. User not found." });
    }

    bcrypt.compare(req.body.lpassword, user.password, function(err, result) {
      if (err) {
        console.error(err);
        return res.send("Error occurred");
      }

      if (result) {
        return res.render("indexx", { message: "Login successful" });
      } else {
        return res.render("index", { message: "Login failed. Password does not match." });
      }
    });
  } catch (error) {
    console.error(error);
    res.send("Error occurred");
  } 
});

app.post("/adminlogin", async (req, res) => {
  try {
      const { user_name, password } = req.body;
      const elections = await Election.find();
      // Validate admin credentials
      if (user_name === "admin" && password === "admin123") {
          // Admin authentication successful
          res.render("admin", { elections: elections })
      } else {
          // Admin authentication failed
          res.render({ error: "Invalid username or password" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Error occurred");
  }
});


app.post("/voterlogin", async (req, res) => {
  try {
    console.log(req.body.name); // Corrected field name
    const newVoter = new Voter({
      name: req.body.name, // Corrected field name
      year1: req.body.year1, // Corrected field name
      div: req.body.div, // Corrected field name
      Rollno: req.body.Rollno, // Corrected field name
      GRno: req.body.GRno, // Corrected field name
    });

    async function saveUser() {
      try {
        await newVoter.save();
        await res.render("portal");
      } catch (err) {
        console.error(err);
        res.status(400).json("Validation error");
      }
    }
    saveUser();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/Election", async (req, res) => {
//   try {
//     console.log("Request Body:", req.body); // Log the request body for debugging
//     const newElection = new Election({
//       name: req.body.name,
//       department: req.body.department,
//       year: req.body.year,
//       description: req.body.description,
//     });
//     await newElection.save();
//     console.log("Election saved successfully"); // Log success message for debugging
//     const elections = await Election.find({}, 'name');
//     res.render("admin", { elections: elections });
//   } catch (err) {
//     console.error("Error:", err); // Log any errors for debugging
//     res.status(400).json({ error: "Validation error" });
//   }
// });


app.post("/Election", async (req, res) => {
  try {
    const { name, department, year, description } = req.body;
    const collectionName = name.replace(/\s+/g, '').toLowerCase();// Generate collection name

    console.log("Request Body:", req.body); // Log the request body for debugging
    const neElection = new Election({
      name: req.body.name,
      department: req.body.department,
      year: req.body.year,
      description: req.body.description,
    });
    await neElection.save()

    // Define a new schema for the dynamic election collection
    const DynamicElectionSchema = new mongoose.Schema({
      name: String,
      department: String,
      year: Number,
      description: String,
    }, { collection: collectionName }); // Specify the collection name
    
    // Check if the model for this collection already exists
    let DynamicElection;
    if (mongoose.models[collectionName]) {
      DynamicElection = mongoose.model(collectionName);
    } else {
      // Create a new model for the dynamic election collection
      DynamicElection = mongoose.model(collectionName, DynamicElectionSchema);
    }
    
    // Create a new election instance
    const newElection = new DynamicElection({
      name: name,
      department: department,
      year: year,
      description: description,
    });
    
    await newElection.save(); // Save the new election to the dynamic collection
    
    const elections = await DynamicElection.find({}, 'name description');
    
    res.render("admin", { elections: elections }); // Redirect to the admin page or any other appropriate action
  } catch (error) {
    console.error("Error saving election:", error); // Log the error for debugging
    res.status(500).send("Internal Server Error");
  }
});

// const ensureDynamicElectionDefined = () => {
//   return new Promise((resolve, reject) => {
//     if (!DynamicElection) {
//       reject(new Error('DynamicElection is not defined'));
//     } else {
//       resolve();
//     }
//   });
// };

app.get("/admin", async (req, res) => {
  try {
    // await ensureDynamicElectionDefined();
    const elections = await Election.find({}, 'name description'); // Assuming you fetch elections from MongoDB
    res.render("admin", { elections: elections }); // Pass elections to the admin.ejs template
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/admin2", async (req, res) => {
  try {
    const elections = await Election.find(); // Fetch all elections from the database
    const candidates = await Candidate.find(); // Fetch all candidates from the database


    res.render("admin2", { elections: elections, candidates: candidates});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



app.post("/Candidate", async (req, res) => {
  try {
    const { name, email, department, year, roll_no, election_type } = req.body;

    // Find the selected election in the database
    const selectedElection = await Election.findOne({ name: election_type });

    if (!selectedElection) {
      // If the selected election is not found, handle the error accordingly
      console.error("Selected election not found:", election_type);
      return res.status(404).send("Selected election not found");
    }

    // Create a new candidate instance
    const newCandidate = new Candidate({
      name: name,
      email: email,
      department: department,
      year: year,
      roll_no: roll_no,
      election_type: election_type,
    });

    // Save the new candidate to the database
    await newCandidate.save();

    if (!selectedElection.candidates) {
      // Initialize candidates array if it doesn't exist
      selectedElection.candidates = [];
    }

    // Associate the candidate with the selected election
    selectedElection.candidates.push(newCandidate);
    await selectedElection.save();

    // Redirect the user or send a response indicating success
    res.redirect("/admin"); // Redirect to the admin2 page or any other appropriate action
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/api/elections', async (req, res) => {
  try {
      // Fetch all elections from the database
      const elections = await Election.find();
      // Return election data as JSON response with cache-control headers
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.json(elections);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/candidatecollection', async (req, res) => {
  try {
      const candidatecollection = await Candidate.find();
      // Return election data as JSON response with cache-control headers
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.json(candidatecollection);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



//RIDHAM

require('dotenv').config();
// const express = require('express');
const fileUpload = require('express-fileupload');
app.use(
    fileUpload({
        extended:true
    })
)
app.use(express.static(__dirname));
app.use(express.json());
// const path = require("path");
const ethers = require('ethers');

// var port = 3000;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const {abi} = require('./artifacts/contracts/Voting.sol/Voting.json');
const provider = new ethers.providers.JsonRpcProvider(API_URL);

console.log(CONTRACT_ADDRESS);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/vote", async (req, res) => {
    var vote = req.body.vote;
    console.log(vote)
    async function storeDataInBlockchain(vote) {
        console.log("Adding the candidate in voting contract...");
        const tx = await contractInstance.addCandidate(vote);
        await tx.wait();
    }
    const bool = await contractInstance.getVotingStatus();
    if (bool == true) {
        await storeDataInBlockchain(vote);
        res.send("The candidate has been registered in the smart contract");
    }
    else {
        res.send("Voting is finished");
    }
});

// app.listen(4000, function () {
//     console.log("App is listening on port 3000")
// });



app.listen(4000, function () {
  console.log("Server started on port 4000");
});
