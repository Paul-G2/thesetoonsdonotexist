function main()
{
    var tt = document.ttData = document.ttData || {};
    tt.toonImgActualSize = 768;
    tt.toonImgRelSize = 0.8;
    tt.progImgActualSize = 266;
    tt.progImgRelSize = 0.15;
    tt.portraitButtonWidth = 150;
    tt.portraitButtonHeight = 40;
    tt.landscapeButtonWidth = 80;
    tt.landscapeButtonHeight = 80;
    tt.portraitCtrlDivHeight = 60;
    tt.landscapeCtrlDivWidth = 100;
    tt.generating = false;
    layout_ui();
    window.addEventListener('resize', on_resize);
    window.addEventListener('orientationchange', on_resize);
    new_image(); 
}

function layout_ui()
{
    var tt = document.ttData;
    var cw = document.documentElement.clientWidth;
    var ch = document.documentElement.clientHeight;
    if ((cw === tt.cw) && (ch == tt.ch)) { return; }
    document.body.height = ch;
    document.body.width = cw;     
    
    var toonImg = document.getElementById('toon-img');
    var progImg = document.getElementById('prog-img');
    var aboutBtn = document.getElementById('about-btn');
    var moreBtn = document.getElementById('more-btn');
    var toonImgSize, progImgSize;

    if (ch >= cw) // Portrait orientation
    {
        toonImgSize = Math.min(tt.toonImgActualSize, Math.round(tt.toonImgRelSize*cw));
        var toonImgTop = (ch - toonImgSize - tt.portraitCtrlDivHeight)/2;
        var toonImgLeft = (cw - toonImgSize)/2;
        toonImg.style.width = toonImg.style.height = toonImgSize.toString() + "px";
        toonImg.style.left = toonImgLeft.toString() + "px";
        toonImg.style.top = toonImgTop.toString() + "px";

        progImgSize = Math.min(tt.progImgActualSize, Math.round(tt.progImgRelSize*cw));
        progImg.style.width = progImg.style.height = progImgSize.toString() + "px";
        progImg.style.left = ((cw - progImgSize)/2).toString() + "px";
        progImg.style.top = ((ch - progImgSize - tt.portraitCtrlDivHeight)/2).toString() + "px";

        var hsep = Math.min(25, cw/60);
        aboutBtn.style.width = moreBtn.style.width = tt.portraitButtonWidth.toString() + "px";
        aboutBtn.style.height = moreBtn.style.height = tt.portraitButtonHeight.toString() + "px";
        aboutBtn.style.top = moreBtn.style.top = (toonImgTop + toonImgSize + 15).toString() + "px";
        aboutBtn.style.left = (cw/2 - tt.portraitButtonWidth - hsep).toString() + "px";
        moreBtn.style.left = (cw/2 + hsep).toString() + "px";
    }
    else // Landscape orientation
    {
        toonImgSize = Math.min(tt.toonImgActualSize, Math.round(tt.toonImgRelSize*ch), cw-70-2*tt.landscapeButtonWidth);
        toonImg.style.width = toonImg.style.height = toonImgSize.toString() + "px";
        toonImg.style.left = ((cw - toonImgSize)/2).toString() + "px";
        toonImg.style.top = ((ch - toonImgSize)/2).toString() + "px";

        progImgSize = Math.min(tt.progImgActualSize, Math.round(tt.progImgRelSize*ch));
        progImg.style.width = progImg.style.height = progImgSize.toString() + "px";
        progImg.style.left = ((cw - progImgSize)/2).toString() + "px";
        progImg.style.top = ((ch - progImgSize)/2).toString() + "px";

        aboutBtn.style.width = moreBtn.style.width = tt.landscapeButtonWidth.toString() + "px";
        aboutBtn.style.height = moreBtn.style.height = tt.landscapeButtonHeight.toString() + "px";
        aboutBtn.style.top = moreBtn.style.top = (ch/2 - tt.landscapeButtonHeight/2).toString() + "px";
        aboutBtn.style.left = (cw/2 - toonImgSize/2 - tt.landscapeButtonWidth- 25).toString() + "px";
        moreBtn.style.left = (cw/2 + toonImgSize/2 + 25).toString() + "px";
    }
    document.getElementById('modal-content').style.fontSize = ((ch > 375) ? "100%" : (ch > 340) ? "90%" : "80%");
}

function on_resize() 
{
    layout_ui();
}


function new_image(seed)
{
    var tt = document.ttData;
    if (tt.generating) { return; }
    
    tt.generating = true;
    document.getElementById("prog-img").style.display = 'block';

    var req = new XMLHttpRequest();
    req.open('POST', 'https://us-central1-finetoon2.cloudfunctions.net/thistoon_generator2', true);
    req.setRequestHeader('Content-type', 'application/json');
    req.onload = function(evt) {
        var response = JSON.parse(evt.currentTarget.response);
        if (response.tt_status == 'ok') {
            document.getElementById("toon-img").src = response.imgdata;
        }
    };
    req.onloadend = function(evt) {
        document.ttData.generating = false;
        document.getElementById("prog-img").style.display = 'none';
    };
    seed = seed || new Date().getTime(); 
    req.send(JSON.stringify( {seed:seed} )); 
}


function show_about() {
    document.getElementById("about-dlg").style.display="block";
}


function hide_about() {
    document.getElementById("about-dlg").style.display="none";
}



