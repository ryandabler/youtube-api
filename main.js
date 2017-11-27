const YOUTUBE_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=";

function divHoverEffectIn(event) {
  let divImg  = $(event.currentTarget).find("div.img");
  let $divImg = $(divImg[0]);
  
  let currentBgImg = $divImg.css("background-image");
  $divImg.css("background-image", "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))," + currentBgImg);
}

function divHoverEffectOut(event) {
  let divImg  = $(event.currentTarget).find("div.img");
  let $divImg = $(divImg[0]);
  
  let currentBgImg = $divImg.css("background-image");
  let bgImg = currentBgImg.split(")), ")[1];
  $divImg.css("background-image", bgImg);
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
  
  div_txt.addClass("text");
  div_txt.text(title);
  
  a.addClass("background");
  a.attr("href", YOUTUBE_VIDEO_URL + videoId);
  a.hover(divHoverEffectIn, divHoverEffectOut);
  a.focusin(divHoverEffectIn);
  a.focusout(divHoverEffectOut);
  
  div_sub.append(div_txt);
  a.append(div_sub);
  div_main.append(a);
  return div_main;
}

function renderAPIResultsToDOM(responseJSON, resultsObj) {
  const videoItems = responseJSON.items;
  let processedItems = videoItems.map(elem => processObject(elem));
  
  // Display nav element if there are pages to navigate
  if (responseJSON.prevPageToken !== undefined) {
    $("#js-nav-left").removeClass("invisible");
    $("#js-left").attr("data-page-token", responseJSON.prevPageToken);
  } else {
    $("#js-nav-left").addClass("invisible");
  }
  
  if (responseJSON.nextPageToken !== undefined) {
    $("#js-nav-right").removeClass("invisible");
    $("#js-right").attr("data-page-token", responseJSON.nextPageToken);
  } else {
    $("#js-nav-right").addClass("invisible");
  }
  
  // Clear old results
  $(".js-results").empty();
  
  // Render results to DOM
  let section = $(".js-results");
  processedItems.forEach(elem => section.append(elem));
}

function queryAPI(resultsObj, callback, pageToken = null) {
  const query = {
    q:          resultsObj.searchPhrase,
    part:       "snippet",
    maxResults: 8,
    key:        "AIzaSyDM_G1dTHAP1MQIp6jA9M8ehwpKRr9Oan4"
  };
  
  if (pageToken !== null) {
    query.pageToken = pageToken;
  }
  
  $.getJSON(YOUTUBE_ENDPOINT, query, callback);
}

function getYouTubeResults(event, resultsObj) {
  event.preventDefault();
  
  resultsObj.searchPhrase = $(".js-input").val();
  queryAPI(resultsObj, function(response) { renderAPIResultsToDOM(response, resultsObj); } );
}

function scrollResults(event, resultsObj) {
  let $this = $(event.target);
  let token = $this.attr("data-page-token");
  
  queryAPI(resultsObj,
           function(response) { renderAPIResultsToDOM(response, resultsObj); },
           token
          );
}

function addEventListeners(resultsObj) {
  $("#js-form") .submit( function(ev) { getYouTubeResults(ev, resultsObj); } );
  $("#js-left") .click(  function(ev) { scrollResults(ev, resultsObj);     } );
  $("#js-right").click(  function(ev) { scrollResults(ev, resultsObj);     } );
}

function buildApp() {
  const results = {
    searchPhrase: null
  };
  
  addEventListeners(results);
}

$(buildApp);