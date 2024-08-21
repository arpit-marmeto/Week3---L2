document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.menu-active').classList.toggle('open');
});

document.querySelector('.close-menu').addEventListener('click', function() {
    document.querySelector('.menu-active').classList.remove('open');
});

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

// Render the first result card
function renderFirstResult(photo) {
    document.getElementById('firstResultCard').classList.remove('hidden');
    document.getElementById('firstResultImage').src = photo.src.medium;
    document.getElementById('firstResultName').textContent = photo.photographer;
    document.getElementById('firstResultCategory').textContent = `Image: ${photo.alt || 'No description available'}`;
    document.getElementById('firstResultButton').setAttribute('href', photo.url);
}

// Render similar results in the slider
function renderSliderResults(photos) {
    const sliderResults = document.getElementById('sliderResults');
    sliderResults.innerHTML = ''; // Clear previous results

    photos.forEach(photo => {
        const sliderCard = `
            <li class="splide__slide">
                <div class="bg-white shadow-md p-4">
                    <img src="${photo.src.medium}" alt="${photo.alt || 'No description available'}" class="w-full h-40 object-cover mb-4">
                    <h3 class="text-xl font-bold">${photo.alt || 'No description available'}</h3> <!-- Display image name -->
                    <p class="text-gray-600">Photographer: ${photo.photographer}</p> <!-- Display photographer name -->
                    <a href="${photo.url}" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Explore Profile</a>
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
