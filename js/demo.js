class MetroDemo {
    constructor(graph) {
        this.graph = graph;
        this.curNode = null;
        this.node1 = null;
        this.node2 = null;
        this.startNode = null;
        this.endNode = null;
        const svgWidth = screen.width * 0.6;
        const svgHeight = screen.height * 0.6;
        const svg = d3.select('#demo-svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);
        svg.append('g').attr('class', 'links');
        svg.append('g').attr('class', 'nodes');
    }
    setNode1() {
        if (this.curNode === null) return;
        const node1Span = document.getElementById('node1');
        this.node1 = this.curNode;
        node1Span.innerHTML = this.node1.name;
    }
    setNode2() {
        if (this.curNode === null) return;
        const node2Span = document.getElementById('node2');
        this.node2 = this.curNode;
        node2Span.innerHTML = this.node2.name;
    }
    setStartNode() {
        if (this.curNode === null) return;
        const startNodeSpan = document.getElementById('start-node');
        this.startNode = this.curNode;
        startNodeSpan.innerHTML = this.startNode.name;
    }
    setEndNode() {
        if (this.curNode === null) return;
        const endNodeSpan = document.getElementById('end-node');
        this.endNode = this.curNode;
        endNodeSpan.innerHTML = this.endNode.name;
    }
    addNode(graph) {
        const input = document.getElementById('add-node-input');
        const hint = document.getElementById('add-node-hint');
        const svgWidth = d3.select('#demo-svg').attr('width');
        const svgHeight = d3.select('#demo-svg').attr('height');
        const name = input.value;
        input.value = '';
        if (name === '') {
            hint.innerHTML = '请输入新站点名称';
            return;
        }
        const result = graph.addNode(name, svgWidth / 2, svgHeight / 2);
        if (result === false) {
            hint.innerHTML = '新站点名称重复';
            return;
        }
        this.drawGraph();
        hint.innerHTML = '添加成功';
    }
    addLink(graph) {
        const select = document.getElementById('no-select');
        const hint = document.getElementById('add-link-hint');
        const index = select.selectedIndex;
        if (this.node1 === null) {
            hint.innerHTML = '请选择站点1';
            return;
        }
        if (this.node2 === null) {
            hint.innerHTML = '请选择站点2';
            return;
        }
        if (this.node1 === this.node2) {
            hint.innerHTML = '站点1与站点2重复';
            return;
        }
        const result = graph.addLink(this.node1, this.node2, index);
        if (result === false) {
            hint.innerHTML = '该线路已存在';
            return;
        }
        this.drawGraph();
        hint.innerHTML = '添加成功';
    }
    updatePlainData() {
        // d3可能会改变元素在svg中的顺序，对应的数据顺序也要改变
        const nodes = d3.select('#demo-svg').select('g.nodes').selectAll('g.node');
        const links = d3.select('#demo-svg').select('g.links').selectAll('line.link');
        this.graph.data.nodes = nodes.data();
        this.graph.data.links = links.data();
    };
    findRoute(graph) {
        const infoArea = document.getElementById('info-area');
        if (this.startNode === null) {
            infoArea.value = '请选择起点站';
            return;
        }
        if (this.endNode === null) {
            infoArea.value = '请选择终点站';
            return;
        }
        if (this.startNode === this.endNode) {
            infoArea.value = '起点站与终点站相同';
            return;
        }
        const result = graph.findRoute(this.startNode, this.endNode);
        if (result[0] === false) {
            infoArea.value = '未找到路径';
            return;
        }
        var curSectoion = null;
        var curNode = null;
        var nxtNode = null;
        var preLink = null;
        var curLink = null;
        var infoText = '';
        infoText += '在' + result[1][0].name;
        infoText += '乘坐' + (result[1][1].no + 1) + '号线';
        infoText += result[1][1].target.name + '方向，';
        for(let i = 1; i < result[1].length; i++) {
            curSectoion = result[1][i];
            if ("name" in curSectoion) {  // 当前为节点
                curNode = curSectoion;
            }
            else {  // 当前为边
                preLink = curLink;
                curLink = curSectoion;
                nxtNode = curLink.target;
                if (preLink !== null && curLink.no !== preLink.no) {
                    infoText += '乘至' + curNode.name;
                    infoText += '换乘' + (curLink.no + 1) + '号线';
                    infoText += nxtNode.name + '方向，';
                }
            }
        }
        infoText += '在' + result[1][result[1].length - 1].name + '下车。';
        infoArea.value = infoText;
        this.drawRoute(result[1]);
    }
    drawRoute(data) {
        const inData = (d) => {
            return data.find((elm) => elm === d);
        }
        const nodes = d3.select('#demo-svg').select('g.nodes').selectAll('g.node');
        const links = d3.select('#demo-svg').select('g.links').selectAll('line.link');
        nodes.classed('active', false);
        links.classed('active', false);
        nodes.filter(inData).classed('active', true).raise();
        links.filter(inData).classed('active', true).raise();
        this.updatePlainData();
    }
    clearRoute() {
        const infoArea = document.getElementById('info-area');
        const startNodeSpan = document.getElementById('start-node');
        const endNodeSpan = document.getElementById('end-node');
        const nodes = d3.select('#demo-svg').select('g.nodes').selectAll('g.node');
        const links = d3.select('#demo-svg').select('g.links').selectAll('line.link');
        this.startNode = null;
        this.endNode = null;
        startNodeSpan.innerHTML = '';
        endNodeSpan.innerHTML = '';
        infoArea.value = '';
        nodes.classed('active', false);
        links.classed('active', false);
    }
    drawGraph() {
        //线路颜色
        const colorScale = [
            '#1f77b4',
            '#ff7f0e',
            '#2ca02c',
            '#d62728',
            '#9467bd',
            '#8c564b',
            '#e377c2',
            '#7f7f7f',
            '#bcbd22',
            '#17becf'
        ];
        const setCurNode = (node) => {
            const curSpan = document.getElementById('current-node');
            this.curNode = node;
            curSpan.innerHTML = this.curNode.name;
        };
        const translatePosition = (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
        };
        const changeCursor = function (d) {
            d3.select(this).style("cursor", "pointer");
        };
        const dragstarted = function(event, d) {
            const links = d3.select('#demo-svg').select('g.links').selectAll('line.link');
            const linkSource = links.filter((l) => { return l.source === d; });
            const linkTarget = links.filter((l) => { return l.target === d; });
            d3.select(this).raise();
            linkSource.raise();
            linkTarget.raise();
            demo.updatePlainData();
            setCurNode(d);
        };
        const dragged = function(event, d) {
            const svgWidth = d3.select('#demo-svg').attr('width');
            const svgHeight = d3.select('#demo-svg').attr('height');
            const links = d3.select('#demo-svg').select('g.links').selectAll('line.link');
            const linkSource = links.filter((l) => { return l.source === d; });
            const linkTarget = links.filter((l) => { return l.target === d; });
            d.x = Math.min(Math.max(0, event.x), svgWidth);
            d.y = Math.min(Math.max(0, event.y), svgHeight);
            d3.select(this).attr('transform', translatePosition(d));
            linkSource.attr('x1', d.x).attr('y1', d.y);
            linkTarget.attr('x2', d.x).attr('y2', d.y);
        };
        const dragended = function(event, d) {};
        const drag = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        const nodesPrepare = d3.select('#demo-svg')
            .select('g.nodes')
            .selectAll('g.node')
            .data(this.graph.data.nodes);
        nodesPrepare.exit().remove();
        const nodesEnter = nodesPrepare.enter().append('g');
        nodesEnter.classed('node', true);
        nodesEnter.attr('id', (d) => { return d.name; });
        nodesEnter.attr('transform', translatePosition);
        nodesEnter.on('mouseover', changeCursor);
        nodesEnter.call(drag);
        nodesEnter.append('circle').attr('r', 10);
        nodesEnter.append('text')
            .attr('dx', '0.5em')
            .attr('dy', '-0.5em')
            .text((d) => { return d.name });
        const linksPrepare = d3.select('#demo-svg')
            .select('g.links')
            .selectAll('line.link')
            .data(this.graph.data.links);
        linksPrepare.exit().remove();
        const linksEnter = linksPrepare.enter().append('line');
        linksEnter.attr('class', 'link');
        linksEnter.attr('x1', (l) => { return l.source.x; });
        linksEnter.attr('y1', (l) => { return l.source.y; });
        linksEnter.attr('x2', (l) => { return l.target.x; });
        linksEnter.attr('y2', (l) => { return l.target.y; });
        linksEnter.attr('stroke', (l) => { return colorScale[l.no]; });
    }
}