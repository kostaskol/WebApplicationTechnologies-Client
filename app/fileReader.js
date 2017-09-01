function readFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', "file://" + file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState == 4) {
            if (rawFile.status == 200 || rawFile.status == 0) {
                console.log("All Text: " + rawFile.responseText);
            }
        }
    };
    rawFile.send(null);
}