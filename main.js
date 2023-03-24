const { v4: uuidv4 } = require('uuid');

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const port = 5005;

app.use(express.static('public'))
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    var page = `
        <html>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css" integrity="sha512-xiunq9hpKsIcz42zt0o2vCo34xV0j6Ny8hgEylN3XBglZDtTZ2nwnqF/Z/TTCc18sGdvCjbFInNd++6q3J0N6g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        
            <link href="https://unpkg.com/tabulator-tables@5.4.2/dist/css/tabulator.min.css" rel="stylesheet">
            <script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.4.2/dist/js/tabulator.min.js"></script>

            <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>

            <script type="module" src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"></script>

            <div id="attributes-table" display="inline-block"></div>
            <div id="attributes-buttons" display="inline-block">
                <span onclick="addRow()">
                    <svg width="28px" height="28px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8 12h4m4 0h-4m0 0V8m0 4v4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </span>
                <span onclick="removeSelectedRows()">
                    <svg width="28px" height="28px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8 12h8M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </span>
            </div>

            <div style="margin-top:5px">
                <div display="inline-block">Viz URL: </div>
                <div display="inline-block"><input type="text"id="viz-url" value=""></div>
            </div>

            <div style="margin-top:5px">
                <button onclick="loadViz()">Load Viz</button>
            </div>
            
            <div style="margin-top:80px; border-style: solid; border-width: 1px" id="viz-pane">
            </div>

            <script src="/js/attributes_table.js"></script>
        </html>
    `;

    response.end(page);
});

app.post("/getToken", (request, response) => {
    var connectedAppClientId = config.get("client_id");
    var connectedAppSecretKey = config.get("secret_value");
    var connectedAppSecretId = config.get("secret_id");

    var attributesFromClient = request.body;
    var claims = {
        iss: connectedAppClientId,
        exp: Math.floor(Date.now() / 1000) + (9 * 60),
        jti: uuidv4(),
        aud: "tableau",
        sub: "abac",
        scp: ["tableau:views:embed"],
        ...attributesFromClient
    };

    var jwt = require('jsonwebtoken');
    var token = jwt.sign(
        claims,
        connectedAppSecretKey,
        {
            algorithm: 'HS256',
            header: {
                'kid': connectedAppSecretId,
		        'iss': connectedAppClientId
            }
        }
    );

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(token);
});

app.listen(port, () => {
    console.log('Server running...');
});
