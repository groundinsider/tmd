document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login_form').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('login_id').value;
        const password = document.getElementById('login_password').value;

        user.login(id, password);

        document.getElementById('login_id').value = '';
        document.getElementById('login_password').value = '';
    });
});

class User {
    constructor() {
        this.loggedIn = false;
        this.username = null;
        this.db = null;
        this.initDB();
    }

    initDB() {
        let request = indexedDB.open("UserDatabase", 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            let userStore = db.createObjectStore("users", { keyPath: "id" });
            userStore.createIndex("password", "password", { unique: false });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
        };

        request.onerror = (event) => {
            console.error('Error opening IndexedDB:', event);
        };
    }

    login(id, password) {
        let transaction = this.db.transaction(["users"], "readonly");
        let objectStore = transaction.objectStore("users");

        let request = objectStore.get(id);

        request.onsuccess = (event) => {
            let data = event.target.result;
            if (data) {
                if (data.password === password) {
                    this.loggedIn = true;
                    this.username = id;
                    alert('Login is successful! Username: ' + id);
                    userData.printUser(this);
                } else {
                    alert('Error: Incorrect password.');
                }
            } else {
                this.checkPasswordExists(password, (exists) => {
                    if (exists) {
                        alert('Error: The password is already in use with a different ID.');
                    } else {
                        this.createAccount(id, password);
                    }
                });
            }
        };

        request.onerror = (event) => {
            console.error('Error:', event);
        };
    }

    checkPasswordExists(password, callback) {
        let transaction = this.db.transaction(["users"], "readonly");
        let objectStore = transaction.objectStore("users");
        let index = objectStore.index("password");
        let request = index.get(password);

        request.onsuccess = (event) => {
            callback(!!event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error:', event);
        };
    }

    createAccount(id, password) {
        let transaction = this.db.transaction(["users"], "readwrite");
        let objectStore = transaction.objectStore("users");

        let request = objectStore.add({ id: id, password: password });

        request.onsuccess = () => {
            this.loggedIn = true;
            this.username = id;
            alert('New account is created! Username: ' + id);
            userData.printUser(this);
        };

        request.onerror = (event) => {
            console.error('Error creating new account:', event);
            alert('Error creating new account.');
        };
    }
}

class UserData {
    constructor() {
        this.loggedInUser = null;
    }

    printUser(user) {
        this.loggedInUser = user;
        document.getElementById('user_data').textContent = `User: ${user.username}`;
    }
}

class SaveUserData {
    constructor(user, blocks) {
        this.loggedInUser = user;
        this.blockPlacement = blocks;
    }

    save() {
        if (!this.loggedInUser || !this.loggedInUser.username) {
            alert('No logged-in user found.');
            return;
        }

        const blockData = this.blockPlacement.blocks.map(block => ({
            type: block.type,
            cost: block.cost,
            num: block.num,
            color: block.color
        }));

        let transaction = this.loggedInUser.db.transaction(["users"], "readwrite");
        let objectStore = transaction.objectStore("users");

        let request = objectStore.get(this.loggedInUser.username);

        request.onsuccess = (event) => {
            let userData = event.target.result;
            if (userData) {
                userData.blockPlacement = blockData;
                objectStore.put(userData).onsuccess = () => {
                    alert('Block placement data saved successfully.');
                };
            } else {
                alert('User not found in the database.');
            }
        };

        request.onerror = (event) => {
            console.error('Error saving block placement data:', event);
        };
    }
}


const user = new User();
const userData = new UserData();

document.getElementById('sbtn').addEventListener('click', function() {
    if (user.loggedIn) {
        const saveUserData = new SaveUserData(user, blocks);
        saveUserData.save();
    } else {
        alert('Please log in to save block placements.');
    }
});