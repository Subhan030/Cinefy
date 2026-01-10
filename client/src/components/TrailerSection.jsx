import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { dummyTrailers } from '../assets/assets'
import { Play, Film } from 'lucide-react'
import BlurCircle from './BlurCircle'

const TrailerSection = () => {
    const [activeTrailer, setActiveTrailer] = useState(dummyTrailers[0])
    const [isPlaying, setIsPlaying] = useState(false)

    const handleTrailerChange = (trailer) => {
        setActiveTrailer(trailer)
        setIsPlaying(false)
    }

    return (
        <section className="relative px-6 md:px-16 lg:px-36 mt-24 overflow-hidden">
            {/* Background Decoration */}
            <BlurCircle size="w-[500px] h-[500px]" className="-bottom-32 -left-20 opacity-10" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col gap-1 mb-10">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Film size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Trailers</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Trending Trailers</h2>
                    <div className="w-16 h-1 bg-primary rounded-full mt-2"></div>
                </div>

                {/* Main Player Container */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Active Trailer Player */}
                    <div className="flex-1">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black group transition-all duration-300">
                            {!isPlaying ? (
                                <div
                                    className="w-full h-full relative cursor-pointer"
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <img
                                        src={activeTrailer.image}
                                        alt="Trailer Preview"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                                            <Play fill="white" className="text-white ml-1" size={32} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src={`https://www.youtube.com/embed/${activeTrailer.videoUrl.split('v=')[1]}?autoplay=1&rel=0`}
                                    title="YouTube video player"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold opacity-90"></h3>
                            <p className="text-gray-400 text-sm mt-1">Experience the latest action-packed thrills in stunning quality.</p>
                        </div>
                    </div>

                    {/* Recommended Side/Bottom Grid */}
                    <div className="lg:w-1/3 xl:w-1/4">
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                            Upcoming Next
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {dummyTrailers.filter(trailer => trailer.videoUrl !== activeTrailer.videoUrl).map((trailer, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleTrailerChange(trailer)}
                                    className={`group cursor-pointer p-2 rounded-xl transition-all duration-300 ${activeTrailer.videoUrl === trailer.videoUrl ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                                        <img
                                            src={trailer.image}
                                            alt="Trailer thumbnail"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play fill="white" className="text-white" size={32} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default TrailerSection
