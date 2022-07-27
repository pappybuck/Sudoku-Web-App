const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: 'localhost:3000'
}));
const albums = {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99}


app.get('/', (req, res) => {
    console.log(req.headers.host);
    res.send(albums);
});

app.listen(8081);