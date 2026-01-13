import React from 'react'
import { assets } from '../assets/assets'
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'
import backgroundImage from '../assets/backgroundImage.png'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useEffect, useState } from 'react'

const HeroSection = () => {
    const navigate = useNavigate()
    const { shows, axios } = useAppContext()
    const [heroMovie, setHeroMovie] = useState(null)

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const { data } = await axios.get('/api/show/hero-movie')
                if (data.success && data.heroMovie) {
                    setHeroMovie(data.heroMovie)
                } else if (shows && shows.length > 0) {
                    // Fallback to the first upcoming show if no hero movie is configured
                    const movie = shows[0]?.movie
                    if (movie) setHeroMovie(movie)
                }
            } catch (error) {
                console.error("Failed to fetch hero movie:", error)
                if (shows && shows.length > 0) {
                    const movie = shows[0]?.movie
                    if (movie) setHeroMovie(movie)
                }
            }
        }
        fetchHero()
    }, [shows, axios])

    if (!heroMovie) return null // Or a loading skeleton

    return (
        <div
            className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen w-full transition-all duration-700'
            style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${heroMovie.backdrop_path})` }}
        >
            <div className='absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent'></div>

            <div className='relative z-10 flex flex-col items-start gap-4'>


                <h1 className='text-5xl md:text-[70px] md:leading-[1.1] font-bold max-w-2xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                    {heroMovie.title}
                </h1>

                <div className='flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base'>
                    {heroMovie.genres?.slice(0, 3).map((g, i) => (
                        <span key={i} className='px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>{g.name}</span>
                    ))}

                    <div className='flex items-center gap-2 ml-2'>
                        <CalendarIcon className='w-4 h-4 text-primary' />
                        <span>{heroMovie.release_date?.split('-')[0]}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <ClockIcon className='w-4 h-4 text-primary' />
                        <span>{Math.floor(heroMovie.runtime / 60)}h {heroMovie.runtime % 60}m</span>
                    </div>
                </div>

                <p className='max-w-md text-gray-400 leading-relaxed text-sm md:text-base line-clamp-3'>
                    {heroMovie.overview}
                </p>

                <button
                    onClick={() => navigate(`/movies/${heroMovie._id}`)}
                    className='group mt-4 flex items-center gap-2 px-8 py-4 text-sm bg-primary hover:bg-primary-dull transition-all duration-300 rounded-full font-bold cursor-pointer shadow-lg shadow-primary/20'
                >
                    View Details
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

export default HeroSection