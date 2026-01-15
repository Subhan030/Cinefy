import { useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../../assets/assets'
import { Film, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useEffect } from 'react'
const Dashboard = () => {
    const navigate = useNavigate()
    const { axios, getToken, user, image_base_url } = useAppContext()
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [allMovies, setAllMovies] = useState([])
    const [selectedHeroMovieId, setSelectedHeroMovieId] = useState('')
    const [loadingSettings, setLoadingSettings] = useState(false)
    
    
    const stats = [
        { title: 'Total Movies', value: dashboardData?.totalMovies || 0, icon: Film, color: 'bg-blue-500/10 text-blue-500' },
        { title: 'Active Shows', value: dashboardData?.totalActiveShows || 0, icon: Calendar, color: 'bg-green-500/10 text-green-500' },
        { title: 'Total Bookings', value: dashboardData?.totalBookings || 0, icon: Users, color: 'bg-purple-500/10 text-purple-500' },
        { title: 'Total Revenue', value: `₹${dashboardData?.totalRevenue || 0}`, icon: DollarSign, color: 'bg-yellow-500/10 text-yellow-500' },
    ]
    useEffect(() => {
        fetchDashboardData()
        fetchAllMovies()
        fetchSettings()
    }, [])

    const fetchAllMovies = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/all-movies', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setAllMovies(data.movies)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchSettings = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success && data.settings?.heroMovie) {
                setSelectedHeroMovieId(data.settings.heroMovie._id || data.settings.heroMovie)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateHero = async () => {
        if (!selectedHeroMovieId) return toast.error("Please select a movie");
        setLoadingSettings(true);
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/admin/update-hero-movie', { movieId: selectedHeroMovieId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update hero movie");
        } finally {
            setLoadingSettings(false);
        }
    }
    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const response = await axios.get('/api/admin/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data
            if (data.success) {
                setDashboardData(data.dashboardData)
                setLoading(false)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#1A1A1D] p-6 rounded-2xl border border-white/5 shadow-xl hover:translate-y-[-2px] transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>

                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-gray-500 font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            { }
            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl mt-8">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Newest Movies</h3>
                    <button onClick={() => navigate('/admin/list-movies')} className="text-primary text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-[#1E1E21">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Movie</th>
                                <th className="px-6 py-4 font-semibold">Genre</th>
                                <th className="px-6 py-4 font-semibold">Language</th>
                                <th className="px-6 py-4 font-semibold">Duration</th>
                                <th className="px-6 py-4 font-semibold">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(dashboardData?.latestMovies || []).map((movie, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-10 h-14 object-cover rounded-md" />
                                            <div>
                                                <p className="font-medium text-white">{movie.title}</p>
                                                <p className="text-xs text-gray-500">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {movie.genres.slice(0, 2).map((g, i) => (
                                                <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{movie.original_language?.toUpperCase() || 'EN'}</td>
                                    <td className="px-6 py-4 text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-bold text-sm">
                                                {movie.vote_average?.toFixed(1) || 'N/A'}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {movie.vote_count?.toLocaleString()} votes
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            { }
            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl mt-8">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold">Featured Hero Movie</h3>
                    <p className="text-gray-400 text-sm mt-1">Select which movie appears on the main home page banner.</p>
                </div>
                <div className="p-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                        <label className="text-sm text-gray-400 mb-2 block">Select Movie</label>
                        <div className="relative">
                            <select
                                value={selectedHeroMovieId}
                                onChange={(e) => setSelectedHeroMovieId(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">-- Select a movie --</option>
                                {allMovies.map(movie => (
                                    <option key={movie._id} value={movie._id}>
                                        {movie.title} ({movie.release_date?.split('-')[0]})
                                    </option>
                                ))}
                            </select>
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                    <button
                        onClick={handleUpdateHero}
                        disabled={loadingSettings}
                        className="px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                    >
                        {loadingSettings ? 'Saving...' : 'Set as Hero'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
