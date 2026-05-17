const API_URL= "https://api.potterdb.com/v1/characters?page%5Bsize%5D=100";
// selecteren van DOM element
const charactersContainer= document.querySelector("#characters");

// maken van een card

const createCard=(character) =>{
  const attributes = character.attributes;
  const card=document.createElement("article");
  card.classList.add("card");
  //html toevoegen via template literal
   card.innerHTML = ` 
    <img class="card-image" src="${attributes.image ? attributes.image : ''}" alt="${attributes.name}" />
    <h2 class="card-name">${attributes.name}</h2>
    <p class="card-info"><strong>House:</strong> ${attributes.house ? attributes.house : "Unknown"}</p>
    <p class="card-info"><strong>Species:</strong> ${attributes.species ? attributes.species : "Unknown"}</p>
    <p class="card-info"><strong>Blood:</strong> ${attributes.blood_status ? attributes.blood_status : "Unknown"}</p>
    <p class="card-info"><strong>Gender:</strong> ${attributes.gender ? attributes.gender : "Unknown"}</p>
    <p class="card-info"><strong>Patronus:</strong> ${attributes.patronus ? attributes.patronus : "Unknown"}</p>
  `;
  return card;

}

// renderen van alle Cards

const renderCharacters= (characters) => {
  charactersContainer.innerHTML=""; // verwijderd de loading bericht


  characters.forEach((character) => {
  const card=createCard(character);
  charactersContainer.appendChild(card);
  })

};

//API fetch data--> zorgen dat data opgehaald kan worden//

const getCharacters= async ()=> {                  //maken van functie met als naam getCharacters
  try{
    const response = await fetch (API_URL);
    
    if(! response.ok){ 
      throw new Error(`HTTP error:${response.status}`);
    }
    const json= await response.json();
    renderCharacters(json.data);
  }catch(error){
    console.error("Something went wrong", error.message);
    charactersContainer.innerHTML= `<p class="loading"> Failed to load characters.</p>`;
  }


};
getCharacters(); // roept de functie op