
$(document).ready(function () {
     Site.Init();
});

var Site = new Object();
Site.Init = function () {
     $(".AppLink").unbind("click").bind("click", Site.AppLinkClicked);
}

Site.AppLinkClicked = function () {
     var oThis = $(this);
     var strLink = oThis.attr("for");
     var newTab = window.open(strLink, '_blank', 'toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1');
}