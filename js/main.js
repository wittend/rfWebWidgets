//------------------------------------
// main.js
//
// Code for the:   rfWebWidgets project.
// Created:        06/16/2019
// Copyright (c):  David M. Witten II
//------------------------------------
/* jshint unused:           false       */

//------------------------------------
// Auto load the debugger, if desired.
//------------------------------------
let DEBUG = false;
if(DEBUG)
{
    // Auto load the debugger
    nw.Window.get().showDevTools();
}

//------------------------------------
// formLoader()
//------------------------------------
function formLoader(srcURL, targetEl, fragEl, onSuccess)
{
    let tEl = '#' + targetEl;
    let sEl = srcURL + ' #' + fragEl;
    $(tEl).load(sEl, onSuccess);
}

//------------------------------------
// pLoad()
//------------------------------------
function pLoad(srcURL, targetEl, fragEl, onSuccess)
{
    let tEl = '#' + targetEl;
    let sEl = srcURL + ' #' + fragEl;
    return new Promise((resolve, reject) =>
    {
        $(tEl).load(sEl,
                    function ()
                    {
                        document.querySelector('#btnDivMeasure').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.MEASURE);
                        });
                        
                        document.querySelector('#btnDivMagnify').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.MAGGLASS);
                        });
                        
                        document.querySelector('#btnDivDraw').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.DRAW);
                        });
                        
                        document.querySelector('#btnDivReset').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.RESET);
                        });
                        
                        document.querySelector('#btnDivHideAll').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').hideAll();
                        });
                        
                        document.querySelector('#btnDivClearAll').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').clearAll();
                        });
                        
                        document.querySelector('#btnDivShowAll').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').showAll();
                        });
                        
                        document.querySelector('#btnDivPrintCurrent').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').printCurrent();
                        });
                        
                        document.querySelector('#btnDivPrintAll').addEventListener('click', function(e)
                        {                                                              
                            document.querySelector('#x-rfpanafall-1').printAll();
                        });
                        // Set the id of the canvas to show the zoomed region
                        document.querySelector('#x-rfpanafall-1').frameDiv.extView =  document.querySelector('#asideMagCanvas');
                        //$('#xt-image-id')[0].nostrilRightText($('#rightNostril'));

                        // set initial mode
                        document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.DRAW);
                    });
    });
}

//------------------------------------
// formLoader4()
//------------------------------------
async function formLoader4(srcURL, targetEl, fragEl, onSuccess)
{
    let doneness = await pLoad(srcURL, targetEl, fragEl, onSuccess);
}

/*
 * Replicates the functionality of jQuery's `load` function, 
 * used to load some HTML from another file into the current one.
 * 
 * Based on this Stack Overflow answer:
 * https://stackoverflow.com/a/38132775/3626537
 * And `fetch` documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * 
 * @param {string} parentElementId - The ID of the DOM element to load into
 * @param {string} htmlFilePath - The path of the HTML file to load
 */
const loadHtml = function(parentElementId, filePath)
{
    const init =
    {
        method : "GET",
        headers : { "Content-Type" : "text/html" },
        mode : "cors",
        cache : "default"
    };
    const req = new Request(filePath, init);
    fetch(req)
        .then(function(response)
        {
            return response.text();
        })
        .then(function(body)
        {
            // Replace `#` char in case the function gets called `querySelector` or jQuery style
            if (parentElementId.startsWith("#"))
            {
                parentElementId.replace("#", "");
            }
            document.getElementById(parentElementId).innerHTML = body;
        });
};

////------------------------------------
//// possible alternative:
////------------------------------------
//fetch('/somepage')
//    .then(function(response)
//    {
//        return response.text();
//    })
//    .then(function(body)
//    {
//        document.querySelector('#div').innerHTML = body;
//    });
//

//------------------------------------
// docReady()
//------------------------------------
//function docReady()
$(document).ready(function()
{
    // Kick the debugger to make it wake up
    //---------------------------------------
    //debugger;
    
   // put all code that executes on startup here.
    // console.log('========= docReady =========');
    let mm = new MainMenu();
    let topframe = `
    <div id='topFrame' class='builder-topframe'> 
        <div id='tabs'>
            <ul>
                <li><a href='#tabs-sigplot'>Signal Plot</a></li>
                <li><a href='#tabs-annotzoom'>Annotations & Zoom</a></li>
                <!--li><a href='#tabs-waterfall'>Waterfall / Panadaptor</a></li -->
                <li><a href='#tabs-config'>Config</a></li>
            </ul>
            <div id='tabs-sigplot'>
            </div>
            <div id='tabs-annotzoom'>
            </div>
            <!--div id='tabs-waterfall'>
            </div-->
            <div id='tabs-config'>
            </div>
        </div>
    </div>`;
    theBody.innerHTML = topframe;
    $('#tabs').tabs();
    $('#tabs').tabs('option', 'heightStyle', 'fill');

    let brd3;
    let A;
    let B;
    let C;
    let hyp;
    formLoader('./html/tabformTracking.html', 'tabs-sigplot', 'panelSigPlot', function( response, status, xhr )
        {
            brd3 = JXG.JSXGraph.initBoard('tabs-sigplot', {boundingbox: [-3, 3, 3, -3], keepaspectratio: true, showCopyright: false});
            A = brd3.create('point', [0, 1]);
            B = brd3.create('point', [1, 1]);
            C = brd3.create('point', [0, -1]);
            hyp = brd3.create('hyperbola', [A, B, C]);
        }
    );
    formLoader4('./html/tab-rfgraphtool.html', 'tabs-annotzoom', 'waterfalls');     
    //formLoader4('./html/tab-panafall.html', 'tabs-waterfall', 'panafall');
    formLoader('./html/tabform01.html', 'tabs-config', 'panelGrid1', null);
    
    // Kick the debugger to make it wake up
    //---------------------------------------
    //debugger;
    
    // Store secrrn position, size, and any other stuff you want
    //-----------------------------------------------------------0
    let lUDsizes;
    let lrsizes;
    let consizes;
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
});


