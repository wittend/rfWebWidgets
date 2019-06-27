//------------------------------------
// main.js
//
// Code for the:   rfWebWidgets project.
// Created:        2019/06/16
// Copyright (c):  David M. Witten II
//------------------------------------
// jshint unused:           false
// jshint undef:            false

//------------------------------------
// Auto load the debugger, if desired.
//------------------------------------
let DEBUG = true;
if(DEBUG)
{
    // Auto load the debugger
    nw.Window.get().showDevTools();
}

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
    let mm = new MainMenu();
    let topframe = `
    <div id='topFrame' class='topFrameClass'> 
        <div id='tabs'>
            <ul>
                <li><a href='#tabs-sigplot'>Signal Plot</a></li>
                <li><a href='#tabs-annotzoom'>Annotations & Zoom</a></li>
                <!--li><a href='#tabs-waterfall'>Waterfall / Panadaptor</a></li -->
                <li><a href='#tabs-config'>Config</a></li>
            </ul>
            <div id='tabs-sigplot' class='tabPanelClass'>
            </div>
            <div id='tabs-annotzoom' class='tabPanelClass'>
            </div>
            <div id='tabs-config' class='tabPanelClass'>
            </div>
        </div>
    </div>`;
    theBody.innerHTML = topframe;
    $('#tabs').tabs();
    $('#tabs').tabs('option', 'heightStyle', 'fill');

    // function to connect the interface buttons to the object when the map page is done loading.
    function connectBtns()
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
        // set initial mode
        document.querySelector('#x-rfpanafall-1').toolMode(modeEnum.DRAW);
    }
    
    let brd3;
    let A;
    let B;
    let C;
    let hyp;
    function showHyp( response, status, xhr )
    {
        brd3 = JXG.JSXGraph.initBoard('tabs-sigplot', {boundingbox: [-3, 3, 3, -3], keepaspectratio: true, showCopyright: false});
        A = brd3.create('point', [0, 1]);
        B = brd3.create('point', [1, 1]);
        C = brd3.create('point', [0, -1]);
        hyp = brd3.create('hyperbola', [A, B, C]);
    }

    loadForm('./html/tabformTracking.html', '#tabs-sigplot', '#tabBody', showHyp);
    loadForm('./html/tab-rfgraphtool.html', '#tabs-annotzoom', '#tabBody', connectBtns);
    loadForm('./html/tabform01.html', '#tabs-config', '#tabBody', null);
 
    loadStoreCfg();
    
    // Kick the debugger to make it wake up
    //---------------------------------------
    //debugger;
});


