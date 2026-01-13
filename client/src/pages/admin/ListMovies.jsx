import React, { useEffect, useState } from 'react'
import { Search, Edit, Trash2, Plus, Filter } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ListMovies = () => {
    const { axios, getToken } = useAppContext()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchMovies = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/all-movies', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                // Ensure poster_paths are full URLs if they aren't already
                const updatedMovies = data.movies.map(movie => {
                    if (movie.poster_path && !movie.poster_path.startsWith('http')) {
                        movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    }
                    return movie
                })
                setMovies(updatedMovies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch movies")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie? This cannot be undone.")) return;

        try {
            const token = await getToken()
            const { data } = await axios.post('/api/admin/delete-movie', { movieId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchMovies()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete movie")
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])


    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Movies List</h2>
                    <p className="text-gray-400">Manage your movie collection</p>
                </div>
                <button className="bg-primary hover:bg-primary-dull text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                    <Plus size={20} />
                    Add New Movie
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 bg-[#1A1A1D] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <button className="p-2.5 bg-black/50 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <Filter size={20} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading movies...</div>
                ) : filteredMovies.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? `No movies found matching "${searchTerm}"` : "No movies available."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#27272A] text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Movie Detail</th>
                                    <th className="px-6 py-4 font-semibold">Release Date</th>
                                    <th className="px-6 py-4 font-semibold">Runtime</th>
                                    <th className="px-6 py-4 font-semibold">Rating</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMovies.map((movie, index) => (
                                    <tr key={movie._id || index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={movie.poster_path} alt={movie.title} className="w-12 h-16 object-cover rounded-lg shadow-md" />
                                                <div>
                                                    <p className="font-bold text-white text-lg">{movie.title}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {movie.genres.slice(0, 3).map((g, i) => (
                                                            <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-gray-300">
                                                                {g.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">
                                            {movie.release_date}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-green-500 h-full rounded-full"
                                                            style={{ width: `${(movie.vote_average / 10) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{movie.vote_average}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    ({movie.vote_count?.toLocaleString()} votes)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-blue-400/10 rounded-lg">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(movie._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListMovies
