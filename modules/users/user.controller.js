import { Router } from "express";
import * as US from "./user.service.js"
const userRouter = Router();

userRouter.post("/signUp",US.signUp)
userRouter.post("/signUp/Gmail",US.signUpWithGmail)
userRouter.post("/signIn",US.signIn)
userRouter.post("/profile",US.getProfile)




export default userRouter;