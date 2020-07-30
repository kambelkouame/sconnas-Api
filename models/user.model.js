const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
      
    },
    last_name: {
        type: String,
      
    },
    hab: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    CreationDate: {
        type: Date,
        defaut: Date.now()
    },
    lastConnect: {
        type: Date
    }

    
});



mongoose.model('User', userSchema);