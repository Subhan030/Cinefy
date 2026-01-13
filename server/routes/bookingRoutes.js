import express from 'express';
import { createBooking, getOccupiedSeats, getUserBookings } from '../controllers/bookingController.js';

const bookingRouter = express.Router();
bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.get('/my-bookings', getUserBookings);
export default bookingRouter;
