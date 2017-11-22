const YOUTUBE_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";

function processObject(element) {
  const videoId = element.id.videoId;
  const description = element.snippet.description;
  const thumbnailURL = element.snippet.thumbnails.default.url;
  
  let div = $("<div>");
  let img = $("<img>");
  img.attr("src", thumbnailURL);
  
  div.append(img);
  return div;
}

function renderAPIResultsToDOM(responseJSON) {
  console.log(responseJSON);
  const videoItems = responseJSON.items;
  let processedItems = videoItems.forEach(elem => processObject(elem));
  console.log(processedItems);
}

function queryAPI(searchPhrase, callback) {
  const query = {
    q: `${searchPhrase}`,
    part: "snippet",
    maxResults: 3,
    key: "AIzaSyDM_G1dTHAP1MQIp6jA9M8ehwpKRr9Oan4"
  };
  
  $.getJSON(YOUTUBE_ENDPOINT, query, callback);
}

function addEventListeners() {
  $("#js-form").submit(function(ev) {
    ev.preventDefault();
    
    let input = $(".js-input").val();
    queryAPI(input, renderAPIResultsToDOM);
  });
}

function buildApp() {
  addEventListeners();
}

$(buildApp);