import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Monitor, Clock } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {
    const { showId } = useParams()
    const navigate = useNavigate()
    const { axios, getToken, user } = useAppContext()
    const [show, setShow] = useState(null)
    const [movie, setMovie] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [occupiedSeats, setOccupiedSeats] = useState([])
    const [loading, setLoading] = useState(true)

    // Seat Config
    const basePrice = show?.showPrice || 150
    const TIERS = {
        SILVER: { price: basePrice, label: 'Silver', color: 'bg-gray-700' },
        GOLD: { price: basePrice + 100, label: 'Gold', color: 'bg-yellow-600' },
        PLATINUM: { price: basePrice + 200, label: 'Platinum', color: 'bg-purple-600' }
    }
    const CONVENIENCE_FEE = 20

    // Complex Theater Configuration
    const seatLayoutConfig = [
        // Front Section - Silver
        {
            tier: 'SILVER',
            rows: ['A', 'B', 'C'],
            sections: [6, 6], // Left 6, Right 6 (Aisle in middle)
            gap: 8
        },
        // Middle Section - Gold (Wide aisle before this)
        {
            tier: 'GOLD',
            rows: ['D', 'E', 'F', 'G', 'H'],
            sections: [6, 8, 6], // Left 6, Center 8, Right 6
            gap: 4
        },
        // Back Section - Platinum (Recliners)
        {
            tier: 'PLATINUM',
            rows: ['I'],
            sections: [10], // One big exclusive row
            gap: 0
        }
    ]

    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                const { data } = await axios.get(`/api/show/instance/${showId}`)
                if (data.success) {
                    setShow(data.show)
                    setMovie(data.show.movie)
                    const occupied = Object.keys(data.show.occupiedSeats || {})
                    setOccupiedSeats(occupied)
                } else {
                    toast.error("Show not found")
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch show details")
            } finally {
                setLoading(false)
            }
        }
        fetchShowDetails()
    }, [showId, axios, navigate])

    const handleSeatClick = (seatId, tierRate) => {
        if (occupiedSeats.includes(seatId)) return

        // Check if removing
        const existing = selectedSeats.find(s => s.id === seatId)
        if (existing) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatId))
        } else {
            if (selectedSeats.length >= 6) {
                toast.error("You can only select up to 6 seats")
                return
            }
            setSelectedSeats([...selectedSeats, { id: seatId, price: tierRate }])
        }
    }

    const totalAmount = selectedSeats.reduce((acc, seat) => acc + seat.price, 0) + (selectedSeats.length > 0 ? CONVENIENCE_FEE : 0)

    const handleBooking = async () => {
        if (!user) return toast.error('Please login to book tickets')
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/booking/create',
                { showId, selectedSeats: selectedSeats.map(s => s.id) },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                toast.success('Booking Successful!')
                navigate('/my-bookings')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Booking failed')
        }
    }

    if (loading || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const formatShowTime = (dateObj) => {
        return new Date(dateObj).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen pt-24 pb-32 px-6 relative overflow-hidden bg-black text-white">
            <BlurCircle size="w-[500px] h-[500px]" className="-left-20 top-20 opacity-10" />
            <BlurCircle size="w-[400px] h-[400px]" className="-right-20 bottom-20 opacity-10" />
            <BlurCircle size="w-[600px] h-[600px]" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

            {/* Header */}
            <div className="relative z-10 container mx-auto flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{movie.title}</h1>
                        <p className="text-sm text-gray-400">
                            {show && new Date(show.showDateTime).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                            | {show && formatShowTime(show.showDateTime)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">

                {/* Main Content (Screen & Seats) */}
                <div className="flex-1 w-full max-w-3xl">
                    {/* Screen Visual */}
                    <div className="w-full mb-12 relative group">
                        {/* Curved Screen Effect */}
                        <div className="w-full h-20 bg-gradient-to-b from-white/20 to-transparent rounded-[50%] scale-x-[1.2] border-t-4 border-primary/40 shadow-[0_10px_50px_rgba(248,69,101,0.3)] opacity-60"></div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center w-full">
                            <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-light">All eyes this way</p>
                        </div>
                    </div>

                    {/* Realistic Seat Grid */}
                    <div className="w-full overflow-x-auto pb-12 custom-scrollbar">
                        <div className="flex flex-col gap-8 min-w-[700px] items-center mx-auto">

                            {seatLayoutConfig.map((tierGroup, groupIndex) => (
                                <div key={groupIndex} className="flex flex-col gap-2 w-full items-center relative">
                                    {/* Section divider/label */}
                                    <div className="w-full text-center border-b border-white/5 pb-2 mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${tierGroup.tier === 'PLATINUM' ? 'bg-purple-500/20 text-purple-400' :
                                            tierGroup.tier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {TIERS[tierGroup.tier].label} - ₹{TIERS[tierGroup.tier].price}
                                        </span>
                                    </div>

                                    {tierGroup.rows.map((rowLabel) => (
                                        <div key={rowLabel} className="flex items-center gap-6">
                                            {/* Left Row Label */}
                                            <span className="w-6 text-right text-gray-500 text-xs font-bold opacity-60">{rowLabel}</span>

                                            <div className="flex items-center">
                                                {tierGroup.sections.map((sectionCount, sectionIdx) => {
                                                    // Calculate starting number for this section
                                                    let previousSeats = 0
                                                    for (let i = 0; i < sectionIdx; i++) previousSeats += tierGroup.sections[i]

                                                    return (
                                                        <div key={sectionIdx} className="flex gap-1.5 sm:gap-2">
                                                            {/* Aisle Spacer */}
                                                            {sectionIdx > 0 && <div style={{ width: `${tierGroup.gap * 4}px` }}></div>}

                                                            {Array.from({ length: sectionCount }).map((_, i) => {
                                                                const seatNum = previousSeats + i + 1
                                                                const seatId = `${rowLabel}${seatNum}`
                                                                const isOccupied = occupiedSeats.includes(seatId)
                                                                const isSelected = selectedSeats.find(s => s.id === seatId)

                                                                const tierColor = TIERS[tierGroup.tier].color;

                                                                return (
                                                                    <button
                                                                        key={seatId}
                                                                        onClick={() => handleSeatClick(seatId, TIERS[tierGroup.tier].price)}
                                                                        disabled={isOccupied}
                                                                        className={`
                                                                            rounded-t-lg rounded-b-md text-[10px] font-medium transition-all duration-300 relative group
                                                                            flex items-center justify-center border
                                                                            ${tierGroup.tier === 'PLATINUM' ? 'w-12 h-10 sm:w-14 sm:h-12' : 'w-7 h-7 sm:w-9 sm:h-8'}
                                                                            ${isOccupied
                                                                                ? 'bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed'
                                                                                : isSelected
                                                                                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(248,69,101,0.6)] transform scale-110 z-10'
                                                                                    : `bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10`
                                                                            }
                                                                        `}
                                                                    >
                                                                        {/* Top colored strip for tier identification on empty seats */}
                                                                        {!isOccupied && !isSelected && (
                                                                            <div className={`absolute top-0 left-0 w-full h-[3px] rounded-t-lg opacity-50 ${tierGroup.tier === 'PLATINUM' ? 'bg-purple-500' :
                                                                                tierGroup.tier === 'GOLD' ? 'bg-yellow-500' :
                                                                                    'bg-gray-500'
                                                                                }`}></div>
                                                                        )}
                                                                        {seatNum}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Right Row Label */}
                                            <span className="w-6 text-left text-gray-500 text-xs font-bold opacity-60">{rowLabel}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 md:gap-12 mb-12 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white/10 border border-white/10"></div>
                            Available
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-primary shadow-primary/40"></div>
                            Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-700 border border-gray-600"></div>
                            Sold
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Show Info */}
                <div className="w-full lg:w-72 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-primary" />
                        Show Details
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="font-medium text-white">
                                {show && new Date(show.showDateTime).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-500 mb-1">Time</p>
                            <p className="font-medium text-white">
                                {show && formatShowTime(show.showDateTime)}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-500 mb-1">Price per Ticket</p>
                            <p className="font-medium text-white">
                                Starts at ₹{TIERS.SILVER.price}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-2">Venue</p>
                        <p className="text-sm text-gray-300">Cinefy Cinemas, Downtown Hall 1</p>
                    </div>
                </div>

            </div>

            {/* Footer Summary */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-[#09090B]/90 backdrop-blur-xl border-t border-white/10 p-6 z-50">
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                <span className="text-white font-semibold">{selectedSeats.length}</span> Ticket(s) selected
                            </p>
                            <div className="text-2xl font-bold text-white flex gap-2 items-baseline">
                                ₹{totalAmount}
                                <span className="text-xs text-gray-500 font-normal">(Includes ₹{CONVENIENCE_FEE} Fee)</span>
                            </div>
                            <p className="text-xs text-gray-500">{selectedSeats.map(s => s.id).join(', ')}</p>
                        </div>
                        <button
                            className="bg-primary hover:bg-primary-dull text-white px-12 py-3 rounded-full font-bold shadow-lg shadow-primary/25 transition-all w-full md:w-auto"
                            onClick={handleBooking}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SeatLayout
