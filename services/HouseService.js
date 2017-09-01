var app = angular.module("airbnbApp");

app.service("HouseService", [
    function() {
        this.housePages = [];
        this.timeStamp = null;
        this.pages = [];
        this.createHouses = function(houses, timestamp, page) {
            if (this.pages.includes(page)) return;
            this.pages.push(page);
            this.housePages.push(houses);
            this.timeStamp = timestamp;
            if (this.pages.length > 3) {
                this.pages.splice(0, 1);
                this.housePages.splice(0, 1);
            }
        };
        
        this.getPage = function(page) {
            return this.housePages[page];
        };
        
        this.appendHouses = function(houses) {
            var houseLength = houses.length;
            var lastPageLength = this.housePages[this.housePages.length - 1].length;
            if (houseLength + PAGE_SIZE <= lastPageLength) {
                for (var i = 0; i < houseLength; i++) {
                    this.housePages[this.housePages.length - 1].push(houses[i]);
                }
            } else {
                for (var i = 0; i < PAGE_SIZE - lastPageLength; i++) {
                    this.housePages[this.housePages.length - 1].push(houses[i]);
                }
                
                this.housePages.push([{}]);
                for (i = PAGE_SIZE - lastPageLength + 1; i < houses.length; i++) {
                    this.housePages[this.housePages.length - 1].push(houses[i]);
                }
            }
        }
    }
]);