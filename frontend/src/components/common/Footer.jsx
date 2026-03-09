import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="pt-10">
        <footer className="mt-auto border-t border-gray-100 bg-white ">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8">
                
                {/* Logo Column */}
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                        Lac<span className="text-gray-300">ed</span>
                    </h2>
                    <p className="mt-4 text-sm text-gray-500 font-medium max-w-xs leading-relaxed">
                        Step into greatness. The premium destination for authentic, high-quality footwear.
                    </p>
                </div>

                {/* Brands Column */}
                <div>
                    <h3 className="font-bold text-black mb-6 text-[15px] uppercase tracking-widest">Brands</h3>
                    <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                        <li><Link to="/search?brand=nike" className="hover:text-black transition-colors">Nike</Link></li>
                        <li><Link to="/search?brand=adidas" className="hover:text-black transition-colors">Adidas</Link></li>
                    </ul>
                </div>

                {/* Categories Column */}
                <div>
                    <h3 className="font-bold text-black mb-6 text-[15px] uppercase tracking-widest">Categories</h3>
                    <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                        <li><Link to="/category" className="hover:text-black transition-colors">Air Force</Link></li>
                        <li><Link to="/category" className="hover:text-black transition-colors">Air Jordan</Link></li>
                        <li><Link to="/category" className="hover:text-black transition-colors">Pegasus</Link></li>
                    </ul>
                </div>

                {/* New Arrivals Column */}
                <div>
                    <h3 className="font-bold text-black mb-6 text-[15px] uppercase tracking-widest">New Arrivals</h3>
                    <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                        <li><Link to="/category" className="hover:text-black transition-colors">Latest Nike</Link></li>
                        <li><Link to="/category" className="hover:text-black transition-colors">Latest Adidas</Link></li>
                        <li><Link to="/category" className="hover:text-black transition-colors">Limited Edition</Link></li>
                    </ul>
                </div>

                {/* Quick Links Column */}
                <div>
                    <h3 className="font-bold text-black mb-6 text-[15px] uppercase tracking-widest">Quick Links</h3>
                    <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                        <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
                        <li><Link to="/" className="hover:text-black transition-colors">Search Hub</Link></li>
                        <li><Link to="/helpdesk" className="hover:text-black transition-colors">Help & Support</Link></li>
                        <li><Link to="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                        <li><Link to="#" className="hover:text-black transition-colors">Return Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-gray-400 text-[12px] uppercase font-bold border-t border-gray-100 tracking-widest font-sans">
                © {new Date().getFullYear()} Laced PVT. All rights reserved.
            </div>
        </footer>
        </div>
    );
};

export default Footer;