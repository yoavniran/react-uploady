// @flow
import { logger, FILE_STATES, request, parseResponseHeaders, pick } from "@rpldy/shared";
import { XHR_SENDER_TYPE } from "../consts";
import prepareFormData from "./prepareFormData";

import type {
    BatchItem,
    UploadData,
} from "@rpldy/shared";

import type { OnProgress, SendResult, SendOptions } from "../types";

type Headers = { [string]: string };

type SendRequest = {
    url: string,
    count: number,
    pXhr: Promise<XMLHttpRequest>,
    xhr: XMLHttpRequest,
    aborted: boolean,
};

export const SUCCESS_CODES = [200, 201, 202, 203, 204];

const makeRequest = (items: BatchItem[], url: string, options: SendOptions, onProgress: ?OnProgress): SendRequest => {
    const formData = prepareFormData(items, options);

    const pXhr = request(url, formData, {
        ...pick(options, ["method", "headers", "withCredentials"]),
        preSend: (req) => {
            req.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(e, items.slice());
                }
            };
        },
    });

    return {
        url,
        count: items.length,
        pXhr,
        // $FlowFixMe -
        xhr: pXhr.xhr,
        aborted: false,
    };
};

const parseResponseJson = (response: string, headers: ?Headers, options: SendOptions): string | Object => {
    let parsed = response;

    const ct = headers && headers["content-type"];

    if (options.forceJsonResponse || (ct && ~ct.indexOf("json"))) {
        try {
            parsed = JSON.parse(response);
        } catch { //silent fail
        }
    }

    return parsed;
};

const processResponse = async (sendRequest: SendRequest, options: SendOptions): Promise<UploadData> => {
    let state, response;

    try {
        const xhr = await sendRequest.pXhr;

        logger.debugLog("uploady.sender: received upload response ", xhr);

        state = ~SUCCESS_CODES.indexOf(xhr.status) ?
            FILE_STATES.FINISHED : FILE_STATES.ERROR;

        const resHeaders = parseResponseHeaders(xhr);

        response = {
            data: parseResponseJson(xhr.response, resHeaders, options),
            headers: resHeaders,
        };
    } catch (ex) {
        if (sendRequest.aborted) {
            state = FILE_STATES.ABORTED;
            response = "aborted";
        } else {
            logger.debugLog("uploady.sender: upload failed: ", ex);
            state = FILE_STATES.ERROR;
            response = ex;
        }
    }

    return {
        state,
        response,
    };
};

const abortRequest = (sendRequest: SendRequest) => {
    let abortCalled = false;
    const { aborted, xhr } = sendRequest;

    if (!aborted && xhr.readyState && xhr.readyState !== 4) {
        logger.debugLog(`uploady.sender: cancelling request with ${sendRequest.count} items to: ${sendRequest.url}`);

        xhr.abort();
        sendRequest.aborted = true;
        abortCalled = true;
    }

    return abortCalled;
};

export default (items: BatchItem[], url: string, options: SendOptions, onProgress?: OnProgress): SendResult => {
    logger.debugLog("uploady.sender: sending file: ", { items, url, options, });

    const sendRequest = makeRequest(items, url, options, onProgress);

    return {
        request: processResponse(sendRequest, options),
        abort: () => abortRequest(sendRequest),
        senderType: XHR_SENDER_TYPE,
    };
};
