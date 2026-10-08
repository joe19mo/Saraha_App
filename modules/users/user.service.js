import * as dbService from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { Encrypt, Decrypt } from "../../src/common/security/encrypt.js"
import { Hash, Compare } from "../../src/common/security/hash.js"




export const signUp = async (req,res,next)=>{
try {
    const {fName,lName, email,password, age , gender, phone} = req.body
    const emaiExist = await userModel.findOne({email: email.toLowerCase()})
    if (emaiExist){
        // return res.status(409).json({message:"email allready exists"})
        // next(new Error("email allready exists"))
        throw new Error("email allready exists")
    }

    const user = await dbService.create({ model: userModel, data: { fName, lName, email, password: await Hash(password), age, gender, phone:Encrypt(phone) } })
    return res.status(201).json({message:"Done!",user})
} catch (error) {
    return res.status(500).json({message:"fail to signUP :(",error})    
}
}
export const signIn = async (req,res,next)=>{
try{
    const {email,password}= req.body
    const user = await dbService.findOne({ model: userModel, filter: { email: email.toLowerCase() } })
    if(!user){
        // return res.status(409).json({message:"email not exist :("})
        throw new Error("email not exist :(")
    }
    // if(user.isConfirmed !== true){
    //     // return res.status(400).json({message:"email not consirmed yet :("})
    //     throw new Error("email not confirmed yet :(")

    // }
    if(!await Compare(password,user.password)){
        // return res.status(409).json({message:"wrong password :("})
        throw new Error("wrong password :(")

    }
    return res.status(200).json({message:"Done!",user:{...user._doc, phone:Decrypt(user.phone)}})



}catch (error) {
    return res.status(500).json({message : "fail to signin :(" , error})
}
}

