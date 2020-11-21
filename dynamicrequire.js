/*==================
[GitHub Action] Send To Pipedream - Dynamic Require
	Language:
		NodeJS/12.13.0
==================*/
const advancedDetermine = require("@hugoalh/advanced-determine"),
	path = require("path");
function dynamicRequire(packageName) {
	if (advancedDetermine.isString(packageName) !== true) {
		throw new TypeError();
	};
	try {
		return require(packageName);
	} catch (error) {
		const fileSystem = require("fs");
		let data = fileSystem.readFileSync(
			path.join(__dirname, "./package.json"),
			{
				encoding: "utf8",
				flag: "r"
			}
		);
		let metadata = JSON.parse(data);
		if (advancedDetermine.isObjectPair(metadata.dynamicDependencies) !== true) {
			throw error;
		};
		let packageVersion = metadata.dynamicDependencies[packageName];
		if (advancedDetermine.isString(packageVersion) !== true) {
			throw error;
		};
		const childProcess = require("child_process");
		childProcess.execSync(
			`npm install ${packageName}@${packageVersion}`,
			{
				cwd: __dirname
			}
		);
		return require(packageName);
	};
};
module.exports = dynamicRequire;
