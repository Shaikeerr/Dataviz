let tab = [];
let data;
let default_value_barre = 200;
let largeur_barre;
let an = 2003
let compteur = 0

annee(an)



function choix_annee() {
    an = parseInt(document.getElementById("choix_annee").value);
    document.querySelector(".year").innerHTML = "Année : " + an
    console.log(an);
    annee(an);
}

function next() {
    if (an >= 2023) {
        an = 2002
    }
    an = an + 1 
    document.querySelector(".year").innerHTML = "Année : " + an
    console.log(an)
    annee(an)
}

function previous() {
    if (an <= 2003) {
        an = 2024
    }
    an = an - 1 
    document.querySelector(".year").innerHTML = "Année : " + an
    console.log(an)
    annee(an)
}

function annee(x) {
    console.log(an)
    d3.json("data.json").then(function (jsonData) {
        data = jsonData;
        let current_year = data["classement"][x];
        createBarChart(current_year);
    });
}

function createBarChart(data) {
    const svgContainer = d3.select("#bar-chart");
    svgContainer.selectAll("*").remove();
    const margin = { top: 50, right: 75 , bottom: 30, left:20 };
    const width = document.getElementById('bar-chart').offsetWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", '96%')
        .attr("padding", "20px")
        .attr("height", height + margin.top + margin.bottom)
        .style("border-radius", "1.8125rem")
        .style("background", "linear-gradient(259deg, rgba(0, 255, 255, 0.1) -74.6%, rgba(0, 255, 255, 0.1) 101.52%")
        .style("box-shadow", "2px 2px 100px 0px rgba(66, 66, 66, 0.10) inset, -2px -2px 100px 0px rgba(255, 255, 255, 0.2) inset")
        .style("backdrop-filter", "blur(45px)")

        .style("position", "absolute")
        .style("left", "50%")
        .style('transform', "translateX(-50%)")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.jeu))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.argent_generé)])
        .nice()
        .range([height, 0]);

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
        // Ajoutez un cercle pour chaque barre après l'animation des barres
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
        var imageId = d3.select(this).attr("id").split("-")[1];
        d3.select("#barreui-" + imageId).style("opacity", 1);
        d3.select(this).style("opacity", 1);
        d3.select(".stats").transition()
            .text("Jeu: " + d.jeu + "<br/>" + "Argent généré: " + d.argent_generé)
            .duration(200)
            .style("opacity", .9);
    })
    .on("mouseout", function (d, i) {
        // À la sortie du survol, rétablissez l'opacité normale de la barre
        d3.selectAll(".bar").style("opacity", 1);
        d3.selectAll(".image").style("opacity", 1);
        d3.select(".stats").transition()
            .text("")
            .duration(200)
            .style("opacity", .9);
    })
    .transition()
    .duration(500)
    .style("opacity", 1);
    compteur++;
    console.log(compteur);
    });

    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .style("color", "white") // Changez la couleur du texte
    .style("stroke-width", "5px") // Changez l'épaisseur de la ligne de l'axe X
    .selectAll("text") // Sélectionnez tous les textes des étiquettes de l'axe X
    .style("visibility", "hidden") // Cachez les textes des étiquettes
    .style("width", "100px")

    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.jeu) + x.bandwidth() / 2)
        .attr("y", d => y(d.argent_generé) - 5)
        .attr("text-anchor", "middle")


        svg.selectAll(".bar")
        .data(data)
        .on("mouseover", function (d, i) {
            d3.selectAll(".bar").style("opacity", 0.5);
            d3.select(this).style("opacity", 1);
            d3.selectAll(".image").style("opacity", 0.5);
            var barreId = d3.select(this).attr("id").split("-")[1];
            d3.select("#image-" + barreId).style("opacity", 1);
            d3.select(this).style("opacity", 1);
            d3.select(".stats").transition()
                .text("Jeu: " + d.jeu + "<br/>" + "Argent généré: " + d.argent_generé)
                .duration(200)
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
    
        });

    
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
            .attr('x', d => x(d.jeu) + x.bandwidth() / 2)
    





        })
}


