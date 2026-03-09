import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/products/ProductCard';
import Footer from '../../components/common/Footer';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter States
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Dynamically generated filter lists
    const [brands, setBrands] = useState(['All']);
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                const data = response.data;
                
                setProducts(data);
                setFilteredProducts(data);

                // Automatically find all unique brands and categories
                const uniqueBrands = ['All', ...new Set(data.map(item => item.brand).filter(Boolean))];
                const uniqueCategories = ['All', ...new Set(data.map(item => item.category).filter(Boolean))];
                
                setBrands(uniqueBrands);
                setCategories(uniqueCategories);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load the catalog. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Run this effect whenever the user clicks a filter button
    useEffect(() => {
        let result = products;

        if (selectedBrand !== 'All') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        setFilteredProducts(result);
    }, [selectedBrand, selectedCategory, products]);

    const clearFilters = () => {
        setSelectedBrand('All');
        setSelectedCategory('All');
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <p className="font-black uppercase tracking-widest text-gray-400">Loading Catalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="mb-10 border-b border-gray-200 pb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Complete Collection</h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 border-l-4 border-red-500 text-red-600 font-bold mb-8">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* SIDEBAR: Filters */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-black">Filters</h2>
                                {(selectedBrand !== 'All' || selectedCategory !== 'All') && (
                                    <button 
                                        onClick={clearFilters}
                                        className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-red-500 hover:text-red-700 hover:border-red-700 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* BRANDS */}
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Brands</h3>
                                <div className="flex flex-col gap-2">
                                    {brands.map(brand => (
                                        <button
                                            key={`brand-${brand}`}
                                            onClick={() => setSelectedBrand(brand)}
                                            className={`text-left text-sm font-medium px-3 py-2 rounded-md transition-all ${
                                                selectedBrand === brand 
                                                ? 'bg-black text-white font-bold shadow-md' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CATEGORIES */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</h3>
                                <div className="flex flex-col gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={`cat-${category}`}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`text-left text-sm font-medium px-3 py-2 rounded-md transition-all ${
                                                selectedCategory === category 
                                                ? 'bg-black text-white font-bold shadow-md' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT: Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-gray-200 p-16 text-center rounded-2xl">
                                <p className="text-gray-400 font-black uppercase tracking-widest">No products match your filters.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 text-black font-black uppercase text-xs tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Category;