import {useEffect, useState} from 'react';

import './ProductListing.css';

interface Product {
    name: string;
    price: number;
}

function ProductListing() {
    const [products, setProducts] = useState<Product[]>([]);

    // Get product list from server
    useEffect(() => {
        fetch('http://localhost:8080/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setProducts(data.products);
        })
    }, []);

    return (
        <div>
            {products.map((product, index) => {
                return (
                    <div key={index} className="product">
                        <h2>{product.name}</h2>
                        <p>Price: {product.price}</p>
                        <div className='color-picker'>
                            <div className='yellow-gold'></div>
                            <div className='white-gold'></div>
                            <div className='rose-gold'></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductListing