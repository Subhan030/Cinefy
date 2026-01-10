import React, { useState, useEffect } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { Heart } from 'lucide-react'

const Favourite = () => {
    const [favouriteMovies, setFavouriteMovies] = useState([])

    // Simulate loading favourites (using slice of dummy data for demo)
    useEffect(() => {
        setFavouriteMovies(dummyShowsData.slice(0, 3))
    }, [])

    return (
        <div className="min-h-screen pt-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
            {/* Background Decoration */}
            <BlurCircle size="w-[500px] h-[500px]" className="-top-20 -left-20 opacity-10" />

            {/* Header */}
            <div className="relative z-10 mb-12 flex items-center gap-3">
                <Heart className="text-primary fill-primary" size={32} />
                <h1 className="text-3xl md:text-4xl font-bold">Your Favourites</h1>
            </div>

            {/* Main Content */}
            {favouriteMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
                    {favouriteMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] relative z-10 text-center">
                    <Heart className="text-gray-600 mb-4" size={64} />
                    <h2 className="text-2xl font-bold mb-2">No Favourites Yet</h2>
                    <p className="text-gray-400">Start exploring and save movies you love!</p>
                </div>
            )}
        </div>
    )
}

export default Favourite
