import React from 'react'
import { dummyBookingData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react'

const MyBookings = () => {
    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden bg-black text-white">
            <BlurCircle size="w-[500px] h-[500px]" className="-left-20 top-20 opacity-10" />

            <h1 className="text-3xl md:text-4xl font-bold mb-12 relative z-10 flex items-center gap-3">
                <Ticket className="text-primary" size={36} />
                My Bookings
            </h1>

            <div className="flex flex-col gap-6 relative z-10 max-w-4xl">
                {dummyBookingData.map((booking) => {
                    const { movie, showDateTime } = booking.show
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
                                    src={movie.poster_path}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Ticket Details */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold line-clamp-1">{movie.title}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${booking.isPaid
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {booking.isPaid ? 'Confirmed' : 'Pending'}
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
                                    <button className="text-sm text-primary hover:text-white underline transition-colors">
                                        View Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyBookings
