import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import BlurCircle from '../components/BlurCircle'
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const MyBookings = () => {
    const { axios, getToken, user } = useAppContext()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoading(false)
                return
            }
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/booking/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (data.success) {
                    setBookings(data.bookings)
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch bookings")
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [user])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden bg-black text-white">
            <BlurCircle size="w-[500px] h-[500px]" className="-left-20 top-20 opacity-10" />

            <h1 className="text-3xl md:text-4xl font-bold mb-12 relative z-10 flex items-center gap-3">
                <Ticket className="text-primary" size={36} />
                My Bookings
            </h1>

            {!user ? (
                <div className="relative z-10 text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xl text-gray-400 mb-4">Please login to view your bookings</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="relative z-10 text-center py-20 bg-white/5 rounded-2xl border border-white/10 opacity-70">
                    <p className="text-xl text-gray-400 mb-4">You haven't booked any tickets yet.</p>
                    <button onClick={() => navigate('/movies')} className="text-primary hover:text-white transition-colors underline">
                        Browse Movies
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6 relative z-10 max-w-4xl">
                    {bookings.map((booking) => {
                        const movie = booking.show?.movie
                        const showDateTime = booking.show?.showDateTime

                        // Skip if legacy data without show details
                        if (!movie || !showDateTime) return null

                        const date = new Date(showDateTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        const time = new Date(showDateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })

                        return (
                            <div
                                key={booking._id}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:bg-white/[0.07] transition-colors group"
                            >
                                {/* Movie Poster */}
                                <div className="w-full md:w-48 h-64 md:h-auto flex-shrink-0 relative overflow-hidden">
                                    <img
                                        src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Ticket Details */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-2xl font-bold line-clamp-1">{movie.title}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                Confirmed
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-300 mb-6">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} className="text-primary" />
                                                <span>{date}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-primary" />
                                                <span>{time}</span>
                                            </div>
                                            <div className="flex items-center gap-3 md:col-span-2">
                                                <MapPin size={18} className="text-primary" />
                                                <span>Cinefy Cinemas, Downtown Hall 1</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="text-gray-400 text-sm">Seats:</span>
                                            {booking.bookedSeats.map(seat => (
                                                <span key={seat} className="bg-white/10 px-2 py-0.5 rounded text-sm font-mono">
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Total Amount</p>
                                            <p className="text-xl font-bold">₹{booking.amount}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/ticket/${booking._id}`)}
                                            className="text-sm text-primary hover:text-white underline transition-colors"
                                        >
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MyBookings
