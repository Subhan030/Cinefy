import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { MapPin, Star, ArrowLeft, Filter } from 'lucide-react'
import downtownCinema from '../assets/downtown_cinema.png'

const TheatreDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { shows } = useAppContext()
    const [theatre, setTheatre] = useState(null)
    const [theatreMovies, setTheatreMovies] = useState([])

    // Dummy logic to match ID to dummy theatre data
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

    useEffect(() => {
        const selectedTheatre = theaters.find(t => t.id === parseInt(id))
        setTheatre(selectedTheatre)

        if (selectedTheatre && shows.length > 0) {
            // Find shows for this venue
            const venueShows = shows.filter(s => s.venue === selectedTheatre.name)

            // Extract unique movies
            // We need to construct movie objects that MovieCard accepts (with nextShow logic)
            // Group by movie ID
            const moviesById = {}
            venueShows.forEach(show => {
                if (!show.movie) return
                if (!moviesById[show.movie._id]) {
                    moviesById[show.movie._id] = {
                        ...show.movie,
                        nextShow: show.showDateTime // default first found
                    }
                }
                // Update nextShow if this show is sooner/upcoming
                // (Simplified for now, picking first encountered or keep as explains logic in Movies.jsx)
            })

            setTheatreMovies(Object.values(moviesById))
        }
    }, [id, shows])

    if (!theatre) {
        return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white bg-black">
            {/* Header Image */}
            <div className="absolute top-0 left-0 w-full h-[60vh] -z-10">
                <img
                    src={theatre.image}
                    alt={theatre.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
            </div>

            <BlurCircle size="w-[600px] h-[600px]" className="top-20 -right-20 opacity-20" />

            <div className="container mx-auto px-6 md:px-16 lg:px-24 pt-32 pb-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Theaters
                </button>

                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{theatre.name}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            {theatre.address}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                            <Star size={18} fill="currentColor" />
                            {theatre.rating}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {theatre.amenities.map((amenity, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-white/10 rounded-lg text-sm font-medium text-gray-200 border border-white/10"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full"></span>
                        Now Showing
                    </h3>

                    {theatreMovies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {theatreMovies.map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#1A1A1D] rounded-3xl border border-white/5 h-64">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Filter size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No shows available</h3>
                            <p className="text-gray-400 max-w-xs mx-auto">
                                There are currently no movies scheduled at this cinema.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TheatreDetails
