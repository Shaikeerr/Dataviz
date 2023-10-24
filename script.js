
let tab = []

function choix_annee() {
    an = document.getElementById("choix_annee").value
    console.log(an)
    annee(an)
}


function annee(x) {

//Permet de récupérer toutes les données d'un fichier JSON et de les stocker dans une variable data
d3.json("data.json" ).then(function(data) {

    //Permet de récupérer l'objet de données correspondant à l'année inscrite dans la fonction et de le stocker dans une variable element 
    let current_year = data["classement"][x]
        d3.select("body")
        .selectAll(".barre")
        .data(current_year)
        .join("div")
        .attr("class", "barre")
        .style("background-color", d => d.couleur )
        .html((d,i) => `Position : ${d.position} <br> Jeu : ${d.jeu} <br> Source: ${d.lien} <br> Argent généré : ${d.argent_generé.toLocaleString('fr-FR', { style: 'decimal' })} $<br> Nombre de joueurs : ${d.nombre_joueurs} <br> Nombre de Tournois : ${d.nombre_tournois} <br> Couleur : ${d.couleur} <br><br>` );

 });

}

annee(2023)

function separateur_nombre(x) {

}
