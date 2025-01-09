var Edmonds = function (edges, maxCardinality) {
    this.edges = edges;
    this.maxCardinality = maxCardinality;
    this.nEdge = edges.length;
    this.init();
  
    // Convert methods to arrow functions for automatic `this` binding
    this.assignLabel = (w, t, p) => {
      var b = this.inBlossom[w];
      this.label[w] = this.label[b] = t;
      this.labelEnd[w] = this.labelEnd[b] = p;
      this.bestEdge[w] = this.bestEdge[b] = -1;
      if (t === 1) {
        this.queue.push(...this.blossomLeaves(b));
      } else if (t === 2) {
        var base = this.blossomBase[b];
        this.assignLabel(this.endpoint[this.mate[base]], 1, this.mate[base] ^ 1);
      }
    };
  
    this.slack = (k) => {
      var i = this.edges[k][0];
      var j = this.edges[k][1];
      var wt = this.edges[k][2];
      return this.dualVar[i] + this.dualVar[j] - 2 * wt;
    };
  
    this.scanBlossom = (v, w) => {
      var path = [];
      var base = -1;
      while (v !== -1 || w !== -1) {
        var b = this.inBlossom[v];
        if ((this.label[b] & 4) !== 0) {
          base = this.blossomBase[b];
          break;
        }
        path.push(b);
        this.label[b] = 5;
        if (this.labelEnd[b] === -1) {
          v = -1;
        } else {
          v = this.endpoint[this.labelEnd[b]];
        }
        if (w !== -1) {
          [v, w] = [w, v];
        }
      }
      for (let b of path) {
        this.label[b] = 1;
      }
      return base;
    };
  
    this.addBlossom = (base, k) => {
      var v = this.edges[k][0];
      var w = this.edges[k][1];
      var bb = this.inBlossom[base];
      var bv = this.inBlossom[v];
      var bw = this.inBlossom[w];
      var b = this.unusedBlossoms.pop();
      this.blossomBase[b] = base;
      this.blossomParent[b] = -1;
      this.blossomParent[bb] = b;
      var path = this.blossomChilds[b] = [];
      var endPs = this.blossomEndPs[b] = [];
      while (bv !== bb) {
        this.blossomParent[bv] = b;
        path.push(bv);
        endPs.push(this.labelEnd[bv]);
        v = this.endpoint[this.labelEnd[bv]];
        bv = this.inBlossom[v];
      }
      path.push(bb);
      path.reverse();
      endPs.reverse();
      endPs.push(2 * k);
      while (bw !== bb) {
        this.blossomParent[bw] = b;
        path.push(bw);
        endPs.push(this.labelEnd[bw] ^ 1);
        w = this.endpoint[this.labelEnd[bw]];
        bw = this.inBlossom[w];
      }
      this.label[b] = 1;
      this.labelEnd[b] = this.labelEnd[bb];
      this.dualVar[b] = 0;
      for (let v of this.blossomLeaves(b)) {
        this.inBlossom[v] = b;
      }
    };
  
    this.expandBlossom = (b, endStage) => {
      for (let s of this.blossomChilds[b]) {
        this.blossomParent[s] = -1;
        if (s < this.nVertex) {
          this.inBlossom[s] = s;
        } else if (endStage && this.dualVar[s] === 0) {
          this.expandBlossom(s, endStage);
        } else {
          for (let v of this.blossomLeaves(s)) {
            this.inBlossom[v] = s;
          }
        }
      }
      this.blossomChilds[b] = [];
      this.blossomEndPs[b] = [];
      this.blossomBase[b] = -1;
      this.unusedBlossoms.push(b);
    };
  };
  
  Edmonds.prototype.init = function () {
    this.nVertex = Math.max(...this.edges.flatMap(e => [e[0], e[1]])) + 1;
    this.dualVar = Array(this.nVertex).fill(0);
    this.mate = Array(this.nVertex).fill(-1);
    this.label = Array(this.nVertex * 2).fill(0);
    this.labelEnd = Array(this.nVertex * 2).fill(-1);
    this.inBlossom = Array.from({ length: this.nVertex }, (_, i) => i);
    this.blossomParent = Array(this.nVertex * 2).fill(-1);
    this.blossomBase = Array(this.nVertex * 2).fill(-1);
    this.unusedBlossoms = Array.from({ length: this.nVertex }, (_, i) => this.nVertex + i);
    this.queue = [];
  };
  
  Edmonds.prototype.blossomLeaves = function (b) {
    if (b < this.nVertex) {
      return [b];
    }
    return this.blossomChilds[b].flatMap(c => this.blossomLeaves(c));
  };
  
  module.exports = function (edges, maxCardinality) {
    const edmonds = new Edmonds(edges, maxCardinality);
    return edmonds.mate;
  };
  