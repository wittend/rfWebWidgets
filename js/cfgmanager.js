//--------------------------------------------------------------
// cfgmanager.js
//
// Purpose:         eXtended <img> element with drawable
//                  canvas overlays.
//
// Date created:    2019-06-26
// Copyright (c):   David M. Witten II
//--------------------------------------------------------------
// jshint unused:           false
// jshint undef:            false

function loadStoreCfg()
{
    // Store screen position, size, and any other stuff you want
    //------------------------------------------------------------
    let lUDsizes;
    let lrsizes;
    let consizes;
    let output = '';
    if(localStorage)
    {
        if(localStorage.length)
        {
            for (let i = 0; i < localStorage.length; i++)
            {
                output += localStorage.key(i) + ': ' + localStorage.getItem(localStorage.key(i)) + '\n';
            }
        }
        else
        {
            // let pathName = process.cwd();
            let config =
            {
                //localImagePath:         process.env.PWD + '/noses',
                //localImageSavePath:     process.env.PWD + '/noses/edited/',
                //remoteWorklistURL:      'https://image.offa.org/stenotic_nares',
                //remoteStorageURL:       'https://image.offa.org/stenotic_nares/store',
                //showDebugConsole:       false,
                //showApplicationTab:     false,
                //showAdvancedTools:      false
            };
            localStorage.setItem('configData', JSON.stringify(config));
        }
    }
}