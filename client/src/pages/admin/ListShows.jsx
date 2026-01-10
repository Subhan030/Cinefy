import React from 'react'
import { MoreVertical, Search, Filter, Calendar } from 'lucide-react'

const ListShows = () => {
    // Mock shows data
    const shows = [
        { id: 'SH001', movie: 'Inception', date: '2025-01-12', time: '09:00 PM', hall: 'IMAX Hall 1', price: 15, status: 'Active' },
        { id: 'SH002', movie: 'Interstellar', date: '2025-01-12', time: '06:00 PM', hall: 'Hall 2', price: 12, status: 'Sold Out' },
        { id: 'SH003', movie: 'The Dark Knight', date: '2025-01-13', time: '08:00 PM', hall: 'Hall 1', price: 14, status: 'Active' },
        { id: 'SH004', movie: 'Dune: Part Two', date: '2025-01-13', time: '05:30 PM', hall: 'IMAX Hall 1', price: 18, status: 'Active' },
        { id: 'SH005', movie: 'Oppenheimer', date: '2025-01-14', time: '07:00 PM', hall: 'Hall 3', price: 12, status: 'Draft' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-500/10 text-green-500'
            case 'Sold Out': return 'bg-red-500/10 text-red-500'
            case 'Draft': return 'bg-gray-500/10 text-gray-400'
            default: return 'bg-blue-500/10 text-blue-500'
        }
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
                <table className="w-full text-left">
                    <thead className="bg-[#27272A] text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Show ID</th>
                            <th className="px-6 py-4 font-semibold">Movie</th>
                            <th className="px-6 py-4 font-semibold">Date & Time</th>
                            <th className="px-6 py-4 font-semibold">Hall</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {shows.map((show, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{show.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{show.movie}</td>
                                <td className="px-6 py-4 text-gray-300">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-white">{show.time}</span>
                                        <span className="text-xs text-gray-500">{show.date}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{show.hall}</td>
                                <td className="px-6 py-4 font-medium">${show.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(show.status)}`}>
                                        {show.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListShows
