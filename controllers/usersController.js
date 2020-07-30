const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Auto = mongoose.model('Auto');
var cookieParser = require('cookie-parser');
var multer = require('multer');
const path = require('path');
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
var generatePassword = require('password-generator');
var cokmail;




const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `Document_` + Date.now()) + `${file.originalname}`
    }

})

const upload = multer({ storage: storage })

//let upload = multer({ dest: 'uploads/' })


// send Mail 1

router.post("/sendmail1", (req, res) => {
    console.log("request came");
    let user = req.body;
    console.log(user)


    sendMail1(user, info => {

        if (info) {


            console.log(`le mail à été envoyé avec success et ID est ${info.messageId}`);
            res.jsonp({ message: 'succes' })
                // res.send(info);
                //console.log(info)
        } else {
            res.jsonp({ message: 'erreur' })
        }

    });
});


async function sendMail1(user, callback) {

    let transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port: 25,
        secure: false,
        auth: {
            user: "contact@mqashgroup.com",
            pass: "Paris$2019"
        }
    });

    let mailOptions = {
        from: "contact@mqashgroup.com",
        to: user.receiver,
        subject: user.objet,
        html: user.password
    };


    let info = await transporter.sendMail(mailOptions);

    callback(info);
}



//Send Mail 2
router.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    console.log(user)
    sendMail(user, info => {

        if (info) {


            console.log(`le mail à été envoyé avec success et ID est ${info.messageId}`);
            res.jsonp({ message: 'succes' })
                // res.send(info);
                //console.log(info)

            var myquery = { status: 0 };
            var newvalues = { status: 1 };
            Auto.updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");

            });


        } else {
            res.jsonp({ message: 'erreur' })
        }

    });
});




async function sendMail(user, callback) {

    let transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port: 25,
        secure: false,
        auth: {
            user: "contact@mqashgroup.com",
            pass: "Paris$2019"
        }
    });

    let mailOptions = {
        from: "contact@mqashgroup.com",
        to: user.receiver,
        subject: user.objet,
        attachments: [{
            path: user.sender.find.document
        }],
        html: '<h2>DECLARATION DE SINISTRE</h2><br><h3>COURTIER:SCCONAS</h3><br><h4>' + user.password + '</h4><br> <h5> Abreviation</h5><ul><li>SAA: Sinistre Avec Adversaire</li><li>SSA: Sinistre Sans Adversaire</li><li>BG:Bris de Glace</li><li>DC:Dommage Corporels</li><li>DM:Dommage Materiel</li><li>DM&DC:Dommage Materiel et Dommage Corporel</li></ul> <h4>Information sur le sinistre</h4><ul><li><h4>Nom de l\'Assuré:' + user.sender.find.nomAssure + '<h4></li><li><h4>Prenom de l\'Assuré:' + user.sender.find.prenomAssure + '</h4></li><li><h4>Type de Sinistre:' + user.sender.find.TypeSinistre + '</h4></li><li><h4>Cathegorie du Sinistre:' + user.sender.find.CathSinistre + '</h4></li><li><h4>Sinistre:' + user.sender.find.Sinistre + '</h4></li><li><h4>Nom et prenom du conducteur:' + user.sender.find.nomConducteur + '</h4></li><li><h4>Nombre de Blessé:' + user.sender.find.NbBlesse + '</h4></li><li><h4>Nombre de Mort:' + user.sender.find.NbMort + '</h4></li><li><h4>Date du Sinistre:' + user.sender.find.date_sinistre + '</h4></li><li><h4>Vehicule:' + user.sender.find.vehicule + '</h4></li><li><h4>Dommage Apparent:' + user.sender.find.dommageApp + '</h4></li><br><h3>vous trouverz ci joint les pieces jointes du sinistre(Permis de Conduire,photo du sinistre,constat de police,expertise)</h3>'

    };


    let info = await transporter.sendMail(mailOptions);

    callback(info);
}


router.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
        res.jsonp({ message: 'pas de message' })
    }

    res.jsonp({ message: 'ok' }, file);


})


