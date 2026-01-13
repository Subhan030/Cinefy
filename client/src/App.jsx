import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Theaters from './pages/Theaters'
import TheatreDetails from './pages/TheatreDetails'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import ViewTicket from './pages/ViewTicket'
import PaymentSuccess from './pages/PaymentSuccess'
import Favourite from './pages/Favourite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import ListMovies from './pages/admin/ListMovies'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import { SignIn } from '@clerk/clerk-react'
import { useAppContext } from './context/AppContext'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { user } = useAppContext()

  return (
    <>
      <ScrollToTop />
      <Toaster />
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/theaters' element={<Theaters />} />
        <Route path='/theaters/:id' element={<TheatreDetails />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/buy-ticket/:showId' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/ticket/:bookingId' element={<ViewTicket />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/favourite' element={<Favourite />} />
        <Route path='/admin/*' element={user ? <Layout /> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path='list-movies' element={<ListMovies />} />
          <Route path='add-show' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}
export default App