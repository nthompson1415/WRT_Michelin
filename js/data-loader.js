// Data loader utility
let restaurantData = null;

async function loadRestaurantData() {
    if (restaurantData) {
        return restaurantData;
    }
    
    try {
        const response = await fetch('restaurants/data.json');
        if (!response.ok) {
            throw new Error('Failed to load restaurant data');
        }
        restaurantData = await response.json();
        return restaurantData;
    } catch (error) {
        console.error('Error loading restaurant data:', error);
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
