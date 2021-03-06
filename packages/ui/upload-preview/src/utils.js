// @flow
import { isFunction } from "@rpldy/shared";
import { PREVIEW_TYPES } from "./consts";
import { PREVIEW_DEFAULTS } from "./defaults";

import type {
    FallbackMethod,
    PreviewType,
    MandatoryPreviewOptions,
    PreviewOptions,
    PreviewItem
} from "./types";

const getWithMandatoryOptions = (options: ?PreviewOptions): MandatoryPreviewOptions => {
	return {
		...PREVIEW_DEFAULTS,
		...options,
	};
};

const getFallbackUrlData = (fallbackProp: ?string | FallbackMethod, file: Object) : ?PreviewItem => {
    let data = isFunction(fallbackProp) ?
        fallbackProp(file) :
        fallbackProp;

    if (typeof data === "string") {
        data = {
            id: "",
            url: data,
			name: file.name,
            type: PREVIEW_TYPES.IMAGE,
        };
    }

    return data;
};

const getFileObjectUrlByType = (
    type: PreviewType,
    mimeTypes: string[],
    max: number,
    file: Object
): void | {| name: any, type: PreviewType, url: string |} => {
    let data;

    if (mimeTypes && ~mimeTypes.indexOf(file.type)) {
        if (!max || file.size <= max) {
            data = {
                url: URL.createObjectURL(file),
				name: file.name,
                type,
            };
        }
    }

    return data;
};
export {
    isFunction,
    getWithMandatoryOptions,
    getFallbackUrlData,
    getFileObjectUrlByType,
};
