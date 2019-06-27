//--------------------------------------------------------------
// rfwidgitall.js
//
// Purpose:         eXtended <img> element with drawable
//                  canvas overlays.
//
// Date created:    2019-05-06
// Copyright (c):   David M. Witten II
//--------------------------------------------------------------
// jshint esversion:        6
// jshint unused:           false
// jshint undef:            false

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
        const self          = super();
        this.ctx            = null;
        return self;
    }
    
    //--------------------------------------------
    // Monitored attributes.
    //--------------------------------------------
    static get observedAttributes()
    {
        return ['active' ]; //, 'alt', 'width', 'height'];
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
//            console.log(`Value: ${name} changing from ${oldValue} to ${newValue}`);
            switch(name)
            {
                case 'active':
                    break;
                //case 'height':
                //case 'height':
                //    this.h = parseInt(newValue);
                //    this.shadowRoot.querySelector('#baseImg').height            = this.h;
                //    this.shadowRoot.querySelector('#copyCanvas').height         = this.h;
                //    if(len > 1)
                //    {
                //        for(let i = len - 1; i > 0; i--)
                //        {
                //            this.layers[i].height = this.h;
                //        }
                //        this.shadowRoot.querySelector('#frameDiv').style.height     = (this.h + 'px');
                //    }
                //    this.fillBackground();
                //    break;
                //case 'width':
                //    this.w = parseInt(newValue);
                //    this.shadowRoot.querySelector('#baseImg').width            = this.w;
                //    this.shadowRoot.querySelector('#copyCanvas').width         = this.w;
                //    //for(let i = this.layers.length - 1; i > 0; i--)
                //    if(len > 1)
                //    {
                //        for(let i = len - 1; i > 0; i--)
                //        {
                //            this.layers[i].width = this.w;
                //        }
                //        this.shadowRoot.querySelector('#frameDiv').style.width     = (this.w + 'px');
                //    }
                //    this.fillBackground();
                //    break;
                //case 'src':
                //    this.imgsrc = newValue;
                //    this.shadowRoot.querySelector('#baseImg').src = this.imgsrc;
                //    break;
                //case 'alt':
                //    this.imgalt = newValue;
                //    this.shadowRoot.querySelector('#baseImg').alt = this.imgalt;
                //    break;
                default:
                    break;
            }
        }
    }

    //============================================
    // getters/setters properties.
    //============================================

    //--------------------------------------------
    // get/set active.
    //--------------------------------------------
    get active()
    {
        return this.hasAttribute('active');
    }

    set active(val)
    {
        const isEq = (val !== this.imgsrc);
        if(isEq)
        {
            this.setAttribute('active', val);
        }
    }
}

