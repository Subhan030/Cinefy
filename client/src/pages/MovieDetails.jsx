import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets'
import { Star, Clock, Calendar, Ticket, ArrowLeft, Share2, Heart, Film } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import { formatRuntime } from '../lib/utils'
import MovieCard from '../components/MovieCard'

const MovieDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

    // Helper to get dates for the next 4 days
    const getNextDays = (count = 4) => {
        const dates = []
        const today = new Date('2025-07-24') // Fixed date to match dummy data
        for (let i = 0; i < count; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            dates.push(date.toISOString().split('T')[0])
        }
        return dates
    }
    const availableDates = getNextDays()

    useEffect(() => {
        const foundMovie = dummyShowsData.find(m => m.id === parseInt(id))
        setMovie(foundMovie)

        // Select first available date by default
        if (availableDates.length > 0) {
            setSelectedDate(availableDates[0])
        }
    }, [id])

    const handleBookTicket = () => {
        if (selectedTimeSlot && selectedDate && movie) {
            // In a real app, you'd navigate to seat selection with showId
            navigate(`/movies/${id}/${selectedDate}`)
        } else {
            alert('Please select a showtime')
        }
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute top-0 left-0 w-full h-[70vh] bg-cover bg-center -z-10"
                style={{ backgroundImage: `url(${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
            </div>

            <BlurCircle size="w-[600px] h-[600px]" className="top-20 -right-20 opacity-20" />

            <div className="container mx-auto px-6 md:px-16 lg:px-24 pt-32 pb-20">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Movies
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Poster */}
                    <div className="flex-shrink-0 mx-auto lg:mx-0">
                        <div className="relative group perspective-1000">
                            <div className="w-72 md:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-2 border-white/10 transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-2">
                                <img
                                    src={movie.poster_path}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Info & Booking */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{movie.title}</h1>

                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6">
                            <span className="flex items-center gap-1.5 text-yellow-400 font-semibold px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                                <Star size={16} fill="currentColor" />
                                {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <Clock size={16} />
                                {formatRuntime(movie.runtime)}
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                {movie.release_date.split('-')[0]}
                            </span>
                            <div className="flex gap-2">
                                {movie.genres.map(g => (
                                    <span key={g.id} className="text-primary font-medium">{g.name}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tagline & Overview */}
                        {movie.tagline && (
                            <p className="text-lg text-gray-400 italic mb-4 font-light">"{movie.tagline}"</p>
                        )}
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Film size={20} className="text-primary" />
                            Synopsis
                        </h3>
                        <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                            {movie.overview}
                        </p>

                        {/* Cast Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="text-primary">★</span> Cast
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {movie.casts && movie.casts.length > 0 ? (
                                    movie.casts.map((cast, index) => (
                                        <div key={index} className="flex flex-col items-center min-w-[100px] gap-2">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                                                <img
                                                    src={cast.profile_path}
                                                    alt={cast.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-center text-gray-300 font-medium line-clamp-2 w-24">
                                                {cast.name}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No cast information available.</p>
                                )}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                Select Date
                            </h3>
                            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                                {availableDates.map(date => {
                                    const d = new Date(date)
                                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
                                    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
                                    const dayNum = d.getDate()
                                    const isSelected = selectedDate === date

                                    return (
                                        <button
                                            key={date}
                                            onClick={() => {
                                                setSelectedDate(date)
                                                setSelectedTimeSlot(null) // Reset time when date changes
                                            }}
                                            className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-xl border transition-all duration-300 ${isSelected
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 transform scale-105'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <span className="text-xs font-medium uppercase opacity-80">{monthName}</span>
                                            <span className="text-xl font-bold">{dayNum}</span>
                                            <span className="text-xs font-medium uppercase opacity-80">{dayName}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Showtime Selection (Dependent on Date) */}
                        {selectedDate && (
                            <div className="mb-10">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-primary" />
                                    Select Time
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {dummyDateTimeData[selectedDate] ? (
                                        dummyDateTimeData[selectedDate].map((slot, index) => {
                                            const timeString = new Date(slot.time).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            const isSelected = selectedTimeSlot === slot

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                    className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all duration-200 min-w-[100px] ${isSelected
                                                        ? 'bg-white text-primary border-white shadow-md transform scale-105'
                                                        : 'bg-transparent border-gray-600 text-gray-300 hover:border-primary hover:text-primary'
                                                        }`}
                                                >
                                                    {timeString}
                                                </button>
                                            )
                                        })
                                    ) : (
                                        <p className="text-gray-500 w-full">No shows available for this date.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                            <button
                                onClick={handleBookTicket}
                                disabled={!selectedTimeSlot}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${selectedTimeSlot
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dull hover:-translate-y-1'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Ticket size={20} />
                                Book Ticket
                            </button>
                            <div className="flex gap-4">
                                <button className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-primary transition-colors">
                                    <Heart size={24} />
                                </button>
                                <button className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Movies Section */}
                <div className="mt-24">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full"></span>
                        You Might Also Like
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {dummyShowsData
                            .filter(m => m.id !== movie.id)
                            .slice(0, 5)
                            .map(relatedMovie => (
                                <MovieCard key={relatedMovie.id} movie={relatedMovie} />
                            ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => navigate("/movies")}
                            className="px-8 py-3 border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-primary/20"
                        >
                            View All Movies
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails
