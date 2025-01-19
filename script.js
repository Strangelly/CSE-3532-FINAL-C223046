document.addEventListener('DOMContentLoaded', () => {
    const videoGallery = document.getElementById('videoGallery');
    const filterButtonsContainer = document.querySelector('section.bg-white .container'); // Container for buttons
    
    // Fetch the video categories
    fetch('https://openapi.programming-hero.com/api/videos/categories')
      .then(response => response.json())
      .then(data => {
        const categories = data.data;
  
        // Dynamically create filter buttons based on categories
        categories.forEach(category => {
          const button = document.createElement('button');
          button.classList.add('filter-btn', 'bg-gray-100', 'px-4', 'py-2', 'text-sm', 'font-medium', 'rounded', 'hover:bg-gray-200');
          button.dataset.filter = category.id;
          button.textContent = category.category;
          
          // Add click event to each button
          button.addEventListener('click', () => {
            // Clear the video gallery before fetching new videos
            videoGallery.innerHTML = '';
            filterVideos(category.id);
  
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
              btn.classList.remove('bg-red-500', 'text-white');  // Remove active styles
              btn.classList.add('bg-gray-100', 'text-black');   // Reset to default
            });
  
            // Add active class to the clicked button
            button.classList.add('bg-red-500', 'text-white');  // Add active styles
            button.classList.remove('bg-gray-100', 'text-black'); // Reset others
          });
  
          filterButtonsContainer.appendChild(button); // Append buttons to the container
        });
  
        // Optionally, load the first category's videos by default
        if (categories.length > 0) {
          // Simulate a click on the first button to apply active styles
          filterButtonsContainer.children[0].click();
        }
      })
      .catch(error => console.error('Error fetching categories:', error));
  
    // Function to filter and display videos based on the selected category
    function filterVideos(categoryId) {
      fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
          const videos = data.data;
          // Clear the existing videos in the gallery before adding new ones
          videoGallery.innerHTML = '';
  
          // Dynamically create video cards for the selected category
          if (videos && videos.length > 0) {
            videos.forEach(video => {
              const videoCard = document.createElement('div');
              videoCard.classList.add('bg-white', 'shadow', 'rounded', 'overflow-hidden');
  
              videoCard.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="text-lg font-semibold">${video.title}</h3>
                  <p class="text-gray-600 text-sm mt-2">${video.description}</p>
                  <span class="text-red-500 text-sm mt-2">${video.views} views</span>
                </div>
              `;
  
              videoGallery.appendChild(videoCard);
            });
          } else {
            // Show a message if no videos are found for the category
            videoGallery.innerHTML = `<p class="text-center text-gray-600">No videos found for this category.</p>`;
          }
        })
        .catch(error => console.error('Error fetching videos:', error));
    }
  });
  