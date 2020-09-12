window.onload = function () {

    graph = new MetroGraph();
    demo = new MetroDemo(graph);

    d3.select('#set-node1-button')
        .on('click', () => { demo.setNode1(); });
    d3.select('#set-node2-button')
        .on('click', () => { demo.setNode2(); });
    d3.select('#set-start-node-button')
        .on('click', () => { demo.setStartNode(); });
    d3.select('#set-end-node-button')
        .on('click', () => { demo.setEndNode(); });
    d3.select('#add-node-button')
        .on('click', () => { demo.addNode(graph); });
    d3.select('#add-link-button')
        .on('click', () => { demo.addLink(graph); });
    d3.select('#inquery-route-button')
        .on('click', () => { demo.findRoute(graph); });
    d3.select('#clear-route-button') 
        .on('click', () => { demo.clearRoute(graph); });
    
    demo.drawGraph();
};