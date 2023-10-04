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
    array.sort((a, b) => a - b);
    this.root = buildTree(array);
  }

  buildTree(array) {
    let midIndex = 0;
    if (array.length % 2 === 0) {
      midIndex = array.length / 2; // midIndex will be the the left-middle index
    } else {
      midIndex = parseInt(array.length / 2);
    }
    const mid = new Node(array[midIndex]);
    mid.leftNode = buildTree(array.slice(0, midIndex));
    mid.rightNode = buildTree(array.slice(midIndex + 1, array.length));
  }

  removeDuplicates(array) {
    return Array.from(new Set(array));
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
