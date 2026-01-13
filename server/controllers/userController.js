import Booking from "../models/Bookings.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";


// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.auth;
        const bookings = await Booking.find({ user: userId }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = req.auth;

        const user = await clerkClient.users.getUser(userId)
        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }
        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        }
        else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter((id) => id !== movieId)
        }
        await clerkClient.users.updateUser(userId, { privateMetadata: user.privateMetadata })
        res.json({ success: true, message: "Favorite added successfully" })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await clerkClient.users.getUser(userId)
        const favorites = user.privateMetadata.favorites || [];
        // Getting movies from database
        const movies = await Movie.find({ _id: { $in: favorites } })
        res.json({ success: true, movies })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}