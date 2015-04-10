/**
 * Created by sztp on 2015/4/3.
 * 页面自适应
 */
(function(win){
    function init(){
        var docWidth=win.document.documentElement.clientWidth;
        var html=win.document.querySelector("html");
        html.style.fontSize= (docWidth/20) +"px";
    }
    win.addEventListener("resize",init);
    init();
})(window);