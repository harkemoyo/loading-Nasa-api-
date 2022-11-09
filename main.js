const resultNav = document.getElementById('resultNav');
const favoriteNav = document.getElementById('favoriteNav');
const imageContainer = document.querySelector('.img-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');




//on api keys
const count = 10;
const apiKey  = 'DEMO_KEY';
const apiUrl =`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;


let resultsArray = [];
let favorites = {};


function createDOMNodes (page) {
    const  currentArray = page === 'result' ? resultsArray : Object.values(favorites);
    
    currentArray.forEach((result) => {
        //card container
        const card = document.createElement('div');
        card.classList.add('card');
        //link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full image';
        link.target = '_blank';
        //image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt ='Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body'); 
        //card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if ( page === 'result'){
        saveText.textContent = 'Add To Favorite';

        saveText.setAttribute('onclick', `saveFavorite ('${result.url}')`);
        }else{
        saveText.textContent = 'Remove Favorite';
        saveText.setAttribute('onclick', `removeFavorite ('${result.url}')`);
        }
        //card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //copyright
        const  copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        //append
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imageContainer.appendChild(card);
    });
}
// save fnc
function saveFavorite (itemUrl) {
    //loop through array
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            
            //save confirmation
            saveConfirmed.hidden = false;
            setTimeout(() =>{
                saveConfirmed.hidden = true;
            }, 2000);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
       
    });
}
// remove from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        //from localstorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    
        updateDom('favorites');

    }
}

//loader
function showContent (page) {
    window.scrollTo({top:0, behavior:'instant'});
    if (page === 'result'){
        resultNav.classList.remove('hidden');
        
        favoriteNav.classList.add('hidden');
        
    }else {
        resultNav.classList.add('hidden');
        favoriteNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function updateDom (page){
    // get favorite from localstorage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
   
    
    imageContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

//fetch request
async function getNasaPictures(){
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
       
        updateDom('result');
    } catch (error) {
        //catch error
        
    }
} 


//on load 
getNasaPictures();