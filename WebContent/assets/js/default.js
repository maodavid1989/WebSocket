//url = "ws://localhost:8084/WebSocket/ws"; 
url = "ws://52.69.57.216:8080/WebSocket/ws"; 
ws = new WebSocket(url);
var interval=7000;//間隔(秒)
var dataset=[];

$(document).ready(function() {	
		$('.sidebar').css('overflow','scroll');
		$('#queryTime').val(interval/1000);
		//web storage
		if(window.localStorage['stockAll']){
			$('#stockAll').val(window.localStorage['stockAll']);
		}
		
		ws.onopen = function() {  
			$('#messageTextArea').append("\nconnect to websocket...\n"); 
		};     
		ws.onclose = function() {  
		}; 
		ws.onmessage = function(message) {  
			var data=JSON.parse(message.data);
			
			switch(data.type) {
		    case "login":
		    	$('#messageTextArea').append(data.name+data.text+'\n');
		        break;
		    case "logout":
		        $('#messageTextArea').append(data.name+data.text+'\n');
		        break;
		    case "OnStock":
		    	$('#time').empty().append(data.nowTime);
		    	//資料圖表產生
				var sl=$('#stockAll').val().split(',').length;
		    	for(var i=0 ; i<sl ; i++){
		    		dataset[i].price.push(eval('data.JsonArray'+i)[0]);
		    		dataBind(eval('data.JsonArray'+i), dataset[i].price, ".demo"+i, i);
		    	}
		    	break;
		    case "OnIndex":
		    	var indexset=[];
	        	for (var i=0; i<data.ohlcArray.length;i++){
	        		indexset.push(data.ohlcArray[i].c);
	        	}
	        	dynamicChartIndex(indexset);
		    	break;
		    default:
		    	alert('system error');
		    	break;
			}
		}; 
		
		//關閉remove socket limit
	    $(window).bind("beforeunload", function() { 
	    	if($('#token').val()){
	    		closeAddress();
	    	}
	    });
});

	function start(){		
		if(!addressValid()){
			alert('請勿重複開啟');
			return;
		}else{
			//save to local storage
			window.localStorage.setItem("stockAll", $('#stockAll').val());	
			$('#start').attr('disabled', true);
			//關閉remove socket limit
		    $('#token').val("Y");
			var stock=$('#stockAll').val().split(',');//取得股票代號
			var sl=stock.length;
			for(var i=0; i <sl ; i++){
				var arrayAhref=getStockAhref(stock[i]);//取得最新消息超連結
				appendStock(stock[i], i, arrayAhref);
				$('#number'+i).val(stock[i]);
				dataset.push( { price : [] } );
			}
			ws.send(stock);//first time
			//ws.send("getTaiwanIndex");//first time
			setInterval(function(){
				var now =new Date();
				var msg=now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
				ws.send(stock);  
				//ws.send("getTaiwanIndex");  
			},interval);
		}
	}
	
	
	//取得股票新聞連結
	function getStockAhref(SN){
		var arrayAhref=[];
	    $.ajax({
	        async : false,
	        url : "ajaxStockServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "getStockAhref",
	            stockNumber : SN
	        },
	        success : function(data, textStatus, xhr) {
	        	arrayAhref.push(data.formData.href1);
	        	arrayAhref.push(data.formData.text1);
	        	arrayAhref.push(data.formData.href2);
	        	arrayAhref.push(data.formData.text2);
	        	arrayAhref.push(data.formData.href3);
	        	arrayAhref.push(data.formData.text3);
	        }
	    });
	    return arrayAhref;
	}
		
	function appendStock(number, count, arrayAhref){
		$('.stockAppend').append('<table border="0" width=100%><tr>'
		+'<td style="display:block;>'
		+'<div class="mycontent"><br/>'
			+'股票代號:&nbsp;<input id="number'+count+'" size="6" disabled>&nbsp;'
			+'成交:&nbsp;<div style="display:inline;" id="Price'+count+'"></div>&nbsp;'
			+'漲跌:&nbsp;<div style="display:inline;" id="UpandDown'+count+'"></div>&nbsp;'
			+'開盤:&nbsp;<div style="display:inline;" id="Open'+count+'"></div>&nbsp;'
			+'最高價:&nbsp;<div style="display:inline;" id="Top'+count+'"></div>&nbsp;'
			+'最低價:&nbsp;<div style="display:inline;" id="Bottom'+count+'"></div>&nbsp;'
			+'成交量:&nbsp;<div style="display:inline;" id="Count'+count+'"></div>&nbsp;'
			+'<br/>'
			+'<div class="demo'+count+'"></div>'
		+'</div>'
		+'<div class="mycontent">'
			+'<a target=_blank class="hidden-xs"  href="'+arrayAhref[0]+'">'+arrayAhref[1]+'</a><br/>'
			+'<a target=_blank class="hidden-xs" href="'+arrayAhref[2]+'">'+arrayAhref[3]+'</a><br/>'
			+'<a target=_blank class="hidden-xs" href="'+arrayAhref[4]+'">'+arrayAhref[5]+'</a><br/>'
		+'</div></td>'
		
		+'</tr></table>');
	}

	function dataBind(data, ds, className, count){
		$('#UpandDown'+count).css("font-weight","Bold");
    	if(data[1].indexOf("△") > -1){//漲
    		$('#UpandDown'+count).css("color","red");
    	}else if(data[1].indexOf("▽") > -1){//跌
    		$('#UpandDown'+count).css("color","green");
    	}else if(data[1].indexOf("▲") > -1){//漲停
    		$('#UpandDown'+count).css("background-color","red");
    		$('#UpandDown'+count).css("color","black");
    	}else{
    		$('#UpandDown'+count).css("color","black");
    	}
    	
    	
    	$('#Price'+count).empty().append('<b>'+data[0]+'</b>');
    	$('#UpandDown'+count).empty().empty().append(data[1]);
    	$('#Open'+count).empty().append(data[3]);//開盤價
    	$('#Top'+count).empty().append(data[4]);
    	$('#Bottom'+count).empty().append(data[5]);
    	$('#Count'+count).empty().append(data[2]);//成交量
    	//開盤價
    	//alert((data[3]*1.1).toFixed(2));
    	
    	dynamicChartStock(ds, className, data[4], data[5]);
	}
	

    function addressValid(){
    	var isVal=true;
    	$.ajax({
	        async : false,
	        url : "ajaxStockServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "addressValid",
	        },
	        success : function(data, textStatus, xhr) {
	        	isVal=data.formData.pass;
	        }
	    });
    	return isVal;
    }
    
    function closeAddress(){
    	var isVal=true;
    	$.ajax({
	        async : false,
	        url : "ajaxStockServlet",
	        dataType : 'json',
	        data : {
	            ajaxAction : "closeAddress",
	        },
	        success : function(data, textStatus, xhr) {

	        }
	    });

    }
