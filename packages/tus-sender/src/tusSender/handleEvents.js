// @flow
import { FILE_STATES, logger } from "@rpldy/shared";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import { CHUNKING_SUPPORT, CHUNK_EVENTS, } from "@rpldy/chunked-sender";
import initTusUpload from "./initTusUpload";
import { SUCCESS_CODES } from "./consts";

import type {
	ChunkedSender,
	ChunkStartEventData,
	ChunkFinishEventData
} from "@rpldy/chunked-sender";
import type { TusState, State } from "./types";
import type { UploaderType } from "@rpldy/uploader";

const PATCH = "PATCH";

const handleParallelChunk = async (tusState: TusState, chunkedSender: ChunkedSender, data: ChunkStartEventData): Promise<boolean> => {
	const { item: orgItem, chunkItem, url, sendOptions, onProgress, chunkIndex } = data;
	const { options } = tusState.getState();

	tusState.updateState((state) => {
		//store the parallel upload URLs under the original batch item data
		state.items[orgItem.id].parallelChunks.push(chunkItem.id);
	});

	const initResult = initTusUpload(
		[chunkItem],
		url,
		{
			...sendOptions,
			//params will be sent as metadata with the finalizing request
			params: null,
		},
		onProgress,
		tusState,
		chunkedSender,
		`_prlChunk_${+options.chunkSize}_${chunkIndex}`
	);

	const response = await initResult.request;

	return response.state !== FILE_STATES.FINISHED;
};

const updateChunkStartData = (tusState: TusState, data: ChunkStartEventData, isParallel) => {
	const { item: orgItem, chunk, chunkItem, chunkIndex, chunkCount } = data;
	const { options } = tusState.getState();
	const itemInfo = tusState.getState().items[isParallel ? chunkItem.id : orgItem.id];
	const offset = isParallel ? 0 : (itemInfo.offset || chunk.start);

	const headers = {
		"tus-resumable": options.version,
		"Upload-Offset": offset,
		"Content-Type": "application/offset+octet-stream",
		//TUS doesnt expect content-range header and may not whitelist for CORS
		"Content-Range": undefined,
		"X-HTTP-Method-Override": options.overrideMethod ? PATCH : undefined,
		//for deferred length, send the file size header with the last chunk
		"Upload-Length": options.deferLength && (chunkIndex === (chunkCount - 1)) ? orgItem.file.size : undefined,
		"Upload-Concat": isParallel ? "partial" : undefined,
	};

	logger.debugLog(`tusSender.handleEvents: chunk start handler. offset = ${offset}`, {
		headers,
		url: itemInfo.uploadUrl
	});

	return {
		sendOptions: {
			sendWithFormData: false,
			method: options.overrideMethod ? "POST" : PATCH,
			headers,
		},
		url: itemInfo.uploadUrl,
	};
};

export default (uploader: UploaderType, tusState: TusState, chunkedSender: ChunkedSender) => {
	if (CHUNKING_SUPPORT) {
		uploader.on(UPLOADER_EVENTS.ITEM_FINALIZE, (item) => {
			const itemData = tusState.getState().items[item.id];

			if (itemData) {
				logger.debugLog(`tusSender.handleEvents: item ${item.id} finalized (${item.state}). Removing from state`);

				const parallelChunks = itemData.parallelChunks;

				tusState.updateState((state: State) => {
					if (parallelChunks.length) {
						parallelChunks.forEach((chunkItemId) => {
							delete state.items[chunkItemId];
						});
					}

					delete state.items[item.id];
				});
			}
		});

		chunkedSender.on(CHUNK_EVENTS.CHUNK_START,
			async (data: ChunkStartEventData) => {

				const { options } = tusState.getState(),
					isParallel = +options.parallel > 1;

				const continueWithChunk = !isParallel ||
					await handleParallelChunk(tusState, chunkedSender, data);

				return continueWithChunk &&
					updateChunkStartData(tusState, data, isParallel);
			});

		chunkedSender.on(CHUNK_EVENTS.CHUNK_FINISH, ({ item, chunk, uploadData }: ChunkFinishEventData) => {
			const { items, options } = tusState.getState();

			if (!options.parallel && items[item.id]) {
				const { status, response } = uploadData;
				logger.debugLog(`tusSender.handleEvents: received upload response (code: ${status}) for : ${item.id}, chunk: ${chunk.id}`, response);

				if (~SUCCESS_CODES.indexOf(status) && response.headers) {
					tusState.updateState((state: State) => {
						const data = state.items[item.id];
						data.offset = response.headers["upload-offset"];
					});
				}
			}
		});
	}
};
