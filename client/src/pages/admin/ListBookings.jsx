import React from 'react'
import { MoreVertical, Search, Filter, Download } from 'lucide-react'

const ListBookings = () => {
    // Mock bookings data
    const bookings = [
        { id: 'BK-7829', user: 'Alex Doe', movie: 'Inception', seats: 'A1, A2', amount: 30, date: '2025-01-11 14:30', status: 'Confirmed' },
        { id: 'BK-7830', user: 'Sarah Smith', movie: 'Dune: Part Two', seats: 'F5, F6, F7', amount: 54, date: '2025-01-11 15:45', status: 'Confirmed' },
        { id: 'BK-7831', user: 'John Mike', movie: 'Interstellar', seats: 'C3', amount: 12, date: '2025-01-11 16:00', status: 'Pending' },
        { id: 'BK-7832', user: 'Emily White', movie: 'Oppenheimer', seats: 'B1, B2', amount: 24, date: '2025-01-10 09:15', status: 'Cancelled' },
        { id: 'BK-7833', user: 'Chris Green', movie: 'Inception', seats: 'D4, D5', amount: 30, date: '2025-01-10 11:20', status: 'Confirmed' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-500/10 text-green-500'
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500'
            case 'Cancelled': return 'bg-red-500/10 text-red-500'
            default: return 'bg-gray-500/10 text-gray-400'
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Recent Bookings</h2>
                    <p className="text-gray-400">Track ticket reservations</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#1A1A1D] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search bookings by ID or Name..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <button className="p-2.5 bg-black/50 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <Filter size={20} />
                </button>
            </div>

            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-[#27272A] text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Booking ID</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Movie</th>
                            <th className="px-6 py-4 font-semibold">Seats</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bookings.map((booking, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-primary">{booking.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{booking.user}</td>
                                <td className="px-6 py-4 text-gray-300">{booking.movie}</td>
                                <td className="px-6 py-4 text-gray-300 font-mono text-xs">{booking.seats}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{booking.date}</td>
                                <td className="px-6 py-4 font-medium">${booking.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                        {booking.status}
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

export default ListBookings
