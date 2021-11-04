import { debug as ghactionCoreDebug, error as ghactionCoreError, getInput as ghactionCoreGetInput, info as ghactionCoreInformation, setSecret as ghactionCoreSetSecret } from "@actions/core";
import { isJSON as adIsJSON, isString as adIsString } from "@hugoalh/advanced-determine";
import { stringParse as mmStringParse } from "@hugoalh/more-method";
import nodeFetch from "node-fetch";
const ghactionUserAgent = "TriggerPipedreamWorkflow.GitHubAction/2.0.0";
let rePipedreamSDKURL = /^https:\/\/sdk\.m\.pipedream\.net\/pipelines\/(?<key>[-0-9_a-z]+)\/events$/giu;
let rePipedreamWebhookURL = /^https:\/\/(?<key>[-0-9_a-z]+)\.m\.pipedream\.net$/giu;
/**
 * @private
 * @function $importInput
 * @param {string} key
 * @returns {string}
 */
function $importInput(key) {
	ghactionCoreDebug(`Import input \`${key}\`.`);
	return ghactionCoreGetInput(key);
};
/**
 * @private
 * @async @function pipedreamSDKRework
 * @param {string} key
 * @param {object} [payload]
 * @returns {Promise<any>}
 */
async function pipedreamSDKRework(key, payload = {}) {
	const axios = (await import("axios")).default;
	return axios.request({
		data: JSON.stringify({
			"raw_event": payload
		}),
		headers: {
			"content-type": "application/json",
			"user-agent": "pdsdk:javascript/1",
			"x-pd-sdk-version": "0.3.2"
		},
		method: "post",
		url: `https://sdk.m.pipedream.net/pipelines/${key}/events`
	});
};
(async () => {
	ghactionCoreInformation(`Import inputs.`);
	let dryRun = mmStringParse($importInput("dryrun"));
	if (typeof dryRun !== "boolean") {
		throw new TypeError(`Input \`dryrun\` must be type of boolean!`);
	};
	let key = $importInput("key");
	if (adIsString(key, { singleLine: true }) !== true) {
		throw new TypeError(`Input \`key\` must be type of string (non-nullable)!`);
	};
	let method = $importInput("method").toLowerCase();
	if (adIsString(method, { singleLine: true }) === false) {
		throw new TypeError(`Input \`method\` must be type of string!`);
	};
	if (
		key.search(/^[\da-z_-]+$/giu) === 0 ||
		key.search(rePipedreamSDKURL) === 0
	) {
		key = key.replace(rePipedreamSDKURL, "$<key>");
		if (method.length === 0) {
			method = "sdk";
		};
	} else if (key.search(rePipedreamWebhookURL) === 0) {
		key = key.replace(rePipedreamWebhookURL, "$<key>");
		if (method.length === 0) {
			method = "webhook";
		};
	};
	ghactionCoreSetSecret(key);
	if (method !== "sdk" && method !== "webhook") {
		throw new SyntaxError(`Input \`method\`'s value is not in the list!`);
	};
	let payload = mmStringParse($importInput("payload"));
	if (adIsJSON(payload) === false) {
		throw new TypeError(`Input \`payload\` must be type of JSON!`);
	};
	let payloadStringify = JSON.stringify(payload);
	if (dryRun === true) {
		ghactionCoreInformation(`Payload Content: ${payloadStringify}`);
		let payloadFakeStringify = JSON.stringify({
			body: "bar",
			title: "foo",
			userId: 1
		});
		ghactionCoreInformation(`Post network request to test service.`);
		let response = await nodeFetch(
			`https://jsonplaceholder.typicode.com/posts`,
			{
				body: payloadFakeStringify,
				follow: 5,
				headers: {
					"Content-Type": "application/json",
					"User-Agent": ghactionUserAgent
				},
				method: "POST",
				redirect: "follow"
			}
		);
		let responseText = await response.text();
		if (response.ok === true) {
			ghactionCoreInformation(`Status Code: ${response.status}\nResponse: ${responseText}`);
		} else {
			throw new Error(`Status Code: ${response.status}\nResponse: ${responseText}`);
		};
	} else {
		ghactionCoreDebug(`Payload Content: ${payloadStringify}`);
		if (method === "sdk") {
			ghactionCoreInformation(`Post network request to Pipedream SDK.`);
			let response = await pipedreamSDKRework(key, payload);
			if (response.statusText === "OK") {
				ghactionCoreInformation(`Status Code: ${response.status}\nResponse: ${response.data}`);
			} else {
				throw new Error(`Status Code: ${response.status}\nResponse: ${response.data}`);
			};
		} else {
			ghactionCoreInformation(`Post network request to Pipedream webhook.`);
			let response = await nodeFetch(
				`https://${key}.m.pipedream.net`,
				{
					body: payloadStringify,
					follow: 5,
					headers: {
						"Content-Type": "application/json",
						"User-Agent": ghactionUserAgent
					},
					method: "POST",
					redirect: "follow"
				}
			);
			let responseText = await response.text();
			if (response.ok === true) {
				ghactionCoreInformation(`Status Code: ${response.status}\nResponse: ${responseText}`);
			} else {
				throw new Error(`Status Code: ${response.status}\nResponse: ${responseText}`);
			};
		};
	};
})().catch((reason) => {
	ghactionCoreError(reason);
	process.exit(1);
});
