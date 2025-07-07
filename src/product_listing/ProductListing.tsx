import {useEffect, useState, useRef} from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import './ProductListing.css';

// Defining an object type so use interface
interface Product {
    name: string;
    price: number;
    images: Images;
    popularityScore: number;
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

    const productContainer = useRef<HTMLDivElement>(null);

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

    // Set scrolling amount to the offsetWidth so it swipes exactly to next products that is out of view.
    // Set negative value to swipe left, positive value to swipe right.
    function swipeLeft() {
        productContainer.current?.scrollBy({
            left: -productContainer.current.offsetWidth,
            behavior: 'smooth'
        });
    }

    function swipeRight() {
        productContainer.current?.scrollBy({
            left: productContainer.current.offsetWidth,
            behavior: 'smooth'
        });
    }

    // If mouse wheel moved to top swipe left, if wheel moved to bottom swipe right.
    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        
        if(event.deltaY < 0) {
            swipeLeft();
        }
        else if(event.deltaY > 0) {
            swipeRight();
        }
    }

    // Calculate stars based on product.popularityScore
    function fillStars(product: Product) {
        const stars = 5;
        const score = typeof product.popularityScore === 'number' ? product.popularityScore : 0;
        const rating = Math.round(score * stars * 10) / 10;
        const totalRating = score * stars;
        const fullStars = Math.floor(totalRating);
        const partialFill = totalRating - fullStars;

        return {rating, partialFill, fullStars, stars}
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

    // Add wheel event listener when component mounts
    useEffect(() => {
        const container = productContainer.current;
        
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            
            // Cleanup function to remove event listener
            return () => {
                container.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);

    return (
        <>
            <h1 id='title'>Product List</h1>

            <div id='product-and-swiper-wrapper' >
                <ArrowBackIosNewIcon className='arrow' onClick={swipeLeft} />

                <div id='product-container' ref={productContainer}>
                    {products.map((product, index) => {
                        const imageSrc = imageSource(product, index);

                        return (
                            <div key={index} className="product" >
                                <img
                                    src={imageSrc}
                                    alt="product-image"
                                    className='product-image'
                                />

                                <h2 className='product-name'>{product.name}</h2>
                                <p className='product-price'>${product.price} USD</p>

                                <div className='color-picker'>
                                    <button className='yellow-gold' onClick={() => setColor(index, 'yellow')} role='button' ></button>
                                    <button className='white-gold' onClick={() => setColor(index, 'white')} role='button' ></button>
                                    <button className='rose-gold' onClick={() => setColor(index, 'rose')} role='button' ></button>
                                </div>

                                <p className='color-choice'>
                                    {
                                        selectedColors[index] === 'yellow' ? "Yellow Gold"
                                        : selectedColors[index] === 'white' ? "White Gold"
                                        : selectedColors[index] === 'rose' ? "Rose Gold"
                                        : "Yellow Gold"
                                    }
                                </p>
                                
                                {/* Star Rating */}
                                <div className="star-rating">
                                    {(() => {
                                        const {rating, partialFill, fullStars, stars} = fillStars(product);
                                    
                                        return (
                                            <>
                                                {Array.from({ length: stars }).map((_, i) => {
                                                    if(i < fullStars) {
                                                        // Full star
                                                        return (
                                                            <span
                                                                key={i}
                                                                className="star"
                                                                style={{ color: '#E6CA97' }}
                                                            >
                                                                ★
                                                            </span>
                                                        );
                                                    }
                                                    else if(i === fullStars && partialFill > 0) {
                                                        // Partially filled star
                                                        return (
                                                            <span
                                                                key={i}
                                                                className="star"
                                                                style={{ 
                                                                    position: 'relative',
                                                                    display: 'inline-block'
                                                                }}
                                                            >
                                                                <span style={{ color: '#E0E0E0' }}>★</span>
                                                                <span 
                                                                    style={{ 
                                                                        color: '#E6CA97',
                                                                        position: 'absolute',
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: `${partialFill * 100}%`,
                                                                        overflow: 'hidden'
                                                                    }}
                                                                >
                                                                    ★
                                                                </span>
                                                            </span>
                                                        );
                                                    }
                                                    else {
                                                        // Empty star
                                                        return (
                                                            <span
                                                                key={i}
                                                                className="star"
                                                                style={{ color: '#E0E0E0' }}
                                                            >
                                                                ★
                                                            </span>
                                                        );
                                                    }
                                                })}
                                                <span className="star-rating-text">
                                                    {rating}/5
                                                </span>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <ArrowForwardIosIcon className='arrow' onClick={swipeRight} />
            </div>
        </>
    )
}

export default ProductListing;