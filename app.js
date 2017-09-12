var express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
var express_ws = require('express-ws')(app);
const base = fs.readFileSync("./client/base.html", 'utf8');
const nav = fs.readFileSync("./client/nav.html", 'utf8');
const routes = JSON.parse(fs.readFileSync("./routes.json", 'utf8'));

for (var i in routes){
    console.log(`${i} was loaded as a path!`);
}

app.use(express.static('public'));

app.get('/messages', function(req, res) {
    res.send(parse(routes["/"], false));
})

app.get('*', function(req, res) {
    
    if (!(req.path in routes)){
        res.send(parse(routes["404"], false));
    } else {
        res.send(parse(routes[req.path], false));
    }
})

app.ws("*", function(ws, req) {
    console.log("Websocket connection")
    ws.on('message',function(msg){
        console.log(msg)
    })
    ws.send("Connected")
})

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post("*", function(req, res) {
    console.log(req.body.message.replace("<","&lt;"))
    res.end("Message recieved")
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port '+(process.env.PORT||"3000")+"!");
})

function parse(route, logged) {


    var page = base;
    
    page = page.replace("{{title}}", route.title);
    
    if (logged) {
        //Then we will parse for the logged in navbar
    }
    else {
        page = page.replace("{{nav}}", nav);
    }

    page = page.replace("{{content}}", fs.readFileSync("./client/views/" + route.file, 'utf8'));

    return page;
}
