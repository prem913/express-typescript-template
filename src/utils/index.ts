import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
      interface Request {
        user: ReqUser
      }
    }
  }

import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { APP_SECRET } from '../config'
import { Request } from "express";
import { ReqUser } from "../custom";

//Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password:string, salt:string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword:string,
  savedPassword:string,
  salt:string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload:Object | string | Buffer) => {
  try {
    return jwt.sign(payload, APP_SECRET as Secret, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignature = async (req:Request) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature?.split(" ")[0]);
    if(!signature) return false;
    const payload = jwt.verify(signature.split(" ")[0], APP_SECRET as Secret);
    req.user = payload as ReqUser;
    console.log("user:",payload)
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data:Object|undefined) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};