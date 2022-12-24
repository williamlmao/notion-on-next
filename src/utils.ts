import fs from "fs";

export const createFolderIfDoesNotExist = (path: string) => {
  // Promisify
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      console.log('Created folder "' + path + '"');
      resolve("done");
    } else {
      resolve("folder already exists");
    }
  });
};

export const appendToFile = async (
  filePath: string,
  data: string,
  callback: () => void
) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, data, (err) => {
      if (err) reject(err);
      callback();
      resolve("done");
    });
  });
};

export const getFileExtension = (url: string) => {
  return url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)?.[1];
};

export const checkNextVersionNumber = (compatibleVersion = 13) => {
  const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  const nextVersionString = packageJson.dependencies.next;

  const nextVersionNumber = Number(
    nextVersionString.replace("^", "").split(".")[0]
  );
  if (nextVersionNumber < compatibleVersion) {
    return false;
  }
  return true;
};
