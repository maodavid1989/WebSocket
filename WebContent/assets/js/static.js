$(document).ready(function() {	
	getPMI();
	getTWeconomic();
	getMoneySupplerM1B();//M1B
	getMoneySupplerM2();//M2
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
	        	PMIchart(data.formData);
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
	        	economicChart(data.formData);
	        }
	    });		
	}
	
	function getMoneySupplerM1B(){//貨幣供給M1B
	    $.ajax({
	        async : false,
	        url : "staticServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getMoneySuppler"
	        },
	        success : function(data, textStatus, xhr) {
	        	moneySupplyM1B(data.formData);
	        }
	    });		
	}
	
	function getMoneySupplerM2(){//貨幣供給M2
	    $.ajax({
	        async : false,
	        url : "staticServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getMoneySuppler"
	        },
	        success : function(data, textStatus, xhr) {
	        	moneySupplyM2(data.formData);
	        }
	    });		
	}