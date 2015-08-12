$(document).ready(function() {	
	getPMI();
	getTWeconomic();
});


	function getPMI(){//PMI 
	    $.ajax({
	        async : false,
	        url : "staticServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getPMI"
	        },
	        success : function(data, textStatus, xhr) {
	        	PMIchart(data.formData, '.tips');
	        }
	    });		
	}

	function getTWeconomic(){//台灣景氣指標
	    $.ajax({
	        async : false,
	        url : "staticServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getTWeconomic"
	        },
	        success : function(data, textStatus, xhr) {
	        	economicChart(data.formData, '.tips2');
	        }
	    });		
	}