// Global "function" that represents the current user
function User(accType, firstName, lastName, phoneNumber) {
    this.accType = accType;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pNum = phoneNumber;
}

function HouseMin(houseId, city, country, rating, numRatings, min, picture) {
    this.houseId = houseId;
    this.city = city;
    this.country = country;
    this.rating = rating;
    this.numRatings = numRatings;
    this.minCost = min;
    this.picture = picture;
}

function House(houseId, lat, lng, addr, beds, baths, acc, liv, sm, pets, ev, area, desc, days, instr, rat, numRat, dF, dT, cost, costpp) {
    this.houseId = houseId;
    this.lat = lat;
    this.lng = lng;
    this.address = addr;
    this.numBeds = beds;
    this.numBaths = baths;
    this.accommodates = acc;
    this.hasLivingRoom = liv;
    this.smokingAllowed = sm;
    this.petsAllowed = pets;
    this.eventsAllowed = ev;
    this.area = area;
    this.description = desc;
    this.minDays = days;
    this.instructions = instr;
    this.rating = rat;
    this.numRatings = numRat;
    this.dateFrom = dF;
    this.dateTo = dT;
    this.minCost = cost;
    this.costPerPerson = costpp;
}


function HouseFull(houseId, lat, lng, addr, beds, baths, acc, liv, sm, pets, ev, area, desc, days, instr, rat, numRat, dF, dT, cost, costpp, pictures) {
    this.houseId = houseId;
    this.lat = lat;
    this.lng = lng;
    this.address = addr;
    this.numBeds = beds;
    this.numBaths = baths;
    this.accommodates = acc;
    this.hasLivingRoom = liv;
    this.smokingAllowed = sm;
    this.petsAllowed = pets;
    this.eventsAllowed = ev;
    this.area = area;
    this.description = desc;
    this.minDays = days;
    this.instructions = instr;
    this.rating = rat;
    this.numRatings = numRat;
    this.dateFrom = dF;
    this.dateTo = dT;
    this.minCost = cost;
    this.costPerPerson = costpp;
    this.pictures = pictures;
}