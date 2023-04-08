import express,{Express} from 'express';
import cors from 'cors';
import userRouter from './routes/user-route'
import HandleErrors from './utils/error-handler';
import errorHandler from './middlewares/error-handler';


export default async (app:Express) => {
    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    app.use('/user',userRouter);
    app.get('/',(req,res)=>{
        res.status(200).send("hello world!");
    })
    // error handling
    app.use(HandleErrors);

    
}