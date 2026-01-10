import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Clock } from 'lucide-react'
import { formatRuntime } from '../lib/utils'

const MovieCard = ({ movie }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/movies/${movie.id}`)}
            className='group cursor-pointer'
        >
            <div className='relative overflow-hidden rounded-xl'>
                <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className='w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110'
                />

                {/* Overlay with Buttons */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 gap-2'>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/movies/${movie.id}`) }}
                        className='w-full py-2.5 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-200'
                    >
                        View Details
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/movies/${movie.id}`) }}
                        className='w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dull'
                    >
                        <Ticket size={14} className="animate-pulse" />
                        Buy Ticket
                    </button>
                </div>
            </div>

            <div className='mt-3 px-1'>
                <h3 className='font-semibold text-lg truncate group-hover:text-primary transition-colors'>{movie.title}</h3>
                <div className='flex items-center flex-wrap gap-2 text-sm text-gray-400 mt-1'>
                    <span className='flex items-center gap-1.5'>
                        {movie.release_date.split('-')[0]}
                    </span>
                    <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                    <span className='flex items-center gap-1'>
                        <Clock size={12} className="text-gray-500" />
                        {formatRuntime(movie.runtime)}
                    </span>
                    <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                    <span className='text-primary font-medium flex items-center gap-1'>
                        {movie.vote_average.toFixed(1)} ★
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
