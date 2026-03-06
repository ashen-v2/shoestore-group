import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        // Wrap the whole card (or just the image/title) in a Link to the new page
        <Link to={`/products/${product.id}`} className="block group cursor-pointer">
            <div className=" relative overflow-hidden mb-4 aspect-square flex items-center justify-center p-2">
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                />
            </div>
            
            <div className="flex justify-between items-start mt-4">
                <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-black group-hover:text-gray-500 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {product.brand}
                    </p>
                </div>
                <span className="font-black italic text-sm text-black">${product.price}</span>
            </div>
        </Link>
    );
};

export default ProductCard;