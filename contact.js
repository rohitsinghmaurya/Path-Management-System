
let map;
let markers = [];
let locations = [];
function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}





// Make sure to remove the Leaflet code for OpenStreetMap initialization




function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setView([currentLocation.lat, currentLocation.lng], 12);
                
                 (async ()=>{
                     const lat1 = currentLocation.lat
                     const lon1 = currentLocation.lng
                     const address = await getAddressandstore(lat1,lon1)
                    // console.log(address);
                     const currentLocationInput = document.querySelector(".input1");
                     if(currentLocationInput){
                         currentLocationInput.value = address;
                     }
                     else{
                         console.log("Element with ID 'input1' not found")
                     }

                     currentLocation.name = address;
                     locations = [currentLocation, ...locations];
                     
                 })();

            },
            error => {
                console.error('Error getting current position:', error);
                alert('Error getting current position');
            }
        );
    } else {
        console.error('Geolocation is not supporte by this browser.');
        alert('Geolocation is not supported by this browser.');
    }
}

 async function textaddresse( lat1 ,  lon1){

    var url1 = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat1}&lon=${lon1}&addressdetails=1`;
    try {
        let response = await fetch(url1);
        let data = await response.json();
        return data.display_name;
    } catch (error) {
        console.log(error);
        return null
    }
}




async function getAddressandstore(lat1 , lon1){
     const address = await textaddresse(lat1,lon1)
   //  console.log(address);

     if(address){
        // console.log(address);
         let sotredaddress = address;
         return sotredaddress;
     }
     else{
         console.log('Failed to retrieve address');
         return null
     }
}



function addLocation() {

    const taskInput = document.getElementById("input2");
    const task = taskInput.value.trim();
    
    if (task !== "") {
        document.querySelector(".task-box").classList.add("move-left");
        document.querySelector(".empty-box").classList.add("move-right");
        const taskList = document.getElementById("taskbox");
        const newTask = document.createElement("li");
        newTask.textContent = task;
        taskList.appendChild(newTask);
        taskInput.value = "";
        geocodeAddress(task);
       // fetchTouristAttraction();
    }
}

function geocodeAddress(address) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const location = {
                    name: address,
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
                map.setView([location.lat, location.lng], 12);
                placeMarker(location);
              //  fetchTouristAttraction(location.lat , location.lng)
                
               const exist = locations.some(loc=>
                     loc.name.toLowerCase() === location.name.toLowerCase() ||
                     (Math.abs(loc.lat - location.lat) < 0.001 && Math.abs(loc.lng - location.lng) < 0.001)  
               );

               if(!exist && location.name && location.lat && location.lng){
                  locations.unshift(location);
               }

            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data');
        });
}


function fetchTouristAttraction(lat , lon){
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:5000,${lat},${lon});out body;`;
    
    fetch(overpassUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tourist attractions');
            }
            return response.json();
        })
        .then(data => {
            if (data.elements && data.elements.length > 0) {
                displayTouristAttraction(data.elements);
            } else {
                displayNotAttractionMessage();
            }
        })
        .catch(error => {
            console.log('Error fetching tourist attractions:', error);
           // alert('Error fetching tourist attractions');
        });
}

function displayNotAttractionMessage(){
      const attractionList = document.getElementById('attractions')
      attractionList.innerHTML = '<li>No tourist attractions found near this location</li>';
}

function displayTouristAttraction(attractions) {
    const attractionList = document.getElementById('attractions');
    attractionList.innerHTML = '';
    attractions.forEach(attraction => {
        const listItem = document.createElement('li');
        listItem.textContent = attraction.tags.name || 'Unnamed attraction';
        listItem.classList.add('attraction-item');
        listItem.style.fontSize = 'small';
        attractionList.appendChild(listItem);
    });
}


function placeMarker(location) {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    markers.push(marker);
    const exist = locations.some(loc => loc.lat === location.lat && loc.lng === location.lng);
    if(!exist){
         locations.unshift(location);
    }
    //locations.push(location)
}




function deleteTask() {
    const taskList = document.getElementById("taskbox");
    const lastTaskIndex = taskList.children.length - 1;
    if (lastTaskIndex >= 0) {
        taskList.removeChild(taskList.children[lastTaskIndex]);
    }

    if (taskList.children.length === 0) {
        document.querySelector(".task-box").classList.remove("move-left");
        document.querySelector(".empty-box").classList.remove("move-right");
        document.getElementById('attractions').innerHTML = '';
    }

    // Remove the last marker from the map
    if (markers.length > 0) {
        map.removeLayer(markers.pop());
        locations.pop()
        if(locations.length > 0){
             const previouslocation = locations[locations.length - 1];
             map.setView([previouslocation.lat , previouslocation.lng],12);
             fetchTouristAttraction(previouslocation.lat , previouslocation.lng);
        }
        else{
             map.setView([0,0],2);
             if(locations.length === 0)
             document.getElementById('attractions').innerHTML = '';
        }
    }
}





window.onload = function() {
    initMap();
    getCurrentLocation();
   document.getElementById('calculatepath').addEventListener('click', calculateAndDisplayShortestPath);
}



async function fetchShortestPath(locations) {
    try {
         
        const validLocations = locations.filter(location => location !== null && location.name && location.lat !== undefined && location.lng !== undefined);
        

        if (validLocations.length === 0) {
            throw new Error("No valid locations to process.");
        }
        
        // Send the filtered locations to the backend
        const response = await fetch('http://localhost:3000/shortest-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ locations: validLocations })
        });

            
        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const data = await response.json();
        
        return data.path;

    } catch (error) {
        console.error('Error fetching the shortest path:', error);
        return null;
    }
}




async function calculateAndDisplayShortestPath() {
    try {
        const sourceLocation = document.querySelector('.input1').value;
       
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${sourceLocation}&format=json`);
        const data = await response.json();
        
        if (data.length > 0) {

           const location = {
                 name:sourceLocation,
                 lat:parseFloat(data[0].lat),
                 lng:parseFloat(data[0].lon)
            }

           
            const exist = locations.some(loc=>
                loc.name?.toLowerCase() === location.name.toLowerCase() ||
                (Math.abs(loc.lat - location.lat) < 0.001  && Math.abs(loc.lng - location.lng) < 0.001)
            );
           
            if(!exist && location.name && location.lat && location.lng){
                  locations.push(location);
            }
           
               
            const shortestPath = await fetchShortestPath(locations);

           
            if(shortestPath && shortestPath.length > 0){
                   const validPath = shortestPath.filter(loc =>
                      loc && loc.name && loc.lat !== undefined && loc.lng !== undefined
                   );

                 if(validPath.length > 0){
                       const pathString = validPath.map(loc =>{
                           const name = loc.name || `Location (${loc.lat} , ${loc.lng})`;
                           return `${name}:${loc.lat} , ${loc.lng}`; 
                       }).join(' -> ');
                       window.open(`http://127.0.0.1:5500/map/Result.html?path=${encodeURIComponent(pathString)}`, '_blank');
                 }
                 else{
                     alert("No valid location found in the shortest path");
                 }
            }
           
        } else {
            alert('Source location not found');
        }
    } catch (error) {
        console.error('Error calculating shortest path:', error);
    }
}



