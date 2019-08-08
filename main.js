document.getElementsByTagName('article')[0].className = 'ready';

if(!window.Float32Array){
    window.Float32Array = Array;
}


var canvas = document.getElementById('c'),
    WIDTH = canvas.clientWidth, // px
    HEIGHT = canvas.clientHeight,
    NPARTICLES = 62000,
    screenRatio = WIDTH/800,
    logo_x = 0,
    logo_y = 0,
    pixel_density = 1,
    fingerprint = 15;

canvas.style.width = WIDTH + 'px';
canvas.style.height = HEIGHT + 'px';
canvas.width = WIDTH;
canvas.height = HEIGHT;

if(navigator.userAgent.match(/iPad/i)){
//                pixel_density = 2;
    fingerprint = 25;
    NPARTICLES *= (screenRatio/pixel_density);
}
else if(navigator.userAgent.match(/iPhone|iPod|Android/i)){
//                pixel_density = 2;
    fingerprint = 25;
    NPARTICLES *= (screenRatio/(pixel_density+1));
    NPARTICLES += 1000;
    // WOW it's that hard to get fullscreen on android
    if(navigator.userAgent.match(/Android/i)){
        canvas.style.height = '1000px';
        setTimeout(function(){
            window.scrollTo(0, window.innerHeight);
            setTimeout(function(){
                canvas.style.height = document.documentElement.clientHeight + 'px';
            },1);
        },100);
    }
}


load_canvas = function() {
    
    var ctx = canvas.getContext('2d'),
        particles = new Float32Array(NPARTICLES*5);

    var i = 0;
    
    // we need to decouple pixel data from DOM because reasons
    // http://ajaxian.com/archives/canvas-image-data-optimization-tip
    var pixels = logo_context.getImageData(0, 0, 600, 250);
    var pixeldata = pixels.data;
    var px = 0;
    
    for( var y = 0; y < 250; y += pixel_density ) {
        for( var x = 0; x < 600; x += pixel_density ) {
            if( pixeldata[4*px+3] > 0 ) {
                particles[i++] = x + (canvas.width  - logo_x)/2;
                particles[i++] = y + (canvas.height - logo_y)/2;
                particles[i++] = 0;
                particles[i++] = 0;
                particles[i++] = pixeldata[4*px+3];
            }
            px++;
        }
    }

    var start = {x:0,y:0}, down = false;
    canvas.onmousedown = function(e){
        start.x = (e.clientX-canvas.offsetLeft);// *screenRatio
        start.y = (e.clientY-canvas.offsetTop);
        down = true;
    }
    canvas.ontouchstart = function(e){
        canvas.onmousedown(e.touches[0]);
        return false;
    }
    canvas.onmouseup = canvas.ontouchend = function(){
        down = false;
    }
    canvas.ontouchmove = function(e){
        canvas.onmousemove(e.touches[0]);
    }
    
    var mx = 0;
    var my = 0;
    var mvx = 0;
    var mvy = 0;
    
    canvas.onmousemove = function(e){
//      if(!down) return;
        mx = (e.clientX-canvas.offsetLeft);
        my = (e.clientY-canvas.offsetTop + window.pageYOffset);
        mvx += (mx-start.x);
        mvy += (my-start.y);
        start.x = mx;
        start.y = my;
    };
    
    ctx.globalCompositeOperation = 'source-over';
    (function animloop(){
        var x, y, vx, vy;
        ctx.clearRect( 0, 0, WIDTH, HEIGHT );
        //ctx.fillStyle = 'rgb(0, 0, 0)';
        //ctx.fillRect(0, 0, WIDTH, HEIGHT);
        //ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        //ctx.globalCompositeOperation = 'lighter'; 
        var imgData = ctx.createImageData(WIDTH, HEIGHT);
        var particles_pixel_number = 0;
        for(var i = 0, l = particles.length; i < l;i+=5){
            x = particles[i]
            y = particles[i+1];
            if( x < 0 || x > WIDTH || y < 0 || y > HEIGHT ) {
                // off the screen, save some cpu power
                continue;
            }
            vx = particles[i+2];
            vy = particles[i+3];
            
            var ld = lineDistance( x, y, mx, my );
            if( ld < fingerprint ) {
                // add mouse velocity to pixel velocity
                vx += mvx * (fingerprint-ld) * Math.random() * .05;
                vy += mvy * (fingerprint-ld) * Math.random() * .05;
            }

            // move pixel
                x += vx;
                y += vy;
                if( x < 0 || x > WIDTH || y < 0 || y > HEIGHT ) {
                    // off the screen; do not render
                    continue;
                }

            // paint pixel
                particles_pixel_number = ((Math.floor(y)-1) * WIDTH + Math.floor(x)) * 4;
                imgData.data[particles_pixel_number] = basecolor;
                imgData.data[particles_pixel_number+1] = basecolor;
                imgData.data[particles_pixel_number+2] = basecolor;
                imgData.data[particles_pixel_number+3] = particles[i+4];
    
            // dampem velocity
                vx *= 0.5;
                vy *= 0.5;
    
            // update particle array
                particles[i] = x;
                particles[i+1] = y;
                particles[i+2] = vx;
                particles[i+3] = vy;
            
        }
        ctx.putImageData(imgData,0,0);
        mvx *= 0.5;
        mvy *= 0.5;
        requestAnimationFrame(animloop);
    })();
 
    document.body.className = theme;
    document.getElementById('c').className = 'visible';
   
}




var logo_canvas = document.getElementById('d');
var logo_context = logo_canvas.getContext('2d');

function loadCanvas(url) {
    var img = new Image();
    img.onload = function() {
        logo_x = img.width  * screenRatio;
        logo_y = img.height * screenRatio;
        logo_context.drawImage(img, 0, 0, img.width, img.height, 0, 0, logo_x, logo_y);
        load_canvas();
    };
    img.src = url;
}
loadCanvas('s_n_p_600.png');

function lineDistance( point1x, point1y, point2x, point2y ) {
    var xs = 0;
    var ys = 0;
    
    xs = point2x - point1x;
    xs = xs * xs;
    
    ys = point2y - point1y;
    ys = ys * ys;
    
    return Math.sqrt( xs + ys );
}




function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

document.onkeyup = function() {
    document.getElementById('send').disabled = (!validateEmail(document.getElementById('email').value) || !document.getElementById('msg').value.length > 0 );
}

$(function() {
    
   // intercept contact form
   $('#contact').on('submit', function(e) {
       e.preventDefault();
       $.ajax({
           method:'post',
           data: {'email':$('#email').val(), 'msg':$('#msg').val()},
           url: 'send.php',
           success: function() {
              $('#contact').slideUp();
              $('#thanks').html('<p>Thanks for writing, we’ll be in touch!</p>');
              $('#thanks').slideDown();
          } 
       });
   });
    
});

