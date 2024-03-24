import { useState } from "react";
import { Tree, Button, message } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./App.css";

const BinarySearchTree = () => {
  const [treeData, setTreeData] = useState([]);

  // Function to insert a node into the binary search tree
  const insertNode = (value) => {
    const newNode = { key: value.toString(), title: value.toString() };
    if (treeData.length === 0) {
      setTreeData([newNode]);
    } else {
      let current = treeData[0];
      while (current) {
        if (value === parseInt(current.title)) {
          message.warning("Node with the same value already exists.");
          return;
        }
        if (value < parseInt(current.title)) {
          if (!current.children) {
            current.children = [newNode];
            break;
          }
          current = current.children[0];
        } else {
          if (!current.children) {
            current.children = [newNode];
            break;
          }
          current = current.children[current.children.length - 1];
        }
      }
      setTreeData([...treeData]);
    }
  };

  // Function to delete a node from the binary search tree
  const deleteNode = (value) => {
    const findAndDelete = (node, parent, direction) => {
      if (!node) return;
      if (parseInt(node.title) === value) {
        if (!node.children) {
          if (parent) {
            parent.children = null;
          } else {
            setTreeData([]);
          }
        } else if (node.children.length === 1) {
          if (parent) {
            parent.children[direction] = node.children[0];
          } else {
            setTreeData(node.children);
          }
        } else {
          // Handle more complex cases (node with two children)
          let current = node.children[0];
          while (current.right) {
            current = current.right;
          }
          node.title = current.title;
          findAndDelete(node.children[0], node, 0);
        }
        return;
      }
      if (parseInt(node.title) > value) {
        findAndDelete(node.children ? node.children[0] : null, node, 0);
      } else {
        findAndDelete(
          node.children ? node.children[node.children.length - 1] : null,
          node,
          node.children.length - 1
        );
      }
    };

    findAndDelete(treeData[0], null, 0);
  };

  // Function to search for a node in the binary search tree
  const searchNode = (value) => {
    const findNode = (node) => {
      if (!node) return false;
      if (parseInt(node.title) === value) return true;
      if (value < parseInt(node.title)) {
        return findNode(node.children ? node.children[0] : null);
      } else {
        return findNode(
          node.children ? node.children[node.children.length - 1] : null
        );
      }
    };

    if (findNode(treeData[0])) {
      message.success(`Node with value ${value} found.`);
    } else {
      message.error(`Node with value ${value} not found.`);
    }
  };

  // Function to render the tree nodes recursively
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      return (
        <div key={item.key} className="tree-node">
          <span className="node-value">{item.title}</span>
          {item.children && (
            <div className="children">
              {item.children.map((child) => (
                <div className="edge" key={child.key}></div>
              ))}
              <div className="child-nodes">
                {renderTreeNodes(item.children)}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  // Event handler for adding a node
  const handleAddNode = () => {
    const value = prompt("Enter value for the new node:");
    if (value !== null) {
      insertNode(parseInt(value, 10));
    }
  };

  // Event handler for deleting a node
  const handleDeleteNode = () => {
    const value = prompt("Enter value to delete:");
    if (value !== null) {
      deleteNode(parseInt(value, 10));
    }
  };

  // Event handler for searching a node
  const handleSearchNode = () => {
    const value = prompt("Enter value to search:");
    if (value !== null) {
      searchNode(parseInt(value, 10));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddNode} icon={<PlusOutlined />}>
          Add Node
        </Button>
        <Button onClick={handleDeleteNode} icon={<DeleteOutlined />}>
          Delete Node
        </Button>
        <Button onClick={handleSearchNode} icon={<SearchOutlined />}>
          Search Node
        </Button>
      </div>
      {renderTreeNodes(treeData)}
    </div>
  );
};

export default BinarySearchTree;
