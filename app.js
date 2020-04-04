
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/stj2019.db', 
    function(err){
        if(!err){
            db.run(`
                CREATE TABLE IF NOT EXISTS stj2019(
                id INTEGER PRIMARY KEY,
                date TEXT,
                time TEXT,
                maxtemp TEXT,
                mintemp TEXT,
                meantemp TEXT,
                precip TEXT,
                rain TEXT,
                snow TEXT,
                groundsnow TEXT
                )
            `);
            console.log('Opened database')
        }else{
            console.log('Could not open database', err);
        }
    }
);

const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

app.engine('hbs', hbs.express4({
    partialDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layout/main.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.get('/',function(req,res){
    
    res.render('index',{
        title: 'Assignment 4',
        
    });

    
});


app.post('/',function(req,res){
    
            


});

let jsonParser = bodyParser.json();

app.get('/data/:startDate/:endDate',jsonParser, function(req, res){

    const form = req.params;
    let msg;
    db.all(
        `SELECT * FROM stj2019 WHERE julianday(?) <= julianday(time) AND julianday(time) <= julianday(?);`, [form.startDate,form.endDate],function(err,rows){
        
        if (!err){
        console.log("Rows: ",rows);
        msg = {result: rows};
        res.send(msg);
        }
        else{
            console.log("Error in searching database",err);
        }
    });

});


app.post('/data/:startDate/:endDate', jsonParser,function(req, res) {
  
    const add1 = req.body;
    console.log("The object: ",add1[1]); 
    let msg;

   
    db.all(
        `SELECT * FROM stj2019 WHERE julianday(?) <= julianday(time) AND julianday(time) <= julianday(?);`, [add1[0].start,add1[0].end],function(err,rows){
        
        if (!err){
       
        msg = {result: rows};
        res.send(msg);
        }
        else{
            console.log("Error in searching database",err);
        }
    });

  });
  const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}!`));