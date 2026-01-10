import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "./BlurCircle";

const FeaturedSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative px-6 md:px-16 lg:px-24 mt-16 overflow-hidden">
            {/* Background Decorations */}
            <BlurCircle className="-top-20 -left-20 opacity-15" />
            <BlurCircle size="w-64 h-64" className="bottom-0 -right-10 opacity-10" />

            {/* Header */}
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

            {/* Movie Cards */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {dummyShowsData.slice(0, 4).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* Show More */}
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
