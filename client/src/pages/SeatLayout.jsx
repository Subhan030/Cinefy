import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets'
import { ArrowLeft, Monitor, Clock } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
    const { id, date } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [occupiedSeats, setOccupiedSeats] = useState([])
    const [selectedTime, setSelectedTime] = useState(null)

    // Pricing configuration
    const TIERS = {
        STANDARD: { price: 150, label: 'Standard' },
        PREMIUM: { price: 250, label: 'Premium' },
        VIP: { price: 400, label: 'VIP' }
    }
    const CONVENIENCE_FEE = 20

    // Realistic Seat Configuration
    const seatLayoutConfig = [
        { tier: 'STANDARD', rows: ['A', 'B', 'C'], sections: [5, 5] }, // 2 sections of 5 seats
        { tier: 'PREMIUM', rows: ['D', 'E', 'F', 'G'], sections: [4, 8, 4] }, // 3 sections: Left-4, Center-8, Right-4
        { tier: 'VIP', rows: ['H', 'I'], sections: [8] } // 1 block of 8 seats (Recliners)
    ]

    useEffect(() => {
        const foundMovie = dummyShowsData.find(m => m.id === parseInt(id))
        setMovie(foundMovie)

        // Set default time to first available
        const times = dummyDateTimeData[date]
        if (times && times.length > 0) {
            setSelectedTime(times[0].time)
        }

        // Simulate random occupied seats
        const generateOccupiedSeats = () => {
            const occupied = []
            seatLayoutConfig.forEach(group => {
                group.rows.forEach(rowLabel => {
                    const totalSeatsInRow = group.sections.reduce((a, b) => a + b, 0)
                    const numberOfOccupied = Math.floor(Math.random() * (totalSeatsInRow / 3)) // ~30% occupancy

                    for (let i = 0; i < numberOfOccupied; i++) {
                        const randomNum = Math.floor(Math.random() * totalSeatsInRow) + 1
                        const seatId = `${rowLabel}${randomNum}`
                        if (!occupied.includes(seatId)) occupied.push(seatId)
                    }
                })
            })
            setOccupiedSeats(occupied)
        }
        generateOccupiedSeats()
    }, [id, date])

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

    if (!movie) {
        return <div className="min-h-screen bg-black" />
    }

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
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
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                            {selectedTime && ` | ${formatTime(selectedTime)}`}
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
                        <div className="flex flex-col gap-8 min-w-[600px] items-center">

                            {seatLayoutConfig.map((tierGroup, groupIndex) => (
                                <div key={groupIndex} className="flex flex-col gap-2 w-full items-center">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 border-b border-white/5 pb-1 w-full text-center">
                                        {TIERS[tierGroup.tier].label} - ₹{TIERS[tierGroup.tier].price}
                                    </div>

                                    {tierGroup.rows.map((rowLabel) => (
                                        <div key={rowLabel} className="flex items-center gap-6">
                                            <span className="w-6 text-right text-gray-500 text-xs font-medium opacity-50">{rowLabel}</span>

                                            <div className="flex items-center gap-4">
                                                {tierGroup.sections.map((sectionCount, sectionIdx) => {
                                                    // Calculate starting number for this section
                                                    let previousSeats = 0
                                                    for (let i = 0; i < sectionIdx; i++) previousSeats += tierGroup.sections[i]

                                                    return (
                                                        <div key={sectionIdx} className="flex gap-1.5 sm:gap-2">
                                                            {Array.from({ length: sectionCount }).map((_, i) => {
                                                                const seatNum = previousSeats + i + 1
                                                                const seatId = `${rowLabel}${seatNum}`
                                                                const isOccupied = occupiedSeats.includes(seatId)
                                                                const isSelected = selectedSeats.find(s => s.id === seatId)

                                                                return (
                                                                    <button
                                                                        key={seatId}
                                                                        onClick={() => handleSeatClick(seatId, TIERS[tierGroup.tier].price)}
                                                                        disabled={isOccupied}
                                                                        className={`
                                                                            rounded-t-lg rounded-b-md text-[10px] font-medium transition-all duration-300
                                                                            flex items-center justify-center border
                                                                            ${tierGroup.tier === 'VIP' ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-7 h-7 sm:w-8 sm:h-8'}
                                                                            ${isOccupied
                                                                                ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                                                                                : isSelected
                                                                                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(248,69,101,0.5)] transform scale-110'
                                                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {seatNum}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <span className="w-6 text-left text-gray-500 text-xs font-medium opacity-50">{rowLabel}</span>
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

                {/* Right Sidebar: Available Timings */}
                <div className="w-full lg:w-72 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-primary" />
                        Available Times
                    </h3>
                    <div className="flex flex-col gap-3">
                        {dummyDateTimeData[date] ? (
                            dummyDateTimeData[date].map((slot, index) => {
                                const isSelected = selectedTime === slot.time
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`w-full py-3 px-4 rounded-xl text-left transition-all duration-300 flex items-center justify-between group ${isSelected
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent hover:border-white/10'
                                            }`}
                                    >
                                        <span className="font-medium">{formatTime(slot.time)}</span>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                                    </button>
                                )
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">No other shows today.</p>
                        )}
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
                            onClick={() => toast.success("Proceeding to payment...")}
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
