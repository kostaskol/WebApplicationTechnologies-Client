# AirBnB (Clone) for Web Application Technology (UoA:DIT)
## Client Side

* ### Index
	* #### [Functionality](#func)
	* #### [Brief Explanation](#expl)
	* #### [Implementation](#impl)
	* #### [Third Party Libraries used](#tpl)

* ### <a name="func"></a>  Functionality
	* Each URL is split into a view and a controller (following the MVC pattern)

* ### <a name="expl"></a> Brief Explanation
	* #### Home Page:
		* Pages of 2 rows and 4 columns each (8 houses) showing a preview of all houses
			* Each preview consists of:
				* A thumbnail of the house's main photograph
				* The number of ratings
				* The per day cost
				* The city and country
					* _Note_: Due to importing data from the CSVs, some cities/countries are shown as '???', which I believe is due to the database's UTF-8 constraints
		* If the user is logged in and they have at least looked at some houses, then the client requests a list of 4 recommended houses (The server runs the NNCF algorithm to find these houses), which are then stored in the browser's session storage (preventing the algorithm from running each time a user visits their homepage)
		
	* #### House Search Page:
		* The provided options are the following:
			* Location Options:
				* City
				* Country
			* Number options:
				* Number of beds
				* Number of bathrooms
				* Number of persons the house accommodates
			* House Rule Options:
				* Has living room
				* Smoking is allowed
				* Events are allowed
				* Pets are allowed
			* Amenity Options:
				* WiFi
				* Airconditioning
				* Heating
				* Kitchen
				* TV
				* Parking
				* Elevator
			* Date Options:
				* Date from and to
				* Minimum amount of days
			* Cost Options:
				* Minimum cost per day
				* Maximum cost per day
				* Minimum cost per person
				* Maximum cost per person
			* Area Options:
				* Minimum area of the house
			
		* After the user makes their choices, they are redirected to the Search Results Screen whose controller is the one that makes the actual HTTP Request to the server and presents the results.
		
	* #### House Registration Page:
		* If the user is logged in, they have requested to be able to register houses and they have been approved by the administrator, they have the option - in the navigation bar - to register a new house
		* The information asked are the following:
			* Location:
				* The browser tries to acquire the user's current location. 
					* Upon success, a marker is placed at their current location.
					* Upon failure, a marker is placed at a random location.
				* In either case, the user can pan the provided map and choose the location of the house, or they can type the address of the house which is then passed through google's geolocation API so that the latitude and longitude of the house can be obtained.
			* Numbers:
				* Number of beds
				* Number of bathrooms
				* Number of persons the house accommodates
			* House Rules (checkboxes):
				* Smoking is allowed
				* Pets are allowed
				* Has living room
				* Events are allowed
			* Amenities:
				* WiFi
				* Airconditioning
				* Heating
				* Kitchen
				* TV
				* Parking
				* Elevator
			* House Information:
				* Area (in m^2)
				* A description of the house
				* Instructions to get to the house
			* Available Dates:
				* Date from - to
				* Minimum number of days
			* Cost:
				* Minimum Cost
				* Cost per person
				* Cost per day
			* Picture:
				* The main picture of the house (more can be added through house editing - Didn't have enough time to fix that).
				
	* #### House Presentation Page:
		* This page consists of the following parts:
			* A picture slider allows the user to look through the house's pictures (not thoroughly tested due to time restrictions)
			* The house owner's name (link to their profile from which the current user can message them)
			* A simple table presenting all of the house's information
			* The exact location of the house.
			* If the user is logged in:
				* There is a booking section that allows the user to choose the dates and the number of days of the reservation, shows them the overall cost and finally, book the house.
				* They can also comment on the house (didn't implement a first-booked requirement due to time constraints) if they haven't commented on it in the past
			* The comment section
				
		
			
	
* ### <a name="impl"></a> Implementation
	* Due to the size of the application, implementation details are in the form of comments within the code.
	
	
* ### <a name="tpl"></a> Third Party Libraries used:

	| Library | Usage | Extra Comments |
	|-----------|---------|------------------------|
	| [JQuery](https://jquery.com/)  | Dependency for various other libraries | |
	| [Bootstrap](http://getbootstrap.com/) | The basic CSS for forms | |
	| [Google Fonts](https://fonts.google.com/) | Applied to the banner text | Used fonts: [Droid Serif](https://fonts.google.com/?query=droid+serif), [Josefin Sans](https://fonts.google.com/?query=josefin+sans)|
	| [Angular JS](https://angularjs.org/) | The MVC implementation Framework | |
	| [Angular Route](https://www.npmjs.com/package/angular-route) | Used to route URLs to views | |
	| [Angular Animate](https://www.npmjs.com/package/angular-animate) | Used to animate picture switching on house presentation | |
	| [Angular cookies](https://www.npmjs.com/package/angular-cookies) | Used to easily access cookies | |
	| [Angular Filter](https://www.npmjs.com/package/angular-filter) | Used to split the house thumbnails in rows of 4 items | |
	| [Google Maps](https://developers.google.com/maps/documentation/javascript/) | Allows the user to visually choose the location of the house to be registered. Also shows the exact location to users browsing for houses | |
	| [Air Datepicker](http://t1m0n.name/air-datepicker/docs/) | Prettier datepicker that also allows for picking a range of dates | |
	| [Angular File Upload](https://github.com/danialfarid/ng-file-upload) | Used to upload pictures to the server | |
	| [Sweet Alert](https://limonte.github.io/sweetalert2/) | Prettier alerts | |
	| [Cookie Consent by Insites](https://cookieconsent.insites.com/) | Requests cookie consent from the user | |
