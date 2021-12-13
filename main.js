import { debug as ghactionDebug, error as ghactionError, getInput as ghactionGetInput, info as ghactionInformation, setSecret as ghactionSetSecret } from "@actions/core";
import { isJSON as adIsJSON, isString as adIsString } from "@hugoalh/advanced-determine";
import { stringParse as mmStringParse } from "@hugoalh/more-method";
const ghactionUserAgent = "TriggerPipedreamWorkflow.GitHubAction/2.1.0";
const rePipedreamSDKURL = /^https:\/\/sdk\.m\.pipedream\.net\/pipelines\/(?<key>[\da-zA-Z_-]+)\/events$/gu;
const rePipedreamWebhookURL = /^https:\/\/(?<key>[\da-zA-Z_-]+)\.m\.pipedream\.net$/gu;
/**
 * @private
 * @function $importInput
 * @param {string} key
 * @returns {string}
 */
function $importInput(key) {
	ghactionDebug(`Import input \`${key}\`.`);
	return ghactionGetInput(key);
};
(async () => {
	ghactionInformation(`Import inputs.`);
	let dryRun = mmStringParse($importInput("dryrun"));
	if (typeof dryRun !== "boolean") {
		throw new TypeError(`Input \`dryrun\` must be type of boolean!`);
	};
	let key = $importInput("key");
	if (!adIsString(key, { empty: false, singleLine: true })) {
		throw new TypeError(`Input \`key\` must be type of string (non-empty)!`);
	};
	let method = $importInput("method").toLowerCase();
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
	} else {
		throw new TypeError(`Input \`key\` must be type of string (non-empty)!`);
	};
	ghactionSetSecret(key);
	if (method !== "sdk" && method !== "webhook") {
		throw new SyntaxError(`Input \`method\`'s value is not in the list!`);
	};
	let payload = mmStringParse($importInput("payload"));
	if (!adIsJSON(payload)) {
		throw new TypeError(`Input \`payload\` must be type of JSON!`);
	};
	let payloadStringify = JSON.stringify(payload);
	if (dryRun) {
		ghactionInformation(`Payload Content: ${payloadStringify}`);
		let payloadFakeStringify = JSON.stringify({
			body: "bar",
			title: "foo",
			userId: 1
		});
		ghactionInformation(`Post network request to test service.`);
		const nodeFetch = (await import("node-fetch")).default;
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
		if (response.ok) {
			ghactionInformation(`Status Code: ${response.status}\nResponse: ${responseText}`);
		} else {
			throw new Error(`Status Code: ${response.status}\nResponse: ${responseText}`);
		};
	} else {
		ghactionDebug(`Payload Content: ${payloadStringify}`);
		if (method === "sdk") {
			ghactionInformation(`Post network request to Pipedream SDK.`);
			const axios = (await import("axios")).default;
			let response = await axios.request({
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
			if (response.statusText === "OK") {
				ghactionInformation(`Status Code: ${response.status}\nResponse: ${response.data}`);
			} else {
				throw new Error(`Status Code: ${response.status}\nResponse: ${response.data}`);
			};
		} else {
			ghactionInformation(`Post network request to Pipedream webhook.`);
			const nodeFetch = (await import("node-fetch")).default;
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
			if (response.ok) {
				ghactionInformation(`Status Code: ${response.status}\nResponse: ${responseText}`);
			} else {
				throw new Error(`Status Code: ${response.status}\nResponse: ${responseText}`);
			};
		};
	};
})().catch((reason) => {
	ghactionError(reason);
	process.exit(1);
});
