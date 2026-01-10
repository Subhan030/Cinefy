import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      <Toaster />
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favourite' element={<Favourite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}
export default App