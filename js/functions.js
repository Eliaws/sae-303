const apiEndpoint = 'Consignes-SAE303/Datas/geo-les_salles_de_cinemas_en_ile-de-france.json';
const display = document.querySelector("#display-data");
const inputNom = document.querySelector("#input");
const ChoixDep = document.querySelector("#ChoixDep");
const seatsRange = document.querySelector("#seatsRange");
const seatsValue = document.querySelector("#seatsValue");

const cinemaData=document.querySelector("[data-cinema]");
const dataFilmProgramme=document.querySelector("[data-film-programme]");
const dataEcran= document.querySelector("[data-ecran]");
const ctx = document.getElementById('myChart');

let GraphDatasNom = []; // Noms de cinéma pour le graphique
let GraphDatasEcrans = []; // Nombre d'écrans pour le graphique
let filteredDataCinema = []; //Tableau contenant les cinémas filtrés


// Récupération des données du fichier JSON
const getData = async () => {
    const res = await fetch(apiEndpoint);
    const data = await res.json();
    return data;
}

//Filtrage des données : (Pour que la fonction filterCinemaData soit utilisée partout dans le code)
const filterCinemaData = async () => {
    let queryNom = inputNom.value.toLowerCase();
    let queryDep = Number(ChoixDep.value);
    let minSeats = parseInt(seatsRange.value, 10);

    const cinema = await getData();

    return cinema.filter((eventData) => {
        let matchesNom = !queryNom || eventData.nom.toLowerCase().includes(queryNom);
        let matchesDep = isNaN(queryDep) || eventData.dep === queryDep;
        let matchesSeats = minSeats <= eventData.fauteuils;

        return matchesNom && matchesDep && matchesSeats;
    });
};

//Mise à jour de la carte 

const updateMapMarkers = async () => {
    let queryNom = inputNom.value.toLowerCase();
    let queryDep = Number(ChoixDep.value);
    let minSeats = parseInt(seatsRange.value, 10);

    const cinema = await getData();
    filteredDataCinema = cinema.filter((eventData) => {
        let matchesNom = !queryNom || eventData.nom.toLowerCase().includes(queryNom);
        let matchesDep = isNaN(queryDep) || eventData.dep === queryDep;
        let matchesSeats = minSeats <= eventData.fauteuils;
        return matchesNom && matchesDep && matchesSeats;
    });

    markers.clearLayers();
    filteredDataCinema.forEach(cinema => {
        const [latitude, longitude] = cinema.geo.split(',').map(coord => parseFloat(coord));
        const marker = L.marker([latitude, longitude]);
        marker.bindPopup(`<b>${cinema.nom}</b><br>${cinema.programmateur}<br>${cinema.commune}<br>${cinema.adresse}`);
        markers.addLayer(marker);
    });
    markers.addTo(map);
};




// Affichage des données de cinéma
const displayCinema = async () => {
    filteredDataCinema = await filterCinemaData();
    
/**Ne pas toucher s'il vous plait */ 
    cinemaData.innerHTML= `
    <table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
             <tr class="text-center">
                <th>Nom </th>
                <th>Région </th>
                <th>Ville </th>
                <th>Départ... </th>
                <th>Nbre sièges</th>
             </tr>
    ${
        display.innerHTML = filteredDataCinema.map((object) => {
            const { nom, region_administrative, commune, dep, fauteuils } = object;
    
            return `
               
              <tr class="fs-6">
                <td>  ${nom}</td>
                <td> ${region_administrative}</td>
                <td> ${commune}</td>
                <td> ${dep}</td>
                <td> ${fauteuils}</td>
              </tr>           
            `
        }).join("")
        
    }
    </table>
    `;

    display.style.display="none";
/**Ne pas toucher s'il vous plait */
    display.innerHTML = filteredDataCinema.map((object) => {
        const { nom, region_administrative, commune, dep, fauteuils } = object;

        return `

        <table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
           
           <tr class="text-center">
              <th>Nom</th>
              <th>Région </th>
              <th>Ville</th>
              <th>Département </th>
              <th>Nombre de sièges </th>
            </tr>
          
          <tr class="fs-6">
            <td>  ${nom}</td>
            <td> ${region_administrative}</td>
            <td> ${commune}</td>
            <td> ${dep}</td>
            <td> ${fauteuils}</td>
          </tr>
        </table>
        <br>
        
        `
    }).join("");


    // Calcul des données agrégées
    const totalCinemas = filteredDataCinema.length;
    const totalSeats = filteredDataCinema.reduce((total, cinema) => total + cinema.fauteuils, 0);
    const FilmProgramme=filteredDataCinema.reduce((total, filmProgramme)=>total+filmProgramme.nombre_de_films_programmes, 0);
    const TotalEcran=filteredDataCinema.reduce((total, Ecran)=>total+Ecran.ecrans, 0);

    // Affichage des données agrégées
    document.getElementById("total-cinemas").textContent = totalCinemas;
    document.getElementById("total-seats").textContent = totalSeats;
    dataFilmProgramme.textContent=FilmProgramme;
    dataEcran.textContent=TotalEcran;


         /****Chart js... */
        //Faire un deuxième tableau Nombre d'écran puis l'utiliser lors de la 

        filteredDataCinema.forEach(element => { 

            GraphDatasNom.push(element.nom);

           
        });
        filteredDataCinema.forEach(element => { 

            GraphDatasEcrans.push(element.ecrans);

           
        });

        /****Graphisme */

        

        new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: GraphDatasNom,
                datasets: [{
                label: "# Nombres d'écran",
                data: GraphDatasEcrans,
                borderWidth: 1
                }]
            },
            options: {
                scales: {
                y: {
                    beginAtZero: true
                }
                }
            }
        });
    


    // Mise à jour de la carte avec les marqueurs
    updateMapMarkers(filteredDataCinema);
};

// Afficher les cinémas initiaux
displayCinema();

document.addEventListener('DOMContentLoaded', async () => {
    await updateMapMarkers();
    updateChart(GraphDatasNom, GraphDatasEcrans);
});


// Mise à jour la valeur affichée pour le nombre de sièges en temps réel
seatsRange.addEventListener("input", () => {
    seatsValue.textContent = seatsRange.value;
    displayCinema();
    updateMapMarkers(filteredDataCinema);
});



inputNom.addEventListener("input", () => {
    displayCinema();
    updateMapMarkers(filteredDataCinema);
});

ChoixDep.addEventListener("change", () => {
    displayCinema();
    updateMapMarkers(filteredDataCinema);
});

document.addEventListener('DOMContentLoaded', async () => {
    await updateMapMarkers();
});



// MAP LEAFLET

var map = L.map('map').setView([48.8566, 2.3522], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

var markers = L.layerGroup().addTo(map); // Groupe de marqueurs

