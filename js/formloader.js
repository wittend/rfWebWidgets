//------------------------------------
// formLoader.js
//
// Code for the:   rfWebWidgets project.
// Created:        2019/06/24
// Copyright (c):  David M. Witten II
//------------------------------------
// jshint esversion:        6
// jshint unused:           false
// jshint undef:            false

//let jsonForm = function newForm(targetEl, formsrc)
//{
//    $(targetEl).load( formsrc, function(response, status, xhr)
//    {
//        if(status == "error")
//        {
//            let msg = "Sorry but there was an error: ";
//            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
//        }
//    });
//};

// ----------------------------------------------------------------------------------
// Replicates the functionality of jQuery's `load` function,
// used to load some HTML from another file into the current one.
//
// Based on this Stack Overflow answer:
// https://stackoverflow.com/a/38132775/3626537
// And `fetch` documentation:
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
//
// @param {string} parentElementId - The ID of the DOM element to load into
// @param {string} htmlFilePath - The path of the HTML file to load
// ----------------------------------------------------------------------------------
// const loadHtml = function(parentElementId, filePath)
// {
//     const init =
//     {
//         method : "GET",
//         headers : { "Content-Type" : "text/html" },
//         mode : "cors",
//         cache : "default"
//     };
//     const req = new Request(filePath, init);
//     fetch(req)
//         .then(function(response)
//         {
//             return response.text();
//         })
//         .then(function(body)
//         {
//             // Replace `#` char in case the function gets called `querySelector` or jQuery style
//             if (parentElementId.startsWith("#"))
//             {
//                 parentElementId.replace("#", "");
//             }
//             document.getElementById(parentElementId).innerHTML = body;
//         });
// };

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
function pLoad(srcURL, targetEl, fragEl, cb, onSuccess)
{
    let tEl = '#' + targetEl;
    let sEl = srcURL + ' #' + fragEl;
    return new Promise((resolve, reject) =>
    {
        $(tEl).load(sEl, cb);
    });
}

//------------------------------------
// formLoader4()
//------------------------------------
async function formLoader4(srcURL, targetEl, fragEl, cb, onSuccess)
{
    let doneness = await pLoad(srcURL, targetEl, fragEl, cb, onSuccess);
}

//=== Experimental ====================================================

//------------------------------------
// jqLoad()
//------------------------------------
function jqLoad(srcURL, targetEl, fragEl, cb, onSuccess)
{
    let t = '#' + targetEl;
    //let s = srcURL + ' #' + fragEl;
    let s = srcURL + ' #' + fragEl;
    return new Promise((resolve, reject) =>
    {
        $(t).load(s, cb);
    });
}

//------------------------------------
// docLoad()
//------------------------------------
function docLoad(srcURL, targetEl, fragEl, cb, onSuccess)
{
    //let t = '#' + targetEl;
    //let s = srcURL + ' #' + fragEl;
    
    let pHeaders = new Headers();
    
    pHeaders.append('Content-Type', 'text/html');
    
    let pInit =  {
                    method:     'GET',
                    headers:    pHeaders,
                    mode:       'cors',
                    cache:      'default'
                 };
   
   let pRequest = new Request(srcURL, pInit);
   fetch(pRequest)
        .then(function(response)
        {
            return response.text();
        })
        .then(function(body)
        {
            let dp = new DOMParser();
            let doc = dp.parseFromString(body, 'text/html')
            let res =  doc.querySelector(fragEl);
            document.querySelector(targetEl).innerHTML =  res.innerHTML;
        })
        .then(function ()
        {
            if((cb !== undefined) && (cb !== null))
            {
                cb();
            }
        });
}

//------------------------------------
// loadForm()
//------------------------------------
const loadForm =  async (srcURL, targetEl, fragEl, cb, onSuccess) =>
{
    // let doneness = await jqLoad(srcURL, targetEl, fragEl, cb, onSuccess);
    let doneness = await docLoad(srcURL, targetEl, fragEl, cb, onSuccess);
}

//loadForm();
