document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const categorySearchInput = document.getElementById('categorySearch');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    const fetchSchedule = async (category = '') => {
        loadingMessage.style.display = 'block';
        scheduleContainer.innerHTML = ''; // Clear previous schedule
        errorMessage.style.display = 'none';

        try {
            const url = category ? `/api/schedule?category=${encodeURIComponent(category)}` : '/api/schedule';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const schedule = await response.json();
            renderSchedule(schedule);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            errorMessage.textContent = 'Failed to load schedule. Please try again later.';
            errorMessage.style.display = 'block';
        } finally {
            loadingMessage.style.display = 'none';
        }
    };

    const renderSchedule = (schedule) => {
        if (schedule.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found for this category.</p>';
            return;
        }

        schedule.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('schedule-item');

            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.classList.add('time-slot');
            timeSlotDiv.innerHTML = `${item.startTime} - ${item.endTime}`;
            itemDiv.appendChild(timeSlotDiv);

            if (item.type === 'talk') {
                const talkDetailsDiv = document.createElement('div');
                talkDetailsDiv.classList.add('talk-details');
                talkDetailsDiv.innerHTML = `
                    <h3>${item.title}</h3>
                    <p class="speakers">${item.speakers.join(' and ')}</p>
                    <p>${item.description}</p>
                    <div class="categories">
                        ${item.category.map(cat => `<span>${cat}</span>`).join('')}
                    </div>
                `;
                itemDiv.appendChild(talkDetailsDiv);
            } else if (item.type === 'break') {
                const breakDetailsDiv = document.createElement('div');
                breakDetailsDiv.classList.add('break-details');
                breakDetailsDiv.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Duration: ${item.durationMinutes} minutes</p>
                `;
                itemDiv.appendChild(breakDetailsDiv);
            }
            scheduleContainer.appendChild(itemDiv);
        });
    };

    // Initial load
    fetchSchedule();

    // Search functionality with debounce
    let searchTimeout;
    categorySearchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        const category = event.target.value;
        searchTimeout = setTimeout(() => {
            fetchSchedule(category);
        }, 300); // Debounce for 300ms
    });
});
