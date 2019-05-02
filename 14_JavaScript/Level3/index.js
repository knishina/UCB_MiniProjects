var $tbody = document.querySelector("tbody");
var dateTime = document.querySelector("#dtime");
var cityInput = document.querySelector("#cityInput");
var stateInput = document.querySelector("#stateInput");
var countryInput = document.querySelector("#countryInput");
var shapeInput = document.querySelector("#shapeInput");
var pageTag = document.querySelector("#pageTag");
var recordTag = document.querySelector("#recordTag");

var searchBtn = document.querySelector("#search");
var resetBtn = document.querySelector("#reset");

var aliens = dataSet;


var queryDate = [];
var queryCity = [];
var queryState = [];
var queryCountry = [];
var queryShape = [];

searchBtn.addEventListener("click", handleSearch);
function handleSearch() {
    if (dateTime.value != "") {
        var myString = dateTime.value.trim();
        if (myString.slice(3, 4) == "0" && myString.slice(0, 1) == "0") {
            var j = myString.slice(3,4);

            var t = 0;
            var newString = myString.replace(/0/g, function(match){
                t++;
            return (t === 2)? "": match;
            })
        } else if (myString.slice(3, 4) =="0") {
            var newString = myString.replace(myString.slice(3, 4), "");
        } else {
            var newString = myString;
        };

        if (newString.slice(0, 1) == "0") {
            var finString = newString.replace(newString.slice(0, 1), "");
        } else {
            var finString = newString;
        };

        var aliens1 = dataSet.filter(function(alienListing) {
            var jDateTime = alienListing.datetime.toString();
            return finString === jDateTime;
        });
        queryDate = aliens1;
    } else{
        queryDate = aliens;
    };

    if (cityInput.value != "") {
        var citySearch = cityInput.value.toLowerCase();
        for (var i=0; i<queryDate.length; i++) {
            if (queryDate[i].city === citySearch) {
                queryCity.push(queryDate[i]);
            }
        };
    } else {
        queryCity = queryDate;
    };

    if (stateInput.value != "") {
        var stateSearch = stateInput.value.toLowerCase();
        for (var i=0; i<queryCity.length; i++) {
            if (queryCity[i].state === stateSearch) {
                queryState.push(queryCity[i]);
            }
        };
    } else {
        queryState = queryCity;
    };

    if (countryInput.value != "") {
        var countrySearch = countryInput.value.toLowerCase();
        for (var i=0; i<queryState.length; i++) {
            if (queryState[i].country === countrySearch) {
                queryCountry.push(queryState[i]);
            }
        };
    } else {
        queryCountry = queryState;
    };

    if (shapeInput.value != "") {
        var shapeSearch = shapeInput.value.toLowerCase();
        for (var i=0; i<queryCountry.length; i++) {
            if (queryCountry[i].shape === shapeSearch) {
                queryShape.push(queryCountry[i]);
            }
        };
    } else {
        queryShape = queryCountry;
    }
list = queryShape;    
load(list);
currentPage = 1;
queryDate = [];
queryCity = [];
queryState = [];
queryCountry = [];
queryShape = [];
numberOfPages = 0;
};

resetBtn.addEventListener("click", resetTable);
function resetTable() {
    queryDate = [];
    queryCity = [];
    queryState = [];
    queryCountry = [];
    queryShape = [];
    list = alienSubset;
    load(list);
    currentPage = 1;
    numberOfPages = 0;
};

//
//
var alienSubset = [];
for (var v=0; v<aliens.length; v++) {
    alienSubset.push({
        datetime: aliens[v].datetime,
        city: aliens[v].city,
        state: aliens[v].state,
        country: aliens[v].country,
        shape: aliens[v].shape,
        comments: aliens[v].comments
    });
}

var list = alienSubset;
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 50;
var numberOfPages = 0;

function makeList() {
    numberOfPages = getNumberOfPages();
}
    
function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;

    pageList = list.slice(begin, end);
    var newBegin = begin + 1;
    d3.select("p").attr("id", "pageTag").text("Page " + currentPage + " of " + numberOfPages);
    d3.select("#recordTag").text("Record " + newBegin + " of " + end);
    drawList();
    check();
}

function drawList() {
    $tbody.innerHTML = "";
    for (var i=0; i<pageList.length; i++) {
        var alienListing = pageList[i];
        var fields = ["datetime", "city", "state", "country", "shape", "comments"];
        var $row = $tbody.insertRow(i);
        
        for (var j=0; j<fields.length; j++) {
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = alienListing[field];
        }
    }
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function load() {
    makeList();
    loadList();
}
    
load(list);


