
const apiEndpoint = '/Consignes-SAE303/Datas/geo-les_salles_de_cinemas_en_ile-de-france.json';
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
    let queryDep = Number(ChoixDep.value); // Convertissez la valeur en nombre

    const cinema = await getData();

    let dataCinema = cinema.filter((eventData) => {
        if (!queryNom === "" && isNaN(queryDep)) { // Utilisez isNaN pour vérifier si queryDep est un nombre
            return true; // Retourne toutes les données si aucun filtre n'est sélectionné
        }
         else if (queryNom === "vide") {
            return eventData;}

        let matchesNom = true;
        let matchesDep = true;

        if (queryNom !== "") {
            matchesNom = eventData.nom.toLowerCase().includes(queryNom);
        }

        if (!isNaN(queryDep)) { // Vérifiez si queryDep est un nombre
            matchesDep = eventData.dep === queryDep;
        }

        return matchesNom && matchesDep;
    }).map((object) => {
        const { nom, region_administrative, commune, dep } = object;

        return `
        <div class="container">
            <p> Nom : ${nom}</p>
            <p> Région : ${region_administrative}</p>
            <p> Ville : ${commune}</p>
            <p> Département : ${dep}</p>
        </div>
        <hr>
        `
    }).join("");

    display.innerHTML = dataCinema;
}

displayCinema();

inputNom.addEventListener("input",() =>{
    displayCinema();
});
ChoixDep.addEventListener("change",() =>{
    displayCinema();
});

