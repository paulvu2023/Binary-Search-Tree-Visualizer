const numbers = document.getElementById("numbers");
const insert = document.getElementById("insert");
const remove = document.getElementById("remove");
const depth = document.getElementById("depth");
const height = document.getElementById("height");
const rebalance = document.getElementById("rebalance");
const form = document.querySelector("form");
let array = [];
let tree = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

numbers.addEventListener("keyup", () => {
  let numbersInput = numbers.value
    .replace(/[^0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  array = numbersInput.split(" ").map(Number);
  tree = new Tree(array);
});

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
    displayTree(this.root);
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

    if (data === this.root.data) {
      let successorNode = this.findSuccessorNode(this.root, true);
      let successorNodeData = successorNode.data;
      this.delete(successorNodeData, this.root);
      this.root.data = successorNodeData;
    }

    if (data < node.data) {
      node.left = this.delete(data, node.left);

      if (node.left.data == data && this.hasTwoChildren(node.left)) {
        let successorNode = this.findSuccessorNode(node.left, true);
        node.left.data = successorNode.data;
        node.left.right = null;
      } else if (node.left.data == data && this.hasOneChild(node.left)) {
        let childNode = this.hasOneChild(node.left);
        node.left = childNode;
        childNode = null;
      } else if (node.left.data == data) {
        node.left = null;
      }
    } else if (data > node.data) {
      node.right = this.delete(data, node.right);

      if (node.right.data == data && this.hasTwoChildren(node.right)) {
        let successorNode = this.findSuccessorNode(node.right, true);
        node.right.data = successorNode.data;
        node.right.right = null;
      } else if (node.right.data == data && this.hasOneChild(node.right)) {
        let childNode = this.hasOneChild(node.right);
        node.right = childNode;
        childNode = null;
      } else if (node.right.data == data) {
        node.right = null;
      }
    }
    return node;
  }

  rebalance() {
    const values = this.inorder();
    this.root = this.buildTree(values, true);
  }

  isBalanced(node = this.root) {
    if (node === null) {
      return true;
    }
    const leftTreeHeight = this.height(node.left);
    const rightTreeHeight = this.height(node.right);
    if (
      Math.abs(leftTreeHeight - rightTreeHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    ) {
      return true;
    }
    return false;
  }

  depth(node, currentNode = this.root, currentDepth = 0) {
    if (currentNode === null) {
      return -1;
    }
    if (node.data === currentNode.data) {
      return currentDepth;
    }
    if (node.data < currentNode.data) {
      return this.depth(node, currentNode.left, currentDepth + 1);
    }

    return this.depth(node, currentNode.right, currentDepth + 1);
  }

  height(node = this.root) {
    if (node == null) {
      return 0;
    }
    let left = this.height(node.left);
    let right = this.height(node.right);
    if (left > right) {
      return left + 1;
    } else {
      return right + 1;
    }
  }

  preorder(node = this.root, func = null, values = []) {
    if (node === null) return values;
    if (func) {
      func(node);
    } else {
      values.push(node.data);
    }
    this.preorder(node.left, func, values);
    this.preorder(node.right, func, values);
    return values;
  }

  inorder(node = this.root, func = null, values = []) {
    if (node === null) return values;
    this.inorder(node.left, func, values);
    if (func) {
      func(node);
    } else {
      values.push(node.data);
    }
    this.inorder(node.right, func, values);
    return values;
  }

  postorder(node = this.root, func = null, values = []) {
    if (node === null) return values;
    this.postorder(node.left, func, values);
    this.postorder(node.right, func, values);
    if (func) {
      func(node);
    } else {
      values.push(node.data);
    }
    return values;
  }

  levelOrder(func = null) {
    const queue = [];
    const values = [];
    queue.unshift(this.root);
    while (queue.length > 0) {
      if (func === null) {
        values.push(queue[queue.length - 1].data);
      } else {
        func(queue[queue.length - 1]);
      }
      if (queue[queue.length - 1].left) {
        queue.unshift(queue[queue.length - 1].left);
      }
      if (queue[queue.length - 1].right) {
        queue.unshift(queue[queue.length - 1].right);
      }
      queue.pop();
    }
    if (func === null) {
      return values;
    }
  }

  find(data, node = this.root) {
    // Returns node if found, otherwise returns false
    if (node === null) {
      return false;
    } else if (data < node.data) {
      return this.find(data, node.left);
    } else if (data > node.data) {
      return this.find(data, node.right);
    } else if (data === node.data) {
      return node;
    }
  }

  findSuccessorNode(node, isInitialCall = false) {
    if (isInitialCall) {
      return this.findSuccessorNode(node.right);
    }
    if (node === null) {
      return null;
    }
    if (this.findSuccessorNode(node.left) === null) {
      return node;
    }
    return this.findSuccessorNode(node.left);
  }

  hasTwoChildren(node) {
    return node.left && node.right;
  }

  hasOneChild(node) {
    // Returns child if node ONLY has 1 child
    let leftNode = false;
    let rightNode = false;
    if (node.left) {
      leftNode = true;
    }
    if (node.right) {
      rightNode = true;
    }
    if (leftNode == true && rightNode == false) {
      return node.left;
    } else if (rightNode == true && leftNode == false) {
      return node.right;
    }
    return false;
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

// const tree = new Tree([1, 10, 54, 99, 25, 44, 57, 82, 13, 19, 48, 49]);
// console.log(tree.isBalanced());
// console.log(tree.preorder());
// console.log(tree.postorder());
// console.log(tree.inorder());
// console.log(tree.levelOrder());
