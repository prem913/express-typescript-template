import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error";

import { createLogger, transports } from 'winston';
import { ConsoleColors, print } from "./console_utils";


const LogErrors = createLogger({
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'app_error.log' })
    ]
  });
    

class ErrorLogger {
    constructor(){}
    async logError(err:Error){
        print('==================== Start Error Logger ===============',"warning");
        LogErrors.log({
            private: true,
            level: 'error',
            message: `${new Date()}-${JSON.stringify(err)}`
          });
        print('==================== End Error Logger ===============','warning');
        // log error with Logger plugins
      
        return false;
    }

    isTrustError(error:any){
        if(error instanceof AppError){
            return error.isOperational;
        }else{
            return false;
        }
    }
}

const ErrorHandler = async(err:AppError,req:Request,res:Response,next:NextFunction) => {
    
    const errorLogger = new ErrorLogger();

    // process.on('uncaughtException', (reason, promise) => {
    //     console.log(reason, 'UNHANDLED');
    //     throw reason; // need to take care
    // })

    // process.on('uncaughtException', (error) => {
    //     errorLogger.logError(error);
    //     if(errorLogger.isTrustError(err)){
    //         //process exist // need restart
    //     }
    // })
    
    // console.log(err.description, '-------> DESCRIPTION')
    // console.log(err.message, '-------> MESSAGE')
    // console.log(err.name, '-------> NAME')
    if(err){
        await errorLogger.logError(err);
        if(errorLogger.isTrustError(err)){
            if(err.errorStack){
                const errorDescription = err.errorStack;
                return res.status(err.statusCode).json({'message': errorDescription})
            }
            return res.status(err.statusCode).json({'message': err.message })
        }else{
            //process exit // terriablly wrong with flow need restart
            // console.log(err.stack)
        print(err.message,"error")
        print(err.stack)
        print("server working needs refactoring",'warning')
            // res.status(500).json({'message': err.stack})
            // return;
        }
        return res.status(500).json({'message': err.message})
    }
    next();
}

export default ErrorHandler;