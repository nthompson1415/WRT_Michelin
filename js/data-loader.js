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
        
        // Always use absolute path from repository root to avoid path issues
        const dataPath = `${basePath}/restaurants/data.json`;
        
        console.log('Loading restaurant data from:', dataPath);
        console.log('Current pathname:', window.location.pathname);
        
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load restaurant data: ${response.status} ${response.statusText}`);
        }
        
        restaurantData = await response.json();
        console.log('Successfully loaded restaurant data:', restaurantData.restaurants?.length || 0, 'restaurants');
        return restaurantData;
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        console.error('Current pathname:', window.location.pathname);
        console.error('Base path calculated:', window.location.pathname.split('/').filter(p => p)[0] || '');
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
