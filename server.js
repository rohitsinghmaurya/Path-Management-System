const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(bodyParser.json());


function calculateShortestPath(locations) {

    const numLocations = locations.length;
    if (numLocations < 2) return [];

    const dist = Array(numLocations).fill(Infinity);
    const prev = Array(numLocations).fill(null);
    const visited = Array(numLocations).fill(false);
    dist[0] = 0;

    for (let i = 0; i < numLocations; i++) {
        let u = -1;
        for (let j = 0; j < numLocations; j++) {
            if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
                u = j;
            }
        }

        if (u === -1 || dist[u] === Infinity) break;
        visited[u] = true;

        for (let v = 0; v < numLocations; v++) {
            if (!visited[v]) {
                const alt = dist[u] + getDistance(locations[u], locations[v]);
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }
    }

    let path = [];
    let at = numLocations - 1;
    while (at != null) {
        path.push(at);
        at = prev[at];
    }
    path.reverse();

    if (path.length < numLocations) {
        const unvisited = locations.filter((_, index) => !path.includes(index));
        path = [...path, ...unvisited];
    }

    return path.map(index => locations[index]);
}

function getDistance(loc1, loc2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

app.post('/shortest-path', (req, res) => {
    const locations = req.body.locations;
    
    if (!Array.isArray(locations) || locations.length < 2) {
        return res.status(400).send('Invalid input: locations must be an array with at least two items.');
    }
    
    // Validate each location
    for (const loc of locations) {
        if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
            return res.status(400).send('Invalid input: each location must have numeric lat and lng properties.');
        }
    }

    try {
        const shortestPath = calculateShortestPath(locations);
        if(!shortestPath || shortestPath.length === 0){
              return res.status(500).send("Erro:No valid path to be calculated.")
        }
        res.json({ path: shortestPath });
        
    } catch (error) {
        res.status(500).send(`Error calculating shortest path: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
