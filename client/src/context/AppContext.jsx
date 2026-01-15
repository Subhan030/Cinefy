import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const { user } = useUser()
    const { getToken } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('/api/admin/is-admin', { headers: { Authorization: `Bearer ${token}` } })
            const data = response.data;
            setIsAdmin(data.isAdmin)
            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error('You are not authorized to access this page')
            }
        } catch (error) {
            console.error(error)
            
            setIsAdmin(false);
        }
    }

    const fetchShows = async () => {
        try {
            const response = await axios.get('/api/show/all')
            const data = response.data;
            if (data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch shows")
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchShows()
    }, [])

    useEffect(() => {
        if (user) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    }, [user])

    const value = {
        axios,
        fetchIsAdmin,
        fetchShows,
        fetchFavoriteMovies,
        isAdmin,
        shows,
        favoriteMovies,
        user,
        getToken,
        navigate
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)