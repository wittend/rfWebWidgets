//--------------------------------------------------------------
// rfGraphCore.js
//
// Purpose:         eXtended <img> element with drawable
//                  canvas overlays.
//
// Date created:    05-06-2019
// Copyright (c):   David M. Witten II
//--------------------------------------------------------------
/* jshint strict:           true        */
/* jshint unused:           false       */
/* jshint jquery:           true        */
/* globals          window              */
/* globals          document            */
/* globals          HTMLElement         */
/* globals          customElements      */
/* globals          ffiller             */

//export default class XRFGraphTool {}
//export { XRFGraphTool as default };


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// <XRFLayer>    [eXtended Img element]
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
class XRFLayer extends HTMLElement
{
    //--------------------------------------------
    // ctor()
    //--------------------------------------------
    constructor(src, alt)
    {
        const self = super();
        this.create();
        return self;
    }
}

////--------------------------------------------
//// Register custom element ('tag').
////--------------------------------------------
customElements.define('x-rflayer', XRFLayer);

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// <XRFGraphTool>    [eXtended Img element]
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// export default class XRFGraphTool extends HTMLElement
class XRFGraphTool extends HTMLElement
{
    //--------------------------------------------
    // ctor()
    //--------------------------------------------
    constructor(src, alt)
    {
        const self = super();

        this.name                   = "XRFGraphTool";
        this.h                      = 100;
        this.w                      = 150;
        this.imgsrc                 = src;
        this.imgalt                 = alt;
        this.mouseDown              = false;
        this.backgroundColor        = "#3030FFFF";
        this.layers                 = [];
        this.canvasList             = [];

        this.create();
        return self;
    }

    //--------------------------------------------
    // create()
    //--------------------------------------------
    create()
    {
        this.baseImg                                    = document.createElement('img');
        this.baseImg.className                          = 'baseImgClass';
        this.baseImg.id                                 = 'baseImg';
        this.baseImg.width                              = this.w;
        this.baseImg.height                             = this.h;
        this.baseImg.style.visibility                   = 'hidden';
        this.baseImg.style.display                      = 'block';
        this.baseImg.style.backgroundcolor              = 'transparent';

        this.copyCanvas                                 = this.addLayer('copyCanvas', 'copyCanvasClass', 'canvas', null);
        this.frameDiv                                   = this.addLayer('frameDiv', 'frameDivClass', 'frame', null);

        this.frameDiv.appendChild(this.baseImg);
        this.frameDiv.appendChild(this.copyCanvas);

        const shadowRoot = this.attachShadow( { mode: 'open' } );
        shadowRoot.appendChild(this.frameDiv);

        //------------------------------------------
        // baseImg.onload()
        // trigger function after the image has loaded in image object
        //------------------------------------------
        this.baseImg.addEventListener('load', function(e)
        {
            let oParent = this.parentElement;
            let aSibs   = oParent.children;
            let dimUsed = '';
            let zf      = 1.0;

            this.w = this.naturalWidth  * zf;
            this.h = this.naturalHeight * zf;
        
            //oParent.style.width     = (oParent.sizerParent[0].clientWidth + 'px');
            //oParent.style.height    = (oParent.sizerParent[0].clientHeight + 'px');
        
            for(let i = 0; i < aSibs.length; i++)
            {
                aSibs[i].width   = this.w;
                aSibs[i].height  = this.h;
            }
            let ctx = aSibs.copyCanvas.getContext('2d');
            ctx.drawImage(this, 0, 0, this.naturalWidth * zf, this.naturalHeight * zf);
        });
     }

