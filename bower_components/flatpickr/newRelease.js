const pkg = require("./package.json");
const fs = require("fs");
const semver = require("semver");
const exec = require('child_process').exec;

pkg.version = semver.inc(pkg.version, "patch");

console.info("v" + pkg.version);

fs.readFile("./src/flatpickr.js", (err, data) => {
	fs.writeFile(
		"./src/flatpickr.js",
		data.toString().replace(/v\d\.\d\.\d/, `v${pkg.version}`),
		"utf8",
		(err, ok) => console.info(err || ok || "✔ src/flatpickr.js")
	);
});

fs.writeFile("./package.json", JSON.stringify(pkg, null , 2), "utf8", (err, ok) => {
	console.info(err || "✔ package.json");

	postIncrement();
});

async function postIncrement() {
	await test();
	await build();
	await commit();
}

async function test() {
	console.log("  running unit tests..");
	exec("npm test", function(error, stdout, stderr) {
		if (error)
			throw new Error(error);

		console.log("✔ unit tests passed");
		return true;
	});
}

async function build() {
	console.log("  building..");

	exec("npm run build", function(error, stdout, stderr) {
		if (error)
			throw new Error(error);

		console.log("✔ build successful");
		return true;
	});
}

async function commit() {
	exec(
		`git commit -m 'build' dist && git commit -m 'v${pkg.version}' src package.json`,
		function(error, stdout, stderr) {
			if (error)
				throw new Error(error);

			console.log("✔ committed build");
			console.log(`✔ committed v${pkg.version}`);

			return true;
		}
	);
}
