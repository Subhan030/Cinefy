import express from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";

// API Routes
const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)
export default userRouter;