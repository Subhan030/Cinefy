import React, { useState, useEffect } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import { Search, Filter } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'

import { useAppContext } from '../context/AppContext'

const Movies = () => {
    const { shows } = useAppContext()
    const [movies, setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeGenre, setActiveGenre] = useState('All')

    const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Comedy', 'Drama', 'Horror', 'Family', 'Fantasy']

    
    useEffect(() => {
        if (shows && shows.length > 0) {
            const now = new Date();

            
            const showsByMovie = {};
            shows.forEach(show => {
                if (!show.movie || !show.movie._id) return;
                if (!showsByMovie[show.movie._id]) {
                    showsByMovie[show.movie._id] = [];
                }
                showsByMovie[show.movie._id].push(show);
            });

            
            const uniqueMovies = Object.values(showsByMovie).map(movieShows => {
                const movie = movieShows[0].movie;

                
                const sortedShows = movieShows.sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime));

                
                const upcomingShow = sortedShows.find(s => new Date(s.showDateTime) >= now);

                
                const nextShow = upcomingShow ? upcomingShow.showDateTime : sortedShows[sortedShows.length - 1].showDateTime;

                return { ...movie, nextShow };
            });

            setMovies(uniqueMovies);
            setFilteredMovies(uniqueMovies);
        }
    }, [shows])

    
    useEffect(() => {
        let result = movies

        
        if (searchQuery) {
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        
        if (activeGenre !== 'All') {
            result = result.filter(movie =>
                movie.genres.some(genre =>
                    genre.name === activeGenre ||
                    (activeGenre === 'Sci-Fi' && genre.name === 'Science Fiction') 
                )
            )
        }

        setFilteredMovies(result)
    }, [searchQuery, activeGenre, movies])

    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
            { }
            <BlurCircle size="w-[600px] h-[600px]" className="-top-20 -right-20 opacity-10" />
            <BlurCircle size="w-[400px] h-[400px]" className="bottom-20 -left-20 opacity-10" />

            { }
            <div className="mb-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Movies</h1>
                <p className="text-gray-400 max-w-2xl">
                    Browse our extensive collection of the latest blockbusters, classic favorites, and trending new releases. Find your perfect movie night today.
                </p>
            </div>

            { }
            <div className="flex flex-col lg:flex-row gap-8 relative z-10 mb-20">

                { }
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    { }
                    <div className="bg-[#1A1A1D] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Search size={18} className="text-primary" />
                            Search
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Find movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    { }
                    <div className="bg-[#1A1A1D] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Filter size={18} className="text-primary" />
                                Genres
                            </h3>
                            {activeGenre !== 'All' && (
                                <button
                                    onClick={() => setActiveGenre('All')}
                                    className="text-xs text-gray-500 hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setActiveGenre(genre)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeGenre === genre
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {genre}
                                    {activeGenre === genre && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                { }
                <div className="flex-1">
                    {filteredMovies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMovies.map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#1A1A1D] rounded-3xl border border-white/5 h-96">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Filter size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No movies found</h3>
                            <p className="text-gray-400 max-w-xs mx-auto">
                                We couldn't find any movies matching your current filters.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveGenre('All') }}
                                className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Movies
