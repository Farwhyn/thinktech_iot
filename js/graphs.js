// Initialize Firebase
var config = {
  apiKey: "AIzaSyBmxV78S_W_68fp7H_qgSQFubJdjVyaOCE",
  authDomain: "thinktech-34ceb.firebaseapp.com",
  databaseURL: "https://thinktech-34ceb.firebaseio.com",
  projectId: "thinktech-34ceb",
  storageBucket: "thinktech-34ceb.appspot.com",
  messagingSenderId: "740650395339"
};
firebase.initializeApp(config);
var m_table = document.getElementById("iot");
var iotlights = firebase.database().ref('lights');
iotlights.on('value', function(snapshot) {
        //console.log(snapshot.val());
        var lightvalue = snapshot.val();
        //console.log(lightvalue);
        var newdata = generateRandomData(lightvalue);
        init(newdata);
        m_table.deleteRow(1);
        var row = m_table.insertRow(1);
        var problem = row.insertCell(0);
        var solution = row.insertCell(1);
        if(lightvalue < 30) {
          problem.innerHTML = "Lightbulb loose";
          solution.innerHTML = "Turn off lights and screw bulb tighter";
        }
        else {
          problem.innerHTML = "Pipe leak";
          solution.innerHTML = "Standby... Calling pipe maintainer";
        }
});

function init(newdata, lights) {
  const svg = d3.select('svg');
  svg.selectAll('g').remove();
  const svgContainer = d3.select('#container');

  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 500 - 2 * margin;

  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(newdata.map((s) => s.sensor))
    .padding(0.4)

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);

  // vertical grid lines
  // const makeXLines = () => d3.axisBottom()
  //   .scale(xScale)

  /* const makeYLines = () => d3.axisLeft()
    .scale(yScale) */

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

 /*  chart.append('g')
    .call(d3.axisLeft(yScale)); */


/*   chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    ) */

  const barGroups = chart.selectAll()
    .data(newdata)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.sensor))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .attr('fill', (g) => g.color)
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.sensor) - 5)
        .attr('width', xScale.bandwidth() + 10)

      const y = yScale(actual.value)

      /* line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y) */

      /* barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.sensor) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value).toFixed(1)

          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}%`

          return idx !== i ? text : '';
        }) */

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.sensor))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })

  barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.sensor) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text((a) => {
      if(a.sensor === "Temperature")
        return a.value + "*Celsius"
      else if(a.sensor === "Humidity")
        return a.value + "%";
      else
        return a.value + "V";
    })

 /*  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Love meter (%)') */

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Sensors')

/*   svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('IoT Sensor Data')*/
  }


function generateRandomData(light) {
  var sample = [
    {
      sensor: 'Temperature',
      value: random(22, 25),
      color: '#FF6347'
    },
    {
      sensor: 'Humidity',
      value: random(40, 48),
      color: '#00FFFF'
    },
    {
      sensor: 'Light Intensity',
      value: light,
      color: '#FFFF00'
    }
  ];
  return sample;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* setInterval(function() {
  var newdata = generateRandomData();
  init(newdata);
}, 1000); */
