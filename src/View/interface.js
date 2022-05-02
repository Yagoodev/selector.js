const { ipcRenderer } = require("electron");

const button = document.getElementById("button");
const path = document.getElementById("path");

const pathField = document.getElementById("path-field");

let currentPath = [];

path.addEventListener("click", () => {
  ipcRenderer.send("get-path", null);

  ipcRenderer.on("path", (event, response) => {
    const { path } = response;

    currentPath.push(path);
    pathField.innerText = path;
  })
});

button.addEventListener("click", () => {
  const Start = require("./src/Model/GetImagesReference");

  const jobName = jobField.innerText;
  const currentPath = currentPath[0];

  Start(jobName, currentPath);
});