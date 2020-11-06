var fs = require('fs');
var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const express = require('express')
const app = express()
const port = 3000
const HTMLDir = 'pages/'

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const { Pool } = require('pg')
const client = new Pool({
    user: "raddbaccess",
    host: "localhost",
    database: "radiationdb",
    password: tokens.DBPassword,
    port: "5432"
});

client.connect();

function servePage(path, res){
    console.log("1");
    fs.readFile(path, function(err, data){
        console.log("2");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
}

app.post('/api/upload_data', async (req, res) => {
    //Token verification
    var token = req.body.token;

    const result = await client.query({
        text: 'SELECT TeamID FROM Team WHERE TeamToken = $1',
        values: [token],
    })

    if (result.rowCount == 0) {
        res.send("Invalid token.")
        return;
    }
    let teamID = result.rows[0].teamid

    let cpm = req.body.reading.cpm;
    let floor = req.body.reading.location.floor;
    let locX = req.body.reading.location.x;
    let locY = req.body.reading.location.y;

    var insertQuery = "INSERT INTO reading (teamid, posfloor, posx, posy, cpm) VALUES ($1, $2, $3, $4, $5);"
    var values = [teamID, floor, locX, locY, cpm]

    try {
        await client.query('BEGIN')
        const response = await client.query(insertQuery, values)
        console.log(response.rows[0])
        res.send("Data submitted sucessfully. cpm: " + cpm + " floor: " + floor + " locX: " + locX + " locY: " + locY + "teamID: " + teamID);
        await client.query('COMMIT')

    } catch (err) {
        console.log(err.stack)
        res.send("Error commiting to db.");
        await client.query('ROLLBACK')
    }
    
});

app.get('/api/readings', async (req, res) => {
    const result = await client.query({
        text: 'SELECT * FROM reading JOIN team ON reading.teamid = team.teamid'
    })

    let response = new Array();
    result.rows.forEach(function(reading) {
        response.push({
            "teamid" : reading.teamid,
            "teamname": reading.teamname,
            "reading" : {
                "cpm": reading.cpm,
                "location": {
                    "floor": reading.posfloor,
                    "x": reading.posx,
                    "y": reading.posy
                }
            }
        })
    });

    res.send(response);
});

app.get('/record', (req, res) => {
    // Serve record.html
    servePage(HTMLDir+'record.html', res);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})