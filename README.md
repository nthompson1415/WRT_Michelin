# Syracuse Food Guide

A Michelin Guide-inspired website showcasing the best restaurants within 5 miles of Syracuse University's campus.

## Overview

This GitHub Pages site provides curated reviews and information about restaurants near Syracuse University, featuring:
- Detailed restaurant listings with ratings
- Comprehensive reviews based on aggregated data
- Location information with embedded maps
- Filtering and search functionality
- Responsive, mobile-friendly design

## Project Structure

```
WRT_Michelin/
├── index.html              # Main homepage
├── restaurants/
│   ├── restaurant.html     # Restaurant detail page template
│   └── data.json           # Restaurant data
├── css/
│   ├── style.css           # Main stylesheet
│   └── restaurant.css      # Detail page styles
├── js/
│   ├── main.js             # Homepage functionality
│   ├── restaurant.js       # Detail page logic
│   └── data-loader.js      # Data loading utility
└── images/
    └── restaurants/        # Restaurant photos
```

## Setup

1. Clone this repository
2. Ensure `restaurants/data.json` contains restaurant data (already included with 20 restaurants)
3. Push to GitHub
4. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Select "GitHub Actions" as the source (the workflow file is already configured)
   - Or use "Deploy from a branch" and select main/master branch
5. The site will be available at `https://[username].github.io/WRT_Michelin/`

## Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that automatically deploys the site to GitHub Pages when you push to the main or master branch. Alternatively, you can enable GitHub Pages manually in the repository settings.

## Data Format

Restaurant data is stored in `restaurants/data.json` with the following structure:

```json
{
  "restaurants": [
    {
      "id": "restaurant-slug",
      "name": "Restaurant Name",
      "cuisine": "Italian",
      "address": "123 Main St, Syracuse, NY",
      "coordinates": {
        "lat": 43.0378,
        "lng": -76.1340
      },
      "distance": "0.5 miles",
      "rating": 4.5,
      "priceRange": "$$",
      "hours": "Mon-Sat: 11am-10pm",
      "review": {
        "summary": "Review summary...",
        "highlights": ["Highlight 1", "Highlight 2"],
        "pros": ["Pro 1"],
        "cons": ["Con 1"]
      }
    }
  ]
}
```

## Features

- **Restaurant Listings**: Grid view of all restaurants with key information
- **Detailed Reviews**: Comprehensive reviews based on aggregated data
- **Location Maps**: Embedded Google Maps for each restaurant
- **Filtering**: Filter by cuisine type and minimum rating
- **Search**: Search restaurants by name, cuisine, or address
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## License

This project is for educational purposes as part of a WRT class assignment.
