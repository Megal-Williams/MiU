// Project 1 Javascript
// MIU 1303
// Megal Williams

// Wait until the DOM is ready.
window.addEventListener("DOMContentLoaded", function(){

	//getElementByID function
	function $(x){
	var theElement = document.getElementById(x)
	return theElement;
	};

	//Create select field element and populate with platforms
	function getPlatforms(){
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "platforms");
		for (var i=0, j=gamePlatforms.length; i<j; i++){
			var makeOption = document.createElement("option");
			var optText = gamePlatforms[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}

	//Find value of a checkbox
	function getFavValue(){
		if($('fav').checked){
			favValue = $('fav').value;
		} else {
			favValue = "No"
		}
		return favValue;
	}

	//Show data on a separate page
	function toggleControls(n){
		switch(n){
			case "on":
				$('addGameForm').style.display = "none";
				$('clearData').style.display = "inline";
				$('displayData').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('addGameForm').style.display = "block";
				$('clearData').style.display = "inline";
				$('displayData').style.display = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	}

	//Function to store data in local storage
	function storeData(key){
		//If there is no key, this means this is a brand new item and we need a new key.
		if(!key) {
			var dataId = Math.floor(Math.random()*100000001)
		} else {
			//Set the id to the existing key we're editing so that it will save over the data.
			//The key is the same key that's been passed along from the editSubmit event handler
			//to the validate function, and then passed here, into th storeData function.
			dataId = key;
		}

		//Gather up all our form field values and store in an object
		//Object properties contain array with the form label and the input values
		var item = {};
			item.platforms = ["Game Platform:", $('platforms').value ];
			item.game = ["Game Title:", $("game").value];
			item.date = ["Date Purchased:", $("date").value];
			item.fav = ["Favorite:", getFavValue()];
			item.score = ["Score:", $("score").value];
			item.comments = ["Comments:", $("comments").value];
		//Save data to local storage: Use stringify to convert our object to a string
		localStorage.setItem(dataId, JSON.stringify(item));
		alert("Game Saved!");
	}

	//Function to let us see the data store in local storage
	function showData () {
		toggleControls("on");
		if(localStorage.length === 0) {
			alert("There are no games in your library so the default games have been added.");
			autoFillGames();
		}
		//Write data from local storage to the browser
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
		for(var i=0, len=localStorage.length; i<len;i++) {
			var makeLi = document.createElement('ol');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from local storage value back to an object
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			getImage(obj.platforms[1], makeSubList);
			for(var n in obj) {
				var makeSubli = document.createElement('li');
				makeSubList.appendChild(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); //Create our edit and delete buttons/link for each item in local storage.
		}
	}

	//Get the image for the right category
	function getImage(imgName, makeSubList){
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "images/"+ imgName +".png");
		imageLi.appendChild(newImg);
	}

	//Auto populate local storage
	function autoFillGames(){
		//The actual JSON object data required for this to work is coming from our json.js file which is loaded from our HTML page.
		//Store the JSON object into local storage.
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}

	//Make Item Links - create the edit and delete links for each stored item when displayed.
	function makeItemLinks (key, linksLi) {
		//add edit single item link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;	
		var editText = "Edit Game";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		//add a line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);

		//add delete single item link
		var deleteLink = document.createElement("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Game";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}

	function editItem(){
		//Grab the data from our item from Local Storage.
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//Show the form
		toggleControls("off");

		//Populate the form fields with the current localStorage values.
		$('platforms').value = item.platforms[1];
		$('game').value = item.game[1];
		$('date').value = item.date[1];

		if(item.fav[1] == "Yes"){
			$('fav').setAttribute("checked", "checked");
		}

		$('score').value = item.score[1];
		$('comments').value = item.comments[1];	

		//Remove the initial listener from the input "save game" button.
		$('saveData').removeEventListener("click", storeData);
		//Change submit button value to edit button.
		$('saveData').src = "images/editgame.png";
		var editSubmit = $('saveData');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;	
	}

	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this game?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Game was deleted.");
			window.location.reload();
		} else {
			alert("Game was not deleted.");
		}
	}

	//Function to let us erase all data in local storage
	function deleteData(){
		if(localStorage.length === 0){
			alert("There is no data to clear.")
		} else {
			localStorage.clear();
			alert("All data has been deleted.");
			window.location.reload();
			return false;
		}
	}

	function validate(e){
		//Define the elements we want to check.
		var getPlats = $('platforms');
		var getTitle = $('game');

		//Reset Error Messages
		errMsg.innerHTML = "";
		getPlats.style.border = "";
		getTitle.style.border = "";


		//Get Error Messages
		var messageArray = [];

		//Platform validation
		if(getPlats.value === "--Choose a Platform--") {
			var platsError = "Please choose a platform";
			getPlats.style.border = "1px solid red";
			messageArray.push(platsError);
		}

		//Game Title validation
		if(getTitle.value === "") {
			var titleError = "Please enter a game title."
			getTitle.style.border = "1px solid red"
			messageArray.push(titleError);
		}

		//If there were errors, display them on the screen.
		if(messageArray.length >= 1){
			for (var i=0, j = messageArray.length; i <j; i++) {
				var txt = document.createElement('li');
				txt.innerHTML = messageArray[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		} else {
			//If all is okay, store data. Send the key value (which came from the editData function).
			//Remember this key value was passed through the editSubmit event listener as a property.
			storeData(this.key);
		}
	}


	//Variable defaults
	var gamePlatforms = ["--Choose a Platform--", "Xbox 360", "PS3", "Wii", "PC", "Handheld"];
		errMsg = $('errors');

	getPlatforms();

	//Set link and submit click events
	var displayData = $("displayData");
	displayData.addEventListener("click", showData);
	var clearData = $("clearData");
	clearData.addEventListener("click", deleteData);
	var saveData = $("saveData");
	saveData.addEventListener("click", validate);




});