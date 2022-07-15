import { Chalk } from "chalk";
import { endGroup as ghactionsEndGroup, error as ghactionsError, getInput as ghactionsGetInput, info as ghactionsInformation, setSecret as ghactionsSetSecret, startGroup as ghactionsStartGroup } from "@actions/core";
import { isJSON as adIsJSON, isString as adIsString } from "@hugoalh/advanced-determine";
import yaml from "yaml";
const ghactionsChalk = new Chalk({ level: 3 });
const pipedreamSDKURLRegExp = /^https:\/\/sdk\.m\.pipedream\.net\/pipelines\/(?<key>[\da-zA-Z_-]+)\/events$/gu;
const pipedreamWebhookURLRegExp = /^https:\/\/(?<key>[\da-zA-Z_-]+)\.m\.pipedream\.net$/gu;
(async () => {
	ghactionsStartGroup(`Import inputs.`);
	let key = ghactionsGetInput("key");
	if (!adIsString(key, {
		empty: false,
		singleLine: true
	})) {
		throw new TypeError(`Input \`key\` must be type of string (non-empty)!`);
	};
	let method = ghactionsGetInput("method").toLowerCase();
	if (
		key.search(/^[\da-z_-]+$/giu) === 0 ||
		key.search(pipedreamSDKURLRegExp) === 0
	) {
		key = key.replace(pipedreamSDKURLRegExp, "$<key>");
		if (method.length === 0) {
			method = "sdk";
		};
	} else if (key.search(pipedreamWebhookURLRegExp) === 0) {
		key = key.replace(pipedreamWebhookURLRegExp, "$<key>");
		if (method.length === 0) {
			method = "webhook";
		};
	} else {
		throw new TypeError(`Input \`key\` is not a valid Pipedream key!`);
	};
	ghactionsSetSecret(key);
	if (method !== "sdk" && method !== "webhook") {
		throw new SyntaxError(`Input \`method\`'s value \`${method}\` is not a valid Pipedream trigger method!`);
	};
	let payload = yaml.parse(ghactionsGetInput("payload"));
	if (!adIsJSON(payload)) {
		throw new TypeError(`\`${payload}\` is not a valid Pipedream JSON/YAML/YML payload!`);
	};
	let payloadStringify = JSON.stringify(payload);
	ghactionsInformation(`${ghactionsChalk.bold("Method:")} ${method}`);
	ghactionsInformation(`${ghactionsChalk.bold("Payload Content:")} ${payloadStringify}`);
	ghactionsEndGroup();
	ghactionsStartGroup(`Post network request to Pipedream.`);
	if (method === "sdk") {
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
		let result = `${ghactionsChalk.bold("Status Code:")} ${response.status}\n${ghactionsChalk.bold("Response:")} ${response.data}`;
		if (response.statusText !== "OK") {
			throw new Error(result);
		};
		ghactionsInformation(result);
	} else {
		const nodeFetch = (await import("node-fetch")).default;
		let response = await nodeFetch(
			`https://${key}.m.pipedream.net`,
			{
				body: payloadStringify,
				follow: 1,
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "TriggerPipedreamWorkflow.GitHubAction/2.2.0"
				},
				method: "POST",
				redirect: "follow"
			}
		);
		let responseText = await response.text();
		let result = `${ghactionsChalk.bold("Status Code:")} ${response.status}\n${ghactionsChalk.bold("Response:")} ${responseText}`;
		if (!response.ok) {
			throw new Error(result);
		};
		ghactionsInformation(result);
	};
	ghactionsEndGroup();
})().catch((reason) => {
	ghactionsError(reason);
	ghactionsEndGroup();
	process.exit(1);
});
