import * as http from "http";
import * as https from "https";
import * as path from "path";

import { Resource, MatchRequestData } from "./types";

export class Webserver {
    private server: http.Server;
    private resources: Resource[] = [];
    private sslEnabled: boolean;

    constructor(
        sslEnabled: boolean,
        options: https.ServerOptions = {},
        notFoundHandler?: () => void
    ) {
        const httpPackage = sslEnabled ? https : http;
        this.sslEnabled = sslEnabled;

        this.server = httpPackage.createServer(
            options,
            (request: http.IncomingMessage, response: http.ServerResponse) => {
                const matchRequestData = this.createMatchRequestData(request);
                const resource: Resource | undefined = this.resources.find((resource: Resource) =>
                    resource.match(matchRequestData)
                );

                if (resource) {
                    resource.onRequest({
                        response,
                        ...matchRequestData,
                    });
                } else {
                    this.handeNotFoundError(response, notFoundHandler);
                }
            }
        );
    }

    /**
     * priority is defined by their order
     */
    addResource = (resourceDefinition: Resource): this => {
        this.resources.push(resourceDefinition);

        return this;
    };

    run = (port?: number): void => {
        if (port === undefined) {
            port = this.getDefaultPort();
        }

        this.server.listen(port, () => console.log(`Server is running on port ${port}.`));
    };

    stop = (): void => {
        this.server.close((error?: Error) => {
            if (error) {
                console.error(error);
            }

            console.log("Server is stopped.");
        });
    };

    private createMatchRequestData = (request: http.IncomingMessage): MatchRequestData => {
        const url: string | undefined = request.url;
        const extension: string | undefined = url ? this.getExtensionFromUrl(url) : undefined;

        return {
            request,
            url,
            extension: url ? this.getExtensionFromUrl(url) : undefined,
            dirname: url ? path.dirname(url) : undefined,
            filename: url ? path.basename(url, extension) : undefined,
        };
    };

    private getDefaultPort = (): number => (this.sslEnabled ? 443 : 80);

    private handeNotFoundError = (
        response: http.ServerResponse,
        notFoundHandler?: () => void
    ): void => {
        if (notFoundHandler) {
            notFoundHandler();
        } else {
            response.writeHead(404);
            response.end();
        }
    };

    private getExtensionFromUrl(url: string): string | undefined {
        const extension: string = path.extname(url);

        if (extension) {
            return extension;
        }

        return undefined;
    }
}
