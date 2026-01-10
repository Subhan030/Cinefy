import { useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../../assets/assets'
import { Film, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react'

const Dashboard = () => {
    const navigate = useNavigate()

    // Mock Statistics
    const stats = [
        { title: 'Total Movies', value: dummyShowsData.length, icon: Film, color: 'bg-blue-500/10 text-blue-500' },
        { title: 'Active Shows', value: '24', icon: Calendar, color: 'bg-green-500/10 text-green-500' },
        { title: 'Total Bookings', value: '1,245', icon: Users, color: 'bg-purple-500/10 text-purple-500' },
        { title: 'Total Revenue', value: '$45,280', icon: DollarSign, color: 'bg-yellow-500/10 text-yellow-500' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#1A1A1D] p-6 rounded-2xl border border-white/5 shadow-xl hover:translate-y-[-2px] transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                <TrendingUp size={14} className="mr-1" /> +12%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-gray-500 font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Recent Movies Table Section */}
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
                            {dummyShowsData.slice(0, 5).map((movie, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={movie.poster_path} alt={movie.title} className="w-10 h-14 object-cover rounded-md" />
                                            <div>
                                                <p className="font-medium text-white">{movie.title}</p>
                                                <p className="text-xs text-gray-500">{movie.release_date?.split('-')[0] || '2024'}</p>
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
        </div>
    )
}

export default Dashboard
