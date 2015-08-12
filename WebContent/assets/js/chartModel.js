//chart
var margin = {top: 10, right: 40, bottom: 20, left: 40};

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
		var width = 700 ; // 寬
		var height = 300 ; // 高

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

		var format = d3.format(',');
		
		text = svg.append('text').text('台灣採購經理人指數PMI').attr('x', 0).attr('y', 20).attr('fill', 'green')
	}