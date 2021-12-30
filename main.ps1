param (
	[Parameter()][boolean]$DryRun,
	[Parameter(Mandatory = $true, Position = 1)][ValidatePattern('^([\da-zA-Z_-]+|https:\/\/[\da-zA-Z_-]+\.m\.pipedream\.net)$')][string]$Key,
	[Parameter(Mandatory = $true, Position = 2, ValueFromPipeline = $true)][ValidateNotNullOrEmpty()][string]$Payload
)
Import-Module -Name 'hugoalh.GitHubActionsToolkit' -Scope Local
[string]$GHActionUserAgent = 'TriggerPipedreamWorkflow.GitHubAction/2.1.0'
[string]$REPipedreamWebhookURL = '^https:\/\/(?<Key>[\da-zA-Z_-]+)\.m\.pipedream\.net$'
if ($Key -cmatch $REPipedreamWebhookURL) {
	$Key -creplace $REPipedreamWebhookURL,'${Key}'
}
Add-GHActionsSecretMask -Value $Key
[string]$PayloadStringify = (ConvertFrom-Json -InputObject $Payload -Depth 100 | ConvertTo-Json -Compress -Depth 100)
if ($DryRun) {
	Write-Host -Object "Payload Content: $PayloadStringify"
	[string]$PayloadFakeStringify = (ConvertFrom-Json -InputObject '{"body": "bar", "title": "foo", "userId": 1}' -Depth 100 | ConvertTo-Json -Compress -Depth 100)
	Write-Host -Object "Post network request to test service."
	[pscustomobject]$Response = Invoke-WebRequest -UseBasicParsing -Uri 'https://jsonplaceholder.typicode.com/posts' -UserAgent $GHActionUserAgent -MaximumRedirection 5 -Method Post -Body $PayloadFakeStringify -ContentType 'application/json; charset=utf-8'
	$Response.PSObject.Properties | ForEach-Object -Process {
		Enter-GHActionsLogGroup -Title $_.Name
		Write-Host -Object "$($_.Value | ConvertTo-Json -Compress -Depth 100)"
		Exit-GHActionsLogGroup
	}
} else {
	Write-GHActionsDebug -Message "Payload Content: $PayloadStringify"
	Write-Host -Object 'Post network request to Pipedream webhook.'
	[pscustomobject]$Response = Invoke-WebRequest -UseBasicParsing -Uri "https://$Key.m.pipedream.net" -UserAgent $GHActionUserAgent -MaximumRedirection 5 -Method Post -Body $PayloadStringify -ContentType 'application/json; charset=utf-8'
	$Response.PSObject.Properties | ForEach-Object -Process {
		Enter-GHActionsLogGroup -Title $_.Name
		Write-GHActionsDebug -Message ($_.Value | ConvertTo-Json -Compress -Depth 100)
		Exit-GHActionsLogGroup
	}
}