//--------------------------------------------
// Register custom element ('tag').
//--------------------------------------------
customElements.define('x-rflayer', XRFLayer);


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// <XRFGraphTool>    [eXtended Img element]
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
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
        
        this.frameDiv                             = document.createElement('div');
        this.frameDiv.className                   = 'frameDivClass';
        this.frameDiv.id                          = 'frameDiv';
        this.frameDiv.style.border                = '#000000 solid 1px';
        this.frameDiv.style.minWidth              = (this.w + 'px');
        this.frameDiv.style.minHeight             = (this.h + 'px');
        this.frameDiv.style.width                 = (this.w + 'px');
        this.frameDiv.style.height                = (this.h + 'px');
        this.frameDiv.style.position              = 'absolute';
        this.frameDiv.style.top                   = '0px';
        this.frameDiv.style.left                  = '0px';
        this.frameDiv.style.overflow              = 'hidden';
        this.frameDiv.style.backgroundcolor       = 'transparent';
        this.frameDiv.style.display               = 'block';


        this.baseImg                              = document.createElement('img');
        this.baseImg.className                    = 'baseImgClass';
        this.baseImg.id                           = 'baseImg';
        this.baseImg.width                        = this.w;
        this.baseImg.height                       = this.h;
        this.baseImg.style.visibility             = 'hidden';
        this.baseImg.style.display                = 'block';
        this.baseImg.style.backgroundcolor        = 'transparent';

        this.copyCanvas                           = this.addLayer('copyCanvas', 'copyCanvasClass', 'canvas', null);
        // this.frameDiv                                   = this.addLayer('frameDiv', 'frameDivClass', 'frame', null);

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
            let zoom    = 1.0;

            this.w = this.naturalWidth  * zoom;
            this.h = this.naturalHeight * zoom;
        
            //oParent.style.width     = (oParent.sizerParent[0].clientWidth + 'px');
            //oParent.style.height    = (oParent.sizerParent[0].clientHeight + 'px');
        
            for(let i = 0; i < aSibs.length; i++)
            {
                aSibs[i].width   = this.w;
                aSibs[i].height  = this.h;
            }
            let ctx = aSibs.copyCanvas.getContext('2d');
            ctx.drawImage(this, 0, 0, this.naturalWidth * zoom, this.naturalHeight * zoom);
        });
        return self;
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
                this.layers[len]                     = document.createElement('canvas');
                this.layers[len].width               = this.w;
                this.layers[len].height              = this.h;
                this.layers[len].fillObj             = false;
                this.layers[len].closeShape          = false;
                this.layers[len].fillStyle           = '#ffff00FF';
                this.layers[len].strokeStyle         = '#FF0000FF';  //'#00ff00FF';
                break;
            case 'frame':
                this.layers[len]                     = document.createElement('div');
                this.layers[len].style.border        = '#000000 solid 1px';
                this.layers[len].style.minWidth      = (this.w + 'px');
                this.layers[len].style.minHeight     = (this.h + 'px');
                this.layers[len].style.width         = (this.w + 'px');
                this.layers[len].style.height        = (this.h + 'px');
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
                    if(len > 0)
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
                    if(len > 0)
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

//------------------------------------------
// Mode enumerator
//------------------------------------------
const modeEnum =
{
    RESET:              0,
    DRAW:               1,
    MEASURE:            2,
    MAGGLASS:           3
};
Object.freeze(modeEnum);
// export { modeEnum };

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// <XRFPanaFall>    [eXtended Img element]
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
class XRFPanaFall extends XRFGraphTool
{
    //--------------------------------------------
    // ctor()
    //--------------------------------------------
    constructor(src, alt)
    {
        const self          = super(src, alt);
        this.name           = "XRFPanaFall";
        
        this.frameDiv.extView        = '';
        this.frameDiv.cursorHt       = 40;
        this.frameDiv.cursorWid      = 40;

        this.drawCanvas = this.addLayer('drawCanvas', 'drawCanvasClass', 'canvas', null);
        this.frameDiv.appendChild(this.drawCanvas);
        this.measureCanvas = this.addLayer('measureCanvas', 'measureCanvasClass', 'canvas', null);
        this.frameDiv.appendChild(this.measureCanvas);
        this.magGlassCanvas = this.addLayer('magGlassCanvas', 'magGlassCanvasClass', 'canvas', null);
        this.frameDiv.appendChild(this.magGlassCanvas);

        return self;
    }
    
    //------------------------------------------
    // toolMode()
    //------------------------------------------
    toolMode(mode)
    {
        this.baseImg.style.visibility               = 'hidden';
        this.copyCanvas.style.visibility            = 'visible';
        for(let i = this.layers.length - 1; i > 0; i--)
        {
            this.layers[i].mousedown        = null;
            this.layers[i].mousemove        = null;
            this.layers[i].mouseup          = null;
            let zdx                         =  String(i + 1);
            this.layers[i].style.zIndex     = zdx;
            this.layers[i].style.visibility = 'hidden';
        }
        switch(mode)
        {
            case modeEnum.RESET:
                break;
            case modeEnum.DRAW:
                this.layers[mode].onmousedown       = this.pathMouseDown;
                this.layers[mode].onmousemove       = this.pathMouseMove;
                this.layers[mode].onmouseup         = this.pathMouseUp;
                this.layers[mode].style.visibility  = 'visible';
                this.layers[mode].style.zIndex      = '10';
                break;
            case modeEnum.MEASURE:
                this.layers[mode].onmousedown       = this.measureMouseDown;
                this.layers[mode].onmousemove       = this.measureMouseMove;
                this.layers[mode].onmouseup         = this.measureMouseUp;
                this.layers[mode].style.visibility  = 'visible';
                this.layers[mode].style.zIndex      = '10';
                break;
            case modeEnum.MAGGLASS:
                this.layers[mode].onmousedown       = this.magMouseDown;
                this.layers[mode].onmousemove       = this.magMouseMove;
                this.layers[mode].onmouseup         = this.magMouseUp;
                this.layers[mode].style.visibility  = 'visible';
                this.layers[mode].style.zIndex      = '10';
                break;
            default:
                break;
        }
        this.frameDiv.mode = mode;
    }