    //--------------------------------------------
    // addLayer()
    //--------------------------------------------
    addLayer(id, classname, type, content)
    {
        let len = this.layers.length;
        switch(type)
        {
            case 'canvas':
                this.layers[len]                             = document.createElement('canvas');
                this.layers[len].width                       = this.w;
                this.layers[len].height                      = this.h;
                this.layers[len].fillObj                     = false;
                this.layers[len].closeShape                  = false;
                this.layers[len].fillStyle                   = '#ffff00FF';
                this.layers[len].strokeStyle                 = '#00ff00FF';
                break;
            case 'frame':
                this.layers[len]                             = document.createElement('div');
                this.layers[len].style.border                = '#000000 solid 1px';
                this.layers[len].style.minWidth              = (this.w + 'px');
                this.layers[len].style.minHeight             = (this.h + 'px');
                this.layers[len].style.width                 = (this.w + 'px');
                this.layers[len].style.height                = (this.h + 'px');
                break;
            default:
                break;
        }
        this.layers[len].className                   = classname;
        this.layers[len].id                          = id;
        this.layers[len].style.position              = 'absolute';
        this.layers[len].style.top                   = '0px';
        this.layers[len].style.left                  = '0px';
        this.layers[len].style.overflow              = 'hidden';
        this.layers[len].style.backgroundcolor       = 'transparent';
        this.layers[len].style.display               = 'block';
        this.layers[len].countPix                    = null;
        this.layers[len].lineVertical                = true;
        this.layers[len].mouseDown                   = false;
        return this.layers[len];
    }

    //--------------------------------------------
    // Monitored attributes.
    //--------------------------------------------
    static get observedAttributes()
    {
        return ['src', 'alt', 'width', 'height'];
    }

    //--------------------------------------------
    // Reflect changed attributes.
    //--------------------------------------------
    attributeChangedCallback(name, oldValue, newValue)
    {
        const hasValue = newValue !== null;
        const len = this.layers.length;
        if(hasValue)
        {
            console.log(`Value: ${name} changing from ${oldValue} to ${newValue}`);
            switch(name)
            {
                case 'height':
                    this.h = parseInt(newValue);
                    this.shadowRoot.querySelector('#baseImg').height            = this.h;
                    this.shadowRoot.querySelector('#copyCanvas').height         = this.h;
                    if(len > 1)
                    {
                        for(let i = len - 1; i > 0; i--)
                        {
                            this.layers[i].height = this.h;
                        }
                        this.shadowRoot.querySelector('#frameDiv').style.height     = (this.h + 'px');
                    }
                    this.fillBackground();
                    break;
                case 'width':
                    this.w = parseInt(newValue);
                    this.shadowRoot.querySelector('#baseImg').width            = this.w;
                    this.shadowRoot.querySelector('#copyCanvas').width         = this.w;
                    //for(let i = this.layers.length - 1; i > 0; i--)
                    if(len > 1)
                    {
                        for(let i = len - 1; i > 0; i--)
                        {
                            this.layers[i].width = this.w;
                        }
                        this.shadowRoot.querySelector('#frameDiv').style.width     = (this.w + 'px');
                    }
                    this.fillBackground();
                    break;
                case 'src':
                    this.imgsrc = newValue;
                    this.shadowRoot.querySelector('#baseImg').src = this.imgsrc;
                    break;
                case 'alt':
                    this.imgalt = newValue;
                    this.shadowRoot.querySelector('#baseImg').alt = this.imgalt;
                    break;
                default:
                    break;
            }
        }
    }

