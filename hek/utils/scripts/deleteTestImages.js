const fs = require("fs");
const { join } = require("path");
const pathToTestImages = join(__dirname, "../../uploads/test");

function deleteTestFiles(pathToTestImages) {
  try {
    // delete all generated test files
    if (fs.existsSync(pathToTestImages)) {
      const files = fs.readdirSync(pathToTestImages);
      for (file of files) {
        fs.unlinkSync(`${pathToTestImages}/${file}`);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}
deleteTestFiles(pathToTestImages);
