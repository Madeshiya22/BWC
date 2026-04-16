import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken:{
        type:String,
        default:null
    },
},
{timestamps:true}
)

const userModel = mongoose.model("User", userSchema);

export default userModel;