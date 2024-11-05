
// Inicializacija Dexie baze podatkov
const db = new Dexie('UsersDatabase');
db.version(1).stores({
    users: '++id, ime, priimek, leta, eposta'
});

// Funkcija za shranjevanje podatkov v IndexedDB z Dexie
function saveDataLocally(data) {
    db.transaction('rw', db.users, async () => {
        await db.users.bulkPut(data);
    }).catch(e => {
        console.error("Napaka pri shranjevanju v IndexedDB:", e);
    });
}

// Funkcija za pridobivanje podatkov iz IndexedDB z Dexie
function getDataLocally() {
    return db.users.toArray();
}

// Funkcija za sinhronizacijo podatkov
async function synchronizeData() {
    const localData = await getDataLocally();
    if (localData && localData.length > 0) {
        try {
            const response = await fetch('/syncData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: localData })
            });
            if (response.ok) {
                console.log('Podatki so bili uspešno sinhronizirani');
                // Čiščenje IndexedDB po uspešni sinhronizaciji
                await db.users.clear();
            } else {
                console.error('Napaka pri sinhronizaciji podatkov:', response.statusText);
            }
        } catch (error) {
            console.error('Napaka pri sinhronizaciji podatkov:', error);
        }
    }
}

// Ob zagonu aplikacije preverimo, ali so lokalno shranjeni podatki, in jih po potrebi sinhroniziramo
window.addEventListener('load', synchronizeData);
/*
let db;
const request = indexedDB.open('UsersDatabase', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', {keyPath: 'id'});
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error('Database error: ', event.target.errorCode);
};

// Funkcija za shranjevanje podatkov v localStorage
function saveDataLocally(data) {
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    data.forEach(function(user) {
        objectStore.put(user);
    });
}

function getDataLocally() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users']);
        const objectStore = transaction.objectStore('users');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject('Error fetching data from IndexedDB:', event.target.errorCode);
        };
    });
}
// Funkcija za sinhronizacijo podatkov z REST API-jem
async function synchronizeData() {
    const localData = await getDataLocally(); // Dodajte await tukaj
    if (localData && localData.length > 0) {
        try {
            const response = await fetch('/syncData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: localData }) // Prepričajte se, da ustreza pričakovanemu formatu na strežniku
            });
            if (response.ok) {
                console.log('Podatki so bili uspešno sinhronizirani');
                // Čiščenje IndexedDB po uspešni sinhronizaciji
                clearIndexedDB();
            } else {
                console.error('Napaka pri sinhronizaciji podatkov:', response.statusText);
            }
        } catch (error) {
            console.error('Napaka pri sinhronizaciji podatkov:', error);
        }
    }
}

// Ob zagonu aplikacije preverimo, ali so lokalno shranjeni podatki, in jih po potrebi sinhroniziramo
window.addEventListener('load', () => {
    synchronizeData();
});*/