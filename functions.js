const apiEndpoint = 'geo-les_salles_de_cinemas_en_ile-de-france.json';
const display = document.querySelector("#display-data");
const inputNom = document.querySelector("#input");
const ChoixDep = document.querySelector("#ChoixDep");

//Récupération des données du fichier json
const getData = async () => {
    const res = await fetch(apiEndpoint);
    const data = await res.json();
    return data;
  }

const displayCinema = async () => {
    let queryNom = inputNom.value.toLowerCase();
    let queryDep = Number(ChoixDep.value);
    let minSeats = parseInt(seatsRange.value, 10); // Valeur du nombre de sièges

    const cinema = await getData();

    let filteredDataCinema = cinema.filter((eventData) => {
        if (!queryNom && isNaN(queryDep) && minSeats === 1) {
            return true; // Retourne toutes les données si aucun filtre n'est sélectionné
        }

        let matchesNom = true;
        let matchesDep = true;
        let matchesSeats = true;

        if (queryNom) {
            matchesNom = eventData.nom.toLowerCase().includes(queryNom);
        }

        if (!isNaN(queryDep)) {
            matchesDep = eventData.dep === queryDep;
        }

        if (minSeats > 1) {
            matchesSeats = eventData.fauteuils >= minSeats;
        }

        return matchesNom && matchesDep && matchesSeats;
    });
    
    
    
    
    display.innerHTML = filteredDataCinema.map((object) => {
        const { nom, region_administrative, commune, dep, fauteuils } = object;

        return `
        <div class="container">
            <p> Nom : ${nom}</p>
            <p> Région : ${region_administrative}</p>
            <p> Ville : ${commune}</p>
            <p> Département : ${dep}</p>
            <p> Nombre de sièges : ${fauteuils}</p>
        </div>
        <hr>
        `
    }).join("");



    console.log(filteredDataCinema.length);

    // Calcul des données agrégées
    const totalCinemas = filteredDataCinema.length;
    const totalSeats = filteredDataCinema.reduce((total, cinema) => total + cinema.fauteuils, 0);

    // Affichage des données agrégées
    document.getElementById("total-cinemas").textContent = totalCinemas;
    document.getElementById("total-seats").textContent = totalSeats;

}


// Mise à jour la valeur affichée pour le nombre de sièges en temps réel
seatsRange.addEventListener("input", () => {
    seatsValue.textContent = seatsRange.value;
    displayCinema();
});

displayCinema();

inputNom.addEventListener("input", () => {
    displayCinema();
});

ChoixDep.addEventListener("change", () => {
    displayCinema();
});

