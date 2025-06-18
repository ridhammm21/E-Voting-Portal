// const mongoose = require("mongoose");
// main().catch(err=> console.log(err));
// async function main(){
// await mongoose.connect("mongodb+srv://vrdeshmukh103:42kGls4W7k0bRgse@cluster0.rrazacp.mongodb.net/?retryWrites=true&w=majority").then(()=> console.log('connected to atlas')) .catch(err=>{
//     console.log(err);
// })}



// const LoginSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:true
//     },
//     name:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:Number,
//         required:true
//     },
//     confirmPassword:{
//         type:Number,
//         required:true
//     }
     
// });

// const VoterSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     year1:{
//         type:Number,
//     },
//     Div:{
//         type:String,
//     },
//     Rollno:{
//         type:Number,
//     },
//     GRno:{
//         type:Number,
//     },
// })

// const ElectionSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     department: {
//         type: String,
//         required: true
//     },
//     year: {
//         type: Number,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     }
// });

// const Election = mongoose.model("Election", ElectionSchema, 'elections');

// module.exports = Election;

// const collection =mongoose.model("LoginCollection",LoginSchema, 'logincollections');

// const voter =mongoose.model("VoterCollection",VoterSchema, 'votercollections');

// module.exports = collection;
// module.exports = voter;


const mongoose = require("mongoose");

// Connect to MongoDB Atlas
async function main() {
    try {
        await mongoose.connect("");
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}
main();

// Define LoginSchema
const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
}, { collection: 'logincollections' }); // Specify collection name

// Define VoterSchema
const VoterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year1: {
        type: Number,
        required: true
    },
    div: {
        type: String,
        required: true
    },
    Rollno: {
        type: Number,
        required: true
    },
    GRno: {
        type: Number,
        required: true
    }
}, { collection: 'votercollections' }); // Specify collection name

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    roll_no:{
        type: String,
        required: true
    },
    election_type:{
        type: String,
        required: true
    },
    // candidate_no:{
    //     type:Number,
    //     requiredtrue
    // }

}, {collection: 'candidatecollection'})

// Define ElectionSchema
const ElectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { collection: 'elections' }); // Specify collection name

const AdminSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        default:"admin"
    },
    password: {
        type: String,
        required: true,
        default: "admin123"
    }
})

const DynamicElectionSchema = new mongoose.Schema({
    // Define schema fields
    name: String,
    department: String,
    year: Number,
    description: String,
}, { collection: 'dynamic_collection_name' }); // Specify the collection name
const DynamicElection = mongoose.model("DynamicElection", DynamicElectionSchema);


// Create models
const Election = mongoose.model("Election", ElectionSchema);
const Login = mongoose.model("Login", LoginSchema);
const Voter = mongoose.model("Voter", VoterSchema);
const Candidate = mongoose.model("Candidate", CandidateSchema);
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Election, Login, Voter, Candidate, Admin, DynamicElection}; // Export models
