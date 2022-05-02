const util = require("util");
const path = require("path");
const fs = require("fs");

const copyFilePromise = util.promisify(fs.copyFile);

module.exports = function arrangePhotos(selectedPhotosClient, jobName, currentPath) {
  let photosSelected = [];
  let formattedSelectedPhotosClient = selectedPhotosClient.split(",");

  formattedSelectedPhotosClient.filter(photo => {
    const formattedPhoto = (photo + ".JPG").replace(/ /g, "");

    photosSelected.push(formattedPhoto);
  });

  try {
    fs.mkdirSync(path.join(currentPath, `SELECT ${jobName} (${photosSelected.length} FOTOS)`));
  } catch (error) {
    console.log(error);
  }

  copyPhotosToSelectFolder(currentPath, path.join(currentPath, `SELECT ${jobName} (${photosSelected.length} FOTOS)`), photosSelected);
}

// Faz a cópia de todos os arquivos dentro de uma pasta.

function copyPhotosToSelectFolder(from, to, files) {
  return Promise.all(files.map(file => {
    return copyFilePromise(path.join(from, file), path.join(to, file));
  }));
}