import express from "express";
import { getAllBookings, getAllShows, getDashboardData, isAdmin, getAllMovies, deleteMovie, getSystemSettings, updateHeroMovie } from "../controllers/adminController.js"
import { protectAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();
adminRouter.get('/is-admin', protectAdmin, isAdmin)
adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/all-shows', protectAdmin, getAllShows)
adminRouter.get('/all-bookings', protectAdmin, getAllBookings)
adminRouter.get('/all-movies', protectAdmin, getAllMovies)
adminRouter.post('/delete-movie', protectAdmin, deleteMovie)
adminRouter.get('/settings', protectAdmin, getSystemSettings)
adminRouter.post('/update-hero-movie', protectAdmin, updateHeroMovie)

export default adminRouter;