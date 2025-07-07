import {useEffect, useState} from 'react';

import './ProductListing.css';

// Defining an object type so use interface
interface Product {
    name: string;
    price: number;
    images: Images;
}

// Defining properties of an object so also use interface
interface Images {
    white: string;
    yellow: string;
    rose: string;
}

function ProductListing() {
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    // Function to keep track of user's color choice
    function setColor(index: number, color: string) {
        setSelectedColors(prev => {
            const updated = [...prev];
            updated[index] = color;
            return updated;
        });
    }

    // Function to determine image source depending on user's color choice
    function imageSource(product: Product, index: number) {
        const selectedColor = selectedColors[index];
        let imageSrc = '';

        if(selectedColor === 'white') {
            return imageSrc = product.images.white;
        }
        else if(selectedColor === 'rose') {
            return imageSrc = product.images.rose;
        }
        else {
            return imageSrc = product.images.yellow; // Default color is yellow
        }
    }

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
        <div id='product-container'>
            {products.map((product, index) => {
                const imageSrc = imageSource(product, index);

                return (
                    <div key={index} className="product">
                        <img
                            src={imageSrc}
                            alt="product-image"
                            className='product-image'
                        />

                        <h2 className='product-name'>{product.name}</h2>
                        <p className='product-price'>Price: {product.price}</p>
                        <div className='color-picker'>
                            <button className='yellow-gold' onClick={() => setColor(index, 'yellow')} ></button>
                            <button className='white-gold' onClick={() => setColor(index, 'white')} ></button>
                            <button className='rose-gold' onClick={() => setColor(index, 'rose')} ></button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductListing