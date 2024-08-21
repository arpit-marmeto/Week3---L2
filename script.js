// ----- Hamburger Menu Functionality -----

// Toggle menu visibility when hamburger icon is clicked
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.menu-active').classList.toggle('open');
});

// Close the menu when close icon is clicked
document.querySelector('.close-menu').addEventListener('click', function() {
    document.querySelector('.menu-active').classList.remove('open');
});

// ----- Pexels API Integration -----

const API_KEY = 'ml3IcyswtevACPjeoE94GGXBWYVbtBmg88s6GaeLBxjkmWYl0K5X6FKC';
const API_URL = 'https://api.pexels.com/v1/search?query=';

// Fetch data from Pexels API
async function fetchPhotographers(query) {
    try {
        const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error('Error fetching photographers:', error);
        return [];
    }
}

// Handle search input
document.getElementById('searchBar').addEventListener('input', async function() {
    const query = this.value.trim();
    
    if (query) {
        const photos = await fetchPhotographers(query);

        console.log('Fetched photos:', photos); // Debugging line

        if (photos.length > 0) {
            // Render the first result as a separate card
            renderFirstResult(photos[0]);

            // Render the rest of the results in the slider
            renderSliderResults(photos.slice(1));
        } else {
            // Hide first result card and clear slider if no results
            document.getElementById('firstResultCard').classList.add('hidden');
            document.getElementById('sliderResults').innerHTML = '';
        }
    } else {
        // If search query is empty, hide the first result card and clear the slider
        document.getElementById('firstResultCard').classList.add('hidden');
        document.getElementById('sliderResults').innerHTML = '';
    }
});

// ----- Rendering Functions -----

// Render the first result card
function renderFirstResult(photo) {
    document.getElementById('firstResultCard').classList.remove('hidden');
    document.getElementById('firstResultImage').src = photo.src.medium;
    document.getElementById('firstResultAlt').textContent = photo.alt;
    document.getElementById('firstResultPhotographer').textContent = photo.photographer;
    document.getElementById('firstResultButton').setAttribute('href', photo.url);
}

// Render similar results in the slider
function renderSliderResults(photos) {
    const sliderResults = document.getElementById('sliderResults');
    sliderResults.innerHTML = ''; // Clear previous results

    photos.forEach(photo => {
        const sliderCard = `
        <li class="splide__slide pl-16 pr-16">
        <div class="bg-white shadow-md card-container ">
        <img src="${photo.src.medium}" alt="${photo.alt || 'No description available'}" class="card-image">
        <span class="heart-icon cursor-pointer" onclick="toggleFavorite(${photo.id}, '${photo.src.medium}', '${photo.alt || 'No description available'}', this)">
            <i class="fa-solid fa-heart"></i>
        </span>
        <div class="p-5 card-content">
            <h3 class="text-xl font-bold">${photo.alt || 'No description available'}</h3>
            <p class="text-gray-600">${photo.photographer}</p>
        </div>
        </div>
        </li>
        `;
        sliderResults.insertAdjacentHTML('beforeend', sliderCard);
    });

    // Initialize or refresh Splide.js
    new Splide('#resultsSlider', {
        perPage: 4,
        gap: '1rem',
        pagination: false,
        breakpoints: {
            640: {
                perPage: 1,
            },
            768: {
                perPage: 2,
            },
            1024: {
                perPage: 3,
            },
        },
    }).mount();
}

// ----- Favorite List Functionality -----

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Render favorites list
function renderFavorites() {
    const favoritesResults = document.getElementById('favoritesResults');
    favoritesResults.innerHTML = ''; // Clear previous results

    favorites.forEach(favorite => {
        const sliderCard = `
            <li class="splide__slide pl-16 pr-16">
                <div class="bg-white shadow-md">
                <img src="${favorite.src}" alt="${favorite.alt}" class="w-full h-40 object-cover mb-4">
                <div class="p-5">          
                    <h3 class="text-xl font-bold">${favorite.alt}</h3>
                    <p class="text-gray-600">${favorite.photographer}</p>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4" onclick="removeFavorite(${favorite.id})">Remove</button>
                </div>
                </div>
            </li>
        `;
        favoritesResults.insertAdjacentHTML('beforeend', sliderCard);
    });

    // Initialize or refresh Splide.js for favorites
    new Splide('#favoritesSlider', {
        perPage: 4,
        gap: '1rem',
        pagination: false,
        breakpoints: {
            640: {
                perPage: 1,
            },
            768: {
                perPage: 2,
            },
            1024: {
                perPage: 3,
            },
        },
    }).mount();
}

// Toggle favorite status
function toggleFavorite(id, src, alt, heartIconElement) {
    const index = favorites.findIndex(fav => fav.id === id);

    if (index === -1) {
        // Add to favorites
        favorites.push({ id, src, alt });
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateHeartIcon(id, heartIconElement); // Update the heart icon color
    renderFavorites();
}


// Remove a favorite
function removeFavorite(id) {
    // Remove from favorites array
    const index = favorites.findIndex(fav => fav.id === id);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites(); // Re-render the favorites list
    }
}

// Render favorites on page load
renderFavorites();


function updateHeartIcon(id, heartIconElement) {
    const isFavorite = favorites.some(fav => fav.id === id);
    if (isFavorite) {
        heartIconElement.classList.add('text-red-500'); // Set heart color to red
        heartIconElement.classList.remove('text-white'); // Remove white color if present
    } else {
        heartIconElement.classList.add('text-white'); // Set heart color to white
        heartIconElement.classList.remove('text-red-500'); // Remove red color if present
    }
}
