import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Ticket, Calendar, Clock, MapPin, Download, Share2, ArrowLeft } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { formatRuntime, shareContent } from '../lib/utils'
import html2canvas from 'html2canvas'

const ViewTicket = () => {
    const { bookingId } = useParams()
    const navigate = useNavigate()
    const { axios, getToken } = useAppContext()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const ticketRef = useRef(null)

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = await getToken()
                // Reuse my-bookings endpoint or create a specific one. 
                // For efficiency, we'll fetch all and find one, OR fetch specific if API supports.
                // Current backend supports getUserBookings which returns all. 
                // Let's rely on that for now or assume we can filter client side.
                // Ideally, a GET /api/booking/:id would be better but to avoid backend changes right now:
                const { data } = await axios.get('/api/booking/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (data.success) {
                    const foundBooking = data.bookings.find(b => b._id === bookingId)
                    if (foundBooking) {
                        setBooking(foundBooking)
                    } else {
                        toast.error("Ticket not found")
                        navigate('/my-bookings')
                    }
                } else {
                    toast.error("Could not fetch bookings")
                }
            } catch (error) {
                console.error(error)
                toast.error("Error loading ticket")
            } finally {
                setLoading(false)
            }
        }
        fetchTicket()
    }, [bookingId, axios, getToken, navigate])

    const downloadTicket = async () => {
        if (!ticketRef.current) return
        try {
            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#000000',
                scale: 2 // Improve quality
            })
            const link = document.createElement('a')
            link.download = `Cinefy-Ticket-${bookingId}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
            toast.success("Ticket downloaded!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to download ticket")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!booking) return null

    const movie = booking.show.movie
    const date = new Date(booking.show.showDateTime).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const time = new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="min-h-screen pt-24 px-6 relative overflow-hidden bg-black text-white flex flex-col items-center">
            <BlurCircle size="w-[500px] h-[500px]" className="-left-20 top-20 opacity-10" />

            <div className="w-full max-w-4xl mb-8 flex items-center justify-between relative z-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">Your Ticket</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Ticket Container */}
            <div className="relative z-10 w-full max-w-md perspective-1000">
                <div
                    ref={ticketRef}
                    className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header Image */}
                    <div className="h-48 relative">
                        <img
                            src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                            <h2 className="text-white text-3xl font-bold leading-tight shadow-md">{movie.title}</h2>
                        </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 relative">
                        {/* Punch Holes Effect */}
                        <div className="absolute -top-3 left-0 w-full h-6 flex justify-between px-4">
                            <div className="w-6 h-6 rounded-full bg-black"></div>
                            <div className="w-6 h-6 rounded-full bg-black"></div>
                        </div>

                        <div className="flex flex-col gap-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Date</p>
                                    <p className="font-semibold text-lg flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        {new Date(booking.show.showDateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Time</p>
                                    <p className="font-semibold text-lg flex items-center gap-2">
                                        <Clock size={16} className="text-primary" />
                                        {time}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Venue</p>
                                <p className="font-semibold text-lg flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" />
                                    Cinefy Cinemas, Downtown
                                </p>
                            </div>

                            <div className="p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 text-center">Seats</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {booking.bookedSeats.map(seat => (
                                        <span key={seat} className="bg-black text-white px-3 py-1 rounded-md font-mono font-bold text-lg">
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase">Booking ID</span>
                                    <span className="font-mono text-sm">{booking._id.slice(-8).toUpperCase()}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 justify-center">

                    <button
                        onClick={() => shareContent({
                            title: `Ticket for ${movie.title}`,
                            text: `I'm going to watch ${movie.title} at Cinefy!`,
                            url: window.location.href
                        })}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                    >
                        <Share2 size={20} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewTicket
