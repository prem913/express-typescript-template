// import { NextFunction, Request, Response } from "express";
// import { APIError, AppError, STATUS_CODES, ValidationError } from "../utils/app-error";

// const errorHandler = (err:AppError | APIError | ValidationError | Error, req:Request, res:Response, next:NextFunction) => {
//     if(err instanceof AppError || err instanceof APIError || err instanceof ValidationError ){
//         const statusCode = res.statusCode;
//         return res.status(statusCode).json({
//         message: err.message,
//         stack: err.errorStack,
//         });
//     }
//     else{
//         console.log(err.message);
//         res.sendStatus(500).json({
//             message: err.message,
//             stack:process.env.NODE_ENV === "production" ? null : err.stack,
//         })
//     }

//   };
  
// export default errorHandler;

// A better implementation is in utils/app-error.ts & utils/error-handler.ts