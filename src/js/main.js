const API_URL= "https://api.potterdb.com/v1/characters?page[size]=100";
// selecteren van DOM element
const charactersContainer= document.querySelector("#characters");

// maken van een card

const createCard=(characters) =>{
  const attributes = character.attributes;
  const card=document.createElement("article");
  card.classList.add("card");
  //html toevoegen via template literal
   card.innerHTML = ` 
    <img class="card-image" src="${image ? image : ''}" alt="${name}" />
    <h2 class="card-name">${name}</h2>
    <p class="card-info"><strong>House:</strong> ${house ? house : "Unknown"}</p>
    <p class="card-info"><strong>Species:</strong> ${species ? species : "Unknown"}</p>
    <p class="card-info"><strong>Blood:</strong> ${blood_status ? blood_status : "Unknown"}</p>
    <p class="card-info"><strong>Gender:</strong> ${gender ? gender : "Unknown"}</p>
    <p class="card-info"><strong>Patronus:</strong> ${patronus ? patronus : "Unknown"}</p>
  `;
  return card;

}

// renderen van alle Cards

const renderCharacters= (characters) => {
  charactersContainer.innerHTML=""; // verwijderd de loading bericht


  characters.array.forEach((character) => {
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
    console.log("Full response:",json);
    console.log("Characters array:", json.data.length);
  }catch(error){
    console.log("Something went wrong", error.message);
  }


};
getCharacters()// roept de functie op

