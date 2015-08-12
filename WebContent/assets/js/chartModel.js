//chart
var margin = {top: 50, right: 40, bottom: 20, left: 40};

//股票圖表
	function dynamicChartStock(ds, className, top , bottom){
		$(className).html("");
		var w = 390 ; // 寬
		var h = 100 ; // 高
		var Ymax = top; 
		var Ymin = bottom;
		var widthRange=500;
		if (ds.length>500){
			widthRange=ds.length;
		}
		var xScale = d3.scale.linear().domain([0, widthRange]).range([0, w]);
		var yScale = d3.scale.linear().domain([Ymin, Ymax]).range([h, 0]);
		// 增加一個line function，用來把資料轉為x, y
		var line = d3.svg.line()
			.x(function(d,i) { 
				return xScale(i + 1); //利用尺度運算資料索引，傳回x的位置
			})
			.y(function(d) { 
				return yScale(d); //利用尺度運算資料的值，傳回y的位置
			});

		//增加一個SVG元素
		var svg = d3.select(className).append('svg')
			.attr('width', w + margin.left + margin.right) //將左右補滿
			.attr('height', h + margin.top + margin.bottom) //上下補滿
			.attr('class', 'mycontent')
			.append('g') //增加一個群組g
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
		// 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
		var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(-h).tickSubdivide(true);
		// SVG加入x軸線
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + h + ')')
			.call(xAxis);


		// 建立y軸線，4個刻度，數字在左
		var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient('left');
		// SVG加入y軸線
		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(0,0)')
			.call(yAxisLeft);
					
		svg.append('path').attr('d', line(ds)); //將資料套用d3.svg.line()
	}

	
//指數圖表	
	function dynamicChartIndex(ds){
		var className=".twIndex";
		var indexName=".twIndexN"
		var w = 390 ; // 寬
		var h = 100 ; // 高
		var Ymax =Math.max.apply(null, ds); 
		var Ymin =Math.min.apply(null, ds);

		$(indexName).html(ds[ds.length-1]);
		$(className).html("");
		var widthRange=50;
		if (ds.length>50){
			widthRange=ds.length;
		}
		var xScale = d3.scale.linear().domain([0, widthRange]).range([0, w]);
		var yScale = d3.scale.linear().domain([Ymin, Ymax]).range([h, 0]);
		// 增加一個line function，用來把資料轉為x, y
		var line = d3.svg.line()
			.x(function(d,i) { 
				return xScale(i + 1); //利用尺度運算資料索引，傳回x的位置
			})
			.y(function(d) { 
				return yScale(d); //利用尺度運算資料的值，傳回y的位置
			});

		//增加一個SVG元素
		var svg = d3.select(className).append('svg')
			.attr('width', w + margin.left + margin.right) //將左右補滿
			.attr('height', h + margin.top + margin.bottom) //上下補滿
			.attr('class', 'mycontent')
			.append('g') //增加一個群組g
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
		var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(-h).tickSubdivide(true);
		// SVG加入x軸線
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + h + ')')
			.call(xAxis);


		// 建立y軸線，4個刻度，數字在左
		var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient('left');
		// SVG加入y軸線
		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(0,0)')
			.call(yAxisLeft);
					
		svg.append('path').attr('d', line(ds)); //將資料套用d3.svg.line()
	}

	
