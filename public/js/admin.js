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
var currentTickets = firebase.database().ref('tickets');
var submit = document.getElementById("submitTicket");
var ticketTable = document.getElementById("tableTickets");
var ticketModal = document.getElementById("exampleModal");
initGraph();
currentTickets.on("value", function(snapshot) {
  
  
  while(ticketTable.firstChild) {
    ticketTable.removeChild(ticketTable.firstChild);
  }
  if(snapshot.val() != null) {
    createTable(snapshot.val());
  }
  


})

function createTable(entry) {
  var heading = document.createElement('tr');
  var hProblem = document.createElement("th");
  var hTemp = document.createElement("th");
  var hHum = document.createElement("th");
  var hLight = document.createElement("th");
  var hSolution = document.createElement("th");
  var hResolve = document.createElement("th");
  hProblem.appendChild(document.createTextNode("Problem"));
  hTemp.appendChild(document.createTextNode("Temperature"));
  hHum.appendChild(document.createTextNode("Humidity"));
  hLight.appendChild(document.createTextNode("Light"));
  hSolution.appendChild(document.createTextNode("Solution"));
  hResolve.appendChild(document.createTextNode("Resolve"));
  heading.appendChild(hProblem);
  heading.appendChild(hTemp);
  heading.appendChild(hHum);
  heading.appendChild(hLight);
  heading.appendChild(hSolution);
  heading.appendChild(hResolve);
  ticketTable.appendChild(heading);
  for(var item in entry) {
    var currentKey = item;
    var tableEntry = document.createElement("tr");
    var tProblem = document.createElement("td");
    var tTemp = document.createElement("td");
    var tHum = document.createElement("td");
    var tLight = document.createElement("td");
    var tSolution = document.createElement("td");
    var tButton = document.createElement("td");
    tProblem.appendChild(document.createTextNode(entry[item].problem));
    tTemp.appendChild(document.createTextNode(entry[item].values[0].value));
    tHum.appendChild(document.createTextNode(entry[item].values[1].value));
    tLight.appendChild(document.createTextNode(entry[item].values[2].value));
    var input = document.createElement("input");
    input.type = "text";
    tSolution.appendChild(input);
    var resolveBtn = document.createElement("button");
    resolveBtn.appendChild(document.createTextNode("Close"));
    resolveBtn.addEventListener("click", function() {
      currentTickets.child(currentKey).remove();
      $("#exampleModal").modal("hide");
      initGraph();
    });
    tButton.appendChild(resolveBtn);
    tableEntry.appendChild(tProblem);
    tableEntry.appendChild(tTemp);
    tableEntry.appendChild(tHum);
    tableEntry.appendChild(tLight);
    tableEntry.appendChild(tSolution);
    tableEntry.appendChild(tButton);
    ticketTable.appendChild(tableEntry);
  }
}

function initGraph(){
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  svg.selectAll('g').remove();

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("data/miserables.json", function(error, graph) {
    if (error) throw error;

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
      
    var circles = node.append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    /* var lables = node.append("text")
        .text(function(d) {
          return d.id;
        })
        .attr('x', 6)
        .attr('y', 3); */

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
    }
  });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}