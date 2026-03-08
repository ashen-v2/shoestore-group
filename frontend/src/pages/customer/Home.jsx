import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/products/ProductCard';

const mockProducts = [
    {
        id: 1,
        name: 'Nike Air Jordan 1 Mid',
        price: 150,
        image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9e3f8030-bebb-4ac1-b59b-4851945a055b/AIR+JORDAN+1+MID.png'
    },
    {
        id: 2,
        name: 'Nike Air Jordan 1 Low SE',
        price: 115,
        image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7adad52d-1034-407c-8cce-8a3c4db89a62/AIR+JORDAN+1+LOW+SE+%28GS%29.png'
    },
    {
        id: 3,
        name: 'Nike Air Jordan 1 Low SE',
        price: 140,
        image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8e2d257b-22ff-4f61-abf1-4d72444b0d1c/AIR+JORDAN+1+LOW+SE+%28GS%29.png'
    },
    {
        id: 4,
        name: 'Nike Air Jordan 1 Low SE',
        price: 140,
        image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/41a9cf07-aeec-40a5-994a-dbb2db4e9881/AIR+JORDAN+1+LOW+SE+BG.png'
    }
];

const Home = () => {
    const [products, setProducts] = useState(mockProducts);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // If the user wants real data, we keep the API call but fallback to mock.
                const response = await api.get(`/products/?q=${search}`);
                if (response.data && response.data.length > 0) {
                    // Show all returned products so newly added items appear
                    setProducts(response.data);
                } else {
                    // fallback to mock products when API returns nothing
                    setProducts(mockProducts);
                }
            } catch (err) {
                console.error("Failed to fetch shoes, using fallback.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search]);

    const [sortOrder, setSortOrder] = useState(''); // low to high and high to low sort option

    //Logic to sort products
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'lowToHigh') return a.price - b.price;
        if (sortOrder === 'highToLow') return b.price - a.price;
        return 0;
    });

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar onSearch={setSearch} />

            {/* Top Banner */}
            <div className="max-w-350 mx-auto px-6 mt-6">
                <div className="w-full h-75 rounded-3xl overflow-hidden relative bg-gray-100 shadow-sm border border-gray-100">
                    <img
                        src="/src/assets/images/nike_banner.jpg"
                        alt="Just Do It"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop";
                        }}
                    />
                </div>
            </div>

            {/* Product Grid Section */}
            <div className="max-w-350 mx-auto px-6 py-10 pt-16">
                    <div className="flex justify-between items-center mb-8 px-4">
                        <h2 className="text-[24px] font-black uppercase italic tracking-tighter">New Arrival</h2>

                        <div className="relative group">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded-md text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer font-sans"
                            >
                                <option value="">Sort By: Featured</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                            {/* Custom Arrow Icon */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Grid now uses sortedProducts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                        {sortedProducts.map((shoe) => (
                            <ProductCard key={shoe.id} product={shoe} />
                        ))}
                    </div>
            </div>

            {/* Second Banner - Air Force 1 Mid Flax */}
            <div className="max-w-350 mx-auto px-6 pb-20">
                <div className="w-full h-95 rounded-3xl overflow-hidden relative shadow-lg group isolate" style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1510134017377-0add0d2aa62f?q=80&w=2000&auto=format&fit=crop')", // autumn leaves
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-0"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-0"></div>

                    <div className="relative z-10 h-full flex items-center justify-between px-16">
                        <div className="text-white">
                            <h2 className="text-[48px] font-black leading-none uppercase mb-2 tracking-tight">
                                AIR FORCE 1 MID<br />FLAX
                            </h2>
                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-8 font-sans">
                                AVAILABLE ON 09/08 AT 09:00AM CST
                            </p>
                            <button className="bg-white text-black text-sm font-bold rounded-full py-3 px-8 hover:bg-gray-100 transition-colors shadow-lg">
                                Add to cart
                            </button>
                        </div>

                        <div className="w-137.5 relative mt-16 transform transition-transform duration-700 group-hover:-translate-y-4">
                            <img
                                src="https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/l8og35sx908n5jwvcbpf/AIR+FORCE+1+MID+%2707+PRM+QS.png"
                                alt="Air Force 1 Mid Flax"
                                className="w-full h-auto object-contain filter drop-shadow-2xl"
                                style={{
                                    filter: 'sepia(60%) saturate(180%) hue-rotate(-30deg) brightness(85%) contrast(110%) drop-shadow(10px 20px 25px rgba(0,0,0,0.7))'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 border-t border-gray-100">
                <div className="max-w-350 mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8">
                    {/* Logo Column */}
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter">
                            Lac<span className="text-gray-300">ed</span>
                        </h2>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold text-black mb-6 text-[15px]">Brands</h3>
                        <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                            <li><a href="#" className="hover:text-black transition-colors">Nike</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Adidas</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-black mb-6 text-[15px]">Categories</h3>
                        <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                            <li><a href="/category" className="hover:text-black transition-colors">Air Force</a></li>
                            <li><a href="/category" className="hover:text-black transition-colors">Air Jordan</a></li>
                            <li><a href="/category" className="hover:text-black transition-colors">Pegasus</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-black mb-6 text-[15px]">New Arrivals</h3>
                        <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                            <li><a href="#" className="hover:text-black transition-colors">Latest Nike</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Latest Adidas</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Latest Pegasus</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Limited Edition</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-black mb-6 text-[15px]">Quick Links</h3>
                        <ul className="space-y-4 text-[14px] text-gray-500 font-semibold font-sans">
                            <li><a href="/search" className="hover:text-black transition-colors">Search</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Return Policy</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Contact Information</a></li>
                        </ul>
                    </div>
                </div>

                <div className="text-center py-8 text-gray-500 text-[14px] font-semibold border-t border-gray-100 tracking-wide font-sans">
                    © 2026 Laced PVT
                </div>
            </footer>
        </div>
    );
};

export default Home;