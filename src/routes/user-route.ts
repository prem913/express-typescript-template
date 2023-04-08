import { Router } from "express";
import {
    signUp,
    signIn,
    getUserDetails
} from '../controllers/user-controller'
import authenticateUser from '../middlewares/auth'

const router = Router();

router.post("/signup",signUp)
router.post("/signin",signIn)
router.get("/getuserdetails",authenticateUser,getUserDetails)


export default router;