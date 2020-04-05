# webserver-ts

Webserver written in TypeScript.

## Installation

```bash
npm install --save webserver-ts
```

## Example Usage

```typescript
import * as fs from "fs";
import { Webserver, MatchRequestData, RequestData } from "webserver-ts";

const port: number = 3000;
const webserver: Webserver = new Webserver(false);

webserver
    .addResource({
        match: (data: MatchRequestData) => data.filename === "home",
        onRequest: (data: RequestData) => {
            data.response.end("Welcome!");
        },
    })
    .addResource({
        match: (data: MatchRequestData) => data.extension === ".html",
        onRequest: (data: RequestData) => {
            const content = fs.readFileSync("." + data.url);
            data.response.end(content);
        },
    })
    .run(port);
```
