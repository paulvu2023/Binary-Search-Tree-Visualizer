class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(array) {
    array = this.removeDuplicates(array);
    array.sort((a, b) => a - b);
    this.root = this.buildTree(array, true);
    prettyPrint(this.root);
  }

  buildTree(array) {
    if (array.length <= 0) {
      return null;
    }
    let midIndex = 0;
    if (array.length % 2 === 0) {
      midIndex = array.length / 2 - 1; // midIndex will be the the left-middle index
    } else {
      midIndex = parseInt(array.length / 2);
    }
    const mid = new Node(array[midIndex]);
    mid.left = this.buildTree(array.slice(0, midIndex));
    mid.right = this.buildTree(array.slice(midIndex + 1, array.length));
    return mid;
  }

  insert(data, node = this.root) {
    if (node === null) {
      return new Node(data);
    }

    if (data < node.data) {
      node.left = this.insert(data, node.left);
    } else if (data > node.data) {
      node.right = this.insert(data, node.right);
    }
    return node;
  }

  delete(data, node = this.root) {
    if (node === null) {
      return new Node(data);
    }

    if (data < node.data) {
      node.left = this.delete(data, node.left);
      if (node.left.data == data) {
        node.left = null;
      }
    } else if (data > node.data) {
      node.right = this.delete(data, node.right);

      if (node.right.data == data) {
        node.right = null;
      }
    }
    return node;
  }

  removeDuplicates(array) {
    return Array.from(new Set(array));
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const tree = new Tree([1, 2, 3, 4, 5, 6, 7, 8, 9]);
tree.delete(0);
prettyPrint(tree.root);
