import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, MapPin, IndianRupee, Film } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const AddShows = () => {

    const { axios, getToken } = useAppContext()

    const [selectedMovieId, setSelectedMovieId] = useState(null)
    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [date, setDate] = useState(null)
    const [times, setTimes] = useState([])
    const [price, setPrice] = useState('')
    const [venue, setVenue] = useState('Cinefy Cinemas - Downtown')


    const [loadingMovies, setLoadingMovies] = useState(true)
    const [movieError, setMovieError] = useState(null)

    const selectedMovie = nowPlayingMovies.find(movie => movie.id === selectedMovieId)

    const fetchNowPlayingMovies = async () => {
        setLoadingMovies(true)
        setMovieError(null)
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/show/now-playing", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setNowPlayingMovies(data.movies)
            } else {
                setMovieError(data.message || "Failed to fetch movies")
                toast.error(data.message)
            }
        }
        catch (error) {
            console.error("Fetch error details:", {
                message: error.message,
                response: error.response,
                status: error.status
            })
            setMovieError("Failed to connect to server")
            toast.error("Failed to fetch movies")
        } finally {
            setLoadingMovies(false)
        }
    }


    const handleCancel = () => {
        setSelectedMovieId(null)
        setDate(null)
        setTimes([])
        setPrice('')
        setVenue('Cinefy Cinemas - Downtown')

    }

    useEffect(() => {
        fetchNowPlayingMovies()
    }, [])

    const handleTimeChange = (time) => {
        if (times.includes(time)) {
            setTimes(times.filter(t => t !== time))
        } else {
            setTimes([...times, time])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedMovieId || !date || times.length === 0 || !price) {
            toast.error("Please fill all fields")
            return
        }

        try {
            const token = await getToken();
            const formattedDate = date.toLocaleDateString('en-CA'); 

            
            const fullShowTimes = times.map(timeStr => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                const showDateTime = new Date(date);
                showDateTime.setHours(hours, minutes, 0, 0);
                return showDateTime.toISOString();
            });

            const { data } = await axios.post('/api/show/add-show', {
                movieId: selectedMovieId,
                
                showTimes: fullShowTimes, 
                showPrice: Number(price),
                venue
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success('Show created successfully')
                setSelectedMovieId(null)
                setDate(null)
                setTimes([])
                setPrice('')
                setVenue('Cinefy Cinemas - Downtown')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Add New Show</h2>
                    <p className="text-gray-400 mt-1">Schedule a movie screening</p>
                </div>
            </div>

            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                { }
                {selectedMovie && (
                    <div className="w-full h-48 md:h-64 relative">
                        <img
                            src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                            alt={selectedMovie.title}
                            className="w-full h-full object-cover mask-gradient-to-b"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1D] to-transparent"></div>
                        <div className="absolute bottom-4 left-8">
                            <h3 className="text-3xl font-bold text-white shadow-black drop-shadow-lg">{selectedMovie.title}</h3>
                            <p className="text-gray-300 drop-shadow-md">{selectedMovie.tagline}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    { }
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-lg font-semibold text-white">
                            <Film size={20} className="text-primary" />
                            Now Playing Movies
                        </label>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                            {loadingMovies ? (
                                <div className="w-full text-center py-8 text-gray-400">Loading movies...</div>
                            ) : movieError ? (
                                <div className="w-full text-center py-8 text-red-500">{movieError}</div>
                            ) : nowPlayingMovies.length === 0 ? (
                                <div className="w-full text-center py-8 text-gray-400">No now playing movies found</div>
                            ) : (
                                nowPlayingMovies.map((movie) => (
                                    <label
                                        key={movie.id}
                                        className={`relative cursor-pointer group transition-all duration-300 flex-shrink-0 w-48 ${selectedMovieId === movie.id ? 'transform scale-105' : ''
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="movie"
                                            value={movie.id}
                                            className="peer sr-only"
                                            onChange={() => setSelectedMovieId(movie.id)}
                                        />
                                        <div className={`flex flex-col gap-3 p-3 rounded-xl border transition-all h-full ${selectedMovieId === movie.id
                                            ? 'border-primary bg-primary/10'
                                            : 'border-white/5 bg-black/20 hover:bg-white/5'
                                            }`}>
                                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-64 object-cover rounded-md" />
                                            <div className="overflow-hidden">
                                                <p className={`font-medium truncate ${selectedMovieId === movie.id ? 'text-primary' : 'text-white'}`}>
                                                    {movie.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Release: {movie.release_date || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {selectedMovieId === movie.id && (
                                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary ring-2 ring-black animate-pulse"></div>
                                        )}
                                    </label>
                                )))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        { }
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-semibold text-white">
                                <CalendarIcon size={20} className="text-primary" />
                                Date & Time
                            </label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Show Date</label>
                                    <DatePicker
                                        selected={date}
                                        onChange={(date) => setDate(date)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                        wrapperClassName="w-full"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Select Date"
                                        minDate={new Date()}
                                        shouldCloseOnSelect={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Show Time</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['09:00', '12:00', '15:00', '18:00', '21:00'].map((timeStr) => (
                                            <label key={timeStr} className="cursor-pointer text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={times.includes(timeStr)}
                                                    onChange={() => handleTimeChange(timeStr)}
                                                    className="peer sr-only"
                                                />
                                                <div className="py-2 rounded-lg border border-white/10 bg-black/20 text-sm hover:bg-white/5 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                                                    {timeStr}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-semibold text-white">
                                <MapPin size={20} className="text-primary" />
                                Hall Details
                            </label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Select Venue & Hall</label>
                                    <select
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                    >
                                        <option value="Cinefy Cinemas - Downtown">Cinefy Cinemas - Downtown</option>
                                        <option value="Cinefy Luxe - Westside">Cinefy Luxe - Westside</option>
                                        <option value="Cinefy Drive-In">Cinefy Drive-In</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Base Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                        <button onClick={handleCancel} type="button" className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                        <button onClick={handleSubmit} type="submit" className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dull text-white font-medium shadow-lg shadow-primary/25 transition-all">Create Show</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddShows
