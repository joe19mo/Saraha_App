import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
   fName:{
        type: String,
        required:true,
        trim:true,
        minLength : 2,
        maxLength : 6
   },
    lName:{
        type: String,
        required:true,
        trim:true,
        minLength : 2,
        maxLength : 6
   },
   email:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
   },
   password:{
        type:String,
        required:true,
        trim:true
   },
   age:{
        type:Number,
        required:true,
        min:18,
        max:60
   },
   gender:{
        type:String,
        enum:["male","female"],
        default:"male"
   },
   profileImage:String,
   provider:{
    type:String,
    enum:["system","google"],
    default:"system"
   },
   isConfirmed:{
        type: Boolean,
        default:false
   }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
const userModel= mongoose.models.User || mongoose.model("User", userSchema )
export default userModel