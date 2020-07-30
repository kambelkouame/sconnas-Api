const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/GestionSinstre', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB connectée avec success.') }
    else { console.log('Erreur lors de la connexion a la BD Mongo : ' + err) }
});

require('./auto.model');
require('./user.model');