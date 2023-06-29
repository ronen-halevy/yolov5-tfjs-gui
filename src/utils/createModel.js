// import * as tf from '@tensorflow/tfjs';

export const createModel = (modelUrl, classNamesUrl) => {
	const modelPromise = tf.loadGraphModel(modelUrl);
	const anchorsPromise = fetch(anchorsUrl).then((response) => response.json());
	const classNamesPromise = fetch(classNamesUrl).then((x) => x.text());

	const promise = Promise.all([
		modelPromise,
		anchorsPromise,
		classNamesPromise,
	]);
	return promise;
};
