import { Request, Response } from "express";
import Joi from "joi";
import { APIError, AppError, ValidationError } from "../utils/app-error";
import asyncHandler from "express-async-handler";
import prisma from "../prisma/client";
import { GenerateSignature } from "../utils/index";
const SignupSchema = Joi.object().keys({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const validation_result = SignupSchema.validate(req.body);
  if (validation_result.error) {
    throw new ValidationError(
      "vaidation when signup request",
      validation_result.error.details
    );
  }
  const data = validation_result.value as {
    username: string;
    password: string;
    confirm_password: string;
    email: string;
  };
  if (data.password !== data.confirm_password) {
    throw new ValidationError("vaidation when signup request","password and confirm_password must be the same");
  }
  // check if user is already exists
  const username = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  const email = await prisma.user.findUnique({
    where:{
      email:data.email
    }
  })
  if (username !== null) {
    throw new ValidationError("vaidation when signup request", "Username already exists");
  }
  if(email !== null){
    throw new ValidationError("vaidation when signup request", "Email already exists");
  }
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
    },
  });
  res.status(200).json({
    message: "user created successfully",
    user: user,
  });
});

const SigninSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const validation_result = SigninSchema.validate(req.body);
  if (validation_result.error) {
    throw new ValidationError(
      "vaidation when signup request",
      validation_result.error.details
    );
    return;
  }
  const data = validation_result.value as {
    username: string;
    password: string;
  };
  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  if (user === null) {
    throw new ValidationError("signin request","user not found");
    return;
  }
  if (user.password !== data.password) {
    throw new ValidationError("signin request","Incorrect password");
    return;
  }
  const token = await GenerateSignature({
    username: user.username
  });
  res.status(200).json({
    message: "logged in successfully",
    token: token,
  });
});

export async function getUserDetails(req: Request, res: Response) {
  const username = req.user.username;
  const user = await prisma.user.findUnique({
    where:{
      username:username
    },
    select:{
      username:true,
      email:true,
      createdAt:true,
      Profile:true
    }
  })
  res.status(200).json({
    message:"User details fetched successfully",
    username:user?.username,
    email:user?.email,
    createdAt:user?.createdAt,
    ...user?.Profile
  })
}

const profileSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  bio: Joi.string().min(3).max(150),
  location: Joi.string(),
  website: Joi.string(),
  avatar: Joi.string(),
  banner: Joi.string(),
});

// export async function getUserProfile(req: Request, res: Response){
//     const user = req.user;
//     const profile = await prisma.profile.findUnique({
//         where:{
//             userId:user.userId;
//         }
//     })
// }

// export async function updateUserProfile(req: Request, res: Response){

// }
