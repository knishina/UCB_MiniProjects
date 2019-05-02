var $tbody = document.querySelector("tbody");
var dateTime = document.querySelector("#dtime");
var cityInput = document.querySelector("#cityInput");
var stateInput = document.querySelector("#stateInput");
var countryInput = document.querySelector("#countryInput");
var shapeInput = document.querySelector("#shapeInput");

var searchBtn = document.querySelector("#search");
var resetBtn = document.querySelector("#reset");

var aliens = dataSet;

function renderTable(foo) {
    $tbody.innerHTML = "";
    for (var i=0; i<foo.length; i++) {
        var alienListing = foo[i];
        var fields = ["datetime", "city", "state", "country", "shape", "comments"];
        var $row = $tbody.insertRow(i);
        
        for (var j=0; j<fields.length; j++) {
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = alienListing[field];
        
        }
    }
}
renderTable(aliens);

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
renderTable(queryShape);
queryDate = [];
queryCity = [];
queryState = [];
queryCountry = [];
queryShape = [];
};

resetBtn.addEventListener("click", resetTable);
function resetTable() {
    queryDate = [];
    queryCity = [];
    queryState = [];
    queryCountry = [];
    queryShape = [];
    renderTable(aliens);
}