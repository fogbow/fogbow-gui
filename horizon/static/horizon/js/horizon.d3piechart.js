/*
    Draw pie chart in d3.

    To use, a div is required with the class .d3_pie_chart
    and a data-used attribute in the div
    that stores the percentage to fill the chart

    Example:
        <div class="d3_pie_chart"
            data-used="{% widthratio current_val max_val 100 %}">
        </div>
*/

horizon.d3_pie_chart = {
  w: 100,
  h: 100,
  r: 45,
  bkgrnd: "#F2F2F2",
  frgrnd: "#006CCF",
//  full: "#D0342B",
  full: "#006CCF",
//  nearlyfull: "orange",
  nearlyfull: "006CCF",

  init: function() {
    var self = this;

    // Pie Charts
    var pie_chart_data = $(".d3_pie_chart");
    self.chart = d3.selectAll(".d3_pie_chart");

    for (var i = 0; i < pie_chart_data.length; i++) {
      used = parseInt(pie_chart_data[i].dataset.used);
      // Fogbow - Added to show some information ih the chart.
      
      fogbowColor = pie_chart_data[i].dataset.color      
      switch(fogbowColor) {
      case "fogbow-color-green":
          self.color = "#79CD38"
          break;
      case "fogbow-color-blue":
    	  self.color = "#3C96CE"
          break;
      case "fogbow-color-red":
    	  self.color = "#FF5555"
          break;
      case "fogbow-color-orange":
    	  self.color = "#F59A59"
          break;
      case "fogbow-color-gray":
    	  self.color = "#696969"
          break;
      case "fogbow-color-yellow":
    	  self.color = "#FFF181"
          break;    	      	      	  
      default:
          self.color = "#3C96CE"
      }
      
      fogbowPercent = pie_chart_data[i].dataset.used;
      fogbowPercent = parseFloat(fogbowPercent.replace(",", "."));
      if (fogbowPercent > 0 && fogbowPercent < 1 ) {
    	  used = 1;
      }
      // End Fogbow 
      self.data = [{"percentage":used}, {"percentage":100 - used}];
      self.pieChart(i);
    }
  },
  // Draw a pie chart
  pieChart: function(i) {
    var self = this;
    var vis = d3.select(self.chart[0][i]).append("svg:svg")
      .attr("class", "chart")
      .attr("width", self.w)
      .attr("height", self.h)
      .style("background-color", "white")
      .append("g")
        .attr("transform", "translate(" + (self.r + 2) + "," + (self.r + 2) + ")")

    var arc = d3.svg.arc()
      .outerRadius(self.r)
      .innerRadius(0)

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d){ return d.percentage; })

    // Draw an empty pie chart
    var piechart = vis.selectAll(".arc")
      .data(pie([{"percentage":10}]))
      .enter()
        .append("path")
          .attr("class","arc")
          .attr("d", arc)
          .style("fill", function(d){
        	// Fogbow
        	  if (self.color != null && self.color != ""){
        		  return self.color;
        	  }
        	// End Fogbow
            if (self.data[0].percentage >= 100) {
              return self.full;
            } else if (self.data[0].percentage >= 80) {
              return self.nearlyfull;
            } else {
              return self.frgrnd;
            }
          })
          .style("stroke", "#CCCCCC")
          .style("stroke-width", 1)
          .each(function(d) {return self.current = d;})

    // Animate filling the pie chart
    animate = function(data) {
      var piechart = vis.selectAll(".arc")
        .data(pie(data))
        .enter()
          .append("path")
            .attr("class","arc")
            .attr("d", arc)
            .style("fill", self.bkgrnd)
            .style("stroke", "#CCCCCC")
            .style("stroke-width", 1)
            .each(function(d) {return self.current = d;})
        .transition()
          .duration(500)
          .attrTween("d", function(a) {
            var tween = d3.interpolate(self.current, a);
            self.current = tween(0);
            return function(t) { return arc(tween(t)); }
          })
    }

    animate(self.data)
  }
}

horizon.addInitFunction(function () {
  horizon.d3_pie_chart.init();
});
