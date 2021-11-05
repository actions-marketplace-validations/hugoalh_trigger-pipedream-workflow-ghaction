param (
	[Parameter()][string]$dryRun,
	[Parameter(Mandatory = $true, Position = 1)][ValidatePattern("^([\da-zA-Z_-]+|https:\/\/[\da-zA-Z_-]+\.m\.pipedream\.net)$")][string]$key,
	[Parameter(Mandatory = $true, Position = 2, ValueFromPipeline = $true)][ValidateNotNullOrEmpty()][string]$payload
)
$rePipedreamWebhookURL = "^https:\/\/(?<key>[\da-zA-Z_-]+)\.m\.pipedream\.net$"
$dryRunBoolean = [bool]::Parse($dryRun)
if ($key -match $rePipedreamWebhookURL) {
	$key = $key.Replace($rePipedreamWebhookURL, '$key')
}
$payloadStringify = (ConvertFrom-Json -InputObject $payload -Depth 100 | ConvertTo-Json -Depth 100 -Compress)
$ghactionUserAgent = "TriggerPipedreamWorkflow.GitHubAction/2.0.0"
if ($dryRunBoolean -eq $true) {
	Write-Output -InputObject "Payload Content: $payloadStringify"
	$payloadFakeStringify = (ConvertFrom-Json -InputObject '{"body": "bar", "title": "foo", "userId": 1}' -Depth 100 | ConvertTo-Json -Depth 100 -Compress)
	Write-Output -InputObject "Post network request to test service."
	Invoke-WebRequest -UseBasicParsing -Uri "https://jsonplaceholder.typicode.com/posts" -UserAgent $ghactionUserAgent -MaximumRedirection 5 -Method Post -Body $payloadFakeStringify -ContentType "application/json; charset=utf-8"
} else {
	Write-Output -InputObject "::debug::Payload Content: $payloadStringify"
	Write-Output -InputObject "Post network request to Pipedream webhook."
	Invoke-WebRequest -UseBasicParsing -Uri "https://$key.m.pipedream.net" -UserAgent $ghactionUserAgent -MaximumRedirection 5 -Method Post -Body $payloadStringify -ContentType "application/json; charset=utf-8"
}
