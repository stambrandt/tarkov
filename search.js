const clearButton = document.getElementById("clearButton");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const highlightButton = document.getElementById("highlightButton");
const highlightAllButton = document.getElementById("highlightAllButton");
const suggestionsBox = document.getElementById('suggestions');

let selectedLootItem = null;
let searchResults = [];

searchInput.addEventListener('input', async function () {
    const query = searchInput.value.replace(/"/g, '');

    if (query.length >= 3) {
        const searchQuery = {
            query: query,
            locale: "en"
        };

        fetch('https://db.sp-tarkov.com/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchQuery)
        })
        .then(response => response.json())
        .then(data => {
            showSuggestions(data.items);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        clearSuggestions();
    }
});

function showSuggestions(items) {
    clearSuggestions();

    if (items.length > 0) {
        items.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.style.padding = '10px';
            suggestionItem.style.cursor = 'pointer';
            suggestionItem.textContent = item.locale.Name;

            suggestionItem.onclick = function () {
                searchInput.value = item.locale.Name;
                clearSuggestions();
                performSearch(item.item._id);  // trigger the search logic using the items id
            };

            suggestionsBox.appendChild(suggestionItem);
        });

        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
    }
}

function clearSuggestions() {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
}

function performSearch(searchText) {
    resultsContainer.innerHTML = '';
    searchResults = [];

    for (let i = 0; i < allItemsInRaid.length; i++) {
        if (allItemsInRaid[i].id == searchText) {
            searchResults.push(allItemsInRaid[i]);
            createItemProfileFromData(allItemsInRaid[i].id).then(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                itemElement.style.cursor = 'pointer';
                itemElement.dataset.itemId = allItemsInRaid[i].id;
                itemElement.innerHTML = `<div class="item-content" style="margin-bottom: 15px;">${item.popupContent}</div>`;

                itemElement.onclick = function () {
                    const previouslySelected = document.querySelector('.item .item-content.selected');
                    if (previouslySelected) {
                        previouslySelected.classList.remove('selected');
                    }
                    itemElement.querySelector('.item-content').classList.add('selected');
                    selectedLootItem = allItemsInRaid[i];
                    map.setView([selectedLootItem.position.y, selectedLootItem.position.x]);
                };
                resultsContainer.appendChild(itemElement);
            });
        }
    }
}

highlightButton.onclick = function () {
    if (selectedLootItem) {
        console.log("Highlighting item with ID:", selectedLootItem.id);
        L.marker([selectedLootItem.position.y, selectedLootItem.position.x], { TeamIcon })
          .addTo(map);
    } else {
        console.log("No item selected to highlight.");
    }
};

highlightAllButton.onclick = function () {
    searchResults.forEach(item => {
        L.marker([item.position.y, item.position.x], { TeamIcon })
        .addTo(map);
    });
};

clearButton.onclick = function () {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    clearSuggestions();
}

// hide suggestions if clicked outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.autocomplete-container')) {
        clearSuggestions();
    }
});