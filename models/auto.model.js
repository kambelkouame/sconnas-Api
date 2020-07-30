const mongoose = require('mongoose');

var autoSchema = new mongoose.Schema({
    email:{
        type: String
    },
    nomAssure:{
        type: String
    },
    prenomAssure:{
        type: String
    },
  nomConducteur:{
      type: String
  },
  prenomConducteur:{
      type: String
  },

  vehicule: {
      type: String,
      default:'aucun'
  },
  immatriculation: {
      type: String,
      default:'aucun'
  },
assurance: {
    type: String,
    default:'aucun'
  },
 
  date_sinistre:{
    type: Date,

    },
  

document:{
    type: String
    },
    
expertise:{
    type: String
    
    },
constat:{
    type: String
    
    },
fature:{
        type: String
        
        },
photo:{
    type: Object

    },
status:{
    type: Number
    
    },
numeroSinistre:{
    type: String
    
    },

contactAssure:{
    type:Number
  
    
    },
    description:{
        type:String,
        default:'aucune'
    },

    commissariat:{
        type:String,
        default:'aucun'
    },
    coordVehicule:{
        type:String,
        default:'aucun'
    },
numeroCP:{
    type: String
    
    },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Auto', autoSchema);


