const fs = require("fs");
const arrangePhotos = require("./ArrangeImages");

const { Builder, By } = require("selenium-webdriver");
const until = require("selenium-webdriver/lib/until");

const webdriverPath = require("../data/webdriverPath");
const account = require("../data/account");

const driver = new Builder()
  .forBrowser('chrome')
  .build();

module.exports = async function Start(jobName, currentPath) {
  AccessURL();
  Login(account.email, account.password);
  CopyFavoritePhotos(jobName, currentPath);
}

async function AccessURL() {
  await driver.get(webdriverPath.URL);
}

async function Login(email, password) {
  await driver.findElement(By.id(webdriverPath.inputEmailID)).sendKeys(email);
  await driver.findElement(By.id(webdriverPath.inputPasswordID)).sendKeys(password);
  await driver.findElement(By.name(webdriverPath.submitButtonNAME)).click();
}

async function CopyFavoritePhotos(jobName, currentPath) {
  const allCollectionsInPixieset = [];

  const galleryButton = await driver.wait(until.elementLocated(By.className(webdriverPath.galleryCLASS)));
  galleryButton.click();

  const collectionElements = await driver.wait(until.elementsLocated(By.className(webdriverPath.collectionsCLASS)));

  for (let collection of collectionElements) {
    allCollectionsInPixieset.push(await collection);
  };

  allCollectionsInPixieset.map(async currentCollection => {
    const collectionName = await currentCollection.findElement(By.className(webdriverPath.pCollectionCLASS)).getText();

    if (collectionName === jobName) {
      await currentCollection.click();

      await driver.findElement(By.xpath(webdriverPath.activitiesXPATH)).click();
      await driver.findElement(By.xpath(webdriverPath.favoriteActiveXPATH)).click();
      await driver.findElement(By.xpath(webdriverPath.myFavoritesOptionsXPATH)).click();
      await driver.findElement(By.xpath(webdriverPath.lightroomListXPATH)).click();

      await driver.sleep(1000);
      const photos = await driver.findElement(By.id(webdriverPath.textareaID)).getText();

      GetPhotosName(photos, currentPath, jobName);
      await driver.quit();
    }
  });
}

async function GetPhotosName(photosName, currentPath, jobName) {
  fs.readdir(currentPath, (err, files) => arrangePhotos(photosName, jobName, currentPath));
}