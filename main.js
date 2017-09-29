//Wikipedia API URLs
let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
let userInput;
let counter = 0;
let titles = [];

function setup() {
    createCanvas(640, 480);
    background(0, 220, 102);

    //Take string from input box
    userInput = select('#userInput');
    userInput.changed(startSearch);
    function startSearch() {
        goWiki(userInput.value());
    }

}

//Access Wikipedia search API
function goWiki(term) {
    counter = counter + 1;
    //Check if Adolf Hitler
    if (term == 'Adolf Hitler') {
        console.log('Found Hitler')
        console.log('In', counter, 'Random Searches');
    } else {
        let url = searchUrl + term;
        loadJSON(url, gotSearch, 'jsonp');
    }
}

//Access Wikipedia content API
function gotSearch(data) {

    //Random title from search results
    let len = data[1].length;
    let index = floor(random(len));
    let title = data[1][index];

    //If no results found, start from beginning (still random)
    if (title === undefined) {
        restart();
    } else {
        //Print title and access content API
        //createDiv(title);
        titles.unshift(title);

        //console.log(titles[1]);
        drawTitle(titles[0]);

        title = title.replace(/\s+/g, '_');
        let url = contentUrl + title;
        loadJSON(url, gotContent, 'jsonp');

    }
}

//Find random search term
function gotContent(data) {

    //Require pageID
    let page = data.query.pages;
    let pageId = Object.keys(data.query.pages)[0];
    
    //Correct if error found
    if (pageId < 0 || page[pageId].revisions === undefined){ 
        restart();
    }
    let content = page[pageId].revisions[0]['*'];

    //Find a word >4 letters
    let wordRegex = /\b\w{4,7}\b/g;
    content.match(wordRegex);
    let word = random((content.match(wordRegex)));

    goWiki(word);
}

function drawTitle(word) {
    background(240, 90, 112);
    textAlign(CENTER);

    textSize(16);
    text("Current Word:", width / 2, 36);

    lengthFactor = 1/word.length;
    textSize(72*lengthFactor + 30);
    text(word, width / 2, height / 2 + 36);
}

function restart() {
    console.log('Restart!');
    goWiki(userInput.value());
}

function foundHitler(){
    image(img,0,0);
    text("THERE HE IS!", width / 2, height / 2 );
}