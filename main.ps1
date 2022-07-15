#Requires -PSEdition Core
#Requires -Version 7.2
Param (
	[Parameter(Mandatory = $True, Position = 1)][ValidatePattern('^([\da-zA-Z_-]+|https:\/\/[\da-zA-Z_-]+\.m\.pipedream\.net)$', ErrorMessage = 'Input `key` is not a valid Pipedream key!')][String]$Key,
	[Parameter(Mandatory = $True, Position = 2)][String]$Payload
)
Import-Module -Name 'hugoalh.GitHubActionsToolkit' -Scope 'Local'
[RegEx]$PipedreamWebhookURLRegEx = '^https:\/\/(?<Key>[\da-zA-Z_-]+)\.m\.pipedream\.net$'
Enter-GitHubActionsLogGroup -Title 'Import inputs.'
If ($Key -imatch $PipedreamWebhookURLRegEx) {
	$Key = $Key -ireplace $PipedreamWebhookURLRegEx, '${Key}'
}
Add-GitHubActionsSecretMask -Value $Key
Try {
	[String]$PayloadStringify = ($Payload | ConvertFrom-Json -Depth 100 | ConvertTo-Json -Depth 100 -Compress)
} Catch {
	Write-GitHubActionsFail -Message "``$Payload`` is not a valid Pipedream JSON payload!"
}
Write-Host -Object "$($PSStyle.Bold)Payload Content:$($PSStyle.Reset) $PayloadStringify"
Exit-GitHubActionsLogGroup
Enter-GitHubActionsLogGroup -Title 'Post network request to Pipedream.'
Invoke-WebRequest -Uri "https://$Key.m.pipedream.net" -UseBasicParsing -UserAgent 'TriggerPipedreamWorkflow.GitHubAction/2.2.0' -MaximumRedirection 1 -MaximumRetryCount 5 -RetryIntervalSec 5 -Method 'Post' -Body $PayloadStringify -ContentType 'application/json; charset=utf-8' | Format-List -Property '*' | Out-String
Exit-GitHubActionsLogGroup
