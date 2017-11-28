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

function renderAPIResultsToDOM(responseJSON, navigationBtn = null) {
  const videoItems   = responseJSON.items,
        totalResults = responseJSON.pageInfo.totalResults,
        resultsPerPg = responseJSON.pageInfo.resultsPerPage;
  let processedItems = videoItems.map(elem => processObject(elem)),
      currResultSet  = parseInt($(".js-results-amount").attr("data-curr-results"));
  
  if (navigationBtn === null || navigationBtn.attr("id") === "js-right") {
    nextResultSet  = currResultSet + 1,
    endResultSet   = currResultSet + resultsPerPg;
  } else {
    nextResultSet  = currResultSet - 2 * resultsPerPg + 1;
    endResultSet   = currResultSet - resultsPerPg;
  }
  
  // Show .results-container
  $(".js-results-container").prop("hidden", false);
  
  // Add results metadata to .results-amount
  $(".js-results-amount").attr("data-curr-results", endResultSet);
  $(".js-results-amount").text(`Results: ${nextResultSet}-${endResultSet} / ${totalResults}`);
  $(".js-results-amount").focus();
  
  // Display nav element if there are pages to navigate
  if (responseJSON.prevPageToken !== undefined) {
    $("#js-nav-left").removeClass("hidden");
    $("#js-left").attr("data-page-token", responseJSON.prevPageToken);
  } else {
    $("#js-nav-left").addClass("hidden");
  }
  
  if (responseJSON.nextPageToken !== undefined) {
    $("#js-nav-right").removeClass("hidden");
    $("#js-right").attr("data-page-token", responseJSON.nextPageToken);
  } else {
    $("#js-nav-right").addClass("hidden");
  }
  
  // Clear old results
  $(".js-results").empty();
  
  // Render results to DOM
  let section = $(".js-results");
  processedItems.forEach(elem => section.append(elem));
}

function queryAPI(callback, pageToken = null) {
  const query = {
    q:          $("#js-results").attr("data-search-phrase"),
    part:       "snippet",
    maxResults: 8,
    key:        "AIzaSyDM_G1dTHAP1MQIp6jA9M8ehwpKRr9Oan4"
  };
  
  if (pageToken !== null) {
    query.pageToken = pageToken;
  }
  
  $.getJSON(YOUTUBE_ENDPOINT, query, callback);
}

function getYouTubeResults(event) {
  event.preventDefault();
  
  let searchPhrase = $(".js-input").val();
  $("#js-results").attr("data-search-phrase", searchPhrase);
  queryAPI(function(response) { renderAPIResultsToDOM(response); });
}

function scrollResults(event) {
  let $this = $(event.target);
  let token = $this.attr("data-page-token");
  
  queryAPI(function(response) { renderAPIResultsToDOM(response, $this); },
           token
          );
}

function addEventListeners() {
  $("#js-form") .submit(getYouTubeResults);
  $("#js-left") .click( scrollResults);
  $("#js-right").click( scrollResults);
}

function buildApp() {
  addEventListeners();
}

$(buildApp);