// @flow

const isFunction = (f: mixed): boolean %checks => typeof (f) === "function";

const getPropsExtractor = (prop: string | string[]) => {
	const props = [].concat(prop);

	return (arr: Object[]) =>
		arr.map((i) => props.map((p) => i[p]).join());
};

/*
stringifies props together - will return true for same type of value (ex: function)
even if refs are different
 */
const isSamePropInArrays = (arr1: Object[], arr2: Object[], prop: string | string[]): boolean => {
	let diff = true;
	const propsExtractor = getPropsExtractor(prop);

	if (arr1 && arr2 && arr1.length === arr2.length) {
		const props1 = propsExtractor(arr1), // arr1.map((i) => props.map((p)=> i[p]).join()),
			props2 = propsExtractor(arr2); //.map((i) => props.map((p)=> i[p]).join());

		diff = !!props1.find((p, i) => p !== props2[i]);
	}

	return !diff;
};

export {
	isFunction,
	isSamePropInArrays,
};