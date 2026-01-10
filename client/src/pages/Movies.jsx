import React, { useState, useEffect } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import { Search, Filter } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeGenre, setActiveGenre] = useState('All')

    const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Comedy', 'Drama', 'Horror', 'Family', 'Fantasy']

    // Load initial data
    useEffect(() => {
        setMovies(dummyShowsData)
        setFilteredMovies(dummyShowsData)
    }, [])

    // Filter logic
    useEffect(() => {
        let result = movies

        // Filter by Search
        if (searchQuery) {
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Filter by Genre
        if (activeGenre !== 'All') {
            result = result.filter(movie =>
                movie.genres.some(genre =>
                    genre.name === activeGenre ||
                    (activeGenre === 'Sci-Fi' && genre.name === 'Science Fiction') // Handle mapping if needed
                )
            )
        }

        setFilteredMovies(result)
    }, [searchQuery, activeGenre, movies])

    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
            {/* Background Decoration */}
            <BlurCircle size="w-[600px] h-[600px]" className="-top-20 -right-20 opacity-10" />
            <BlurCircle size="w-[400px] h-[400px]" className="bottom-20 -left-20 opacity-10" />

            {/* Header Section */}
            <div className="mb-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Movies</h1>
                <p className="text-gray-400 max-w-2xl">
                    Browse our extensive collection of the latest blockbusters, classic favorites, and trending new releases. Find your perfect movie night today.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 relative z-10">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                </div>

                {/* Genre Filters (Desktop) */}
                <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setActiveGenre(genre)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeGenre === genre
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Genre Filters (Mobile - Horizontal Scroll) */}
            <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2 custom-scrollbar relative z-10">
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeGenre === genre
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* Movie Grid */}
            {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10 mb-20">
                    {filteredMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                    <Filter size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No movies found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setActiveGenre('All') }}
                        className="mt-6 text-primary hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default Movies
