// Restaurant detail page functionality
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');
    
    console.log('Restaurant ID from URL:', restaurantId);
    
    if (!restaurantId) {
        document.getElementById('restaurant-details').innerHTML = 
            '<p>Restaurant not found. No ID provided in URL.</p>';
        return;
    }
    
    const data = await loadRestaurantData();
    console.log('Loaded restaurant data:', data);
    console.log('Total restaurants loaded:', data.restaurants?.length || 0);
    
    const restaurant = getRestaurantById(restaurantId);
    console.log('Found restaurant:', restaurant);
    
    if (!restaurant) {
        document.getElementById('restaurant-details').innerHTML = 
            `<p>Restaurant not found. ID: "${restaurantId}"</p>
             <p>Available restaurant IDs: ${data.restaurants?.map(r => r.id).join(', ') || 'none'}</p>`;
        return;
    }
    
    renderRestaurantDetails(restaurant);
});

function renderRestaurantDetails(restaurant) {
    document.getElementById('restaurant-name').textContent = restaurant.name;
    document.title = `${restaurant.name} - Syracuse Food Guide`;
    
    const detailsContainer = document.getElementById('restaurant-details');
    
    const stars = '★'.repeat(Math.floor(restaurant.rating)) + 
                  (restaurant.rating % 1 >= 0.5 ? '½' : '');
    
    // Create map embed URL
    const mapAddress = encodeURIComponent(restaurant.address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6V4qcZ1h8eE&q=${mapAddress}`;
    
    let html = `
        <div class="restaurant-header">
            <h2>${restaurant.name}</h2>
            <div class="cuisine">${restaurant.cuisine}</div>
            <div class="rating-large">
                <span class="rating-value">${restaurant.rating.toFixed(1)}</span>
                <span class="rating-stars">${stars}</span>
            </div>
        </div>
        
        <div class="restaurant-info">
            <div class="info-item">
                <label>Distance</label>
                <div class="value">${restaurant.distance} from SU</div>
            </div>
            ${restaurant.priceRange ? `
            <div class="info-item">
                <label>Price Range</label>
                <div class="value">${restaurant.priceRange}</div>
            </div>
            ` : ''}
            ${restaurant.hours ? `
            <div class="info-item">
                <label>Hours</label>
                <div class="value">${restaurant.hours}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="restaurant-location">
            <h3>Location</h3>
            <div class="address">${restaurant.address}</div>
            <div class="map-container">
                <iframe
                    src="https://www.google.com/maps?q=${mapAddress}&output=embed"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
        
        <div class="restaurant-review">
            <h3>Review</h3>
            <div class="review-summary">
                ${restaurant.review.summary}
            </div>
    `;
    
    if (restaurant.review.highlights && restaurant.review.highlights.length > 0) {
        html += `
            <div class="review-highlights">
                <h4>Highlights</h4>
                <ul>
                    ${restaurant.review.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if ((restaurant.review.pros && restaurant.review.pros.length > 0) || 
        (restaurant.review.cons && restaurant.review.cons.length > 0)) {
        html += `
            <div class="review-pros-cons">
        `;
        
        if (restaurant.review.pros && restaurant.review.pros.length > 0) {
            html += `
                <div class="pros">
                    <h4>Pros</h4>
                    <ul>
                        ${restaurant.review.pros.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (restaurant.review.cons && restaurant.review.cons.length > 0) {
            html += `
                <div class="cons">
                    <h4>Cons</h4>
                    <ul>
                        ${restaurant.review.cons.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    html += `</div>`;
    
    detailsContainer.innerHTML = html;
}
