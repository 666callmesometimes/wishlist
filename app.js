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
            createNewList(listName);
            listInput.value = '';
        }
    });

    function createNewList(listName) {
        const listDiv = document.createElement('div');
        listDiv.classList.add('list');

        const listHeader = document.createElement('div');
        listHeader.classList.add('list-header');

        const listTitle = document.createElement('h2');
        listTitle.textContent = listName;

        const addItemButton = document.createElement('button');
        addItemButton.textContent = 'Add item';
        addItemButton.addEventListener('click', () => {
            itemListForm.style.display = itemListForm.style.display === 'none' ? 'flex' : 'none';
        });

        const deleteListButton = document.createElement('button');
        deleteListButton.textContent = 'Delete wishlist';
        deleteListButton.addEventListener('click', () => {
            listsContainer.removeChild(listDiv);
            saveLists();
        });

        listHeader.appendChild(listTitle);
        listHeader.appendChild(addItemButton);
        listHeader.appendChild(deleteListButton);
        listDiv.appendChild(listHeader);

        const itemListForm = document.createElement('form');
        itemListForm.classList.add('item-list-form');
        itemListForm.innerHTML = `
            <input type="text" placeholder="Add item ..." required>
            <input type="url" placeholder="Add URL...">
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
        removeButton.textContent = '.';
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
            const listName = listDiv.querySelector('.list-header h2').textContent;
            const items = [];
            listDiv.querySelectorAll('ul li').forEach(li => {
                const link = li.querySelector('a');
                const url = link.href !== '#' ? link.href : '';
                items.push({ text: link.textContent, url: url });
            });
            lists.push({ name: listName, items: items });
        });
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function loadLists() {
        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const listDiv = document.createElement('div');
            listDiv.classList.add('list');

            const listHeader = document.createElement('div');
            listHeader.classList.add('list-header');

            const listTitle = document.createElement('h2');
            listTitle.textContent = list.name;

            const addItemButton = document.createElement('button');
            addItemButton.textContent = 'Add item';
            addItemButton.addEventListener('click', () => {
                itemListForm.style.display = itemListForm.style.display === 'none' ? 'flex' : 'none';
            });

            const deleteListButton = document.createElement('button');
            deleteListButton.textContent = 'Delete wishlist';
            deleteListButton.addEventListener('click', () => {
                listsContainer.removeChild(listDiv);
                saveLists();
            });

            listHeader.appendChild(listTitle);
            listHeader.appendChild(addItemButton);
            listHeader.appendChild(deleteListButton);
            listDiv.appendChild(listHeader);

            const itemListForm = document.createElement('form');
            itemListForm.classList.add('item-list-form');
            itemListForm.innerHTML = `
                <input type="text" placeholder="Add item..." required>
                <input type="url" placeholder="Add URL...">
                <button type="submit">Add item</button>
            `;

            const itemList = document.createElement('ul');
            list.items.forEach(item => {
                addItemToList(itemList, item.text, item.url);
            });

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
        });
    }
});
