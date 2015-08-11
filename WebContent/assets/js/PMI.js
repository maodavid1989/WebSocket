$(document).ready(function() {	
	
	getPMI();
	//dynamicChartIndex()
});


	function getPMI(){
	    $.ajax({
	        async : false,
	        url : "ajaxStockServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getPMI"
	        },
	        success : function(data, textStatus, xhr) {
	        	PMIchart(data.formData);
	        }
	    });		
	}
    