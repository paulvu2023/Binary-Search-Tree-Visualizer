class Node {
  constructor(value = null, leftNode = null, rightNode = null) {
    this.value = value;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}

class Tree {
  constructor(array) {
    array = this.removeDuplicates(array);
    this.root = buildTree(array);
  }

  removeDuplicates(array) {
    return Array.from(new Set(array));
  }
}
