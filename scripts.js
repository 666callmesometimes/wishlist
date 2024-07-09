document.addEventListener('DOMContentLoaded', () => {
    const newListForm = document.getElementById('new-list-form');
    const listInput = document.getElementById('list-input');
    const listsContainer = document.getElementById('lists-container');

    // Load lists from localStorage
    loadLists();

    newListForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const listName = listInput.value.trim();
        if (listName !== '') {
            const listId = generateUniqueId();
            createNewList(listName, listId);
            listInput.value = '';
        }
    });

    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function createNewList(listName, listId) {
        const listDiv = document.createElement('div');
        listDiv.classList.add('list');
        listDiv.setAttribute('data-id', listId);

        const listHeader = document.createElement('div');
        listHeader.classList.add('list-header');

        const listTitle = document.createElement('h2');
        listTitle.textContent = listName;

        const addItemButton = document.createElement('button');
        addItemButton.textContent = 'Dodaj pozycję';
        addItemButton.addEventListener('click', () => {
            itemListForm.style.display = itemListForm.style.display === 'none' ? 'flex' : 'none';
        });

        const shareButton = document.createElement('button');
        shareButton.textContent = 'Udostępnij';
        shareButton.classList.add('share-button');
        shareButton.addEventListener('click', () => {
            const url = `${window.location.origin}?list=${listId}`;
            navigator.clipboard.writeText(url).then(() => {
                alert('Link skopiowany do schowka: ' + url);
            });
        });

        const deleteListButton = document.createElement('button');
        deleteListButton.textContent = 'Usuń listę';
        deleteListButton.addEventListener('click', () => {
            listsContainer.removeChild(listDiv);
            saveLists();
        });

        listHeader.appendChild(listTitle);
        listHeader.appendChild(addItemButton);
        listHeader.appendChild(shareButton);
        listHeader.appendChild(deleteListButton);
        listDiv.appendChild(listHeader);

        const itemListForm = document.createElement('form');
        itemListForm.classList.add('item-list-form');
        itemListForm.innerHTML = `
            <input type="text" placeholder="Dodaj przedmiot..." required>
            <input type="url" placeholder="Dodaj URL...">
            <button type="submit">Dodaj</button>
        `;

        const itemList = document.createElement('ul');

        itemListForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const itemInput = itemListForm.querySelector('input[type="text"]');
            const urlInput = itemListForm.querySelector('input[type="url"]');
            const itemText = itemInput.value.trim();
            const itemUrl = urlInput.value.trim();
            if (itemText !== '') {
                addItemToList(itemList, itemText, itemUrl);
                itemInput.value = '';
                urlInput.value = '';
                saveLists();
            }
        });

        listDiv.appendChild(itemListForm);
        listDiv.appendChild(itemList);
        listsContainer.appendChild(listDiv);
        saveLists();
    }

    function addItemToList(itemList, itemText, itemUrl) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = itemText;
        if (itemUrl) {
            link.href = itemUrl;
            link.target = '_blank';
        } else {
            link.href = '#';
        }
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Usuń';
        removeButton.addEventListener('click', () => {
            itemList.removeChild(li);
            saveLists();
        });

        li.appendChild(link);
        li.appendChild(removeButton);
        itemList.appendChild(li);
    }

    function saveLists() {
        const lists = [];
        listsContainer.querySelectorAll('.list').forEach(listDiv => {
            const listId = listDiv.getAttribute('data-id');
            const listName = listDiv.querySelector('.list-header h2').textContent;
            const items = [];
            listDiv.querySelectorAll('ul li').forEach(li => {
                const link = li.querySelector('a');
                const url = link.href !== '#' ? link.href : '';
                items.push({ text: link.textContent, url: url });
            });
            lists.push({ id: listId, name: listName, items: items });
        });
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function loadLists() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedListId = urlParams.get('list');

        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            if (!sharedListId || list.id === sharedListId) {
                createNewList(list.name, list.id);
                const listDiv = listsContainer.querySelector(`[data-id="${list.id}"]`);
                const itemList = listDiv.querySelector('ul');
                list.items.forEach(item => {
                    addItemToList(itemList, item.text, item.url);
                });
            }
        });
    }
});
