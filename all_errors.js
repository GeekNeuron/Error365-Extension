document.addEventListener('DOMContentLoaded', async () => {
    const categories = {
        '4xx': document.getElementById('category-4xx'),
        '5xx': document.getElementById('category-5xx'),
        'network': document.getElementById('category-network'),
        'other': document.getElementById('category-other')
    };

    try {
        const response = await fetch('errors.json');
        const errors = await response.json();

        for (const [code, details] of Object.entries(errors)) {
            const tile = document.createElement('div');
            tile.className = 'error-tile';

            const title = document.createElement('h3');
            title.textContent = details.title;

            const description = document.createElement('p');
            description.textContent = details.description;

            tile.appendChild(title);
            tile.appendChild(description);

            // دسته‌بندی خطاها بر اساس کد آن‌ها
            if (code.startsWith('4')) {
                categories['4xx'].appendChild(tile);
            } else if (code.startsWith('5')) {
                categories['5xx'].appendChild(tile);
            } else if (code.startsWith('net::')) {
                categories['network'].appendChild(tile);
            } else {
                categories['other'].appendChild(tile);
            }
        }
    } catch (error) {
        console.error('Error loading or displaying errors:', error);
        document.querySelector('.container').innerHTML = '<p>Failed to load error list.</p>';
    }
});
