import * as dbService from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { Encrypt, Decrypt } from "../../src/common/security/encrypt.js"
import { Hash, Compare } from "../../src/common/security/hash.js"
import jwt from "jsonwebtoken"
import {OAuth2Client} from 'google-auth-library'

const client = new OAuth2Client();
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
    return res.status(500).json({message:"fail to signUP :(", error})    
}
}
export const signUpWithGmail = async (req,res,next)=>{
    try{
        const {idToken}=req.body
        

        
            const decoded = await client.verifyIdToken({
                idToken,
                audience: WEB_CLIENT_ID, 
  });
    const {family_name , given_name ,picture , email_verified ,email } = decoded.getPayload();
    let user = await dbService.findOne({ model: userModel, filter: { email: email.toLowerCase() } })
    if(!user){
        user = await dbService.create({ model: userModel, data: { fName:given_name, lName:family_name, email, profileImage:picture, provider:"google", isConfirmed:email_verified } })
    }

        const access_token = jwt.sign({id: user._id},"yousef123",{
        expiresIn: 60*5
        
    })

}
    catch (error) {
        return res.status(500).json({message: error.message ,stack: error.stack})
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
    const access_token = jwt.sign({id: user._id},"yousef123",{
        expiresIn: 60*5,
        audience: "http://localhost:4000",
        issuer: "http://localhost:3000",
        notBefore: 30,
        notTimestamp: true
    })
    const refresh_token = jwt.sign({id: user._id},"mohamed123")

    return res.status(200).json({message:"Done!",tokens:{access_token,refresh_token}})



}catch (error) {
    return res.status(500).json({message : "fail to signin :(" , error})
}
}

export const getProfile = async (req,res,next)=>{
try{
    const {token}= req.body

    if(!token){
        throw new Error("token is required :(")
    }
    const decoded = jwt.verify(token,"yousef123")


    const user = await dbService.findOne({ model: userModel, filter: { email: decoded.email.toLowerCase() } })
    if(!user){
        // return res.status(409).json({message:"email not exist :("})
        throw new Error("email not exist :(")
    }
    return res.status(200).json({message:"Done!",decoded})


}
    catch (error) {
    return res.status(500).json({message : "fail to signin :(" , error})
}
}