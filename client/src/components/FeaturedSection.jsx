import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "./BlurCircle";

import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const FeaturedSection = () => {
    const navigate = useNavigate();
    const { shows } = useAppContext()
    const [movies, setMovies] = useState([])

    useEffect(() => {
        if (shows && shows.length > 0) {

            const uniqueMovies = Array.from(new Set(shows.map(s => s.movie?._id)))
                .map(id => {
                    const show = shows.find(s => s.movie?._id === id)
                    return show ? { ...show.movie, nextShow: show.showDateTime } : null
                })
                .filter(Boolean)
                .slice(0, 4)
            setMovies(uniqueMovies)
        }
    }, [shows])

    return (
        <section className="relative px-6 md:px-16 lg:px-24 mt-16 overflow-hidden">

            <BlurCircle className="-top-20 -left-20 opacity-15" />
            <BlurCircle size="w-64 h-64" className="bottom-0 -right-10 opacity-10" />


            <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Now Showing
                    </h2>
                    <div className="w-12 h-1 bg-primary rounded-full"></div>
                </div>

                <button
                    onClick={() => navigate("/movies")}
                    className="flex items-center gap-2 text-primary hover:opacity-80 font-medium transition-all group"
                >
                    View All
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>


            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>


            <div className="relative z-10 flex justify-center mt-12 pb-8">
                <button
                    onClick={() => navigate("/movies")}
                    className="px-8 py-3 border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-primary/20"
                >
                    Show More Movies
                </button>
            </div>
        </section>
    );
};

export default FeaturedSection;