    //------------------------------------------
    // fillBackground()
    //------------------------------------------
    fillBackground()
    {
        //debugger;
        let ctx = this.copyCanvas.getContext('2d');
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.copyCanvas.width, this.copyCanvas.height);
     }

    //------------------------------------------
    // plot()
    //------------------------------------------
    plot(img)
    {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        
        var invert = function()
        {
            for (var i = 0; i < data.length; i += 4)
            {
                data[i]     = 255 - data[i];     // red
                data[i + 1] = 255 - data[i + 1]; // green
                data[i + 2] = 255 - data[i + 2]; // blue
            }
            ctx.putImageData(imageData, 0, 0);
        };
        
        var grayscale = function()
        {
            for (var i = 0; i < data.length; i += 4)
            {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i]     = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
            }
            ctx.putImageData(imageData, 0, 0);
        };
        
        var invertbtn = document.getElementById('invertbtn');
        invertbtn.addEventListener('click', invert);
        var grayscalebtn = document.getElementById('grayscalebtn');
        grayscalebtn.addEventListener('click', grayscale);
    }

    //------------------------------------------
    // countColoredPixels()
    //------------------------------------------
    countColoredPixels(ctx, minX, maxX, minY, maxY)
    {
        let count = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        let dLayer = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);
        let l = dLayer.data.length;
        let newStyle = this.fillStyle.substr(1);
        let bigint = parseInt(newStyle, 16);
        let fillR = (bigint >> 16) & 255;
        let fillG = (bigint >> 8) & 255;
        let fillB = bigint & 255;

        for(let pos = 0; pos < l; pos++)
        {
            r = dLayer.data[pos];
            g = dLayer.data[pos + 1];
            b = dLayer.data[pos + 2];
            if(r == fillR && g == fillG && b == fillB)
            {
                count++;
            }
        }
        return count;
    }

    ////============================================
    //// Object methods and event handlers.
    ////============================================
    ////------------------------------------------
    //// pathMouseMove()
    ////------------------------------------------
    //pathMouseDown(e)
    //{
    //    e.stopImmediatePropagation();
    //    this.ctx = this.getContext('2d');
    //
    //    this.mouseDown = true;
    //    this.startx = e.offsetX;
    //    this.starty = e.offsetY;
    //
    //    let h = this.height;
    //    let w = this.width;
    //
    //    this.ctx.clearRect(0, 0, w, h);
    //    this.ctx.fillStyle      = this.fillStyle;
    //    this.ctx.strokeStyle    = this.strokeStyle;
    //    this.ctx.lineWidth      = 1;
    //    this.ctx.beginPath();
    //}
    //
    ////------------------------------------------
    //// pathMouseMove()
    ////------------------------------------------
    //pathMouseMove(e)
    //{
    //    e.stopImmediatePropagation();
    //    if(this.mouseDown)
    //    {
    //        this.ctx.lineWidth       = 2;
    //        this.ctx.lineTo(e.offsetX, e.offsetY);
    //        this.ctx.stroke();
    //    }
    //}
    //
    ////------------------------------------------
    //// pathMouseUp()
    ////------------------------------------------
    //pathMouseUp(e)
    //{
    //    e.stopImmediatePropagation();
    //    let p = this.parentElement;
    //    if(this.mouseDown)
    //    {
    //        this.ctx.lineTo(e.offsetX, e.offsetY);
    //        this.ctx.stroke();
    //        if(this.closeShape === true)
    //        {
    //            this.ctx.lineTo(this.startx, this.starty);
    //            this.ctx.stroke();
    //            if(this.fillObj === true)
    //            {
    //                this.ctx.closePath();
    //                this.ctx.fill();
    //            }
    //        }
    //    }
    //    this.mouseDown = false;
    //}
    //
    ////------------------------------------------
    //// line MouseDown
    ////------------------------------------------
    //lineMouseDown(e)
    //{
    //    e.stopImmediatePropagation();
    //    let ctx = this.getContext('2d');
    //
    //    this.mouseDown = true;
    //    this.px = e.offsetX;
    //    this.py = e.offsetY;
    //
    //    let h = this.height;
    //    let w = this.width;
    //
    //    ctx.clearRect(0, 0, w, h);
    //}
    //
    ////------------------------------------------
    //// Line MouseMove
    ////------------------------------------------
    //lineMouseMove(e)
    //{
    //    e.stopImmediatePropagation();
    //    if(this.mouseDown)
    //    {
    //        let ctx = this.getContext('2d');
    //
    //        let h = this.height;
    //        let w = this.width;
    //
    //        ctx.clearRect(0, 0, w, h);
    //        ctx.lineWidth       = 1;
    //        ctx.strokeStyle     = '#cfcfcf';
    //        ctx.setLineDash([3, 4]);
    //        ctx.beginPath();
    //        if(this.lineVertical)
    //        {
    //            ctx.moveTo(e.offsetX, 0);
    //            ctx.lineTo(e.offsetX, h);
    //        }
    //        else
    //        {
    //            ctx.moveTo(0, e.offsetY);
    //            ctx.lineTo(w, e.offsetY);
    //        }
    //        ctx.stroke();
    //    }
    //}
    //
    ////------------------------------------------
    //// Line MouseUp
    ////------------------------------------------
    //lineMouseUp(e)
    //{
    //    e.stopImmediatePropagation();
    //    let p = this.parentElement;
    //    if(this.mouseDown)
    //    {
    //        let p = this.parentElement;
    //        let ctx = this.getContext('2d');
    //
    //        let h = this.height;
    //        let w = this.width;
    //        ctx.clearRect(0, 0, w, h);
    //
    //        let x1              = this.px;
    //        let y1              = this.py;
    //        let x2              = e.offsetX;
    //        let y2              = e.offsetY;
    //
    //        ctx.lineWidth       = 1;
    //        ctx.strokeStyle     = '#FFFFFF';
    //        ctx.setLineDash([]);
    //        ctx.beginPath();
    //        if(this.lineVertical)
    //        {
    //            ctx.moveTo(e.offsetX, 0);
    //            ctx.lineTo(e.offsetX, h);
    //            //if(p.parentElement.mode == modeEnum.DOGNOSEMEDIAN)
    //            //{
    //            //    this.parentElement.medianX = h;
    //            //}
    //        }
    //        else
    //        {
    //            ctx.moveTo(0, e.offsetY);
    //            ctx.lineTo(w, e.offsetY);
    //            //if(p.parentElement.mode == modeEnum.DOGNOSEUPPER)
    //            //{
    //            //    this.parentElement.upperLimitY = w;
    //            //}
    //            //else if(p.parentElement.mode == modeEnum.DOGNOSELOWER)
    //            //{
    //            //    this.parentElement.lowerLimitY = w;
    //            //}
    //       }
    //        ctx.stroke();
    //    }
    //    this.mouseDown = false;
    //}
    //
    ////------------------------------------------
    //// Measure MouseDown
    ////------------------------------------------
    //measureMouseDown(e)
    //{
    //    e.stopImmediatePropagation();
    //    let ctx = this.getContext('2d');
    //
    //    this.mouseDown = true;
    //    this.px = e.offsetX;
    //    this.py = e.offsetY;
    //
    //    let h = this.height;
    //    let w = this.width;
    //
    //    ctx.clearRect(0, 0, w, h);
    //}
    //
    ////------------------------------------------
    //// Measure MouseMove
    ////------------------------------------------
    //measureMouseMove(e)
    //{
    //    e.stopImmediatePropagation();
    //    if(this.mouseDown)
    //    {
    //        let ctx = this.getContext('2d');
    //
    //        let h = this.height;
    //        let w = this.width;
    //
    //        ctx.clearRect(0, 0, w, h);
    //        ctx.lineWidth       = 2;
    //        ctx.strokeStyle     = '#afafaf';
    //        ctx.setLineDash([3, 4]);
    //        ctx.beginPath();
    //        ctx.rect(this.px, this.py, e.offsetX - this.px, e.offsetY - this.py);
    //        ctx.stroke();
    //    }
    //}
    //
    ////------------------------------------------
    //// Measure MouseUp
    ////------------------------------------------
    //measureMouseUp(e)
    //{
    //    let p = this.parentElement;
    //    e.stopImmediatePropagation();
    //    if(this.mouseDown)
    //    {
    //        let ctx = this.getContext('2d');
    //
    //        let h = this.height;
    //        let w = this.width;
    //        ctx.clearRect(0, 0, w, h);
    //
    //        let x1              = this.px;
    //        let y1              = this.py;
    //        let x2              = e.offsetX;
    //        let y2              = e.offsetY;
    //
    //        ctx.lineWidth       = 1;
    //        ctx.strokeStyle     = '#FF0000';
    //        ctx.setLineDash([]);
    //        ctx.beginPath();
    //        if((x1 - x2) < (y1-y2))
    //        {
    //            ctx.moveTo(x1, y1-10);
    //            ctx.lineTo(x1, y1+10);
    //            ctx.moveTo(x2, y2-10);
    //            ctx.lineTo(x2, y2+10);
    //        }
    //        else
    //        {
    //            ctx.moveTo(x1-10, y1);
    //            ctx.lineTo(x1+10, y1);
    //            ctx.moveTo(x2-10, y2);
    //            ctx.lineTo(x2+10, y2);
    //        }
    //        let val = Math.sqrt(Math.pow((x2 - x1), 2)  +  Math.pow((y2 - y1), 2));
    //        // $('#measureLen').get(0).value = Math.round(val);
    //        // Math.sqrt(Math.pow((x2 - x1), 2)  +  Math.pow((y2 - y1), 2));
    //        console.log('Distance: ' + Math.round(val));
    //
    //        ctx.moveTo(x1, y1);
    //        ctx.lineTo(x2, y2);
    //        ctx.stroke();
    //    }
    //    this.mouseDown = false;
    //}
    //
    ////------------------------------------------
    //// clearCanvas()
    ////------------------------------------------
    //clearCanvas()
    //{
    //    let ctx = this.getContext('2d');
    //    let h   = this.height;
    //    let w   = this.width;
    //    ctx.clearRect(0, 0, w, h);
    //}

    //------------------------------------------
    // clearAll()
    //------------------------------------------
    clearAll()
    {
        for(let i = 0; i < this.canvasList.length; i++)
        {
            let ctx = this.canvasList[i].getContext('2d');
            let h   = this.canvasList[i].height;
            let w   = this.canvasList[i].width;
            ctx.clearRect(0, 0, w, h);
        }
    }

    //------------------------------------------
    // showAll()
    //------------------------------------------
    showAll()
    {
        for(let i = 0; i < this.canvasList.length; i++)
        {
            this.canvasList[i].style.visibility = 'visible';
        }
    }

    //------------------------------------------
    // hideAll()
    //------------------------------------------
    hideAll()
    {
        for(let i = 0; i < this.canvasList.length; i++)
        {
            this.canvasList[i].style.visibility = 'hidden';
        }
    }

    ////============================================
    //// getters/setters properties.
    ////============================================

    //--------------------------------------------
    // get/set src.
    //--------------------------------------------
    get src()
    {
        return this.hasAttribute('src');
    }

    set src(val)
    {
        const isEq = (val !== this.imgsrc);
        if(isEq)
        {
            this.setAttribute('src', val);
        }
    }

    //--------------------------------------------
    // get/set alt.
    //--------------------------------------------
    get alt()
    {
        return this.hasAttribute('alt');
    }

    set alt(val)
    {
        const isEq = (val !== this.imgalt);
        if(isEq)
        {
            this.setAttribute('alt', val);
        }
    }

    //--------------------------------------------
    // get/set width.
    //--------------------------------------------
    get width()
    {
        if(!this.hasAttribute('width') || (this.width <= 0))
        {
            this.width = 100;
        }
        return this.width;
    }

    set width(val)
    {
        const isUndef = (val == undefined);
        if(!isUndef)
        {
            this.setAttribute('width', val);
        }
        else
        {
            this.removeAttribute('width');
        }
    }

    //--------------------------------------------
    // get/set height.
    //--------------------------------------------
    get height()
    {
        if(!this.hasAttribute('height') || (this.height <= 0))
        {
            this.height = 150;
        }
        return this.height;
    }

    set height(val)
    {
        const isUndef = (val == undefined);
        if(!isUndef)
        {
            this.setAttribute('height', val);
        }
        else
        {
            this.removeAttribute('height');
        }
    }

    //--------------------------------------------
    // get/set mouseMode.
    //--------------------------------------------
    get mouseMode()
    {
        return this.mode;
    }

    set mouseMode(mode)
    {
        this.mode = mode;
    }
}

////--------------------------------------------
//// Register custom element ('tag').
////--------------------------------------------
customElements.define('x-rfgraphtool', XRFGraphTool);

// export { XRFGraphTool };
// export { XRFGraphTool as default };

//------------------------------------------
// getPixelValue()
//------------------------------------------
let getPixelValue = function(e)
{
    //------------------------------------------
    // d2HexStr()
    //------------------------------------------
    this.d2HexStr = function(num)
    {
        if (num < 0)
        {
            num = 0xFFFFFFFF + num + 1;
        }
        return num.toString(16).toUpperCase();
    };

    let dst = this.parentElement.children.objAreaCanvas;
    let src = this;
    let ctx = this.getContext('2d');
    let imgd = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    let pix = imgd.data;
    let clrStr = '[ r: '+ this.d2HexStr(pix[0]) + ', g: ' + this.d2HexStr(pix[1]) + ', b: ' + this.d2HexStr(pix[2]) + ' ] a: ' + this.d2HexStr(pix[3]);
    let startX = e.offsetX;
    let startY = e.offsetY;
    let startR = pix[0];
    let startG = pix[1];
    let startB = pix[2];
};
