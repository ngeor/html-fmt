const fs = require("fs");

fs.copyFileSync("../../README.md", "out/README.md");

if (fs.existsSync(".npmignore")) {
    fs.copyFileSync(".npmignore", "out/.npmignore");
}

let packageJson = JSON.parse(fs.readFileSync("package.json", { encoding: "utf8"}));
packageJson.main = "index.js";
packageJson.scripts = {};
fs.writeFileSync("out/package.json", JSON.stringify(packageJson));
