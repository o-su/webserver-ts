const fs = require("fs");

const { Webserver } = require("../dist/index.js");

const port = 3000;
const webserver = new Webserver(false);

webserver
    .addResource({
        match: (data) => data.filename === "home",
        onRequest: (data) => {
            data.response.end("Welcome!");
        },
    })
    .addResource({
        match: (data) => data.extension === ".html",
        onRequest: (data) => {
            const content = fs.readFileSync(path.join(".", data.url));
            data.response.end(content);
        },
    })
    .run(port);