import React, { useEffect, useState } from 'react'
import { MoreVertical, Search, Filter, Calendar, Trash2 } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ListShows = () => {
    const { axios, getToken } = useAppContext()
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchShows = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/show/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch shows")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/show/delete', { showId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchShows()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete show")
        }
    }

    useEffect(() => {
        fetchShows()
    }, [])

    const filteredShows = shows.filter(show =>
        show.movie?.title?.toLowerCase().includes(search.toLowerCase())
    )

    const getStatusColor = (showDateTime) => {
        const now = new Date();
        const showDate = new Date(showDateTime);
        if (showDate < now) return 'bg-gray-500/10 text-gray-400'; // Past
        return 'bg-green-500/10 text-green-500'; // Active/Upcoming
    }

    const getStatusText = (showDateTime) => {
        const now = new Date();
        const showDate = new Date(showDateTime);
        if (showDate < now) return 'Completed';
        return 'Active';
    }

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Scheduled Shows</h2>
                    <p className="text-gray-400">View and manage upcoming screenings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#1A1A1D] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search shows..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm hover:bg-white/5 transition-colors">
                        <Calendar size={16} />
                        Next 7 Days
                    </button>
                    <button className="p-2.5 bg-black/50 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading shows...</div>
                ) : shows.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No shows found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#27272A] text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Movie</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Hall</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredShows.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No shows found matching "{search}"
                                    </td>
                                </tr>
                            ) : (
                                filteredShows.map((show, index) => (
                                    <tr key={show._id || index} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {show.movie?.title || 'Unknown Movie'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{formatTime(show.showDateTime)}</span>
                                                <span className="text-xs text-gray-500">{formatDate(show.showDateTime)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">Standard Hall</td>
                                        <td className="px-6 py-4 font-medium">₹{show.showPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(show.showDateTime)}`}>
                                                {getStatusText(show.showDateTime)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative group">
                                            <div className="relative inline-block text-left group/menu">
                                                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                                    <MoreVertical size={18} />
                                                </button>
                                                <div className="absolute right-0 bottom-full mb-2 w-32 bg-[#1A1A1D] border border-white/10 rounded-lg shadow-xl z-20 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all duration-200 origin-bottom-right">
                                                    <button
                                                        onClick={() => handleDelete(show._id)}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default ListShows
