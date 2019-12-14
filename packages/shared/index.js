// @flow

import { BATCH_STATES, FILE_STATES } from "./src/consts";
import * as logger from "./src/logger";
import { isFunction } from "./src/utils";

import type {
	UploadOptions,
	CreateOptions,
	Destination,
	UploadInfo,
	ProgressInfo,
	BatchState,
	FileState,
	NonMaybeTypeFunc,
	Batch,
	BatchItem,
	SendMethod,
	SendResult,
	UploadData,
	OnProgress,
	SendOptions,
	SenderProgressEvent,
} from "./src/types";

export {
	BATCH_STATES,
	FILE_STATES,

	logger,
	isFunction,
};

export type {
	UploadOptions,
	CreateOptions,
	Destination,
	UploadInfo,
	ProgressInfo,
	BatchState,
	FileState,
	NonMaybeTypeFunc,
	Batch,
	BatchItem,
	SendMethod,
	SendResult,
	UploadData,
	OnProgress,
	SendOptions,
	SenderProgressEvent,
};
