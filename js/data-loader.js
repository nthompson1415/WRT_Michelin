// Data loader utility
let restaurantData = null;

async function loadRestaurantData() {
    if (restaurantData) {
        return restaurantData;
    }
    
    try {
        // Get base path for GitHub Pages (repository name)
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const repoName = pathParts[0] || '';
        const basePath = repoName ? `/${repoName}` : '';
        
        const dataPath = `${basePath}/restaurants/data.json`;
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load restaurant data: ${response.status}`);
        }
        
        restaurantData = await response.json();
        return restaurantData;
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        console.error('Attempted path:', `${window.location.pathname.split('/').filter(p => p)[0] || ''}/restaurants/data.json`);
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
