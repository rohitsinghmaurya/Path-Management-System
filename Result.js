function getPathFromURL(){
       const urlParams = new URLSearchParams(window.location.search);
       const pathParam = urlParams.get('path');
       if(pathParam){
          return pathParam.split(';').map(location =>{
                 const [name , coords] = location.split(':');
                 const [lat , lng] = coords ? coords.split(',') : [NaN , NaN];
                 return { 
                      name : name ? name.trim() : 'Unknown',
                      lat : parseFloat(lat) ,
                      lng : parseFloat(lng)
                    };
          });
         
       }
       return [];
    }

       const path = getPathFromURL();

       const map = L.map('map').setView([path[0].lat , path[0].lng] , 13);

       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' , {
            maxZoom:19
       }).addTo(map);

       const latlngs = path.map(location =>[location.lat , location.lng]);

       latlngs.forEach(latlng=>{
             L.marker(latlng).addTo(map);          
       });

       const polyline = L.polyline(latlngs ,{color : 'blue'}).addTo(map);

       map.fitBounds(polyline.getBounds());

       const pathDisplayElement = document.getElementById('path-display');

       const pathText = path.map((location , index)=>{
             return `Location ${index + 1} : ${location.name || 'Unknown'}`;
       }).join(' -> ');

       pathDisplayElement.textContent = `Path: ${pathText}`;
