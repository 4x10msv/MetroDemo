class MetroGraph {
    constructor() {
        this.data = {
            nodes: [
                { name: "A", x: 400, y: 200 },
                { name: "B", x: 500, y: 200 },
                { name: "C", x: 500, y: 300 },
                { name: "D", x: 400, y: 300 },
                { name: "E", x: 400, y: 100 },
                { name: "F", x: 500, y: 100 },
                { name: "G", x: 600, y: 200 },
                { name: "H", x: 600, y: 300 },
                { name: "I", x: 500, y: 400 },
                { name: "J", x: 400, y: 400 },
                { name: "K", x: 300, y: 300 },
                { name: "L", x: 300, y: 200 }
            ],
            links: [
                { source: "A", target: "B", no: 0 },
                { source: "B", target: "A", no: 0 },
                { source: "B", target: "C", no: 0 },
                { source: "C", target: "B", no: 0 },
                { source: "C", target: "D", no: 0 },
                { source: "D", target: "C", no: 0 },
                { source: "D", target: "A", no: 0 },
                { source: "A", target: "D", no: 0 },
                { source: "E", target: "A", no: 1 },
                { source: "A", target: "E", no: 1 },
                { source: "F", target: "B", no: 2 },
                { source: "B", target: "F", no: 2 },
                { source: "G", target: "B", no: 3 },
                { source: "B", target: "G", no: 3 },
                { source: "H", target: "C", no: 4 },
                { source: "C", target: "H", no: 4 },
                { source: "I", target: "C", no: 5 },
                { source: "C", target: "I", no: 5 },
                { source: "J", target: "D", no: 6 },
                { source: "D", target: "J", no: 6 },
                { source: "K", target: "D", no: 7 },
                { source: "D", target: "K", no: 7 },
                { source: "L", target: "A", no: 8 },
                { source: "A", target: "L", no: 8 }
            ]
        };
        // 数据索引化
        this.data.links.forEach((l) => {
            l.source = this.data.nodes.find((n) => { return n.name === l.source; });
            l.target = this.data.nodes.find((n) => { return n.name === l.target; });
        });
        this.data.nodes.forEach((n) => {
            n.sourceLinks = this.data.links.filter((l) => {
                return l.source === n;
            });
            n.targetLinks = this.data.links.filter((l) => {
                return l.target === n;
            });
        });
    }
    addNode(name, x, y) {
        const sameNode = (n) => { return n.name === name; };
        if (this.data.nodes.find(sameNode))
            return false;
        var newNode = {
            name: name,
            x: x,
            y: y
        };
        newNode.sourceLinks = [];
        newNode.targetLinks = [];
        this.data.nodes.push(newNode);
        return true;
    }
    addLink(node1, node2, no) {
        const sameLink = (l) => {
            return l.source === node1 && l.target === node2;
        };
        if (this.data.links.find(sameLink)) return false;
        // 添加双向边
        var newLink1 = {
            source: node1,
            target: node2,
            no: no
        };
        var newLink2 = {
            source: node2,
            target: node1,
            no: no
        };
        this.data.links.push(newLink1);
        this.data.links.push(newLink2);
        newLink1.source.sourceLinks.push(newLink1);
        newLink1.target.targetLinks.push(newLink1);
        newLink2.source.sourceLinks.push(newLink2);
        newLink2.target.targetLinks.push(newLink2);
        return true;
    }
    findRoute(nodeStart, nodeEnd) {
        var curNode;
        var curLink;
        var curSection;
        var find = false;
        var pre = new Map();
        var queue = [nodeStart];
        var route = [];
        pre.set(nodeStart, null);
        while (queue.length !== 0) {
            curNode = queue[0];
            queue.shift();
            for (let i in curNode.sourceLinks) {
                curLink = curNode.sourceLinks[i];
                pre.set(curLink, curNode);
                if (pre.has(curLink.target) === false) {
                    pre.set(curLink.target, curLink);
                    queue.push(curLink.target);
                    if (curLink.target === nodeEnd) {
                        find = true;
                        break;
                    }
                }
            }
            if (find === true) break;
        }
        if (find === true) {
            curSection = nodeEnd;
            do {
                route.push(curSection);
                curSection = pre.get(curSection);
            } while (curSection !== nodeStart);
            route.push(nodeStart);
            route.reverse();
        }
        return [find, route];
    }
}