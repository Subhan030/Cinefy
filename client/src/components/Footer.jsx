import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-black/80 text-white pt-16 pb-8 border-t border-white/10 backdrop-blur-3xl mt-20">
            <div className="container mx-auto px-6 md:px-16 lg:px-24">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 text-center md:text-left">

                    {/* Brand & App Stores */}
                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                        <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
                            <img src={assets.logo} alt="Cinefy" className="h-10 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            Discover the latest movies and book your tickets seamlessly with Cinefy.
                        </p>
                        <div className="flex items-center gap-4 animate-fade-in-up">
                            <a href="#" className="hover:scale-105 transition-transform">
                                <img src={assets.googlePlay} alt="Get it on Google Play" className="h-10 w-auto" />
                            </a>
                            <a href="#" className="hover:scale-105 transition-transform">
                                <img src={assets.appStore} alt="Download on the App Store" className="h-10 w-auto" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-lg text-primary tracking-wide">Quick Links</h4>
                            <Link to="/" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block">Home</Link>
                            <Link to="/about" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block">About Us</Link>
                            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block">Contact Us</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-lg text-primary tracking-wide">Legal</h4>
                            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Cinefy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
