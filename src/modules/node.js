export class Node {
  constructor(val) {
    this.left = null;
    this.val = val;
    this.right = null;
  }
}

export class BST {
  constructor() {
    this.root = null;
  }

  insert(_val) {
    const { node: searchedNode } = this.search(_val);
    if (searchedNode) return;

    let node = new Node(_val);
    if (this.root == null) {
      this.root = node;
      return;
    }
    let prev = null;
    let temp = this.root;
    while (temp != null) {
      if (temp.val > _val) {
        prev = temp;
        temp = temp.left;
      } else if (temp.val < _val) {
        prev = temp;
        temp = temp.right;
      } else {
        temp = null;
      }
    }

    if (prev.val > _val) prev.left = node;
    else prev.right = node;
  }

  search(_val) {
    const steps = [];
    let temp = this.root;
    steps.push(temp);
    let parent = null;

    while (temp !== null) {
      if (_val === temp.val) {
        return {
          node: temp,
          parent,
          steps,
        };
      } else if (_val < temp.val) {
        // Search in the left subtree
        parent = temp;
        temp = temp.left;
        steps.push(temp);
      } else {
        // Search in the right subtree
        parent = temp;
        temp = temp.right;
        steps.push(temp);
      }
    }

    return {
      node: null,
      parent: null,
      steps,
    };
  }

  delete(_val) {
    const { node, parent } = this.search(_val);

    if (node === null) {
      return "Node not found";
    }

    // Case 1: No child or only one child
    if (node.left === null) {
      if (parent === null) {
        this.root = node.right;
        return { root: this.root };
      } else if (parent.left === node) {
        parent.left = node.right;
      } else {
        parent.right = node.right;
      }
    } else if (node.right === null) {
      if (parent === null) {
        this.root = node.left;
        return { root: this.root };
      } else if (parent.left === node) {
        parent.left = node.left;
      } else {
        parent.right = node.left;
      }
    } else {
      // Case 2: Node has two children
      // Find the inorder successor (smallest node in the right subtree)
      let successor = node.right;
      let successorParent = node;

      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
      }

      // Replace the value of the node node with the value of the successor
      node.val = successor.val;

      // Delete the successor
      if (successorParent.left === successor) {
        successorParent.left = null;
      } else {
        successorParent.right = null;
      }
    }

    return { root: this.root };
  }
}
