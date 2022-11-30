var express = require('express');
var app = express();
var port = 8000;
var unzip = require('unzip-stream');

app.get('/tp_nodejs', function (req, res) {
    var csv = require('csv-parser');
    var fs = require('fs');
    var download = require('download');
    var compteur = 0;
    var total = 0;

    download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
        fs.createReadStream('./data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) {
                        if(data.transfertSiege == 'true'){
                        
                            compteur = compteur + 1;
                            total = total +1;

                        }
                        else{
                            total = total + 1;
                        }
                     })
                    .on('end', function () {
                    var Result = compteur / total * 100;
                    res.send("D'apr\u00E8s mes calculs, le pourcentage total d'entreprises ayant transf\u00E9r\u00E9s leurs si\u00E8ges sociales avant la date du 1 er Novembre 2022 est de ".concat(Result.toFixed(2), "%"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    });
});
app.listen(port, function () { return console.log("Le TP \u00E0 bien \u00E9t\u00E9 lanc\u00E9 bravo, tu es connect\u00E9 sur le port ".concat(port)); });