    //============================================
    // Object methods and event handlers.
    //============================================
    //------------------------------------------
    // pathMouseMove()
    //------------------------------------------
    pathMouseDown(e)
    {
        e.stopImmediatePropagation();
        this.ctx = this.getContext('2d');
    
        this.mouseDown = true;
        this.startx = e.offsetX;
        this.starty = e.offsetY;
    
        let h = this.height;
        let w = this.width;
    
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.fillStyle      = this.fillStyle;
        this.ctx.strokeStyle    = this.strokeStyle;
        this.ctx.lineWidth      = 1;
        this.ctx.beginPath();
    }
    
    //------------------------------------------
    // pathMouseMove()
    //------------------------------------------
    pathMouseMove(e)
    {
        e.stopImmediatePropagation();
        if(this.mouseDown)
        {
            this.ctx.lineWidth       = 2;
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        }
    }
    
    //------------------------------------------
    // pathMouseUp()
    //------------------------------------------
    pathMouseUp(e)
    {
        e.stopImmediatePropagation();
        let p = this.parentElement;
        if(this.mouseDown)
        {
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
            if(this.closeShape === true)
            {
                this.ctx.lineTo(this.startx, this.starty);
                this.ctx.stroke();
                if(this.fillObj === true)
                {
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
        this.mouseDown = false;
    }
    
    //------------------------------------------
    // Measure MouseDown
    //------------------------------------------
    measureMouseDown(e)
    {
        e.stopImmediatePropagation();
        let ctx = this.getContext('2d');
    
        this.mouseDown = true;
        this.px = e.offsetX;
        this.py = e.offsetY;
    
        let h = this.height;
        let w = this.width;
    
        ctx.clearRect(0, 0, w, h);
    }
    
    //------------------------------------------
    // Measure MouseMove
    //------------------------------------------
    measureMouseMove(e)
    {
        e.stopImmediatePropagation();
        if(this.mouseDown)
        {
            let ctx = this.getContext('2d');
    
            let h = this.height;
            let w = this.width;
    
            ctx.clearRect(0, 0, w, h);
            ctx.lineWidth       = 2;
            ctx.strokeStyle     = '#afafaf';
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.rect(this.px, this.py, e.offsetX - this.px, e.offsetY - this.py);
            ctx.stroke();
        }
    }
    
    //------------------------------------------
    // Measure MouseUp
    //------------------------------------------
    measureMouseUp(e)
    {
        let p = this.parentElement;
        e.stopImmediatePropagation();
        if(this.mouseDown)
        {
            let ctx = this.getContext('2d');
    
            let h = this.height;
            let w = this.width;
            ctx.clearRect(0, 0, w, h);
    
            let x1              = this.px;
            let y1              = this.py;
            let x2              = e.offsetX;
            let y2              = e.offsetY;
    
            ctx.lineWidth       = 1;
            ctx.strokeStyle     = '#FF0000';
            ctx.setLineDash([]);
            ctx.beginPath();
            if((x1 - x2) < (y1-y2))
            {
                ctx.moveTo(x1, y1-10);
                ctx.lineTo(x1, y1+10);
                ctx.moveTo(x2, y2-10);
                ctx.lineTo(x2, y2+10);
            }
            else
            {
                ctx.moveTo(x1-10, y1);
                ctx.lineTo(x1+10, y1);
                ctx.moveTo(x2-10, y2);
                ctx.lineTo(x2+10, y2);
            }
            let val = Math.sqrt(Math.pow((x2 - x1), 2)  +  Math.pow((y2 - y1), 2));
            // $('#measureLen').get(0).value = Math.round(val);
            // Math.sqrt(Math.pow((x2 - x1), 2)  +  Math.pow((y2 - y1), 2));
            console.log('Distance: ' + Math.round(val));
    
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        this.mouseDown = false;
    }
    
    //------------------------------------------
    // Magnifying Glass MouseDown
    //------------------------------------------
    magMouseDown(e)
    {
        e.stopImmediatePropagation();
        this.p          = this.parentElement;
        this.cc         = this.p.children.copyCanvas;
        this.ctx        = this.getContext('2d');
        this.dCtx       = this.parentElement.extView.getContext('2d');
        this.sCtx       = this.cc.getContext('2d');
        this.mouseDown  = true;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeRect(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
        //let tData = this.sCtx.getImageData(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
        this.dCtx.drawImage(this.cc, e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt, 0, 0, 250, 250);
   }
    
    //------------------------------------------
    // Magnifying Glass MouseMove
    //------------------------------------------
    magMouseMove(e)
    {
        e.stopImmediatePropagation();
        if(this.mouseDown)
        {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.strokeRect(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
            //let tData = this.sCtx.getImageData(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
            this.dCtx.drawImage(this.cc, e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt, 0, 0, 250, 250);
        }
    }
    
    //------------------------------------------
    // Magnifying Glass MouseUp
    //------------------------------------------
    magMouseUp(e)
    {
        e.stopImmediatePropagation();
        if(this.mouseDown)
        {
            this.ctx.clearRect(0, 0, this.width, this.height);
            //this.sCtx.strokeRect(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
            // let tData = this.sCtx.getImageData(e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt);
            this.dCtx.drawImage(this.cc, e.offsetX - (this.p.cursorWid/2), e.offsetY - (this.p.cursorHt/2), this.p.cursorWid, this.p.cursorHt, 0, 0, 250, 250);
        }
        this.mouseDown = false;
    }
    
    //------------------------------------------
    // mergeLayers()
    //------------------------------------------
    mergeLayers()
    {
        let ctx = this.mergeCanvas.getContext('2d');
        //ctx.globalCompositeOperation    = 'source-over';  // Default
        ctx.drawImage(this.copyCanvas, 0, 0);
        ctx.drawImage(this.midlineCanvas, 0, 0);
        ctx.drawImage(this.marginCanvasTop, 0, 0);
        ctx.drawImage(this.marginCanvasBottom, 0, 0);
        ctx.drawImage(this.perimCanvasLeft, 0, 0);
        ctx.drawImage(this.perimCanvasRight, 0, 0);
        ctx.drawImage(this.leftNosCanvas, 0, 0);
        ctx.drawImage(this.rightNosCanvas, 0, 0);
        return this.mergeCanvas;
    }

    //------------------------------------------
    // clearCanvas()
    //------------------------------------------
    clearCanvas(canvas)
    {
        let ctx = canvas.getContext('2d');
        let h   = canvas.height;
        let w   = canvas.width;
        ctx.clearRect(0, 0, w, h);
    }
    
    //------------------------------------------
    // showAll()
    //------------------------------------------
    showAll()
    {
        for(let i = 1; i < this.layers.length; i++)
        {
            this.layers[i].style.visibility = 'visible';
        }
    }

    //------------------------------------------
    // hideAll()
    //------------------------------------------
    hideAll()
    {
        for(let i = 1; i < this.layers.length; i++)
        {
            this.layers[i].style.visibility = 'hidden';
        }
    }

    //------------------------------------------
    // printCurrent()
    //------------------------------------------
    printCurrent()
    {
        for(let i = 1; i < this.layers.length; i++)
        {
            this.layers[i].style.visibility = 'hidden';
        }
    }

    //------------------------------------------
    // printAll()
    //------------------------------------------
    printAll()
    {
        for(let i = 1; i < this.layers.length; i++)
        {
            this.layers[i].style.visibility = 'hidden';
        }
    }

    //------------------------------------------
    // clearAll()
    //------------------------------------------
    clearAll()
    {
        for(let i = 1; i < this.layers.length; i++)
        {
            //this.layers[i].clearCanvas(this.layers[i]);
            this.clearCanvas(this.layers[i]);
        }
    }

}

////--------------------------------------------
//// Register custom element ('tag').
////--------------------------------------------
customElements.define('x-rfpanafall', XRFPanaFall);
