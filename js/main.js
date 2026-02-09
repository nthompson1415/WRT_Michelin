// Main homepage functionality
let allRestaurants = [];
let filteredRestaurants = [];

document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadRestaurantData();
    allRestaurants = data.restaurants || [];
    filteredRestaurants = [...allRestaurants];
    
    populateCuisineFilter();
    renderRestaurants();
    setupFilters();
});

function populateCuisineFilter() {
    const cuisineFilter = document.getElementById('cuisine-filter');
    const cuisines = [...new Set(allRestaurants.map(r => r.cuisine))].sort();
    
    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineFilter.appendChild(option);
    });
}

function setupFilters() {
    const cuisineFilter = document.getElementById('cuisine-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const affordableFilter = document.getElementById('affordable-filter');
    const searchInput = document.getElementById('search');
    
    cuisineFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    affordableFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

function applyFilters() {
    const cuisineFilter = document.getElementById('cuisine-filter').value;
    const ratingFilter = parseFloat(document.getElementById('rating-filter').value) || 0;
    const affordableFilter = document.getElementById('affordable-filter').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    filteredRestaurants = allRestaurants.filter(restaurant => {
        const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisine === cuisineFilter;
        const matchesRating = restaurant.rating >= ratingFilter;
        const matchesSearch = searchTerm === '' || 
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm) ||
            (restaurant.address && restaurant.address.toLowerCase().includes(searchTerm));
        
        let matchesPrice = true;
        if (affordableFilter === 'affordable') {
            matchesPrice = restaurant.priceRange === '$' || restaurant.collegeAffordable === true;
        } else if (affordableFilter === 'moderate') {
            matchesPrice = restaurant.priceRange === '$$';
        } else if (affordableFilter === 'upscale') {
            matchesPrice = restaurant.priceRange === '$$$' || restaurant.priceRange === '$$$$';
        }
        
        return matchesCuisine && matchesRating && matchesSearch && matchesPrice;
    });
    
    renderRestaurants();
}

function renderRestaurants() {
    const grid = document.getElementById('restaurants-grid');
    const noResults = document.getElementById('no-results');
    
    grid.innerHTML = '';
    
    if (filteredRestaurants.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredRestaurants.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        grid.appendChild(card);
    });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('a');
    // Get base path for GitHub Pages
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const repoName = pathParts[0] || '';
    const basePath = repoName ? `/${repoName}` : '';
    card.href = `${basePath}/restaurants/restaurant.html?id=${restaurant.id}`;
    card.className = 'restaurant-card';
    
    const stars = '★'.repeat(Math.floor(restaurant.rating)) + 
                  (restaurant.rating % 1 >= 0.5 ? '½' : '');
    
    card.innerHTML = `
        <div class="restaurant-card-header">
            <h2>${restaurant.name}</h2>
            <div class="cuisine">${restaurant.cuisine}</div>
        </div>
        <div class="restaurant-card-body">
            <div class="rating">
                <span class="rating-value">${restaurant.rating.toFixed(1)}</span>
                <span class="rating-stars">${stars}</span>
            </div>
            <div class="distance">📍 ${restaurant.distance} from SU</div>
            ${restaurant.priceRange ? `<div class="price-range">${restaurant.priceRange}</div>` : ''}
        </div>
    `;
    
    return card;
}
