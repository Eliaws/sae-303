const apiEndpoint = 'Consignes-SAE303/Datas/geo-les_salles_de_cinemas_en_ile-de-france.json';
const display = document.querySelector("#display-data");
const inputNom = document.querySelector("#input");
const ChoixDep = document.querySelector("#ChoixDep");



const cinemaData=document.querySelector("[data-cinema]");
const dataFilmProgramme=document.querySelector("[data-film-programme]");
const dataEcran= document.querySelector("[data-ecran]");
const ctx = document.getElementById('myChart');



/****Variable du graph */

let  GraphDatasNom=[]; /**Don't touch */
let  GraphDatasEcrans=[];

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


    // console.log(filteredDataCinema.length);

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

    console.log(cinema);

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



        // console.log(GraphDatasNom);
        console.log(GraphDatasEcrans);

        

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






