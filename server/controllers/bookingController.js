import Show from "../models/Show.js"
import Booking from "../models/Bookings.js"
import User from "../models/User.js"
import { sendBookingConfirmationEmail } from "../services/emailService.js"


const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { showId, selectedSeats } = req.body;

        const isSeatsAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isSeatsAvailable) {
            return res.json({ success: false, message: "Selected seats are not available" })
        }

        const showData = await Show.findById(showId).populate('movie')
        if (!showData) {
            return res.json({ success: false, message: "Show not found" })
        }

        
        let totalAmount = 0;
        const basePrice = showData.showPrice;
        const tiers = {
            'SILVER': { rows: ['A', 'B', 'C'], extra: 0 },
            'GOLD': { rows: ['D', 'E', 'F', 'G', 'H'], extra: 100 },
            'PLATINUM': { rows: ['I'], extra: 200 }
        };

        selectedSeats.forEach(seatId => {
            const row = seatId.charAt(0);
            let seatPrice = basePrice;

            
            if (tiers.GOLD.rows.includes(row)) seatPrice += tiers.GOLD.extra;
            else if (tiers.PLATINUM.rows.includes(row)) seatPrice += tiers.PLATINUM.extra;
            

            totalAmount += seatPrice;
        });

        
        const CONVENIENCE_FEE = 20;
        if (selectedSeats.length > 0) totalAmount += CONVENIENCE_FEE;

        const createBooking = await Booking.create({
            user: userId,
            show: showId,
            amount: totalAmount,
            bookedSeats: selectedSeats
        })

        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        
        const user = await User.findById(userId)
        if (user) {
            const bookingDetails = {
                movieTitle: showData.movie.title,
                date: new Date(showData.showDateTime).toLocaleDateString(),
                time: new Date(showData.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                seats: selectedSeats.join(', '),
                amount: totalAmount,
                bookingId: createBooking._id
            }
            
            sendBookingConfirmationEmail(user.email, bookingDetails)
        }

        res.json({ success: true, createBooking })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({ success: true, occupiedSeats })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.auth;
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'show',
                populate: {
                    path: 'movie',
                    model: 'Movie'
                }
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}