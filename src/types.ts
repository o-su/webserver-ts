import * as http from "http";

export type Resource = {
    match: (data: MatchRequestData) => boolean;
    onRequest: (data: RequestData) => boolean;
};

export type RequestData = { response: http.ServerResponse } & MatchRequestData;

export type MatchRequestData = {
    request: http.IncomingMessage;
    url?: string;
    dirname?: string;
    filename?: string;
    extension?: string;
};
