import Stripe from 'stripe'
import Show from '../models/Show.js'
import Booking from '../models/Bookings.js'


let stripe;
const getStripe = () => {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
}


const calculateAmount = (show, selectedSeats = []) => {
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    return show.showPrice * selectedSeats.length
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { showId, selectedSeats } = req.body
        const userId = req.auth.userId

        const show = await Show.findById(showId).populate('movie')
        if (!show) return res.status(404).json({ success: false, message: 'Show not found' })

        
        
        const unitAmount = show.showPrice * 100 

        
        const isAvailable = selectedSeats.every(seat => !show.occupiedSeats[seat])
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: 'some seats are already booked' })
        }

        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.auth.email, 
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${show.movie.title} - Ticket`,
                            description: `Showtime: ${new Date(show.showDateTime).toLocaleString()} | Seats: ${selectedSeats.join(', ')}`,
                            images: [show.movie.poster_path],
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: selectedSeats.length,
                },
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Convenience Fee',
                        },
                        unit_amount: 2000, 
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${process.env.VITE_BASE_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.VITE_BASE_URL || 'http://localhost:5173'}/buy-ticket/${showId}`,
            metadata: {
                showId,
                userId,
                selectedSeats: JSON.stringify(selectedSeats)
            }
        })

        res.json({ success: true, url: session.url })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body
        const session = await getStripe().checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            const { showId, userId, selectedSeats } = session.metadata
            const seats = JSON.parse(selectedSeats)

            
            const showData = await Show.findById(showId)
            const isAnySeatTaken = seats.some(seat => showData.occupiedSeats && showData.occupiedSeats[seat])

            if (isAnySeatTaken) {
                
                
                
                
                return res.json({ success: false, message: 'Seats were taken during payment process. Refund initiated.' })
            }

            
            const newBooking = await Booking.create({
                user: userId,
                show: showId,
                amount: session.amount_total / 100,
                bookedSeats: seats,
                paymentId: sessionId,
                isPaid: true
            })

            
            seats.forEach(seat => {
                if (!showData.occupiedSeats) showData.occupiedSeats = {}
                showData.occupiedSeats[seat] = userId
            })
            showData.markModified('occupiedSeats')
            await showData.save()

            res.json({ success: true, bookingId: newBooking._id })
        } else {
            res.json({ success: false, message: 'Payment not completed' })
        }
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}
