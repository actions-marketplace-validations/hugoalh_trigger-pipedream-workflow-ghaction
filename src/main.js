import { Chalk } from "chalk";
import { endGroup as ghactionsEndGroup, error as ghactionsError, getInput as ghactionsGetInput, setOutput as ghactionsSetOutput, setSecret as ghactionsSetSecret, startGroup as ghactionsStartGroup } from "@actions/core";
import { isJSON as adIsJSON, isString as adIsString, isStringifyJSON as adIsStringifyJSON } from "@hugoalh/advanced-determine";
import nodeFetch from "node-fetch";
import yaml from "yaml";
try {
	const chalk = new Chalk({ level: 3 });
	const pipedreamKeyRegExp = /^(?<key>(?:[\da-zA-Z][\da-zA-Z_-]*)?[\da-zA-Z])$/u;
	const pipedreamSDKURLRegExp = /^https:\/\/sdk\.m\.pipedream\.net\/pipelines\/(?<key>(?:[\da-zA-Z][\da-zA-Z_-]*)?[\da-zA-Z])\/events$/u;
	const pipedreamWebhookURLRegExp = /^https:\/\/(?<key>(?:[\da-zA-Z][\da-zA-Z_-]*)?[\da-zA-Z])\.m\.pipedream\.net$/gu;
	ghactionsStartGroup(`Import inputs.`);
	let keyRaw = ghactionsGetInput("key");
	let method = ghactionsGetInput("method").toLowerCase();
	let key;
	if (adIsString(keyRaw, { pattern: pipedreamKeyRegExp })) {
		key = keyRaw;
		if (method.length === 0) {
			method = "sdk";
		}
	} else if (adIsString(keyRaw, { pattern: pipedreamSDKURLRegExp })) {
		key = keyRaw.match(pipedreamSDKURLRegExp).groups.key;
		if (method.length === 0) {
			method = "sdk";
		}
	} else if (adIsString(keyRaw, { pattern: pipedreamWebhookURLRegExp })) {
		key = keyRaw.match(pipedreamWebhookURLRegExp).groups.key;
		if (method.length === 0) {
			method = "webhook";
		}
	} else {
		throw new TypeError(`Input \`key\` is not a valid Pipedream SDK or webhook key!`);
	}
	ghactionsSetSecret(key);
	if (method !== "sdk" && method !== "webhook") {
		throw new SyntaxError(`\`${method}\` is not a valid method!`);
	}
	console.log(`${chalk.bold("Method:")} ${method}`);
	let payloadRaw = ghactionsGetInput("payload");
	let payload = adIsStringifyJSON(payloadRaw, { arrayRoot: false }) ? JSON.parse(payloadRaw) : yaml.parse(payloadRaw);
	if (!adIsJSON(payload, { arrayRoot: false })) {
		throw new TypeError(`\`${payload}\` is not a valid Pipedream SDK or webhook JSON/YAML/YML payload!`);
	}
	let payloadStringify = JSON.stringify(payload);
	console.log(`${chalk.bold("Payload:")} ${payloadStringify}`);
	ghactionsEndGroup();
	ghactionsStartGroup(`Post network request to Pipedream.`);
	let response = await nodeFetch((method === "sdk") ? `https://sdk.m.pipedream.net/pipelines/${key}/events` : `https://${key}.m.pipedream.net`, {
		body: (method === "sdk") ? JSON.stringify({ "raw_event": payload }) : payloadStringify,
		follow: 1,
		headers: (method === "sdk") ? {
			"Content-Type": "application/json",
			"User-Agent": "pdsdk:javascript/1",
			"x-pd-sdk-version": "0.3.2"
		} : {
			"Content-Type": "application/json",
			"User-Agent": `TriggerPipedreamWorkflow.GitHubAction/3.0.0 NodeJS/${process.versions.node}-${process.platform}-${process.arch}`
		},
		method: "POST",
		redirect: "follow"
	}).catch((reason) => {
		throw new Error(`Unexpected web request issue: ${reason?.message ?? reason}`);
	});
	let responseText = await response.text();
	ghactionsSetOutput("response", responseText);
	ghactionsSetOutput("status_code", response.status);
	ghactionsSetOutput("status_ok", response.ok);
	ghactionsSetOutput("status_text", response.statusText);
	if (!response.ok) {
		throw new Error(`Unexpected response status \`${response.status} ${response.statusText}\`: ${responseText}`);
	}
	console.log(`${chalk.bold("Response Status:")} ${response.status} ${response.statusText}`);
	console.log(`${chalk.bold("Response Content:")} ${responseText}`);
	ghactionsEndGroup();
} catch (error) {
	ghactionsError(error?.message ?? error);
	ghactionsEndGroup();
	process.exit(1);
}
