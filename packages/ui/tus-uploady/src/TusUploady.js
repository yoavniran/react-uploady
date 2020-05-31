// @flow
import React, { useMemo } from "react";
import { logWarning } from "@rpldy/shared-ui";
import Uploady, { composeEnhancers } from "@rpldy/uploady";
import { CHUNKING_SUPPORT, getTusEnhancer } from "@rpldy/tus-sender";

import type { UploaderEnhancer } from "@rpldy/uploader";
import type { TusUploadyProps } from "./types";
import type { TusOptions } from "@rpldy/tus-sender";

const getEnhancer = (options: TusOptions, enhancer: ?UploaderEnhancer) => {
	const tusEnhancer = getTusEnhancer(options);
	return enhancer ? composeEnhancers(tusEnhancer, enhancer) : tusEnhancer;
};

const TusUploady = (props: TusUploadyProps) => {
	const {
		chunked,
		chunkSize,
		retries,
		parallel,
		version,
		featureDetection,
		featureDetectionUrl,
		onFeaturesDetected,
		resume,
		deferLength,
		overrideMethod,
		sendDataOnCreate,
		storagePrefix,
		lockedRetryDelay,
		forgetOnSuccess,
		ignoreModifiedDateInStorage,
		...uploadyProps
	} = props;

	const enhancer = useMemo(
		() => CHUNKING_SUPPORT ?
			getEnhancer({
				chunked,
				chunkSize,
				retries,
				parallel,
				version,
				featureDetection,
				featureDetectionUrl,
				onFeaturesDetected,
				resume,
				deferLength,
				overrideMethod,
				sendDataOnCreate,
				storagePrefix,
				lockedRetryDelay,
				forgetOnSuccess,
				ignoreModifiedDateInStorage
			}, props.enhancer) :
			undefined,
		[
			props.enhancer,
			chunked,
			chunkSize,
			retries,
			parallel,
			version,
			featureDetection,
			featureDetectionUrl,
			onFeaturesDetected,
			resume,
			deferLength,
			overrideMethod,
			sendDataOnCreate,
			storagePrefix,
			lockedRetryDelay,
			forgetOnSuccess,
			ignoreModifiedDateInStorage
		]);

	return <Uploady {...uploadyProps} enhancer={enhancer}/>;
};

logWarning(CHUNKING_SUPPORT, "This browser doesn't support chunking. Consider using @rpldy/uploady instead");

export default TusUploady;

