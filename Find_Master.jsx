/*////////////////////////////////////////////////////////////////
	
	Find_Master.jsx
	Version 1.2
	InDesign CS5 javascript
	
	Bruno Herfst 2011

	Go to the next page the selected master is applied to.
	
	Save preferences functionality powered by Scott Zanelli (Thank you!)
	
	Keyboard shortcut preference ctrl-M
		
////////////////////////////////////////////////////////////////*/

try{
	var the_document = app.documents.item(0);
	// Create a list of master pages
	var list_of_master_pages = the_document.masterSpreads.everyItem().name;

	// Set default prefs
	var fmaster = 2;
	
	// Look for and read prefs file
	prefsFile = File((Folder(app.activeScript)).parent + "/Find_Master_Memory.txt");
	if(!prefsFile.exists) {
		savePrefs();
	} else {
		readPrefs();
	}
	
	// Make the dialog box for selecting the paragraph styles
	var the_dialog = app.dialogs.add({name:"Find master"});
	with(the_dialog.dialogColumns.add()){
		with(dialogRows.add()){
			try{
				var find_master = dropdowns.add({stringList:list_of_master_pages, selectedIndex:fmaster});
			}catch(e){
				//new doc
				fmaster = 0;
				var find_master = dropdowns.add({stringList:list_of_master_pages, selectedIndex:fmaster});
			}
		}
	}
	
	var myResult = the_dialog.show();
	
	if(myResult == true){
		// Define variables
		fmaster = find_master.selectedIndex;
		savePrefs();
		var find_master = the_document.masterSpreads.item(find_master.selectedIndex);
		var myCounter = app.activeWindow.activePage.documentOffset;
		// Find masters
		findMaster(find_master, myCounter, the_document.documentPreferences.facingPages);	
	} else {
		//cancel
		exit();
	}

}catch(e){
	alert("OOPS!\rSomething went wrong");
	exit();
}

// ------------------------------------------------------ FUNCTIONS ------------------------------------------------------

function findMaster(find_master, C, spreads){
	for(var myCounter = C+1; myCounter < the_document.pages.length-1; myCounter++){
		myPage = the_document.pages.item(myCounter);
		//if document is in spreads the active window viewpage is always left!
		if(spreads == true){
			myPage2 = the_document.pages.item(myCounter-1);
		} else {
			myPage2 = the_document.pages.item(myCounter);
		}
		if (myPage.appliedMaster == find_master){
			if(!(app.activeWindow.activePage == myPage || app.activeWindow.activePage == myPage2)){
				//go to and stop
				app.activeWindow.activePage = myPage;
				exit();
			}
		}
	}
	if(C == 0){
		var message = "Done!\rNothing (else) found";
	} else {
		alert("Did not find "+find_master.name+"\rWill search from start of document")
		//search from top
		findMaster(find_master, 0);
		exit();
	}
}

// function to read prefs from a file
function readPrefs() {
	try {
		prefsFile.open("r");
		fmaster = Number(prefsFile.readln());
		prefsFile.close();
	} catch(e) {
		throwError("Could not read preferences: " + e, false, 2, prefsFile);
	}
}

// function to save prefs to a file
function savePrefs() {
	try	{
		var newPrefs = fmaster;
		prefsFile.open("w");
		prefsFile.write(newPrefs);
		prefsFile.close();
	 }catch(e){
		throwError("Could not save preferences: " + e, false, 2, prefsFile);
	}
}