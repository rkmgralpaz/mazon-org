function myIframeFunction () {
    window.scrollTo(0,0);
    parent.newFromIframe.myFunction();
};
document.addEventListener("DOMContentLoaded", function(event) { 
    myIframeFunction();
});
document.getElementsByTagName("form").addEventListener("submit", function(event) { 
    myIframeFunction();
});
