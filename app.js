document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize modules
    initClock();
    initCalendar();
    initWeather();
});

/* ==========================================================================
   Clock Module
   ========================================================================== */
function initClock() {
    const timeDisplay = document.getElementById('time-display');
    const secondsDisplay = document.getElementById('seconds-display');
    const ampmDisplay = document.getElementById('ampm-display');
    const dateText = document.getElementById('date-text');
    const dayOfWeekText = document.getElementById('day-of-week-text');

    const weekdaysZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    function updateTime() {
        const now = new Date();
        
        // Hours and Minutes
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // AM/PM calculation
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const hoursStr = String(hours).padStart(2, '0');

        // Render clock
        timeDisplay.textContent = `${hoursStr}:${minutes}`;
        secondsDisplay.textContent = seconds;
        ampmDisplay.textContent = ampm;

        // Render Date (only once a day, or on clock update is fine)
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayIndex = now.getDay();

        dateText.textContent = `${year} 年 ${month} 月 ${date} 日`;
        dayOfWeekText.textContent = weekdaysZh[dayIndex];
    }

    // Run clock immediately, then set interval
    updateTime();
    setInterval(updateTime, 1000);
}

/* ==========================================================================
   Calendar Module
   ========================================================================== */
function initCalendar() {
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarGrid = document.getElementById('calendar-grid-container');

    const weekdaysShort = ['日', '一', '二', '三', '四', '五', '六'];
    const monthsZh = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    let currentDate = new Date(); // Tracks currently displayed month/year

    function renderCalendar(date) {
        // Clear grid completely
        calendarGrid.innerHTML = '';

        // 1. Render Weekday Headers (Sun-Sat)
        weekdaysShort.forEach(day => {
            const header = document.createElement('div');
            header.className = 'weekday';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        const year = date.getFullYear();
        const month = date.getMonth();

        // Title update
        calendarMonthYear.textContent = `${year} 年 ${monthsZh[month]}`;

        // 2. Calculate Calendar days block
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Weekday of 1st day (0-6)
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // Days in current month (28-31)
        const totalDaysInPrevMonth = new Date(year, month, 0).getDate(); // Days in previous month

        const today = new Date();

        // 3. Render previous month's overlapping trailing days (sibling-month)
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day sibling-month';
            dayDiv.textContent = totalDaysInPrevMonth - i;
            calendarGrid.appendChild(dayDiv);
        }

        // 4. Render current month's days
        for (let i = 1; i <= totalDaysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = i;

            // Highlight Today
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            // Interactive Day Selection
            dayDiv.addEventListener('click', () => {
                // Clear other selected days
                document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
                dayDiv.classList.add('selected');
            });

            calendarGrid.appendChild(dayDiv);
        }

        // 5. Render next month's overlapping leading days to complete grid structure (6 rows * 7 columns = 42 blocks)
        const currentBlocksCount = firstDayOfMonth + totalDaysInMonth;
        const totalCellsNeeded = 42; // standard beautiful calendar block size
        const nextMonthDaysToRender = totalCellsNeeded - currentBlocksCount;

        for (let i = 1; i <= nextMonthDaysToRender; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day sibling-month';
            dayDiv.textContent = i;
            calendarGrid.appendChild(dayDiv);
        }

        // Re-trigger icon updates if needed
        lucide.createIcons();
    }

    // Event listeners for calendar controls
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Initial render
    renderCalendar(currentDate);
}

/* ==========================================================================
   Weather Module (Powered by keyless Open-Meteo API)
   ========================================================================== */
function initWeather() {
    const weatherBody = document.getElementById('weather-body-container');
    const weatherDetails = document.getElementById('weather-details-container');
    const humidityValue = document.getElementById('humidity-value');
    const windValue = document.getElementById('wind-value');
    const popValue = document.getElementById('pop-value');
    const citySearch = document.getElementById('city-search');

    // Default coordinates: Taichung (台中), Taiwan
    const defaultCoords = {
        name: '台中市',
        lat: 24.1477,
        lon: 120.6736
    };

    // WMO Weather code mapper
    const weatherCodes = {
        0: { desc: '晴朗無雲', icon: 'sunny' },
        1: { desc: '晴時多雲', icon: 'cloudy-sun' },
        2: { desc: '多雲', icon: 'cloudy' },
        3: { desc: '陰天', icon: 'cloudy' },
        45: { desc: '有霧', icon: 'fog' },
        48: { desc: '濃霧', icon: 'fog' },
        51: { desc: '毛毛細雨', icon: 'drizzle' },
        53: { desc: '毛毛雨', icon: 'drizzle' },
        55: { desc: '大毛毛雨', icon: 'drizzle' },
        61: { desc: '陣雨', icon: 'rainy' },
        63: { desc: '中雨', icon: 'rainy' },
        65: { desc: '大雨', icon: 'rainy' },
        71: { desc: '小雪', icon: 'snowy' },
        73: { desc: '中雪', icon: 'snowy' },
        75: { desc: '大雪', icon: 'snowy' },
        80: { desc: '陣雨', icon: 'rainy' },
        81: { desc: '中等陣雨', icon: 'rainy' },
        82: { desc: '大雨暴雨', icon: 'rainy' },
        95: { desc: '雷陣雨', icon: 'thunder' },
        96: { desc: '雷雨伴有冰雹', icon: 'thunder' },
        99: { desc: '暴雷雨伴有冰雹', icon: 'thunder' }
    };

    // Generate stunning keyframe-animated SVGs for extreme premium look
    function getWeatherSVG(iconType) {
        switch (iconType) {
            case 'sunny':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="12" class="sun" />
                    <!-- Sun rays -->
                    <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round">
                        <line x1="32" y1="10" x2="32" y2="15" />
                        <line x1="32" y1="49" x2="32" y2="54" />
                        <line x1="10" y1="32" x2="15" y2="32" />
                        <line x1="49" y1="32" x2="54" y2="32" />
                        <line x1="16.4" y1="16.4" x2="19.9" y2="19.9" />
                        <line x1="44.1" y1="44.1" x2="47.6" y2="47.6" />
                        <line x1="16.4" y1="47.6" x2="19.9" y2="44.1" />
                        <line x1="44.1" y1="19.9" x2="47.6" y2="16.4" />
                    </g>
                </svg>`;
            case 'cloudy-sun':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <circle cx="24" cy="24" r="10" class="sun" />
                    <path class="cloud" d="M46.7,31.3C46.7,24,40.7,18,33.4,18c-5.7,0-10.6,3.6-12.5,8.7c-0.8-0.3-1.7-0.5-2.6-0.5c-4.4,0-8,3.6-8,8s3.6,8,8,8c0.3,0,0.6,0,0.9-0.1c1.8,4.1,5.9,7,10.7,7C40.7,49.2,46.7,43.2,46.7,31.3z" />
                </svg>`;
            case 'cloudy':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <path class="cloud cloud-dark" d="M18,35c0-4.4,3.6-8,8-8c0.3,0,0.6,0,0.9,0.1c1.8-4.1,5.9-7,10.7-7c5.8,0,10.6,4.2,11.3,9.7c0.8-0.4,1.8-0.7,2.8-0.7c3.9,0,7,3.1,7,7s-3.1,7-7,7H26C21.6,43,18,39.4,18,35z" style="transform: translate(-5px, -5px) scale(0.9); opacity: 0.7;"/>
                    <path class="cloud" d="M44.7,33.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7c0,3.7,3,6.7,6.7,6.7c0.2,0,0.5,0,0.7-0.1c1.5,3.4,4.9,5.8,8.9,5.8c6.1,0,11-5,11-11c0,0,0,0,0,0H44.7z" />
                </svg>`;
            case 'fog':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <path class="cloud" d="M44.7,28.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7c0,1.2,0.3,2.3,0.9,3.3h28.5C44.3,32.6,44.7,30.5,44.7,28.3z" />
                    <line x1="16" y1="40" x2="48" y2="40" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
                    <line x1="20" y1="46" x2="44" y2="46" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
                </svg>`;
            case 'drizzle':
            case 'rainy':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <path class="cloud" d="M44.7,28.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7c0,3.7,3,6.7,6.7,6.7c0.2,0,0.5,0,0.7-0.1c1.5,3.4,4.9,5.8,8.9,5.8c6.1,0,11-5,11-11H44.7z" />
                    <!-- Animated rain lines -->
                    <line x1="24" y1="44" x2="20" y2="52" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" class="rain" />
                    <line x1="32" y1="44" x2="28" y2="52" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" class="rain" style="animation-delay: 0.3s;" />
                    <line x1="40" y1="44" x2="36" y2="52" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" class="rain" style="animation-delay: 0.6s;" />
                </svg>`;
            case 'snowy':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <path class="cloud" d="M44.7,28.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7c0,3.7,3,6.7,6.7,6.7c0.2,0,0.5,0,0.7-0.1c1.5,3.4,4.9,5.8,8.9,5.8c6.1,0,11-5,11-11H44.7z" />
                    <!-- Animated falling snowflakes -->
                    <circle cx="23" cy="45" r="2.5" class="snow-flake" />
                    <circle cx="32" cy="48" r="2.5" class="snow-flake" style="animation-delay: 0.8s;" />
                    <circle cx="41" cy="44" r="2.5" class="snow-flake" style="animation-delay: 1.6s;" />
                </svg>`;
            case 'thunder':
                return `
                <svg class="weather-icon-svg" viewBox="0 0 64 64">
                    <path class="cloud" d="M44.7,28.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7c0,3.7,3,6.7,6.7,6.7c0.2,0,0.5,0,0.7-0.1c1.5,3.4,4.9,5.8,8.9,5.8c6.1,0,11-5,11-11H44.7z" />
                    <!-- Pulsing lightning bolt -->
                    <polygon points="32,41 24,51 31,51 28,58 38,48 31,48" fill="#f59e0b" style="animation: bounce 0.8s infinite alternate;" />
                </svg>`;
            default:
                return getWeatherSVG('sunny');
        }
    }

    // Core function to fetch weather from coordinates
    async function fetchWeather(lat, lon, cityName) {
        try {
            // Show loading spinner
            weatherBody.innerHTML = `
                <div class="loader-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; gap: 1rem;">
                    <div class="loader"></div>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">正在取得 ${cityName} 的天氣狀況...</span>
                </div>
            `;
            weatherDetails.style.display = 'none';

            // Query Open-Meteo Current Weather + Hourly for extra metrics
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability&timezone=auto`;
            const response = await fetch(weatherUrl);
            
            if (!response.ok) throw new Error('Weather fetch failed');
            const data = await response.json();

            // Extract current weather variables
            const current = data.current_weather;
            const temp = Math.round(current.temperature);
            const wind = Math.round(current.windspeed);
            const code = current.weathercode;

            // Map weather code
            const mappedCode = weatherCodes[code] || { desc: '未知天氣', icon: 'sunny' };

            // Find current hourly relative humidity and precipitation probability indices
            // If they are not found or missing, we fall back to generic values.
            let humidity = '--';
            let precipitationProb = '--';
            
            if (data.hourly && data.hourly.time) {
                const nowHourString = new Date().toISOString().substring(0, 13) + ':00'; // Match YYYY-MM-DDTHH:00
                const hourIndex = data.hourly.time.findIndex(t => t.startsWith(nowHourString.substring(0, 13)));
                
                if (hourIndex !== -1) {
                    humidity = data.hourly.relativehumidity_2m ? data.hourly.relativehumidity_2m[hourIndex] : '--';
                    precipitationProb = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[hourIndex] : '0';
                } else {
                    // fallback to 1st hour index
                    humidity = data.hourly.relativehumidity_2m ? data.hourly.relativehumidity_2m[0] : '50';
                    precipitationProb = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[0] : '0';
                }
            }

            // Render Weather Widget UI
            weatherBody.innerHTML = `
                <div class="weather-info">
                    <span class="weather-city" id="current-weather-city">${cityName}</span>
                    <div class="weather-temp-container">
                        <span class="weather-temp">${temp}</span>
                        <span class="weather-unit">°C</span>
                    </div>
                    <span class="weather-desc">${mappedCode.desc}</span>
                </div>
                <div class="weather-graphic">
                    ${getWeatherSVG(mappedCode.icon)}
                </div>
            `;

            // Update details
            humidityValue.textContent = `${humidity}%`;
            windValue.textContent = `${wind} km/h`;
            popValue.textContent = `${precipitationProb}%`;
            
            // Show details container
            weatherDetails.style.display = 'grid';

            // Refresh icons in case icons were updated
            lucide.createIcons();
        } catch (error) {
            console.error('Weather module error:', error);
            weatherBody.innerHTML = `
                <div style="text-align: center; color: #f43f5e; width: 100%; padding: 1rem;">
                    <i data-lucide="alert-triangle" style="margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.9rem;">載入天氣失敗，請檢查您的網路連線或稍後再試。</p>
                </div>
            `;
            lucide.createIcons();
        }
    }

    // Geolocation retrieval logic
    function getBrowserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon, '目前位置');
                },
                (error) => {
                    console.warn('Geolocation denied or failed, loading Taichung:', error.message);
                    fetchWeather(defaultCoords.lat, defaultCoords.lon, defaultCoords.name);
                },
                { timeout: 8000 }
            );
        } else {
            console.warn('Geolocation not supported, loading Taichung');
            fetchWeather(defaultCoords.lat, defaultCoords.lon, defaultCoords.name);
        }
    }

    // Keyless City Lookup via Open-Meteo Geocoding API
    async function searchCity(cityName) {
        if (!cityName.trim()) return;

        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`;
            const response = await fetch(geocodeUrl);
            if (!response.ok) throw new Error('Geocoding query failed');
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const lat = result.latitude;
                const lon = result.longitude;
                // Form a clean city label, prioritizing admin region / country if available
                const displayName = result.name + (result.admin1 ? `, ${result.admin1}` : '');
                
                fetchWeather(lat, lon, displayName);
                citySearch.value = ''; // clear search input on success
            } else {
                // If city wasn't found, trigger custom shake visual feedback on search container
                const searchBox = document.querySelector('.search-container');
                searchBox.style.animation = 'shake 0.4s ease';
                setTimeout(() => {
                    searchBox.style.animation = '';
                }, 400);
            }
        } catch (error) {
            console.error('City search failed:', error);
        }
    }

    // Hook search event
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCity(citySearch.value);
        }
    });

    // Add standard keyframe animations dynamically to styles if needed
    // In this case, we write a keyframe for the shake feedback right in CSS or insert dynamically. Let's insert a small style rule for shake feedback!
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Initial weather run using Geolocation or Fallback
    getBrowserLocation();
}
