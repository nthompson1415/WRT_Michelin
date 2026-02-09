// Data loader utility
let restaurantData = null;

async function loadRestaurantData() {
    if (restaurantData) {
        return restaurantData;
    }
    
    try {
        // Get base path for GitHub Pages (repository name)
        // Works from both index.html and restaurants/restaurant.html
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const repoName = pathParts[0] || '';
        const basePath = repoName ? `/${repoName}` : '';
        
        // Try multiple path variations to ensure it works
        const paths = [
            `${basePath}/restaurants/data.json`,
            `./restaurants/data.json`,
            `../restaurants/data.json`,
            `restaurants/data.json`
        ];
        
        let response;
        let lastError;
        
        for (const path of paths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    restaurantData = await response.json();
                    console.log('Successfully loaded restaurant data from:', path);
                    return restaurantData;
                }
            } catch (error) {
                lastError = error;
                continue;
            }
        }
        
        throw new Error(`Failed to load restaurant data. Last error: ${lastError?.message || 'Unknown'}`);
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        console.error('Current pathname:', window.location.pathname);
        console.error('Attempted paths:', [
            `${window.location.pathname.split('/').filter(p => p)[0] || ''}/restaurants/data.json`,
            './restaurants/data.json',
            '../restaurants/data.json',
            'restaurants/data.json'
        ]);
        return { restaurants: [] };
    }
}

function getRestaurantById(id) {
    if (!restaurantData) {
        return null;
    }
    return restaurantData.restaurants.find(r => r.id === id);
}

function getAllRestaurants() {
    if (!restaurantData) {
        return [];
    }
    return restaurantData.restaurants;
}
