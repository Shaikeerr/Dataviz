// Déclaration des variables
let tab = [];
let data;
let default_value_barre = 200;
let largeur_barre;
let an = 2003;
let compteur = 0;
let currentYearData;
let barreId;
let mentionslegales;
let analyseinfos;
let audio = new Audio('logos/oui.mp3');


// Initialisation avec l'année 2003
annee(an);

// Fonction pour gérer le changement d'année depuis le sélecteur
function choix_annee() {
    an = parseInt(document.getElementById("choix_annee").value);
    document.querySelector(".year").innerHTML = "Année : " + an;
    annee(an);
}

// Fonction pour passer à l'année suivante
function next(event) {
    event.preventDefault();
    event.stopPropagation();

    // Si l'année est supérieure à 2023, revenir à 2002
    if (an >= 2023) {
        an = 2002;
    }
    an = an + 1;
    document.querySelector(".year").innerHTML = an;
    annee(an);
    // Mettez ici votre logique pour mettre à jour le graphique
}

// Fonction pour passer à l'année précédente
function previous(event) {
    event.preventDefault();
    event.stopPropagation();

    // Si l'année est inférieure à 2003, revenir à 2024
    if (an <= 2003) {
        an = 2024;
    }
    an = an - 1;
    document.querySelector(".year").innerHTML = an;
    annee(an);
}

// Fonction pour charger les données de l'année spécifiée
function annee(x) {
    d3.json("data.json").then(function (jsonData) {
        data = jsonData;
        mentionslegales = data["Mentions"];
        currentYearData = data["classement"][x];
        analyseinfos = data["Analyse"];
        createBarChart(currentYearData);
    });
}

