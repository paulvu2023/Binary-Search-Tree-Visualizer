const numbers = document.getElementById("numbers");
const insert = document.getElementById("insert");
const insertButton = document.querySelector(".insert-button");
const deleteText = document.getElementById("delete");
const deleteButton = document.querySelector(".delete-button");
const depth = document.getElementById("depth");
const depthButton = document.querySelector(".depth-button");
const depthOutput = document.getElementById("depth-output");
const height = document.getElementById("height");
const heightButton = document.querySelector(".height-button");
const heightOutput = document.querySelector(".height span");
const findHeightOutput = document.getElementById("height-output");
const rebalance = document.getElementById("rebalance");
const balanced = document.querySelector(".balanced span");
const levelOrder = document.querySelector(".level-order span");
const preorder = document.querySelector(".preorder span");
const inorder = document.querySelector(".inorder span");
const postorder = document.querySelector(".postorder span");
let array = [];
let tree = false;

numbers.addEventListener("keyup", () => {
  let numbersInput = numbers.value
    .replace(/[^0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  array = numbersInput.split(" ").map(Number);
  tree = new Tree(array);
  updateTreeInformation();
});

insertButton.addEventListener("click", processInsertInput);

deleteButton.addEventListener("click", processDeleteInput);

depthButton.addEventListener("click", processDepthInput);

heightButton.addEventListener("click", processHeightInput);

rebalance.addEventListener("click", rebalanceTree);

function rebalanceTree() {
  if (tree) {
    tree.rebalance();
    prettyPrint(tree.root);
    generateTreeHTML(tree.root);
  }
}

function updateTreeInformation() {
  heightOutput.textContent = tree.height();
  balanced.textContent = tree.isBalanced();
  levelOrder.textContent = tree.levelOrder().join(" ");
  preorder.textContent = tree.preorder().join(" ");
  inorder.textContent = tree.inorder().join(" ");
  postorder.textContent = tree.postorder().join(" ");
}

function processHeightInput() {
  if (tree) {
    let heightInput = height.value
      .replace(/[^0-9\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (tree.find(parseInt(heightInput))) {
      findHeightOutput.textContent = tree.height(
        tree.find(parseInt(heightInput))
      );
    }
  }
  height.value = "";
}

function processDepthInput() {
  if (tree) {
    let depthInput = depth.value
      .replace(/[^0-9\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (tree.find(parseInt(depthInput))) {
      depthOutput.textContent = tree.depth(tree.find(parseInt(depthInput)));
    }
  }
  depth.value = "";
}

function processDeleteInput() {
  if (tree) {
    let deleteInput = deleteText.value
      .replace(/[^0-9\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    let deleteArray = deleteInput.split(" ").map(Number);
    deleteText.value = "";
    deleteArray.forEach(function (number) {
      tree.delete(number);
      updateTreeInformation();
    });
    prettyPrint(tree.root);
    generateTreeHTML(tree.root);
  }
}

function processInsertInput() {
  if (tree) {
    let insertInput = insert.value
      .replace(/[^0-9\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    let insertArray = insertInput.split(" ").map(Number);
    insert.value = "";
    insertArray.forEach(function (number) {
      tree.insert(number);
      updateTreeInformation();
    });
    prettyPrint(tree.root);
    generateTreeHTML(tree.root);
  }
}

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
    generateTreeHTML(this.root);
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
    } else if (data === node.data) {
      return false;
    }
    return node;
  }

  delete(data, node = this.root) {
    if (node === null || node === undefined) {
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
    prettyPrint(tree.root);
    generateTreeHTML(tree.root);
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
      return 0;
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
    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
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

    values = this.inorder(node.left, func, values);

    if (func) {
      func(node);
    } else {
      values.push(node.data);
    }

    values = this.inorder(node.right, func, values);

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

function generateTreeHTML(
  node = tree.root,
  prefix = "",
  isLeft = true,
  initialCall = true
) {
  // If it's the initial call, clear the existing content of the container
  if (initialCall) {
    const container = document.querySelector(".tree");
    container.innerHTML = "";
  }

  if (node === null) return;

  // Recursively generate visualizations for left and right children
  const childPrefix = `${prefix}${
    isLeft ? "│&nbsp;&nbsp;&nbsp;" : "&nbsp;&nbsp;&nbsp;&nbsp;"
  }`;
  if (node.right) {
    generateTreeHTML(node.right, childPrefix, false, false); // Pass false for subsequent calls
  }

  // Create a new element to represent the node
  const nodeElement = document.createElement("div");
  nodeElement.classList.add("node");
  nodeElement.innerHTML = `${prefix}${isLeft ? "└── " : "┌── "}${node.data}`;

  // Append the node element to the container
  const container = document.querySelector(".tree");
  container.appendChild(nodeElement);

  if (node.left) {
    generateTreeHTML(node.left, childPrefix, true, false); // Pass false for subsequent calls
  }
}