router.post('/download', function(req, res, next) {
    console.log(req.body)
    filepath = path.join(__dirname, '../') + req.body.filename;
    // path.join(__dirname,'../public/uploads') +'/'+
    res.sendFile(filepath);
})



router.post('/multipleFiles', upload.array('files'), (req, res, next) => {

    const files = req.files;
    const info = req.body.info;
    console.log(files);
    console.log(info)

    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    } else {
        console.log(files[0].path)
        res.send({ status: 'ok' });

        var myquery = { document: info };
        var newvalues = { document: files[0].path };
        Auto.updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(err);

        });

    }
})

router.post("/findDevis", (req, res) => {

    console.log(req.body)

    var url = new URL('https://assurtous.ci:50967/api/recupeInfoDevisSouscrit'),
        params = { numeroCP: req.body.numeroCP }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url, {
            method: 'GET',


        })
        .then((response) => response.json())
        .then((responseData) => {
            let response = JSON.stringify(responseData)
            console.log(responseData)
            fetch('https://assurtous.ci:50967/api/decryptData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: response
                })
                .then((response) => response.json())
                .then((Data) => {

                    Data = JSON.parse(Data.body)
                    res.jsonp({ Data })
                    console.log(Data)


                })
                .catch(function(error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                });
        })
        .catch(function(error) {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        });

});

router.get('/sync/:id', (req, res) => {

    var token=req.params.id
    console.log(token)
    fetch('https://assurtous.ci:50967/api/recupeListeDevisSouscrit', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'Authorization': 'JWT '+token
            },

        })
        .then((response) => response.json())
        .then((responseData) => {
            let response = JSON.stringify(responseData)

                console.log(response)

            fetch('https://assurtous.ci:50967/api/decryptData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: response
                })
                .then((response) => response.json())
                .then((Data) => {

                    Data = JSON.parse(Data.body)
                    res.jsonp({ Data })
                    console.log(Data.auto)


                }).catch(function(error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                    res.jsonp({ message: 'decrytage error' })
                });

        })
        .catch(function(error) {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
            res.jsonp({ message: 'no autorization' })
        });



});



router.post('/register', (req, res) => {
    insertUser(req, res);
});

router.post('/update', (req, res) => {
    updateUser(req, res);
});


router.get('/updateStatut/:id', (req, res) => {
    Auto.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log(req.params.id)
            Auto.updateOne({ _id: req.params.id }, { status: 1 }, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(result);
                }
            });
        }
    });

});




function insertUser(req, res) {

    if (req.body.fullName == '' || req.body.last_name == '' || req.body.poste == '' || req.body.email == '' || req.body.password == '') {
        res.jsonp({ message: 'Verifiez que tous les champs sont bien remplis' })
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    var user = new User();
                    user.fullName = req.body.fullName;
                    user.last_name = req.body.last_name;
                    user.hab = req.body.hab;
                    user.email = req.body.email;
                    user.phone = req.body.phone;
                    user.password = req.body.password;
                    user.CreationDate = Date.now();
                    user.lastConnect = Date.now();
                    user.save((err, doc) => {
                        if (!err) {

                            res.jsonp({ message: 'l\'utilisateur a été crée avec succes' })

                        } else {
                            res.jsonp({ message: 'Erreur lors de la creation de l utilisateur  : ' + err });
                        }
                    });
                } else {
                    res.jsonp({ message: 'l\'utilisateur existe déja' })
                }
            })
    }

}


