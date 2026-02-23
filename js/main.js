let allRestaurants = [];
let filteredRestaurants = [];

const CUISINE_ICONS = {
    'Italian': '🍝',
    'Barbecue': '🍖',
    'American': '🍔',
    'Pizza': '🍕',
    'Vegetarian': '🥗',
    'Mexican': '🌮',
    'Japanese': '🍣',
    'Irish': '🍀',
    'Cafe': '☕',
    'Fondue': '🫕',
    'Mediterranean': '🥙',
    'Diner': '🥞',
    'Fast Food': '🍟',
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadRestaurantData();
    allRestaurants = data.restaurants || [];
    filteredRestaurants = [...allRestaurants];

    initNavbar();
    initHeroSearch();
    renderHeroStats();
    renderFeatured();
    renderCuisines();
    renderNearCampus();
    renderAffordable();
    populateCuisineFilter();
    renderRestaurants();
    setupFilters();
    initScrollAnimations();
});

// ── Navigation ─────────────────────────────────────

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });

        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => links.classList.remove('open'));
        });
    }
}

// ── Hero Search ────────────────────────────────────

function initHeroSearch() {
    const input = document.getElementById('hero-search');
    const btn = document.getElementById('hero-search-btn');

    function doSearch() {
        const term = input.value.trim();
        if (!term) return;
        const browse = document.getElementById('browse');
        if (browse) {
            browse.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const filterSearch = document.getElementById('filter-search');
                if (filterSearch) {
                    filterSearch.value = term;
                    applyFilters();
                }
            }, 500);
        }
    }

    if (btn) btn.addEventListener('click', doSearch);
    if (input) input.addEventListener('keypress', e => {
        if (e.key === 'Enter') doSearch();
    });
}

// ── Hero Stats ─────────────────────────────────────

function renderHeroStats() {
    const cuisines = new Set(allRestaurants.map(r => r.cuisine));
    const nearCampus = allRestaurants.filter(r => parseDistance(r.distance) <= 0.5);

    animateCounter('stat-total', allRestaurants.length);
    animateCounter('stat-cuisines', cuisines.size);
    animateCounter('stat-nearby', nearCampus.length);
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ── Featured Restaurants ───────────────────────────

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    const topRated = [...allRestaurants]
        .filter(r => r.cuisine !== 'Fast Food')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    grid.innerHTML = topRated.map((r, i) => {
        const stars = '★'.repeat(Math.floor(r.rating)) + (r.rating % 1 >= 0.5 ? '½' : '');
        const summary = r.review?.summary || '';
        const truncated = summary.length > 160 ? summary.slice(0, 160) + '...' : summary;

        return `
            <a href="${getRestaurantUrl(r.id)}" class="featured-card fade-in">
                <div class="featured-card-top">
                    <div class="featured-rank">#${i + 1}</div>
                    <h3>${r.name}</h3>
                    <div class="featured-cuisine">${r.cuisine}</div>
                    <div class="featured-rating">
                        <span class="featured-rating-value">${r.rating.toFixed(1)}</span>
                        <span class="featured-rating-stars">${stars}</span>
                    </div>
                </div>
                <div class="featured-highlight">
                    <p>${truncated}</p>
                </div>
                <div class="featured-card-bottom">
                    <span class="featured-distance">📍 ${r.distance} from SU</span>
                    <span class="featured-price">${r.priceRange || ''}</span>
                </div>
            </a>`;
    }).join('');
}

// ── Cuisine Categories ─────────────────────────────

function renderCuisines() {
    const grid = document.getElementById('cuisine-grid');
    if (!grid) return;

    const counts = {};
    allRestaurants.forEach(r => {
        counts[r.cuisine] = (counts[r.cuisine] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    grid.innerHTML = sorted.map(([cuisine, count]) => {
        const icon = CUISINE_ICONS[cuisine] || '🍽️';
        return `
            <div class="cuisine-card fade-in" data-cuisine="${cuisine}">
                <span class="cuisine-icon">${icon}</span>
                <div class="cuisine-name">${cuisine}</div>
                <div class="cuisine-count">${count} restaurant${count > 1 ? 's' : ''}</div>
            </div>`;
    }).join('');

    grid.querySelectorAll('.cuisine-card').forEach(card => {
        card.addEventListener('click', () => {
            const cuisine = card.dataset.cuisine;
            const browse = document.getElementById('browse');
            if (browse) browse.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const filter = document.getElementById('cuisine-filter');
                if (filter) {
                    filter.value = cuisine;
                    applyFilters();
                }
            }, 500);
        });
    });
}

// ── Near Campus ────────────────────────────────────

function renderNearCampus() {
    const grid = document.getElementById('near-grid');
    if (!grid) return;

    const nearby = [...allRestaurants]
        .filter(r => r.cuisine !== 'Fast Food')
        .sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance))
        .slice(0, 6);

    grid.innerHTML = nearby.map(r => {
        const dist = parseDistance(r.distance);
        const stars = '★'.repeat(Math.floor(r.rating)) + (r.rating % 1 >= 0.5 ? '½' : '');
        return `
            <a href="${getRestaurantUrl(r.id)}" class="near-card fade-in">
                <div class="near-card-distance">
                    <span class="dist-value">${dist}</span>
                    <span class="dist-unit">miles</span>
                </div>
                <div class="near-card-info">
                    <h3>${r.name}</h3>
                    <div class="near-card-meta">
                        <span class="near-rating">${r.rating.toFixed(1)}</span>
                        <span class="near-stars">${stars}</span>
                        <span>${r.cuisine}</span>
                        <span>${r.priceRange || ''}</span>
                    </div>
                </div>
            </a>`;
    }).join('');
}