//PMI統計圖表
	function PMIchart(data){

		var className=".PMI";
		$(className).html("");
		var width = 500 ; // 寬
		var height = 250 ; // 高

		var parseDate = d3.time.format("%Y%m").parse;

		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var yAxis = d3.svg.axis().scale(y).ticks(8).orient('left');
		
		var line = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.pmi); });

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



		data.forEach(function(d) {
		  d.date = parseDate(d.date);
		});

		data.sort(function(a, b) {
		  return a.date - b.date;
		});

		x.domain([data[0].date, data[data.length - 1].date]);
		y.domain(d3.extent(data, function(d) { return d.pmi; }));

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
		svg.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate(0,0)")
		    .call(yAxis);
		
		svg.append("path")
		    .datum(data)
		    .attr("class", "line")
		    .attr("d", line);

		//var format = d3.format(',');
		
		
		
		//tips
		var tips = svg.append('g').attr('class', 'tips');
		 
		tips.append('rect')
		  .attr('class', 'tips-border')
		  .attr('width', 40)
		  .attr('height', 20)
		  .attr('rx', 10)
		  .attr('ry', 10);
		 
		var textBox = tips.append('text')
		  .attr('class', 'tips-text')
		  .attr('x', 10)
		  .attr('y', 20)
		  .attr('fill', 'white') //文字顏色
		  .text('');

		//mouse event
		var g = svg.selectAll('circle')
		  .data(data)
		  .enter()
		  .append('g')
		  .append('circle')
		  .attr('class', 'white')
		  .attr('fill', '#ff4444')
		  .attr('cx', line.x())
		  .attr('cy', line.y())
		  .attr('r', 3.5)
		  .on("mouseover", function(d){
			  var m = d3.mouse(this);
		      var cx = m[0] - margin.left - 10 ;
		      var cy = m[1] - margin.top + 20;
			 textBox.text(d.pmi);
			 d3.select('.tips').attr('transform', 'translate(' + cx + ',' + cy + ')');
			 d3.select('.tips').style('display', 'block');
			 d3.select(this).transition().duration(500).attr('r', 5);
		  })
		  .on('mouseout', function() {
		    d3.select('.tips').style('display', 'none');
		    d3.select(this).transition().duration(500).attr('r', 3.5);
		  });
		
		svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr('fill', '#ffffff')
        .style("font-size", "32px")
        .text("臺灣製造業採購經理人指數(PMI)");
		
	}
	
	
	
	//台灣景氣燈號
	function economicChart(data){

		var className=".economic";
		$(className).html("");
		var width = 500 ; // 寬
		var height = 250 ; // 高

		var parseDate = d3.time.format("%Y%m").parse;

		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var yAxis = d3.svg.axis().scale(y).ticks(8).orient('left');
		
		var line = d3.svg.line()
		    .x(function(d) { return x(d.date);})
		    .y(function(d) { return y(d.economic); });

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



		data.forEach(function(d) {
		  d.date = parseDate(d.date);
		});

		data.sort(function(a, b) {
		  return a.date - b.date;
		});

		x.domain([data[0].date, data[data.length - 1].date]);
		y.domain(d3.extent(data, function(d) { return d.economic; }));

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
		svg.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate(0,0)")
		    .call(yAxis);
		
		svg.append("path")
		    .datum(data)
		    .attr("class", "line")
		    .attr("d", line);

		//var format = d3.format(',');
		
		
		
		//tips
		var tips = svg.append('g').attr('class', 'tips2');
		 
		tips.append('rect')
		  .attr('class', 'tips-border')
		  .attr('width', 40)
		  .attr('height', 20)
		  .attr('rx', 10)
		  .attr('ry', 10);
		 
		var textBox = tips.append('text')
		  .attr('class', 'tips-text')
		  .attr('x', 10)
		  .attr('y', 20)
		  .attr('fill', 'white') //文字顏色
		  .text('');

		//mouse event
		var g = svg.selectAll('circle')
		  .data(data)
		  .enter()
		  .append('g')
		  .append('circle')
		  .attr('class', 'white')
		  .attr('fill', '#ff4444')
		  .attr('cx', line.x())
		  .attr('cy', line.y())
		  .attr('r', 3.5)
		  .on("mouseover", function(d){

			  var m = d3.mouse(this);
		      var cx = m[0] - margin.left;
			  var cy = m[1] - margin.top + 20;
			 textBox.text(d.economic);
			 d3.select('.tips2').attr('transform', 'translate(' + cx + ',' + cy + ')');
			 d3.select('.tips2').style('display', 'block');
			 d3.select(this).transition().duration(500).attr('r', 5);
		  })
		  .on('mouseout', function() {
		    d3.select('.tips2').style('display', 'none');
		    d3.select(this).transition().duration(500).attr('r', 3.5);
		  });
		
		svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr('fill', '#ffffff')
        .style("font-size", "32px")
        .text("臺灣景氣燈號");

	}