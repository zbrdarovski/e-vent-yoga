const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const User = require('./models/userModel')
const path = require('path');
const app = express();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const eventRoutes = require('./routes/eventRouter');
const newsRoutes = require('./routes/newsRouter');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'secret',
    baseURL: 'http://localhost:3000',
    clientID: 'client_id',
    issuerBaseURL: 'issuer_base_url'
};
// za prikaz slik iz mape slike
//app.use('/slike', express.static(path.join(__dirname, '/slike')));
// auth router attaches /login, /logout, and /callback routes to the baseURL
// Uporaba CORS middleware
app.use(cors());

app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
//  res.send(req.oidc.isAuthenticated() ? 'Prijavljen' : 'Odjavljen');
const isAuthenticated = req.oidc.isAuthenticated();
  const linkText = isAuthenticated ? 'Odjava' : 'Prijava';
  const linkUrl = isAuthenticated ? 'http://localhost:3000/logout' : 'http://localhost:3000/test';
  const linkHTML = `<a href="${linkUrl}">${linkText}</a>`;
  res.send(`${isAuthenticated ? 'Prijavljen' : 'Odjavljen'} | ${linkHTML}`);
});
  
// za statično vsebino (HTML, CSS, JavaScript)
app.use(express.static('public'));
//za json
app.use(express.json());
//za pošiljanje podatkov preko obrazcev
app.use(express.urlencoded({ extended: false }))
// Podpora za parsanje JSON vsebine
app.use(bodyParser.json());

//routes
app.use('/events', eventRoutes);
app.use('/news', newsRoutes);

app.get('/', (req, res) => {
    res.send('zdravo');
});

app.post('/syncData', async (req, res) => {
    const userData = req.body;
    console.log('Prejeli podatke za sinhronizacijo:', userData);

    try {
        for (const user of userData) {
            // Posodobi uporabnika, če že obstaja, ali ga vstavi, če ne
            await User.updateOne(
                { _id: user._id }, // Poišči dokument z ujemajočim _id
                { $set: user },    // Posodobi dokument z novimi podatki
                { upsert: true }   // Če dokument ne obstaja, ga vstavi
            );
        }
        res.status(200).send('Podatki so bili uspešno sinhronizirani');
    } catch (error) {
        console.error('Napaka pri shranjevanju podatkov:', error);
        res.status(500).send('Napaka pri shranjevanju podatkov');
    }
});


// Registracija naprav za potisna obvestila-->za REST API končne točke (endpointe)
// za pošiljanje potisnih sporočil (angl. push notifications)
// Končna točka za pošiljanje potisnih sporočil
app.post('/sendPushNotification', (req, res) => {
    try {
        console.log('Prejeto sporočilo za pošiljanje potisnega sporočila:', req.body.message);
        res.status(200).json({ message: 'Potisno sporočilo uspešno poslano' });
    } catch (error) {
        console.error('Napaka pri obdelavi zahteve za pošiljanje potisnih sporočil:', error);
        res.status(500).json({ message: 'Napaka pri obdelavi zahteve za pošiljanje potisnih sporočil' });
    }
});

///////////////////////////////////v2
app.post('/subscribe', (req, res) => {
    const subscription = req.body; // Naročniški podatki, ki jih pošlje spletna aplikacija
    console.log("Prejeta naročnina:", subscription);

    res.status(200).json({ message: 'Naročanje uspešno' });
});
/////////////////////////////////


// Zaščitena pot za dostop do /User
app.get('/User', requiresAuth(), async (req, res) => {
    try {
        // Pridobitev ID uporabnika iz zahtevka
        const userId = req.oidc.user.sub;

        // Prikaz ID uporabnika v HTML kodi
        res.send(`<h1>ID uporabnika: ${userId}</h1>`);
    } catch (error) {
        console.error('Napaka:', error);
        res.status(500).json({ message: 'Napaka pri pridobivanju ID-ja uporabnika' });
    }
});

// Zaščitena pot za prikaz uporabnikovega profila
app.get('/test', requiresAuth(), (req, res) => {
    // req.oidc.user vsebuje podatke o trenutno prijavljenem uporabniku
    res.sendFile(__dirname + '/public/home.html');
});

// Zaščitena pot za dostop do informacij o trenutno prijavljenem uporabniku
app.get('/currentUser', requiresAuth(), async (req, res) => {
    try {
        // Pridobitev ID uporabnika iz zahtevka
        const userId = req.oidc.user.sub;


        // Prikaz ID uporabnika v HTML kodi (ali vračanje JSON objekta z več podatki, če je to potrebno)
        res.send(`<h1>ID uporabnika: ${userId}</h1>`);
        // Ali pa: res.status(200).json({ userId: userId, ... });
    } catch (error) {
        console.error('Napaka:', error);
        res.status(500).json({ message: 'Napaka pri pridobivanju podatkov o uporabniku' });
    }
});

// Za dostop do /User je potreben avtentikacijski žeton
app.get('/User', (req, res) => {
    res.status(401).json({ message: 'Za dostop do te poti je potreben avtentikacijski žeton' });
});

///////////////////////////////
app.get('/getUser', async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/getUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//za iskanje po imenu ali priimku
app.get('/getUserImePriimek/:imepriimek', async (req, res) => {
    try {
        const { imepriimek } = req.params;
        // Iskanje uporabnikov, katerih ime ali priimek ustreza podanemu nizu
        const users = await User.find({
            $or: [
                { ime: { $regex: imepriimek, $options: "i" } },
                { priimek: { $regex: imepriimek, $options: "i" } }
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/User', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
})

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!User) {
            return res.status(404).json({ message: "ne najdem uporabnika" });
        }
        res.status(200).json(user);
    } catch {
        res.status(500).json({ message: error.message });
    }
})
app.put('/urediUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json({ message: "ne najdem uporabnika" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
)


// Zaščitena pot za dostop do seznamov sob
app.get('/rooms', requiresAuth(), async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Napaka:', error);
        res.status(500).json({ message: 'Napaka pri pridobivanju seznamov sob' });
    }
});

app.get('/rooms/:id', requiresAuth(), async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({message: "Ne najdem sobe"});
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/rooms', requiresAuth(), async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/rooms/:id', requiresAuth(), async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({message: "Ne najdem sobe"});
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/rooms/:id', requiresAuth(), async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) {
            return res.status(404).json({message: "Ne najdem sobe"});
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect('mongodb_connection_string')
.then(() => {
    console.log("Povezan na bazo");
    app.listen(3000, () => {
        console.log('Aplikacija je zagnana na portu 3000');
    });
}).catch((error) => {
    console.log(error);
});
