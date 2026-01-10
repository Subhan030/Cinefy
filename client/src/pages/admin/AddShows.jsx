import React, { useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, Film } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const AddShows = () => {
    const [selectedMovieId, setSelectedMovieId] = useState(null)
    const [date, setDate] = useState(null) // Initialize with null to show placeholder
    const selectedMovie = dummyShowsData.find(m => m.id === selectedMovieId)

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Add New Show</h2>
                    <p className="text-gray-400 mt-1">Schedule a movie screening</p>
                </div>
            </div>

            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                {/* Cover Image Preview */}
                {selectedMovie && (
                    <div className="w-full h-48 md:h-64 relative">
                        <img
                            src={selectedMovie.backdrop_path}
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

                <form className="p-8 space-y-8">
                    {/* Movie Selection */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-lg font-semibold text-white">
                            <Film size={20} className="text-primary" />
                            Select Movie
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dummyShowsData.map((movie) => (
                                <label
                                    key={movie.id}
                                    className={`relative cursor-pointer group transition-all duration-300 ${selectedMovieId === movie.id ? 'transform scale-105' : ''
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="movie"
                                        value={movie.id}
                                        className="peer sr-only"
                                        onChange={() => setSelectedMovieId(movie.id)}
                                    />
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedMovieId === movie.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-white/5 bg-black/20 hover:bg-white/5'
                                        }`}>
                                        <img src={movie.poster_path} alt="" className="w-10 h-14 object-cover rounded-md" />
                                        <div className="overflow-hidden">
                                            <p className={`font-medium truncate ${selectedMovieId === movie.id ? 'text-primary' : 'text-white'}`}>
                                                {movie.title}
                                            </p>
                                            <p className="text-xs text-gray-500">{movie.runtime} mins</p>
                                        </div>
                                    </div>
                                    {selectedMovieId === movie.id && (
                                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary ring-2 ring-black animate-pulse"></div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Date & Time */}
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
                                        placeholderText="dd/mm/yyyy"
                                        minDate={new Date()}
                                        shouldCloseOnSelect={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Show Time</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'].map((time) => (
                                            <label key={time} className="cursor-pointer text-center">
                                                <input type="radio" name="time" value={time} className="peer sr-only" />
                                                <div className="py-2 rounded-lg border border-white/10 bg-black/20 text-sm hover:bg-white/5 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                                                    {time}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hall & Pricing */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-semibold text-white">
                                <MapPin size={20} className="text-primary" />
                                Hall Details
                            </label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Select Hall</label>
                                    <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                                        <option>Hall 1 (Dolby Atmos)</option>
                                        <option>Hall 2 (IMAX)</option>
                                        <option>Hall 3 (Standard)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Base Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                        <button type="button" className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dull text-white font-medium shadow-lg shadow-primary/25 transition-all">Create Show</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddShows
