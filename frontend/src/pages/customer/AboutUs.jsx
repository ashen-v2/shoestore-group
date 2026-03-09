import Navbar from '../../components/common/Navbar';
import shopImage from '../../assets/images/shop.png';
import shopImage2 from '../../assets/images/shop2.png';
import productImage from '../../assets/images/product.jpg';
import Footer from '../../components/common/Footer';

const AboutUs = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            
            {/* HERO SECTION */}
            <div className="max-w-6xl mx-auto px-6 pt-20 text-center animate-fade-in-down">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-black mb-6">
                    Step Into <br/> <span className="text-gray-400">Greatness.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-gray-600 font-medium text-lg leading-relaxed mb-16">
                    We aren't just selling shoes; we are curating the foundation of your daily journey. 
                    From exclusive drops to everyday essentials, our mission is to bring you the highest 
                    quality footwear with an unmatched customer experience.
                </p>
            </div>

            {/* IMAGE GRID PLACEHOLDER */}
            <div className="max-w-6xl mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <img src={shopImage2} alt="Storefront" className="w-full h-64 rounded-2xl object-cover" />
                    <img src={productImage} alt="Product display" className="w-full h-64 rounded-2xl object-cover" />
                    <img src={shopImage} alt="Community" className="w-full h-64 rounded-2xl object-cover" />
                </div>
            </div>

            {/* OUR VALUES */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-10 border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-black">Our Core Values</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mb-6 font-black text-xl">1</div>
                        <h3 className="text-lg font-black uppercase tracking-tighter text-black mb-3">Authenticity</h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed">
                            Every pair of shoes we source is 100% verified. We believe in building trust through transparency and delivering exactly what we promise.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mb-6 font-black text-xl">2</div>
                        <h3 className="text-lg font-black uppercase tracking-tighter text-black mb-3">Community</h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed">
                            Sneaker culture is about the people. We provide a platform where enthusiasts can connect, review products, and share their style.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mb-6 font-black text-xl">3</div>
                        <h3 className="text-lg font-black uppercase tracking-tighter text-black mb-3">Support</h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed">
                            With our dedicated Help Desk and easy return policies, we ensure that your post-purchase experience is just as smooth as checkout.
                        </p>
                    </div>
                </div>
            </div>
            <div className="pt-10"></div>

            {/* Footer */}
           <Footer />
        </div>
    );
};

export default AboutUs;