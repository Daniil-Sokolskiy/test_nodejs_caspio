let usersData = [];
let currentSortColumn = null;
let currentSortOrder = 'asc';

async function fetchUsers() {
    const response = await fetch('/users');
    const data = await response.json();
    usersData = data.Result;
    displayUsers(usersData);
}

function displayUsers(users) {
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = '';
    users.forEach(user => {
        const row = userTable.insertRow();
        row.insertCell(0).innerText = user.UserID;
        row.insertCell(1).innerText = user.FirstName;
        row.insertCell(2).innerText = user.LastName;
        row.insertCell(3).innerText = formatDate(user.DateOfBirth);
        row.insertCell(4).innerText = user.Country;
        row.insertCell(5).innerText = user.City;
        row.insertCell(6).innerText = user.ZipCode;
        row.insertCell(7).innerText = user.Address;
        const actionsCell = row.insertCell(8);
        actionsCell.innerHTML = `<button onclick="showEditModal('${user.UserID}', '${user.FirstName}', '${user.LastName}', '${user.DateOfBirth}', '${user.Country}', '${user.City}', '${user.ZipCode}', '${user.Address}')">Edit</button>
                                 <button onclick="deleteUser('${user.UserID}')">Delete</button>`;
    });

    updateSortButtons();
}

function sortUsers(column, button) {
    let order = button.getAttribute('data-order');
    if (currentSortColumn === column) {
        order = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        order = 'asc';
    }
    currentSortColumn = column;
    currentSortOrder = order;

    usersData.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
    displayUsers(usersData);
}

function updateSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-button i');
    sortButtons.forEach(icon => {
        const button = icon.parentElement;
        const column = button.getAttribute('data-column');
        const order = button.getAttribute('data-order');

        if (column === currentSortColumn) {
            if (currentSortOrder === 'asc') {
                icon.classList.remove('fa-arrow-up');
                icon.classList.add('fa-arrow-down');
                button.setAttribute('data-order', 'desc');
            } else {
                icon.classList.remove('fa-arrow-down');
                icon.classList.add('fa-arrow-up');
                button.setAttribute('data-order', 'asc');
            }
        } else {
            icon.classList.remove('fa-arrow-down');
            icon.classList.add('fa-arrow-up');
            button.setAttribute('data-order', 'asc');
        }
    });
}

async function addUser(event) {
    event.preventDefault();
    const user = {
        firstName: document.getElementById('addFirstName').value,
        lastName: document.getElementById('addLastName').value,
        dateOfBirth: document.getElementById('addDateOfBirth').value,
        country: document.getElementById('addCountry').value,
        city: document.getElementById('addCity').value,
        zipCode: document.getElementById('addZipCode').value,
        address: document.getElementById('addAddress').value
    };

    if (!user.firstName) {
        alert("Firstname is required.");
        return;
    }

    if (!user.lastName) {
        alert("Lastname is required.");
        return;
    }

    if (!user.dateOfBirth) {
        alert("Date of Birth is required.");
        return;
    }

    await fetch('/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    fetchUsers();
    document.getElementById('addModal').style.display = 'none';
}

function showAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

function showEditModal(userID, firstName, lastName, dateOfBirth, country, city, zipCode, address) {
    document.getElementById('editUserID').value = userID;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editDateOfBirth').value = dateOfBirth.split('T')[0]; // Remove time part
    document.getElementById('editCountry').value = country;
    document.getElementById('editCity').value = city;
    document.getElementById('editZipCode').value = zipCode;
    document.getElementById('editAddress').value = address;

    document.getElementById('editModal').style.display = 'block';
}

async function editUser(event) {
    event.preventDefault();
    const userID = document.getElementById('editUserID').value;
    const user = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        dateOfBirth: document.getElementById('editDateOfBirth').value,
        country: document.getElementById('editCountry').value,
        city: document.getElementById('editCity').value,
        zipCode: document.getElementById('editZipCode').value,
        address: document.getElementById('editAddress').value
    };

    if (!user.firstName) {
        alert("Firstname is required.");
        return;
    }

    if (!user.lastName) {
        alert("Lastname is required.");
        return;
    }


    if (!user.dateOfBirth) {
        alert("Date of birth is required.");
        return;
    }

    await fetch(`/users/edit/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    fetchUsers();
    document.getElementById('editModal').style.display = 'none';
}

async function deleteUser(userID) {
    await fetch(`/users/delete/${userID}`, {
        method: 'DELETE'
    });

    fetchUsers();
}

function filterUsers() {
    const filterValue = document.getElementById('filter').value.toLowerCase();
    const filterColumn = document.getElementById('filterColumn').value;
    const rows = document.getElementById('userTable').rows;

    const columnIndex = {
        "FirstName": 1,
        "LastName": 2,
        "Country": 4,
        "City": 5
    };

    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[columnIndex[filterColumn]];
        if (cell) {
            if (cell.innerText.toLowerCase().includes(filterValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

function formatDate(dateString) {
    return dateString.split('T')[0];
}

window.onload = fetchUsers;
