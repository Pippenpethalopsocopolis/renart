
import express, { Request, Response } from 'express';

import products from '../../../data/products.json' with { type: 'json' };

const router = express.Router();

router.get('/products', async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await fetch("https://api.metalpriceapi.com/v1/latest?api_key=7f539eca690b0d394ffa2c501a59d6ad&base=XAU&currencies=USD")
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if(data.error) {
            console.error('API Error:', data.error);
            res.status(500).json({ error: 'Failed to fetch product data' });
            return;
        }

        // Example data to not to spend from API
        /*const data = {
            "rates": {
                "XAUUSD": 2000.00, // Example value, replace with actual API response
                "USD": 2000.00 // Example value, replace with actual API response
            },
            "timestamp": 1700000000,
            "base": "XAU"
        };*/

        // Since unit choosing is paid in the api, i converted it manually
        const oneTroyOunceToGrams = 31.1035;
        const goldPricePerGram = data.rates.USD / oneTroyOunceToGrams;

        data.rates.USD = goldPricePerGram;

        console.log('Gold price per gram:', data);

        products.forEach(product => {
            product['price'] = ((product.popularityScore + 1) * product.weight * data.rates.USD).toFixed(2);
        })

        res.json({
            products,
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
    }
});

export default router;