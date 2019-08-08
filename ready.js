var coinflip = !! Math.round(Math.random() * 1);
if(coinflip) {
    var theme = 'salt';
    var color = 'rgb(255,255,255)';
    var bgcolor = 'rgb(0,0,0)';
    var basecolor = 255;
} else {
    var theme = 'pepper';
    var color = 'rgb(0,0,0)';
    var bgcolor = 'rgb(255,255,255)';
    var basecolor = 0;
}
window.document.body.style.backgroundColor = bgcolor;
window.document.body.style.color = color;

