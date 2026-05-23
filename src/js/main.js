const API_URL = "https://hp-api.onrender.com/api/characters"
// selecteren van DOM element
const charactersContainer= document.querySelector("#characters");

// bewaen van characters om te filteren
let allCharacters=[];

//selecteren van zoekbalk+ filter
const searchInput = document.querySelector("#searchInput");
const houseFilter= document.querySelector("#houseFilter");
const sortFilter= document.querySelector("#sortFilter");



const applyFilters =() => {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedHouse = houseFilter.value;
  const selectedSort=sortFilter.value;
  
  const filtered = allCharacters.filter((character) => {
    const name =character.name.toLowerCase();
    const matchesSearch = name.includes(searchTerm)
    const matchesHouse = selectedHouse =="all" ? true:character.house == selectedHouse;
    return matchesSearch && matchesHouse;
  });
  if (selectedSort=="a-z"){
    filtered.sort((a,b)=>a.name.localeCompare(b.name))
  }else if(selectedSort=="z-a"){
    filtered.sort((a,b) => b.name.localeCompare(a.name));
  }
  renderCharacters(filtered);
}

searchInput.addEventListener("input", applyFilters);
houseFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change",applyFilters);





// maken van een card

const createCard=(character) =>{
  const attributes = character.attributes;
  const card=document.createElement("article");
  card.classList.add("card");
  //html toevoegen via template literal
   card.innerHTML = ` 
    <img class="card-image" src="${character.image ? character.image : ''}" alt="${character.name}" />
    <h2 class="card-name">${character.name}</h2>
    <p class="card-info"><strong>House:</strong> ${character.house ? character.house : "Unknown"}</p>
    <p class="card-info"><strong>Species:</strong> ${character.species ? character.species : "Unknown"}</p>
    <p class="card-info"><strong>Ancestry:</strong> ${character.ancestry ? character.ancestry : "Unknown"}</p>
    <p class="card-info"><strong>Gender:</strong> ${character.gender ? character.gender : "Unknown"}</p>
    <p class="card-info"><strong>Patronus:</strong> ${character.patronus ? character.patronus : "Unknown"}</p>
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
    allCharacters=json // bewaar alle characters globaal
    renderCharacters(json);
  }catch(error){
    console.error("Something went wrong", error.message);
    charactersContainer.innerHTML= `<p class="loading"> Failed to load characters.</p>`;
  }


};
getCharacters(); // roept de functie op