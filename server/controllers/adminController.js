import Booking from "../models/Bookings.js"
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import SystemSettings from "../models/SystemSettings.js";
// API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true })
}
// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).
            populate('movie');
        const totalUser = await User.countDocuments();
        const movies = await Movie.find({}).sort({ createdAt: -1 }).limit(5);
        const dashboardData = {
            totalRevenue: bookings.reduce((total, booking) => total + booking.amount, 0),
            totalBookings: bookings.length,
            totalActiveShows: activeShows.length,
            totalMovies: await Movie.countDocuments(),
            totalUser,
            latestMovies: movies
        }
        res.json({ success: true, dashboardData })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');
        res.json({ success: true, shows })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate({ path: 'show', populate: { path: 'movie' } }).populate('user').sort({ createdAt: 'desc' });
        res.json({ success: true, bookings })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json({ success: true, movies })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.body;
        await Movie.findByIdAndDelete(movieId);
        res.json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getSystemSettings = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        // Populate heroMovie if it exists
        if (settings.heroMovie) {
            await settings.populate('heroMovie');
        }
        res.json({ success: true, settings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const updateHeroMovie = async (req, res) => {
    try {
        const { movieId } = req.body;
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings({});
        }
        settings.heroMovie = movieId;
        await settings.save();
        res.json({ success: true, message: 'Hero movie updated successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}