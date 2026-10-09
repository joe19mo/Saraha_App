import express from 'express';
import ConnectionDB from '../DB/connectionDB.js';
import userRouter from '../modules/users/user.controller.js';
import cors from "cors"

const app = express();
const port = 3000;


await ConnectionDB()
const bootstrap = async()=>{
    app.use(cors())
    app.use(express.json())


    app.get('/', (req, res) => res.status(200).json({message:"welcome on saraha app :)"}))
    app.use("/users", userRouter);

    app.use("/*demo",(req,res,next)=>{
    // res.status(404).json({meassage:"error 404 not found"})
    throw new Error(`URL ${req.originalUrl} not found on this server!`, { cause: 404 });

})
    app.use((err, req, res, next) =>{
    console.log(err);
    res.status(err.cause||500).json({ message: err.message , stack: err.stack });
});
    app.listen(port, () => console.log(`server is running on port ${port}......`))

}
export default bootstrap;