// ── College Affordable ─────────────────────────────

function renderAffordable() {
    const scroll = document.getElementById('affordable-scroll');
    if (!scroll) return;

    const affordable = allRestaurants
        .filter(r => r.priceRange === '$' || r.collegeAffordable)
        .sort((a, b) => b.rating - a.rating);

    scroll.innerHTML = affordable.map(r => {
        const stars = '★'.repeat(Math.floor(r.rating)) + (r.rating % 1 >= 0.5 ? '½' : '');
        return `
            <a href="${getRestaurantUrl(r.id)}" class="affordable-card fade-in">
                <span class="affordable-card-price">${r.priceRange || '$'}</span>
                <h3>${r.name}</h3>
                <div class="affordable-card-cuisine">${r.cuisine}</div>
                <div class="affordable-card-rating">
                    <span class="rating-num">${r.rating.toFixed(1)}</span>
                    <span class="rating-stars">${stars}</span>
                </div>
            </a>`;
    }).join('');
}

// ── Filters (Browse All section) ───────────────────

function populateCuisineFilter() {
    const cuisineFilter = document.getElementById('cuisine-filter');
    if (!cuisineFilter) return;
    const cuisines = [...new Set(allRestaurants.map(r => r.cuisine))].sort();

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineFilter.appendChild(option);
    });
}

function setupFilters() {
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');
    const searchInput = document.getElementById('filter-search');

    if (applyButton) applyButton.addEventListener('click', applyFilters);
    if (searchInput) searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') applyFilters();
    });
    if (clearButton) clearButton.addEventListener('click', clearFilters);
}

function applyFilters() {
    const cuisineVal = document.getElementById('cuisine-filter')?.value || 'all';
    const ratingVal = parseFloat(document.getElementById('rating-filter')?.value) || 0;
    const priceVal = document.getElementById('price-filter')?.value || 'all';
    const searchTerm = (document.getElementById('filter-search')?.value || '').toLowerCase();

    filteredRestaurants = allRestaurants.filter(r => {
        const matchesCuisine = cuisineVal === 'all' || r.cuisine === cuisineVal;
        const matchesRating = r.rating >= ratingVal;
        const matchesSearch = !searchTerm ||
            r.name.toLowerCase().includes(searchTerm) ||
            r.cuisine.toLowerCase().includes(searchTerm) ||
            (r.address && r.address.toLowerCase().includes(searchTerm));

        let matchesPrice = true;
        if (priceVal === 'affordable') matchesPrice = r.priceRange === '$' || r.collegeAffordable === true;
        else if (priceVal === 'moderate') matchesPrice = r.priceRange === '$$';
        else if (priceVal === 'upscale') matchesPrice = r.priceRange === '$$$' || r.priceRange === '$$$$';

        return matchesCuisine && matchesRating && matchesSearch && matchesPrice;
    });

    renderRestaurants();
}

function clearFilters() {
    const cf = document.getElementById('cuisine-filter');
    const rf = document.getElementById('rating-filter');
    const pf = document.getElementById('price-filter');
    const sf = document.getElementById('filter-search');

    if (cf) cf.value = 'all';
    if (rf) rf.value = '0';
    if (pf) pf.value = 'all';
    if (sf) sf.value = '';

    filteredRestaurants = [...allRestaurants];
    renderRestaurants();
}

function renderRestaurants() {
    const grid = document.getElementById('restaurants-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';

    if (filteredRestaurants.length === 0) {
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    filteredRestaurants.forEach(r => {
        const card = createRestaurantCard(r);
        grid.appendChild(card);
    });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('a');
    card.href = getRestaurantUrl(restaurant.id);
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
        </div>`;

    return card;
}

// ── Scroll Animations ──────────────────────────────

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── Helpers ────────────────────────────────────────

function parseDistance(distStr) {
    const match = distStr?.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : Infinity;
}

function getRestaurantUrl(id) {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const repoName = pathParts[0] || '';
    const basePath = repoName ? `/${repoName}` : '';
    return `${basePath}/restaurants/restaurant.html?id=${id}`;
}
