import axios from "axios"
import Show from "../models/Show.js"
import Movie from "../models/Movie.js"
import SystemSettings from "../models/SystemSettings.js"
export const getNowPlayingMovies = async (req, res) => {
    try {
        console.log("Attempting to fetch now playing movies...");
        console.log("TMDB_API_KEY exists:", !!process.env.TMDB_API_KEY);

        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error("Error fetching now playing movies:");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        }
        res.json({ success: false, message: error.message })
    }
}

export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice, venue } = req.body

        if (!process.env.TMDB_API_KEY) {
            return res.json({ success: false, message: "TMDB_API_KEY is missing in server environment" });
        }
        if (!movieId) {
            return res.json({ success: false, message: "movieId is required" });
        }

        const movie = await Movie.findById(movieId)
        if (!movie) {
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])
            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data
            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }
            await Movie.create(movieDetails)
        }
        const showsToCreate = [];

        
        if (req.body.showTimes && Array.isArray(req.body.showTimes)) {
            req.body.showTimes.forEach(isoTime => {
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(isoTime),
                    showPrice,
                    venue,
                    occupiedSeats: {}
                })
            });
        }
        
        else if (showsInput) {
            showsInput.forEach(show => {
                const showDate = show.date;
                show.time.forEach((time) => {
                    const dateTimeString = `${showDate}T${time}`;
                    showsToCreate.push({
                        movie: movieId,
                        showDateTime: new Date(dateTimeString),
                        showPrice,
                        venue,
                        occupiedSeats: {}
                    })
                })
            });
        }

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate)
        }
        res.json({ success: true, shows: showsToCreate })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({}).populate('movie').sort({ showDateTime: 1 })

        
        shows.forEach(show => {
            if (show.movie && show.movie.poster_path && !show.movie.poster_path.startsWith('http')) {
                show.movie.poster_path = "https://image.tmdb.org/t/p/original" + show.movie.poster_path;
            }
            if (show.movie && show.movie.backdrop_path && !show.movie.backdrop_path.startsWith('http')) {
                show.movie.backdrop_path = "https://image.tmdb.org/t/p/original" + show.movie.backdrop_path;
            }
        });
        const uniqueMovies = shows.reduce((acc, show) => {
            if (show.movie && !acc.some(movie => movie._id === show.movie._id)) {
                acc.push(show.movie)
            }
            return acc
        }, [])
        res.json({ success: true, shows, uniqueMovies })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

export const getShow = async (req, res) => {
    const { movieId } = req.params
    try {
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 })
        const movie = await Movie.findById(movieId)
        const dateTime = {};
        shows.forEach(show => {
            const date = new Date(show.showDateTime).toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id, venue: show.venue })
        })
        res.json({ success: true, movie, shows: dateTime })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

export const deleteShow = async (req, res) => {
    try {
        const { showId } = req.body;
        await Show.findByIdAndDelete(showId);
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getHeroMovie = async (req, res) => {
    try {
        const settings = await SystemSettings.findOne().populate('heroMovie');
        let heroMovie = null;
        if (settings && settings.heroMovie) {
            heroMovie = settings.heroMovie;
            
            if (heroMovie.poster_path && !heroMovie.poster_path.startsWith('http')) {
                heroMovie.poster_path = "https://image.tmdb.org/t/p/original" + heroMovie.poster_path;
            }
            if (heroMovie.backdrop_path && !heroMovie.backdrop_path.startsWith('http')) {
                heroMovie.backdrop_path = "https://image.tmdb.org/t/p/original" + heroMovie.backdrop_path;
            }
        }
        res.json({ success: true, heroMovie });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getShowById = async (req, res) => {
    try {
        const { showId } = req.params;
        const show = await Show.findById(showId).populate('movie');
        if (!show) {
            return res.json({ success: false, message: 'Show not found' });
        }
        res.json({ success: true, show });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
