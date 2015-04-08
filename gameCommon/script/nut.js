
$(document).ready(function () {
     TempstartTime = new Date().getTime();
     Log(TempstartTime);
     Nut.PlayAdvertise();
     Nut.Init();
});

Log = function (str) {
     if (console.log) {
          console.log("Log : " + str);
     }
}

var Nut = new Object();
var Text = new Object();
var Xml = new Object();
var Game = new Object();
var oAddPath = new Object();

Nut.LoadProgess = { "ImagesLoaded": false, "TextLoaded": false, "ExtrasLoaded": false };

Nut.Init = function () {
     var oHead = $('head');
     oHead.append("<link rel='stylesheet' type='text/css' href='/gameCommon/style/nut.css' />");
     Nut.strAppName = location.pathname;
     //Loading game.css
     oHead.append("<link rel='stylesheet' type='text/css' href='" + Nut.strAppName + "style/game.css' />");
     Log("Loaded game css");
     //Loading game.js
     oHead.append("<script type='text/javascript' src='" + Nut.strAppName + "/script/game.js' ></script>");
     //Loading Common JS
     oHead.append("<script type='text/javascript' src='/gameCommon/script/common.js' ></script>");
     Log("Loaded game js");
     Nut.StartLoading();
}

Nut.PreLoadImages = function () {
     $.get(Nut.strAppName + "/config/images.xml", function (xml) {
          $(xml).find("image").each(function () {
               var oThis = $(this);
               var strPath = Nut.strAppName + "/media/images/";
               $('<img />').attr('src', strPath + oThis.attr('name'));
               Log("Preload Image : " + strPath + oThis.attr('name'));
          });
          Log("Loading Images Complete");
          Nut.LoadProgess["ImagesLoaded"] = true;
     });
}

//Text.GetText

Nut.LoadText = function () {
     //loading text.xml into Text object
     $.get(Nut.strAppName + "/data/text.xml", function (xml) {
          $(xml).find("element").each(function () {
               var oThis = $(this);
               Text[oThis.attr('id')] = oThis.text();
          });
          Log("Text Loading Complete");
          Nut.LoadProgess["TextLoaded"] = true;
     });
}

Nut.LoadExtras = function () {
     var strCsspath = Nut.strAppName + "/style/";
     var strJspath = Nut.strAppName + "/script/";
     var strXmlpath = Nut.strAppName + "/config/";
     var oHead = $('head');
     $.get(Nut.strAppName + "/config/extras.xml", function (xml) {
          Log("Loading Exta Files Started");
          $(xml).find("file").each(function () {
               var oThis = $(this);
               switch (oThis.attr('type')) {
                    case "js":
                         oHead.append("<script type='text/javascript' src='" + strJspath + oThis.attr('name') + "' ></script>");
                         Log("Loaded JS : " + strJspath + oThis.attr('name'));
                         break;
                    case "css":
                         oHead.append("<link rel='stylesheet' type='text/css' href='" + strCsspath + oThis.attr('name') + "' />");
                         Log("Loaded Css : " + strCsspath + oThis.attr('name'));
                         break;
                    case "xml":
                         if(!Nut.LoadProgess["HasXML"]){
                              Nut.LoadProgess["HasXML"] = new Object();
                         }
                         Nut.LoadProgess["HasXML"][strXmlpath + oThis.attr('name')] = false;
                         $.get(strXmlpath + oThis.attr('name'), function (xml) {
                              Xml[oThis.attr('id')] = xml;
                              Log("Loaded Xml : " + strXmlpath + oThis.attr('name'));
                              Nut.LoadProgess["HasXML"][strXmlpath + oThis.attr('name')] = true;
                         });
                         break;
               }
          });
          Nut.LoadProgess["ExtrasLoaded"] = true;
     });
}

Nut.StartLoading = function () {
     Log("Start Loading Started");
     Nut.LoadExtras();
     Nut.PreLoadImages();
     Nut.LoadText();
     var iTimer = setInterval(function () {
          Log("Check");
          if (Nut.LoadProgess["ImagesLoaded"] && Nut.LoadProgess["TextLoaded"] && Nut.LoadProgess["ExtrasLoaded"]) {
            TempStopTime = new Date().getTime();
            var iexecuteTime = TempStopTime - TempstartTime;
               if (Nut.LoadProgess["HasXML"]) {
                    var wait = false;
                    for (key in Nut.LoadProgess["HasXML"]) {
                         if (!Nut.LoadProgess["HasXML"][key]) {
                              wait = true;
                         }
                    }
                    if (!wait) {
                         Log("Start Loading Complete having xml");
                         Log(TempStopTime);
                         if(iexecuteTime >= 5000){
                            clearInterval(iTimer);
                            Nut.InitGame();
                         }
                    }
               } else {
                    Log("Start Loading Complete");
                    Log(TempStopTime);
                    if(iexecuteTime >= 5000){
                        clearInterval(iTimer);
                        Nut.InitGame();
                    }
               }
          }
     }, 40);
}

Nut.PlayAdvertise = function () {

     $.get("/advertises/advertise.xml", function (xml) {
          var strName = Nut.strAppName.split("/")[2];
          $(xml).find(strName).each(function () {
               $(this).find("space").each(function () {
                    var strId = $(this).attr('id');
                    if (!oAddPath[strId]) {
                         oAddPath[strId] = new Array();
                    }
                    $(this).find("path").each(function () {
                         oAddPath[strId].push("/advertises/" + $(this).text());
                    });
               });
          });
          var arrImg = oAddPath["Fone"];
          var src = arrImg[parseInt(Math.random() * arrImg.length)];
          $("div").hide();
          $("#nutContainer").append("<div id='ImgAd' style='background-image : url(" + src + ");' ></div><div id='LoadingArea'>Loading .....</div>");
          $("#nutContainer,#ImgAd,#LoadingArea").show();
     });
}

Nut.InitGame = function () {
     $("#LoadingArea").empty().html("Loading Complete.<br /> Click To Start");
     $("#LoadingArea").unbind("click").bind("click", function () {
          $("#LoadingArea").remove();
          $("#ImgAd").remove();
          Game.Init();
     });
}