(function(){
    var iframe=document.querySelector("#iframe");
    var send=$("#send");
    var sender=$("#sender");
    var text=document.querySelector("#text");
    var win=iframe.contentWindow;
    var doc=win.document;
    var head=document.querySelector("head");
    var face=$("#face");
    doc.querySelector("head").innerHTML=head.innerHTML;
    doc.body.innerHTML="<p class='p' id='p'></p>";
    var bottom=document.querySelector("#bottom");
    var p=doc.querySelector("#p");
    window.addEventListener("resize",iframeResize);
    function iframeResize(){
        doc.querySelector("html").style.fontSize=document.querySelector("html").style.fontSize;
    }
    iframeResize();
    p.contentEditable=true;
    p.addEventListener("input",resizeFrame);
    var hidden=document.querySelector("#hidden");
    function resizeFrame(){
        if(p.clientHeight/16<5.875 && p.clientHeight>10){
            hidden.style.height=bottom.clientHeight+"px";
            iframe.style.height =p.clientHeight+"px";
        }
    }
    var list=$("#list");
    var user = localStorage.getItem("user");
    var socket = io.connect('http://'+location.hostname+":1337");
    socket.emit("init",user);
    send.on("tap",function(){
        socket.emit("message",user,sender.val(),p.innerHTML);
        list.append(getLi({from:user,msg:p.innerHTML,right:true}));
        p.innerHTML="";
        resizeFrame();
    });
    var expression=$("#expression");
    p.addEventListener("click",function(){
        expression.addClass("hide");
    });
    face.on("tap",function(){
        p.focus();
        face.addClass("active");
        expression.removeClass("hide");
        if(!mySwiper){
            mySwiper= new Swiper('.swiper-container', {
                pagination:".swiper-pagination"
            });
        }
    });
    var wrapper=$("#wrapper");
    var div="<div class='swiper-slide clearfix'>";
    for(var i=0;i<135;i++){
        if(i % 24==0 && i!==0){
            div+="</div>";
            div+="<div class='swiper-slide clearfix'>";
        }
        div+="<a href='javascript:;' class='ex_item'><img src='/face/"+i+".gif' /></a>";
    }
    div+="</div>";
    wrapper.append(div);

    var mySwiper;
    socket.on("to",function(msg){
        list.append(getLi(msg));
    });
    var imgList=wrapper.find(".ex_item");
    imgList.on("click",function(){
        var selection=win.getSelection();
        var range=selection.getRangeAt(0);
        var oFragment = range.createContextualFragment(this.innerHTML),//把插入内容转变为DocumentFragment
            oLastNode = oFragment.lastChild ;//用于修正编辑光标的位置
        range.insertNode(oFragment) ;
        range.setEndAfter(oLastNode ) ;//把编辑光标放到我们插入内容之后
        range.setStartAfter(oLastNode );
        selection.removeAllRanges();//清除所有选择，要不我们插入的内容与刚才的文本处于选中状态
        selection.addRange(range);//插入内容
        resizeFrame();
    });
    function getLi(obj){
        var li='<li '+(obj.right?'class="item_right"':'')+'>'+
            '<div class="item">'+
            '<p class="item_title"><span>'+obj.from+'</span><span>'+(new Date()).toLocaleDateString()+'</span></p>'+
            '<p class="item_content">'+obj.msg+'</p>'+
            '</div>'+
            '</li>';
        return li;
    }
})();