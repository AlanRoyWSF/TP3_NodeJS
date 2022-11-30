const express = require('express')
const app = express()
const port = 8000
const unzip = require('unzip-stream')


app.get('/tp_nodejs', (req, res) => 

{
    const csv = require('csv-parser');
    const fs = require('fs');
    const download = require('download');
    const table = [];
    
        download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => 
    {
        fs.createReadStream('./data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
            .on('entry', function (entry) 
        {
            const fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") 
            {
                entry.pipe(csv())
                .on('data', (data) => table.push(data))
                .on('end', () => 
                {
                    const Transfert = table.filter(result => result.transfertSiege == 'true')
                    const Result = Transfert.length / table.length * 100
                    res.send(`D'après mes calculs, le pourcentage total d'entreprises ayant transférés leurs sièges sociales avant la date du 1 er Novembre 2022 est de ${Result.toFixed(4)}%`)
                })
            } 
            else 
            {
                entry.autodrain();
            }
        });
    })  
})  

app.listen(port, () => console.log(`Le TP à bien été lancé bravo, tu es connecté sur le port ${port}`))    
    