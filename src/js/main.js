const API_URL = "https://hp-api.onrender.com/api/characters"
// selecteren van DOM element
const charactersContainer= document.querySelector("#characters");


let allCharacters=[];
let favorites=[];
let showFavoritesOnly = false;


const loadFavorites =() =>{
  const saved=localStorage.getItem("favorites");
  favorites =saved ? JSON.parse(saved): [];
};

const saveFavorites = ()=>{
  localStorage.setItem("favorites", JSON.stringify(favorites));
};




const searchInput = document.querySelector("#searchInput");
const houseFilter= document.querySelector("#houseFilter");
const sortFilter= document.querySelector("#sortFilter");
const favoritesToggle = document.querySelector("#favoritesToggle");
const wizardForm = document.querySelector("#wizardForm");
const wizardName = document.querySelector("#wizardName");
const wizardHouse = document.querySelector("#wizardHouse");
const wizardPatronus = document.querySelector("#wizardPatronus");
const formError = document.querySelector("#formError");





const applyFilters =() => {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedHouse = houseFilter.value;
  const selectedSort=sortFilter.value;
  
  const filtered = allCharacters.filter((character) => {
    const name =character.name.toLowerCase();
    const matchesSearch = name.includes(searchTerm)
    const matchesHouse = selectedHouse =="all" ? true:character.house == selectedHouse;
    const matchesFavorites = showFavoritesOnly ? favorites.includes(character.name) : true;
    return matchesSearch && matchesHouse && matchesFavorites;
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
favoritesToggle.addEventListener("click",() => {
  showFavoritesOnly=!showFavoritesOnly;
  favoritesToggle.textContent= showFavoritesOnly ? "Show all":"Show favorites only";
  favoritesToggle.classList.toggle ("active", showFavoritesOnly);
  applyFilters();
});

wizardForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const name = wizardName.value.trim();
  const house = wizardHouse.value;
  const patronus = wizardPatronus.value.trim();

  
  if (name == "") {
    formError.textContent = "Please enter a wizard name.";
    return;
  }

  if (name.length < 2) {
    formError.textContent = "Name must be at least 2 characters.";
    return;
  }

  if (house == "") {
    formError.textContent = "Please choose a house.";
    return;
  }

  if (patronus == "") {
    formError.textContent = "Please enter a patronus.";
    return;
  }

  const newWizard = {
    name: name,
    house: house,
    patronus: patronus,
    species: "human",
    ancestry: "Unknown",
    gender: "Unknown",
    image: "",
    dateOfBirth: "Unknown",
    eyeColour: "Unknown",
    hairColour: "Unknown",
    actor: "You!",
  };

  
  allCharacters.push(newWizard);
  formError.textContent = ""; 
  wizardForm.reset(); 
  applyFilters(); 
});



// maken van een card

const createCard=(character) =>{
  
  const card=document.createElement("article");
  card.classList.add("card");
  //html toevoegen via template literal
   card.innerHTML = `
    <img class="card-image lazy" data-src="${character.image ? character.image : ''}" alt="${character.name}" />
    <h2 class="card-name">${character.name}</h2>

    <button class="favorite-button"> Favorite </button>

    <p class="card-info"><strong>House:</strong> ${character.house ? character.house : "Unknown"}</p>
    <p class="card-info"><strong>Species:</strong> ${character.species ? character.species : "Unknown"}</p>
    <p class="card-info"><strong>Ancestry:</strong> ${character.ancestry ? character.ancestry : "Unknown"}</p>
    <p class="card-info"><strong>Gender:</strong> ${character.gender ? character.gender : "Unknown"}</p>
    <p class="card-info"><strong>Patronus:</strong> ${character.patronus ? character.patronus : "Unknown"}</p>
   
      
    <div class="cardDetails hide-me">
    <p class="card-info"><strong>Date of Birth:</strong> ${character.dateOfBirth ? character.dateOfBirth : "Unknown"}</p>
    <p class="card-info"><strong>Eye Colour:</strong> ${character.eyeColour ? character.eyeColour : "Unknown"}</p>
    <p class="card-info"><strong>Hair Colour:</strong> ${character.hairColour ? character.hairColour : "Unknown"}</p>
    <p class="card-info"><strong>Actor:</strong> ${character.actor ? character.actor : "Unknown"}</p>    
    </div> 
    <button class="details-button"> Show details </button>
    `;
  const detailsButton=card.querySelector(".details-button");
  const details= card.querySelector(".cardDetails")
  
  detailsButton.addEventListener("click",()=> {
    details.classList.toggle("hide-me");
    const isHidden= details.classList.contains("hide-me");
    detailsButton.textContent= isHidden? "show details" :"Hide details";
  })
  const favoriteButton= card.querySelector(".favorite-button");

  favoriteButton.addEventListener("click", ()=>{
    const isFavorite= favorites.includes(character.name);

    if (isFavorite){
      favorites= favorites.filter((name) => name != character.name);
    }else {
      favorites.push (character.name);
    }

    saveFavorites();
    updateFavoriteButton(favoriteButton, character.name);
  });

  updateFavoriteButton(favoriteButton, character.name);
  return card;


}
const updateFavoriteButton= (button, characterName) =>{
  const isFavorite = favorites.includes(characterName);
  button.textContent = isFavorite ? "★" :"☆";
  button.classList.toggle("is-favorite", isFavorite);
}
const observeImages=()=>{
  const lazyImages= document.querySelectorAll("img.lazy");

  const imageObserver= new IntersectionObserver((entries,observer) => {
    entries.forEach ((entry)=>{
      if(entry.isIntersecting){
        const img =entry.target;
        img.src=img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });
  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });
};

// renderen van alle Cards

const renderCharacters= (characters) => {
  charactersContainer.innerHTML=""; // verwijderd de loading bericht

  characters.forEach((character) => {
    const card=createCard(character);
    charactersContainer.appendChild(card);
  });
  observeImages();
};


//API fetch data--> zorgen dat data opgehaald kan worden//

const getCharacters= async ()=> {                  //maken van functie met als naam getCharacters
  try{
    const response = await fetch (API_URL);
    
    if(! response.ok){ 
      throw new Error(`HTTP error:${response.status}`);
    }
    const json= await response.json();
    allCharacters=json// bewaar alle characters globaal
    loadFavorites(); // favorieten ophalen
    renderCharacters(json);
  }catch(error){
    console.error("Something went wrong", error.message);
    charactersContainer.innerHTML= `<p class="loading"> Failed to load characters.</p>`;
  }


};
getCharacters(); // roept de functie op