function insertAuto(req, res) {

    if (req.body.nomAssure == '' || req.body.prenomAssure == '' || req.body.vehicule == '' || req.body.date_sinistre == '' ||
        req.body.immatriculation == '') {
        res.jsonp({ message: 'champs' })
    } else {
        console.log(req.body)
        var auto = new Auto();
        auto.email = req.body.email;
        auto.nomAssure = req.body.nomAssure;
        auto.prenomAssure = req.body.prenomAssure;
        auto.nomConducteur = req.body.nomConducteur;
        auto.prenomConducteur = req.body.prenomConducteur;
        auto.vehicule = req.body.vehicule;
        auto.immatriculation = req.body.immatriculation;
        auto.date_sinistre = req.body.date_sinistre;
        auto.description = req.body.description;
        auto.commissariat = req.body.commissariat;
        auto.coordVehicule = req.body.coordVehicule;
        auto.document = req.body.document;
        auto.numeroCP = req.body.numeroCP;
        auto.contactAssure = req.body.contactAssure;
        auto.status = 0;
        auto.numeroSinistre = generatePassword(12, false, /\d/, 'Scconas-SinAuto') + Date.now();
        auto.save((err, doc) => {
            if (!err) {

                res.jsonp({ message: 'succes' })

            } else {
                console.log(err)
                res.jsonp({ message: 'Erreur: ' + err });
            }
        });
    }
}

function updateStatus(req, res) {
    Auto.findOneAndUpdate({ numeroSinistre: req.body.numeroSinistre }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({ Auto: req.body })
        } else {
            res.send('Erreur lors  de la modification : ' + err);
        }

    });
}


function updateUser(req, res) {
    User.findOneAndUpdate({ email: req.body.email }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({ user: req.body })
        } else {
            res.send('Erreur lors  de la modification : ' + err);
        }

    });
}





router.post("/home/auto", function(req, res) {

    insertAuto(req, res);


});

router.post("/home", function(req, res) {

    if (req.cookies.infoUser) {


        res.jsonp({ message: 'Welcome' })

    } else {
        res.jsonp({ message: 'error' })
    }
});



router.post("/login", function(req, res) {
    User.findOne({ email: req.body.email, password: req.body.password })
        .then(user => {
            if (user) {
                res.cookie("info", user)
                console.log(user)
                cokmail = user.email;
                res.jsonp({ message: 'welcome' })


            } else {
                res.jsonp({ message: 'erreurs' })
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })

});


router.get('/register/list', (req, res) => {
    User.find((err, docs) => {
        if (!err) {

            res.jsonp({ user: docs })
        } else {
            res.send('Erreur dans l affichage de la maison:' + err);
        }
    });
});

router.get('/auto/list', (req, res) => {
    Auto.find({ status: 0 })
        .then(list => {
            if (list) {

                //console.log(list)


                res.jsonp({ auto: list })


            } else {
                res.jsonp({ message: 'erreur' })
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
});



router.get('/auto/listValid', (req, res) => {
    Auto.find({ status: 1 })
        .then(list => {
            if (list) {

               // console.log(list)


                res.jsonp({ auto: list })


            } else {
                res.jsonp({ message: 'erreur' })
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
});


router.get('/auto/listRejet', (req, res) => {
    Auto.find({ status: 2 })
        .then(list => {
            if (list) {

                console.log(list)


                res.jsonp({ auto: list })


            } else {
                res.jsonp({ message: 'erreur' })
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
});

router.get('/auto/list/:id', (req, res) => {
    Auto.findById(req.params.id, (err, doc) => {
        if (!err) {


            res.jsonp({ find: doc })
        }
    });

});

router.get('/auto/rejet/:id', (req, res) => {
    Auto.findById(req.params.id, (err, doc) => {
        if (!err) {


            res.jsonp({ find: doc })
        }
    });

});

router.get('/auto/valid/:id', (req, res) => {
    Auto.findById(req.params.id, (err, doc) => {
        if (!err) {


            res.jsonp({ find: doc })
        }
    });

});
router.get('/findCompt/:email', (req, res) => {

    User.find({ email: req.params.email })
        .then(user => {
            res.jsonp({ user: user })
        })

});



function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {


            res.jsonp({ addDis: doc })
        }
    });
});

router.get('/deleteUser/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.jsonp({ message: 'User delete' })
        } else { res.jsonp({ message: 'Erreur lors de la suppression de la maison :' + err }); }
    });
});
router.get('/logout', function(req, res, next) {
    //supprimer la variable cookie user
    res.clearCookie("info")
        //retourne la vue connexion
    res.redirect("/login")
});

module.exports = router;