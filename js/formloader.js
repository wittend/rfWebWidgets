//------------------------------------
// formLoader.js
//
// Code for the:   ubxcfg project.
// Created:        04/31/2019
// Copyright (c):  David M. Wittend II
//------------------------------------
/* jshint unused:           false       */

let jsonForm = function newForm(targetEl, formsrc)
{
    $(targetEl).load( formsrc, function(response, status, xhr)
    {
        if(status == "error")
        {
            let msg = "Sorry but there was an error: ";
            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
        }
    });
};