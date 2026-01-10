import React from 'react'
import { assets } from '../assets/assets'
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'
import backgroundImage from '../assets/backgroundImage.png'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
    return (
        <div
            className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen w-full transition-all duration-700'
            style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${backgroundImage})` }}
        >
            <div className='absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent'></div>

            <div className='relative z-10 flex flex-col items-start gap-4'>
                <img src={assets.marvelLogo} alt="Marvel Logo" className="max-h-11 lg:h-11 animate-fade-in" />

                <h1 className='text-5xl md:text-[70px] md:leading-[1.1] font-bold max-w-2xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                    Guardians <br /> of the Galaxy
                </h1>

                <div className='flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base'>
                    <span className='px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>Action</span>
                    <span className='px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>Adventure</span>
                    <span className='px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>Sci-Fi</span>

                    <div className='flex items-center gap-2 ml-2'>
                        <CalendarIcon className='w-4 h-4 text-primary' />
                        <span>2018</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <ClockIcon className='w-4 h-4 text-primary' />
                        <span>2h 8m</span>
                    </div>
                </div>

                <p className='max-w-md text-gray-400 leading-relaxed text-sm md:text-base'>
                    A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.
                </p>

                <button
                    onClick={() => navigate('/movies')}
                    className='group mt-4 flex items-center gap-2 px-8 py-4 text-sm bg-primary hover:bg-primary-dull transition-all duration-300 rounded-full font-bold cursor-pointer shadow-lg shadow-primary/20'
                >
                    Explore Movies
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

export default HeroSection