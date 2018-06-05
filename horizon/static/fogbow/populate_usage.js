(function() {
	Usage.prototype.updateMembers = function(memberLocalStorage) {
		var that = this;
		var cont = 0;
		$('#usage').find('tr').each(function(indice) {
		    $(this).find('td').each(function(indice) {
		        if (indice == 0) {
		        	var text = $(this).text();
		        	var columnAndLine = "#members__row__" + text.replace(/\./g, '\\.') + " td:eq(3)"
		        	
		        	if (memberLocalStorage == null ) {
			        	$(columnAndLine).text("Loading");
						$(columnAndLine).css('color', 'black');		
		        	} else {
			        	$(columnAndLine).text("Error");
						$(columnAndLine).css('color', 'purple');		        		
		        	}
		        	
		        	that.members[cont] = text;    	
		        	cont++;
		        }
		    });
		});		
	};
	
	Usage.prototype.updateLocalStorage = function(numberMember, newMemberData) {
		var localStorageMembers = localStorage.getItem(MEMBER_STORAGE_STR);
		if (localStorageMembers == null || localStorageMembers == 'undefined') {
			localStorageMembers = newMemberData;
			localStorage.setItem(MEMBER_STORAGE_STR, localStorageMembers);
			return;
		}
		localStorageMembers = localStorageMembers + this.tokenToReplace + newMemberData;
		localStorage.setItem(MEMBER_STORAGE_STR, localStorageMembers);
	};
	
	Usage.prototype.getMemberDataLocalStorage = function(numberMember) {
		var localStorageMembers = localStorage.getItem(MEMBER_STORAGE_STR);
		if (localStorageMembers == null || localStorageMembers == 'undefined') {
			return null;
		}
		
		return localStorageMembers;
	};
	
	Usage.prototype.populateMemberLine = function(member, jsonData) {
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
	};
	
	Usage.prototype.refreshLine = function(numberMember) {	
		var that = this; 
		var text = this.members[numberMember];
		console.log(this.members.length);
		console.log(numberMember);
	 	if ((text == null || text == 'undefined') || (that.members.length -1 == numberMember)) {
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
				columnEl = $("#usage__row__" + text + " td:eq(3)");
				if (data == 'error') {
					columnEl.text('Error');
					columnEl.css('color', 'red');
				} else {
	    	    	var jsonData = JSON.parse(data);
	    	    	var date = new Date();
	    	    	jsonData["3"] = date.toLocaleDateString("en-US") + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();					
	    	    	that.populateMemberLine(text, jsonData);
					console.log(JSON.stringify(jsonData));
					that.updateLocalStorage(cont, JSON.stringify(jsonData));
				}
				
				if (that.continueRefresh) {
					that.refreshLine(++cont);
				}
		    },
		    error: function() {
				columnEl = $("#members__row__" + text + " td:eq(3)"); 
				columnEl.text('Error');
				columnEl.css('color', 'red');
				
				if (that.continueRefresh) {
					that.refreshLine(++cont);
				}    			
		    },
		});				
	}
	
	Usage.prototype.init = function() {
		var that = this;
		var localStorageMembers = localStorage.getItem(MEMBER_STORAGE_STR);
		that.updateMembers(localStorageMembers);
		if (localStorageMembers == null) {
			setTimeout(function(){ that.refreshLine(0); }, 0);			
		} else {			
			for (i = 0; i < that.members.length; i++) { 			    
				console.log(JSON.parse(String(localStorageMembers).split(that.tokenToReplace)[i]));
				that.populateMemberLine(that.members[i].replace(/\./g, '\\.'), JSON.parse(String(localStorageMembers).split(that.tokenToReplace)[i])) 
			}
		}
	};
	
	function Usage() {
		this.continueRefresh = true;
		this.members = [];
		this.tokenToReplace = '#TokenReplace#';
	}
	
	$(document).find("a").click(function() {
		console.log('clicked');
		usageStorage.continueRefresh = false;
	});
	
	$("#button_populate").click(function() {
		$("#button_populate").prop("disabled", true);
		localStorage.clear();
		usageStorage.updateMembers();
		setTimeout(function(){ usageStorage.refreshLine(0); }, 0);
		$("#button_populate").prop("disabled", false);
	});		
	
	var usageStorage = new Usage();
	$(document).ready(function() {	
		usageStorage.init();
	});
})();