// Fonction pour créer le graphique à barres
function createBarChart(data) {
    const svgContainer = d3.select("#bar-chart");
    svgContainer.selectAll(":not(.stats)").remove();

    const margin = { top: 50, right: 125, bottom: 30, left: 70 };
    const width = document.getElementById('bar-chart').offsetWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Ajout des boutons suivant et précédent
    d3.select("#bar-chart")
        .append("image")
        .attr("class", "suivant")
        .attr("onclick", "next(event)");

    d3.select("#bar-chart")
        .append("image")
        .attr("class", "precedent")
        .attr("onclick", "previous(event)");

    // Création de l'élément SVG
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", '96%')
        .attr("padding", "20px")
        .attr("height", height + margin.top + margin.bottom)
        .style("border-radius", "1.8125rem")
        .style("background", "linear-gradient(259deg, rgba(0, 255, 255, 0.1) -74.6%, rgba(0, 255, 255, 0.1) 101.52%)")
        .style("box-shadow", "2px 2px 100px 0px rgba(66, 66, 66, 0.10) inset, -2px -2px 100px 0px rgba(255, 255, 255, 0.2) inset")
        .style("backdrop-filter", "blur(45px)")
        .style("position", "absolute")
        .style("left", "50%")
        .style('transform', "translateX(-50%)")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.select("#bar-chart")
        .append("div")
        .attr("class", "year")
        .text(an);

    const x = d3.scaleBand()
        .domain(data.map(d => d.jeu))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.argent_generé)])
        .nice()
        .range([height, 0]);

    // Ajout des barres
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", d => d.couleur)
        .attr("class", "bar")
        .attr("id", (d, compteur) => "barreui-" + compteur)
        .attr("x", d => x(d.jeu))
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(1000)
        .attr("y", d => y(d.argent_generé))
        .attr("height", d => height - y(d.argent_generé))
        .on("end", function () {

            // Ajout des images
            svg.selectAll(".image")
                .data(data)
                .enter()
                .append("image")
                .attr("class", "image")
                .attr("id", (d, compteur) => "image-" + compteur)
                .attr("x", d => x(d.jeu))
                .attr("y", d => Math.min(y(d.argent_generé) - x.bandwidth(), height - x.bandwidth()))
                .attr("width", x.bandwidth())
                .attr("height", x.bandwidth())
                .attr("href", d => d.URLImage)
                .style("opacity", 0)
                .on("mouseover", function (d, i) {
                    d3.selectAll(".bar").style("opacity", 0.5);
                    d3.selectAll(".image").style("opacity", 0.5);
                    barreId = d3.select(this).attr("id").split("-")[1];
                    d3.select("#image-" + barreId).style("opacity", 1);
                    d3.select(this).style("opacity", 1);
                    d3.select(".stats")
                        .html("<p> <strong>Jeu:</strong> " + currentYearData[barreId].jeu + "<br>" + "<strong>Argent reversé:</strong> " + currentYearData[barreId].argent_generé.toLocaleString('fr-FR') + " $ <br> <strong>Nombre de joueurs:</strong> " + currentYearData[barreId].nombre_joueurs + "<br> <strong> Nombre de tournois: </strong>" + currentYearData[barreId].nombre_tournois + "</p>")
                        .style("opacity", .9);
                })
                .on("mouseout", function (d, i) {
                    d3.selectAll(".bar").style("opacity", 1);
                    d3.selectAll(".image").style("opacity", 1);
                    d3.select(".stats").transition()
                        .text("")
                        .duration(200)
                        .style("opacity", .9);
                })
                .on("click", function (d, i) {
                    var url = location.href;
                    location.href = "#container-2";
                    history.replaceState(null, null, url);
                    const statsContainer = d3.select(".divstats");
                    statsContainer.selectAll("*").remove();
                    statsContainer.append("img")
                        .attr("class", "circle-picture")
                        .attr("src", currentYearData[barreId].URLImage);
                    statsContainer.append("div")
                        .attr("class", "separator");
                    statsContainer.append("p")
                        .html(currentYearData[barreId].Texte_jeu);

                })
                .transition()
                .duration(500)
                .style("opacity", 1);
            compteur++;
        });

    // Ajout de l'axe X
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("color", "white") // Changez la couleur du texte
        .style("stroke-width", "5px") // Changez l'épaisseur de la ligne de l'axe X
        .selectAll("text") // Sélectionnez tous les textes des étiquettes de l'axe X
        .style("visibility", "hidden") // Cachez les textes des étiquettes
        .style("width", "100px");

    // Ajout des labels des barres
    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.jeu) + x.bandwidth() / 2)
        .attr("y", d => y(d.argent_generé) - 5)
        .attr("text-anchor", "middle");

    // Interaction lors du survol des barres
    svg.selectAll(".bar")
        .data(data)
        .on("mouseover", function (d, i) {
            d3.selectAll(".bar").style("opacity", 0.5);
            d3.select(this).style("opacity", 1);
            d3.selectAll(".image").style("opacity", 0.5);
            barreId = d3.select(this).attr("id").split("-")[1];
            d3.select("#image-" + barreId).style("opacity", 1);
            d3.select(this).style("opacity", 1);
            d3.select(".stats")
                .html("<p> <strong>Jeu:</strong> " + currentYearData[barreId].jeu + "<br>" + "<strong>Argent reversé:</strong> " + currentYearData[barreId].argent_generé.toLocaleString('fr-FR') + " $ <br> <strong>Nombre de joueurs:</strong> " + currentYearData[barreId].nombre_joueurs + "<br> <strong> Nombre de tournois: </strong>" + currentYearData[barreId].nombre_tournois + "</p>")
                .style("opacity", .9);
        })
        .on("mouseout", function () {
            // Rétablir l'opacité normale des barres
            d3.selectAll(".bar").style("opacity", 1);
            d3.selectAll(".image").style("opacity", 1);
            d3.select(".stats").transition()
                .text("")
                .duration(200)
                .style("opacity", .9);
        })
        .on("click", function (d, i) {
            var url = location.href;
            location.href = "#container-2";
            history.replaceState(null, null, url);
            const statsContainer = d3.select(".divstats");
            statsContainer.selectAll("*").remove();
            statsContainer.append("img")
                .attr("class", "circle-picture")
                .attr("src", currentYearData[barreId].URLImage);
            statsContainer.append("div")
                .attr("class", "separator");
            statsContainer.append("p")
                .html(currentYearData[barreId].Texte_jeu);

        });

    // Mise à jour en cas de redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        const newWidth = document.getElementById('bar-chart').offsetWidth - margin.left - margin.right;
        svg.attr('width', newWidth + margin.left + margin.right);
        x.range([0, newWidth]);

        svg.selectAll('.bar')
            .attr('x', d => x(d.jeu))
            .attr('width', x.bandwidth());

        svg.select('.x-axis')
            .call(d3.axisBottom(x));

        svg.selectAll('.bar-label')
            .attr('x', d => x(d.jeu) + x.bandwidth() / 2);
        
        // Ajout d'un rectangle invisible pour capturer les événements
        svg.append("rect")
            .attr("class", "persistent")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all"); // Pour permettre aux événements de se propager à travers le rectangle
    });

        // Sélectionne l'élément avec la classe "mentions" et ajoute un événement "click"
        const mentions = d3.select(".mentions");
        mentions.on("click", function(d,i) {
             // Gère le changement d'URL et l'historique
            var url = location.href;               
            location.href = "#footer";             
            history.replaceState(null,null,url); 
            document.querySelector("footer").style.display = "block";   // Affiche le pied de page
            const mentionsContainer = d3.select("footer");     // Sélectionne le conteneur des mentions légales
            mentionsContainer.selectAll("*").remove();

                // Ajoute des éléments HTML pour chaque section des mentions légales

            mentionsContainer.append("div")
            .attr("class", "mentionssuite")
            .append("h3")
            .text("Editeur")
            mentionsContainer.append("p")
            .html(mentionslegales["Editeur"])
            mentionsContainer.append("div")
            .attr("class", "mentionssuite")
            .append("h3")
            .text("Hébergeur")
            mentionsContainer.append("p")
            .html(mentionslegales["Hebergeur"])
            mentionsContainer.append("div")
            .attr("class", "mentionssuite")
            .append("h3")
            .text("Conception")
            mentionsContainer.append("p")
            .html(mentionslegales["Conception"])
            mentionsContainer.append("div")
            .attr("class", "mentionssuite")
            .append("h3")
            .text("Sources")
            mentionsContainer.append("p")
            .html(mentionslegales["Sources"])
                // Ajoute un bouton "Retour" avec un gestionnaire d'événements
            mentionsContainer.append("div")
            .attr("class", "mentionssuite")
            .append("button")
            .attr("class", "mentions")
            .attr("id", "effacermentions")
            .text("Retour")
                // Gestionnaire d'événements pour masquer le pied de page
            document.querySelector("#effacermentions").addEventListener("click", function () {
                document.querySelector("footer").style.display = "none";
            });
            

        });
        // Sélectionne l'élément avec la classe "showinfos"
        const analyse = d3.select(".showinfos");
        analyse.on("click", function(d,i) {
                // Gère le changement d'URL et l'historique
            var url = location.href;               
            location.href = "#container-3";             
            history.replaceState(null,null,url); 
            document.querySelector("#container-3").style.display = "block";     // Affiche l'élément avec l'ID "container-3"
            const analyseContainer = d3.select(".divanalyse");
            analyseContainer.selectAll("*").remove();
                // Ajoute des éléments HTML pour chaque section d'analyse

            analyseContainer.append("div")
            .attr("class", "analysesuite")
            .append("h3")
            .text("Évolution des Cash Prizes (2003-2023)")
            analyseContainer.append("p")
            .html(analyseinfos["2003-2023"])
            analyseContainer.append("div")
            .attr("class", "analysesuite")
            .append("h3")
            .text("Impact de la Pandémie sur l'Esport")
            analyseContainer.append("p")
            .html(analyseinfos["pandémie"])
            analyseContainer.append("div")
            .attr("class", "analysesuite")
            .append("h3")
            .text("Exemple de la Bulle sanitaire pour les Worlds de LoL 2020")
            analyseContainer.append("p")
            .html(analyseinfos["bulle"])
            analyseContainer.append("div")
            .attr("class", "analysesuite")
                // Ajoute un bouton "Retour" avec un gestionnaire d'événements

            .append("button")
            .attr("class", "mentions")
            .attr("id", "effaceranalyse")
            .text("Retour")
                // Gestionnaire d'événements pour masquer l'élément avec l'ID "container-3"

            document.querySelector("#effaceranalyse").addEventListener("click", function () {
                document.querySelector("#container-3").style.display = "none";
            });
            
            

        });

}
// Ajoute des gestionnaires d'événements "click" aux boutons suivant et précédent

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".suivant").addEventListener("click", next);
    document.querySelector(".precedent").addEventListener("click", previous);
});

function easteregg() {
    audio.cloneNode(true).play();

}