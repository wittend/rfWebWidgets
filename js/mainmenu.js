//--------------------------------------------------------------
// mainmenu.js
//
// Code for the:   ubxcfg project.
// Created:        04/31/2019
// Copyright (c):  David M. Wittend II
//--------------------------------------------------------------
/* jshint unused:           false       */

let MainMenu = function _mainmenu()
{
    // Create a tray icon
    // Create an empty menubar
    let menu = new nw.Menu({type: 'menubar'});
    
    function createSubMenu()
    {
        
    }
    
    // Create a submenu as the 2nd level menu
    let filemenu = new nw.Menu();
    
    let ifile = new nw.MenuItem(
    {
        label: 'Input File',
        click: function() 
        {
            console.log("clicked Input File");
            chooseInFile('#fileDialog');
            //document.getElementById("input-file").innerHTML = " Input: ";
        },
    });
    filemenu.append( ifile );
    
    let ofile = new nw.MenuItem(
    {
        label: 'Output File',
        click: function() 
        {
            console.log("clicked Output File");
            chooseOutFile('#fileDialog');
            //document.getElementById("output-file").innerHTML = "Output: ";
        },
    });
    filemenu.append( ofile );
    
    let qquit = new nw.MenuItem(
    {
        label: 'Quit',
        click: function() 
        {
            console.log("Goodbye");
            nw.App.quit();
        },
    });
    filemenu.append( qquit );
    
    // Create a submenu as the 2nd level menu
    let editmenu = new nw.Menu();
    let eundo = new nw.MenuItem(
    {
        label: 'Undo',
        click: function() 
        {
            console.log("clicked Edit");
            //modal.style.display = "block";    
        },
    });
    editmenu.append(eundo);

    let eredo = new nw.MenuItem(
    {
        label: 'Redo',
        click: function() 
        {
            console.log("clicked Edit");
            //modal.style.display = "block";    
        },
    });
    editmenu.append(eredo);

    let ecut = new nw.MenuItem(
    {
        label: 'Cut',
        click: function() 
        {
            console.log("clicked Cut");
            //modal.style.display = "block";    
        },
    });
    editmenu.append(ecut);

    let ecopy = new nw.MenuItem(
    {
        label: 'Copy',
        click: function() 
        {
            console.log("clicked Copy");
            //modal.style.display = "block";    
        },
    });
    editmenu.append(ecopy);

    let epaste = new nw.MenuItem(
    {
        label: 'Paste',
        click: function() 
        {
            console.log("clicked Paste");
            //modal.style.display = "block";    
        },
    });
    editmenu.append(epaste);

    // Create a submenu as the 2nd level menu
    let toolmenu = new nw.Menu();
    let toptions = new nw.MenuItem(
    {
        label: 'Options',
        click: function() 
        {
            console.log("clicked Tools");
            //modal.style.display = "block";    
        },
    });
    toolmenu.append(toptions);

    // Create a submenu as the 2nd level menu
    let tPrefs = new nw.MenuItem(
    {
        label: 'Preferences',
        click: function() 
        {
            console.log("clicked Tools > Preferences");
            //modal.style.display = "block";    
        },
    });
    toolmenu.append(tPrefs);

    // Create a submenu as the 3rd level menu
    let helpmenu = new nw.Menu();
    let hHelp = new nw.MenuItem(
    {
        label: 'View Help',
        click: function() 
        {
            console.log("clicked View Help");
            modal.style.display = "block";    
        },
    });
    helpmenu.append( hHelp );
    
    let hAbout = new nw.MenuItem(
    { 
        label: 'About',
        click: function() 
        {
            console.log("clicked About");
            modal.style.display = "block";    
        },
    });
    helpmenu.append(hAbout);
    
    // Create and append the 1st level menu to the menubar
    menu.append(new nw.MenuItem(
    {
        label: 'File',
        submenu: filemenu
    }));
 
     // Create and append the 1st level menu to the menubar
    menu.append(new nw.MenuItem(
    {
        label: 'Edit',
        submenu: editmenu
    }));
    
    // Create and append the 1st level menu to the menubar
    menu.append(new nw.MenuItem(
    {
        label: 'Tools',
        submenu: toolmenu
    }));
    
    // Create and append the 1st level menu to the menubar
    menu.append(new nw.MenuItem(
    {
        label: 'Help',
        submenu: helpmenu
    }));
    
    // Assign it to `window.menu` to get the menu displayed
    nw.Window.get().menu = menu;
    
    // Get the modal
    let modal = document.getElementById('aboutDlg');
    
    // Get the <span> element that closes the modal
    // let newSpan = document.getElementsByClassName("close")[0];
    // let newSpan = document.createElement('span');
    let newSpan = `<div id='aboutDlg' class='modal'>
            <!-- Modal content -->
            <div class='modal-content'>
                <span class='close'>&times;</span>
                <h2>Example Program</h2>
                <p>by David R. Larsen, Copyright May 10, 2018</p>
                <p id='os-string'></p>
            </div>
        </div>`;
    
    
    // When the user clicks on <span> (x), close the modal
    newSpan.onclick = function() 
    {
        modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) 
    // this.onclick = function(event) 
    window.addEventListener("click", function()
    {
        if (event.target == modal) 
        {
            modal.style.display = "none";
        }
    });
    
    let chooseInFile = function(name1) 
    {
        let chooser1 = document.querySelector(name1);
        chooser1.addEventListener("change", function() 
        {
            testout = this.value;
            console.log(testout);
            document.getElementById("input-file").innerHTML = " Input: " + String(testout);
        }, false);
        chooser1.click();  
    };
    
    let chooseOutFile = function (name2) 
    {
        let chooser2 = document.querySelector(name2);
        chooser2.addEventListener("change", function() 
        {
            console.log(this.value);
            document.getElementById("output-file").innerHTML = " Output: " + String(this.value);
        }, false);
        chooser2.click();  
    };
    
    return menu;
};
// get the system platform using node.js
// let os = require('os');
// document.getElementById("os-string").innerHTML = "OS: "+ os.platform();

