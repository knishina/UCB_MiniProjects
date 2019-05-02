var $tbody = document.querySelector("tbody");
var dateTime = document.querySelector("#dtime");
var searchBtn = document.querySelector("#search");

var aliens = dataSet;

function renderTable() {
    $tbody.innerHTML = "";
    for (var i=0; i<aliens.length; i++) {
        var alienListing = aliens[i];
        var fields = ["datetime", "city", "state", "country", "shape", "comments"];
        var $row = $tbody.insertRow(i);
        
        for (var j=0; j<fields.length; j++) {
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = alienListing[field];
        
        }
    }
}

searchBtn.addEventListener("click", handleSearch);
function handleSearch() {
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

    aliens = dataSet.filter(function(alienListing) {
        var jDateTime = alienListing.datetime.toString();
        return finString === jDateTime;
    });
    renderTable();
}
renderTable();
