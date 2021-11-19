param (
	[Parameter()][boolean]$DryRun,
	[Parameter(Mandatory = $true, Position = 1)][ValidatePattern("^([\da-zA-Z_-]+|https:\/\/[\da-zA-Z_-]+\.m\.pipedream\.net)$")][string]$Key,
	[Parameter(Mandatory = $true, Position = 2, ValueFromPipeline = $true)][ValidateNotNullOrEmpty()][string]$Payload
)
$GHActionUserAgent = "TriggerPipedreamWorkflow.GitHubAction/2.0.1"
$REPipedreamWebhookURL = "^https:\/\/(?<Key>[\da-zA-Z_-]+)\.m\.pipedream\.net$"
if ($Key -cmatch $REPipedreamWebhookURL) {
	$Key -creplace $REPipedreamWebhookURL,'${Key}'
}
Write-Output -InputObject "::add-mask::$Key"
$PayloadStringify = (ConvertFrom-Json -InputObject $Payload -Depth 100 | ConvertTo-Json -Depth 100 -Compress)
if ($DryRun -eq $true) {
	Write-Output -InputObject "Payload Content: $PayloadStringify"
	$PayloadFakeStringify = (ConvertFrom-Json -InputObject '{"body": "bar", "title": "foo", "userId": 1}' -Depth 100 | ConvertTo-Json -Depth 100 -Compress)
	Write-Output -InputObject "Post network request to test service."
	$Response = Invoke-WebRequest -UseBasicParsing -Uri "https://jsonplaceholder.typicode.com/posts" -UserAgent $GHActionUserAgent -MaximumRedirection 5 -Method Post -Body $PayloadFakeStringify -ContentType "application/json; charset=utf-8"
	$Response.PSObject.Properties | ForEach-Object {
		Write-Output -InputObject "::group::$($_.Name)"
		Write-Output -InputObject "$($_.Value | ConvertTo-Json -Depth 100 -Compress)"
		Write-Output -InputObject "::endgroup::"
	}
} else {
	Write-Output -InputObject "::debug::Payload Content: $PayloadStringify"
	Write-Output -InputObject "Post network request to Pipedream webhook."
	$Response = Invoke-WebRequest -UseBasicParsing -Uri "https://$Key.m.pipedream.net" -UserAgent $GHActionUserAgent -MaximumRedirection 5 -Method Post -Body $PayloadStringify -ContentType "application/json; charset=utf-8"
	$Response.PSObject.Properties | ForEach-Object {
		Write-Output -InputObject "::group::$($_.Name)"
		Write-Output -InputObject "::debug::$($_.Value | ConvertTo-Json -Depth 100 -Compress)"
		Write-Output -InputObject "::endgroup::"
	}
}
