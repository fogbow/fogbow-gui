//TODO Remove, because this is the first implementantion.
(function() {
	var continueRefresh = true
	
	$(document).find("a").click(function() {
		console.log('clicked');
		continueRefresh = false;
	});
	
	var members = [];
	
	function updateMembers(memberLocalStorage) {
		var cont = 0;
		$('#usage').find('tr').each(function(indice) {
		    $(this).find('td').each(function(indice) {
		        if (indice == 0) {
		        	var text = $(this).text();
		        	var columnAndLine = "#members__row__" + text.replace(/\./g, '\\.') + " td:eq(2)"
		        	
		        	if (memberLocalStorage == null ) {
			        	$(columnAndLine).text("Loading");
						$(columnAndLine).css('color', 'black');		
		        	} else {
			        	$(columnAndLine).text("Error");
						$(columnAndLine).css('color', 'purple');		        		
		        	}
		        	
		        	members[cont] = text;    	
		        	cont++;
		        }
		    });
		});		
	}	
    
	var tokenToReplace = '#TokenReplace#';
	
    function updateLocalStorage(numberMember, newMemberData) {
    	var localStorageMembers = localStorage.getItem("membersForStorageUsage");
    	if (localStorageMembers == null || localStorageMembers == 'undefined') {
    		localStorageMembers = newMemberData;
    		localStorage.setItem("membersForStorageUsage", localStorageMembers);
    		return;
    	}
    	localStorageMembers = localStorageMembers + tokenToReplace + newMemberData;
    	localStorage.setItem("membersForStorageUsage", localStorageMembers);
    }
    
    function getMemberDataLocalStorage(numberMember) {
    	var localStorageMembers = localStorage.getItem("membersForStorageUsage");
    	if (localStorageMembers == null || localStorageMembers == 'undefined') {
    		return null;
    	}
    	
    	return localStorageMembers;
    }

    function populateMemberLine(member, jsonData) {
		try {			
			for (var key in jsonData) {
				if (jsonData.hasOwnProperty(key)) {										
			 		try {			 			
			 			if (key == 1) {
			 				$("#usage__row__" + member + " td:eq(" + key + ")").text(parseFloat(jsonData[key]).toFixed(2));			 				
			 			} else {
			 				$("#usage__row__" + member + " td:eq(" + key + ")").text(jsonData[key]);			 				
			 			}
			 		}
			 		catch(err) {
			 			$("#usage__row__" + member + " td:eq(" + key + ")").text(jsonData[key]);
			 		}										
			  	}
			}
			columnEl.css('color', 'blue');
		} catch(err) {}
    }
    
	function refreshLine(numberMember) {		
		var text = members[numberMember];
		console.log(members.length);
		console.log(numberMember);
	 	if ((text == null || text == 'undefined') || (members.length -1 == numberMember)) {
	 		return;
	 	}
		var cont = numberMember;		
		
    	$.ajax({
    	    url: window.location.href + text + '/usage',
    	    type: "GET",
    	    timeout:7000,    	    
    	    success: function(data) {   
    	    	console.log('success');    	    
    			text = text.replace(/\./g, '\\.');
    			columnEl = $("#usage__row__" + text + " td:eq(2)");
				if (data == 'error') {
					columnEl.text('Error');
					columnEl.css('color', 'red');
				} else {
	    	    	var jsonData = JSON.parse(data);
	    	    	var date = new Date();
	    	    	jsonData["2"] = date.toLocaleDateString("en-US") + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();					
					populateMemberLine(text, jsonData);
					console.log(JSON.stringify(jsonData));
					updateLocalStorage(cont, JSON.stringify(jsonData));
				}
				
				if (continueRefresh) {
					refreshLine(++cont);
				}
    	    },
    	    error: function() {
    			columnEl = $("#members__row__" + text + " td:eq(2)"); 
    			columnEl.text('Error');
    			columnEl.css('color', 'red');
    			
				if (continueRefresh) {
					refreshLine(++cont);
				}    			
    	    },
    	});				
	}
	
	$(document).ready(function() {
		var localStorageMembers = localStorage.getItem("membersForStorageUsage");
		updateMembers(localStorageMembers);
		if (localStorageMembers == null) {
			setTimeout(function(){ refreshLine(0); }, 0);			
		} else {			
			for (i = 0; i < members.length; i++) { 			    
				console.log(JSON.parse(String(localStorageMembers).split(tokenToReplace)[i]));
			    populateMemberLine(members[i].replace(/\./g, '\\.'), JSON.parse(String(localStorageMembers).split(tokenToReplace)[i])) 
			}
		}
	});	
	
	$("#button_populate").click(function() {
		$("#button_populate").prop("disabled", true);
		localStorage.clear();
		updateMembers();
		setTimeout(function(){ refreshLine(0); }, 0);
		$("#button_populate").prop("disabled", false);
	});
})();	