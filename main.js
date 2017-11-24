const YOUTUBE_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=";

function divHoverEffectIn() {
  let $this = $(this);
  let currentBgImg = $this.css("background-image");
  $this.css("background-image", "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))," + currentBgImg);
}

function divHoverEffectOut() {
  let $this = $(this);
  let currentBgImg = $this.css("background-image");
  let bgImg = currentBgImg.split(")), ")[1];
  $this.css("background-image", bgImg);
}

function processObject(element) {
  const videoId = element.id.videoId;
  const title = element.snippet.title;
  const thumbnailURL = element.snippet.thumbnails.medium.url;
  
  let div_main = $("<div>");
  let div_sub  = $("<div>");
  let div_txt  = $("<div>");
  let a        = $("<a>");
  
  div_main.addClass("col-3 results-box");
  
  div_sub.addClass("img");
  div_sub.css("background-image", `url(${thumbnailURL})`);
  div_sub.hover(divHoverEffectIn, divHoverEffectOut);
  
  div_txt.addClass("text");
  div_txt.text(title);
  
  a.addClass("background");
  a.attr("href", YOUTUBE_VIDEO_URL + videoId);
  
  div_sub.append(div_txt);
  a.append(div_sub);
  div_main.append(a);
  return div_main;
}

function renderAPIResultsToDOM(responseJSON, resultsObj) {
  const videoItems = responseJSON.items;
  
  resultsObj.prevPageToken = responseJSON.prevPageToken;
  resultsObj.nextPageToken = responseJSON.nextPageToken;
  
  let processedItems = videoItems.map(elem => processObject(elem));
  
  // Display nav element if there are pages to navigate
  if (resultsObj.prevPageToken !== undefined) {
    $("#js-nav-left").removeClass("invisible");
  } else {
    $("#js-nav-left").addClass("invisible");
  }
  
  if (resultsObj.nextPageToken !== undefined) {
    $("#js-nav-right").removeClass("invisible");
  } else {
    $("#js-nav-right").addClass("invisible");
  }
  
  // Clear old results
  $(".js-results").empty();
  
  // Render results to DOM
  let section = $(".js-results");
  processedItems.forEach(elem => section.append(elem));
}

function queryAPI(resultsObj, callback, prevPage = null, nextPage = null) {
  const query = {
    q:          `${resultsObj.searchPhrase}`,
    part:       "snippet",
    maxResults: 8,
    key:        "AIzaSyDM_G1dTHAP1MQIp6jA9M8ehwpKRr9Oan4"
  };
  
  if (prevPage !== null) {
    query.pageToken = prevPage;
  }
  
  if (nextPage !== null) {
    query.pageToken = nextPage;
  }
  
  $.getJSON(YOUTUBE_ENDPOINT, query, callback);
}

function getYouTubeResults(event, resultsObj) {
  event.preventDefault();
  
  resultsObj.searchPhrase = $(".js-input").val();
  queryAPI(resultsObj, function(response) { renderAPIResultsToDOM(response, resultsObj); } );
}

function getPreviousResultsPage(resultsObj) {
  queryAPI(resultsObj,
           function(response) { renderAPIResultsToDOM(response, resultsObj); },
           resultsObj.prevPageToken,
           null
          );
}

function getNextResultsPage(resultsObj) {
    queryAPI(resultsObj,
             function(response) { renderAPIResultsToDOM(response, resultsObj); },
             null,
             resultsObj.nextPageToken
            );
}

function addEventListeners(resultsObj) {
  $("#js-form") .submit( function(ev) { getYouTubeResults(ev, resultsObj);  } );
  $("#js-left") .click(  function()   { getPreviousResultsPage(resultsObj); } );
  $("#js-right").click(  function()   { getNextResultsPage(resultsObj);     } );
}

function buildApp() {
  const results = {
    searchPhrase : null,
    nextPageToken: null,
    prevPageToken: null
  };
  
  addEventListeners(results);
}

$(buildApp);