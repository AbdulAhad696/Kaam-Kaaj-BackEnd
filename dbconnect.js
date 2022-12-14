import mongoose from "mongoose";
const connection_url = "mongodb+srv://kaamkaaj:kaamkaaj123@semesterproject.g48g12p.mongodb.net/KaamKaaj?retryWrites=true&w=majority";
mongoose.connect(connection_url,(err)=>{
    if(err){
        console.log("Failed to Connect to database. Error: " + err.body);
    }
    else{
        console.log("Successfully connected to the Database!");
    }
});

export default mongoose;









