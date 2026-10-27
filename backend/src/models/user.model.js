import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"fullName is required"]
        
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email should be unique"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false,
        
    },
    isVerified:{
        type:Boolean,
        default:false,
    }
},{
    timestamps:true
});

const userModel = mongoose.model("users",userSchema);

export default userModel;