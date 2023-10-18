


function annee(x) {
fetch('data.json').then(function(response) {
    response.json().then(function(data) {              //Récupère les données du JSON et les stocke dans une variable data
        console.log(data);
        const element = data[1]   //Execute la fonction analogies avec toutes les valeurs de data
        reponse = document.querySelector(".page")
        reponse.innerHTML += element
    })       
})

}