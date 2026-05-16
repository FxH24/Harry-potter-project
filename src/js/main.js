console.log("Hogwarts Character Explorer")
//dit is gewoon om te testen of het script laad

const API_URL= "https://api.potterdb.com/v1/characters?page[size]=100";

const getCharacters= async ()=> {
  try{ // zorgt ervoor da
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
getCharacters()

