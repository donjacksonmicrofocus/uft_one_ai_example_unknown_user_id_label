'===========================================================
'Function for getting the text in a textblock based on an anchor textblock passing in the anchor textblock text and the direction of the anchor textblock
'===========================================================
Function fnGetTextBlockFromTextBlockAnchor (TextBlockAnchor, Direction)

Dim AnchorDirection, BadValue

BadValue = FALSE

	Select Case trim(lcase(Direction))
		Case "up"
			AnchorDirection = micWithAnchorAbove 
		Case "down"
			AnchorDirection = micWithAnchorBelow
		Case "left"
			AnchorDirection = micWithAnchorOnLeft
		Case "right"
			AnchorDirection = micWithAnchorOnRight
		Case Else
			BadValue = TRUE
			Reporter.ReportEvent micFail, "GetTextBlockFromTextBlockAnchor", "The Direction passed in value " & Direction & " is not handled."
	End Select

	If BadValue Then
		fnGetTextBlockFromTextBlockAnchor = micFail
	Else
		fnGetTextBlockFromTextBlockAnchor = AIUtil.FindTextBlock(micAnyText, AnchorDirection, AIUtil.FindTextBlock(TextBlockAnchor)).GetText
	End If
	
End Function

'Declare variables that will be used in the script
Dim BrowserExecutable, oShell

'Statements to ensure that the OCR service that the AI Object Detection (AIOD) utilizes is running on the machine
Set oShell = CreateObject ("WSCript.shell")
oShell.run "powershell -command ""Start-Service mediaserver"""
Set oShell = Nothing

'Loop to close all open browsers
While Browser("CreationTime:=0").Exist(0)   													
	Browser("CreationTime:=0").Close 
Wend

'Set the BrowserExecutable variable to be the .exe for the browser declared in the datasheet
BrowserExecutable = Parameter.Item("BrowserName") & ".exe"

'Launch the browser specified in the data table
SystemUtil.Run BrowserExecutable,"","","",3												

'Set the variable for what application (in this case the browser) we are acting upon
Set AppContext=Browser("CreationTime:=0")												

'Clear the browser cache to ensure you're getting the latest forms from the application
AppContext.ClearCache																		

'Navigate to the application URL
AppContext.Navigate Parameter.Item("URL"	)

'Maximize the application to give the best chance that the fields will be visible on the screen
AppContext.Maximize																		

'Wait for the browser to stop spinning
AppContext.Sync																			

'Tell the AI engine to point at the application
AIUtil.SetContext AppContext																

'===========================================================================================
'BP:  Login
'===========================================================================================
AIUtil("profile").Click
AIUtil("field", fnGetTextBlockFromTextBlockAnchor ("Password", "down")).SetText "aidemo"

'===========================================================================================
'BP:  Logout
'===========================================================================================

'Close the application at the end of your script
'AppContext.Close							
