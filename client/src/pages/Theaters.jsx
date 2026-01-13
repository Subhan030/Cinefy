import React from 'react'
import BlurCircle from '../components/BlurCircle'
import { MapPin, Phone, Star, Armchair, Coffee, Ticket, Info, Film } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

import downtownCinema from '../assets/downtown_cinema.png'

const Theaters = () => {
    const navigate = useNavigate()
    const { shows } = useAppContext()

    const theaters = [
        {
            id: 1,
            name: "Cinefy Cinemas - Downtown",
            address: "123 Cinema Boulevard, Downtown District, Metropolis",
            rating: 4.8,
            reviews: "2.4k",
            distance: "1.2 km",
            amenities: ["Dolby Atmos", "IMAX", "Recliners", "Gourmet Food Court"],
            image: downtownCinema,
            status: "Open Now"
        },
        {
            id: 2,
            name: "Cinefy Luxe - Westside",
            address: "45 West Avenue, Shopping Mall, Westside",
            rating: 4.6,
            reviews: "850",
            distance: "5.8 km",
            amenities: ["4DX", "Laser Projection", "VIP Lounge"],
            image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
            status: "Open Now"
        },
        {
            id: 3,
            name: "Cinefy Drive-In",
            address: "Old Highway Road, Outskirts",
            rating: 4.5,
            reviews: "420",
            distance: "12 km",
            amenities: ["Outdoor Screen", "Car Service", "Pet Friendly"],
            image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
            status: "Opens at 6:00 PM"
        }
    ]

    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden bg-black text-white">
            <BlurCircle size="w-[500px] h-[500px]" className="-left-20 top-20 opacity-10" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            Our Theaters
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Experience movies like never before at our state-of-the-art cinema locations equipped with global standard technology and premium amenities.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                    {theaters.map((theater) => {
                        const theaterShows = shows.filter(s => s.venue === theater.name && new Date(s.showDateTime) > new Date())
                        const uniqueMovies = Array.from(new Set(theaterShows.map(s => s.movie?.title))).filter(Boolean)

                        return (
                            <div
                                key={theater.id}
                                className="bg-[#1A1A1D] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden flex-shrink-0">
                                    <img
                                        src={theater.image}
                                        alt={theater.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wide">
                                        {theater.status}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1D] to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <h2 className="text-2xl font-bold mb-1">{theater.name}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <MapPin size={14} className="text-primary" />
                                            {theater.distance}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                            {theater.address}
                                        </p>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                                <Star size={16} fill="currentColor" />
                                                {theater.rating}
                                            </div>
                                            <span className="text-xs text-gray-500">({theater.reviews})</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {theater.amenities.map((amenity, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-gray-300 border border-white/5"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Now Showing Section */}
                                    <div className="mb-6 flex-1">
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <Film size={16} className="text-primary" />
                                            Now Showing
                                        </h3>
                                        {uniqueMovies.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {uniqueMovies.map((movieTitle, i) => (
                                                    <span key={i} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                                                        {movieTitle}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No active shows at the moment.</p>
                                        )}
                                    </div>

                                    <div className="flex gap-4 mt-auto">
                                        <button
                                            onClick={() => navigate(`/theaters/${theater.id}`)}
                                            className="flex-1 bg-primary hover:bg-primary-dull text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Ticket size={18} />
                                            View Movies
                                        </button>
                                        <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                                            <Info size={20} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Theaters
