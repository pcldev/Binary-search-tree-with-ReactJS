/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import Tree, { RawNodeDatum } from "react-d3-tree";
import "./App.css";
import { BST } from "./modules/node.js";

const INITIAL_BST = new BST();

INITIAL_BST.insert(5);
INITIAL_BST.insert(3);
INITIAL_BST.insert(4);
INITIAL_BST.insert(2);
INITIAL_BST.insert(15);
INITIAL_BST.insert(11);
INITIAL_BST.insert(17);
INITIAL_BST.insert(14);

const App = () => {
  const [bst, setBst] = useState(INITIAL_BST);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleInsert = () => {
    const val = parseInt(value, 10);
    if (!isNaN(val)) {
      const result = bst.insert(val);
      const { steps, status, message } = result;
      if (!status) {
        alert(message);
        return;
      }
      setBst(bst);
      setValue("");
    }
  };

  const handleDelete = (val) => {
    const result = bst.delete(val);
    const { bst: _bst, status, message } = result;

    if (!status) {
      alert(message);
    }
    const newBST = new BST(_bst.root);
    setBst(newBST);
    setValue("");
  };

  const handleSearch = () => {
    const val = parseInt(searchValue, 10);
    if (!isNaN(val)) {
      const result = bst.search(val);
      const { node, parent, steps } = result;

      addSteps(steps);
    }
  };

  const handleInsertChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  async function traverseTheSearchNode(nameVal, step, circle) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!step?.val) {
          resolve(false);
        } else {
          if (nameVal === step.val) {
            circle.setAttribute("class", "traversing");
          } else {
            circle.removeAttribute("class");
          }
        }

        resolve(true);
      }, 1000);
    });
  }

  function addSteps(steps) {
    const gTags = [...document.querySelectorAll("g")];
    let isNotFound = false;

    (async () => {
      gTags
        .filter((g) => g.hasAttribute("id"))
        .forEach(async (g) => {
          const circle = g.querySelector("circle");
          const nameVal = +g.querySelector("text").textContent;

          if (nameVal) {
            for (const step of steps) {
              if (!isNotFound) {
                const r = await traverseTheSearchNode(nameVal, step, circle);

                if (!r && !isNotFound) {
                  alert("Node not found");

                  isNotFound = true;
                }
              }
            }
          }
        });
    })();
  }

  return (
    <>
      <Typography.Title level={1}>Binary Search Tree</Typography.Title>
      <div className="App">
        <div className="flex g-20 w-100">
          <div className="b-1px w-70">
            <BSTVisualizer bst={bst} handleDelete={handleDelete} />
          </div>

          <div className="b-1px w-30 p-20">
            <Typography.Title
              level={5}
              style={{ textAlign: "left", marginTop: "0px" }}
            >
              Insert Node
            </Typography.Title>
            <div className="flex h-m-c g-10">
              <Input
                aria-label="Insert Node"
                type="number"
                autoFocus
                value={value}
                onChange={handleInsertChange}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    handleInsert();
                  }
                }}
                placeholder="Enter Node Value"
              />

              <Button type="primary" onClick={handleInsert}>
                Insert
              </Button>
            </div>
            <br />
            <Typography.Title
              level={5}
              style={{ textAlign: "left", marginTop: "0px" }}
            >
              Search Node
            </Typography.Title>
            <div className="flex h-m-c g-10">
              <Input
                aria-label="Search Node"
                type="number"
                autoFocus
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Enter Node Value"
              />

              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
            <Typography.Title
              level={5}
              style={{ textAlign: "left", fontStyle: "italic" }}
            >
              Delete Node: Click on the specific node to delete this node{" "}
            </Typography.Title>

            <hr />
            <Typography.Title level={5} style={{ textAlign: "right" }}>
              Nodes: {bst.countNodes()}
            </Typography.Title>

            <Typography.Title level={5} style={{ textAlign: "right" }}>
              Height of tree: {bst.getHeight()}
            </Typography.Title>
          </div>
        </div>
      </div>
    </>
  );
};

const BSTVisualizer = ({ bst, handleDelete }) => {
  useEffect(() => {
    const gTags = [...document.querySelectorAll("g")];
    gTags
      .filter((g) => g.hasAttribute("id"))
      .forEach((g) => {
        const nameVal = g.querySelector("text").textContent;

        if (!nameVal) {
          g.style.display = "none";
        } else {
          g.style.display = "block";
        }
      });
  });

  if (!bst?.root?.val) return <h2>Binary search tree is empty</h2>;

  const orgChart: RawNodeDatum[] | RawNodeDatum = formatBST(bst);
  const getDynamicPathClass = ({ source, target }) => {
    if (target.data.attributes?.empty) {
      return "d-none";
    }

    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return "link__to-leaf";
    }

    // Style it as a link connecting two branch nodes by default.
    return "link__to-branch";
  };

  return (
    <>
      <div id="treeWrapper" className="w-100">
        <Tree
          onNodeClick={(node) => {
            const nodeVal = node.data.name;
            const result = window.confirm(
              `Do you want to delete node ${nodeVal}`
            );
            if (result) {
              handleDelete(nodeVal);
            }
          }}
          translate={{
            x: document.getElementById("treeWrapper")
              ? document.getElementById("treeWrapper").clientWidth / 3
              : window.innerWidth / 3,
            y: document.getElementById("treeWrapper")
              ? document.getElementById("treeWrapper").clientHeight / 6
              : window.innerHeight / 6,
          }}
          // pathFunc="straight"
          pathFunc="straight"
          orientation="vertical"
          data={orgChart}
          collapsible={false}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          pathClassFunc={getDynamicPathClass}
        />
      </div>
    </>
  );
};

export default App;

function formatBST(bst: any) {
  const root = bst.root;

  function findChildren(_root: any, _children?: any[]) {
    if (!_root?.val) return _children;

    const { left, right } = _root;

    const children = [
      ...(left
        ? [
            {
              name: left.val,
              children: findChildren(left),
            },
          ]
        : [
            {
              attributes: {
                empty: true,
              },
            },
          ]),
      ...(right
        ? [
            {
              name: right.val,
              children: findChildren(right),
            },
          ]
        : [
            {
              attributes: {
                empty: true,
              },
            },
          ]),
    ];

    return children;
  }

  function transverseData(root: any) {
    const children = findChildren(root, []);
    return {
      name: root.val,
      children,
    };
  }

  const d = transverseData(root);

  return d;
}
