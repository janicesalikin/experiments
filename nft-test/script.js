window.onload = function() {

  var img = new Image();
  img.crossOrigin = "anonymous";
  var dwn = document.getElementById('download');

  var blob = new Image();
  var blobbase ="assets/"
  var blobnum = Math.floor( Math.random() * 5 )+1;
  var blobname="blob" + blobnum + ".png";
  blob.src = blobbase + blobname;

  var face = new Image();
  var facebase ="assets/"
  var facenum = Math.floor( Math.random() * 5 )+1;
  var facename="face" + facenum + ".png";
  face.src = facebase + facename;

  var hat = new Image();
  var hatbase ="assets/"
  var hatnum = Math.floor( Math.random() * 5 )+1;
  var hatname="hat" + hatnum + ".png";
  hat.src = hatbase + hatname;

  var coins = new Image();
  var coinbase ="assets/"
  var coinsnum = Math.floor( Math.random() * 5 )+1;
  var coinsname="coins" + coinsnum + ".png";
  coins.src = coinbase + coinsname;

  var sparkle = new Image();
  var sparklebase ="assets/"
  var sparklenum = Math.floor( Math.random() * 5 )+1;
  var sparklename="sparkle" + sparklenum + ".png";
  sparkle.src = hatbase + sparklename;

  blob.onload = function() {
      buildblobs();
  }

  face.onload = function() {
      buildblobs();
  }

  hat.onload = function() {
      buildblobs();
  }

  coins.onload = function() {
      buildblobs();
  }

  sparkle.onload = function() {
      buildblobs();
  }

  function buildblobs() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 500;

  var hue = Math.floor(Math.random() * 360);
  var pastel = 'hsl(' + hue + ', 100%, 80%, 0.05)';

  ctx.fillStyle = pastel;
  ctx.fillRect(0, 0, 500, 500);

  ctx.drawImage(blob, ((500-blob.width)/2), 0);
  ctx.drawImage(face, ((500-face.width)/2), 0);
  ctx.drawImage(hat, ((500-hat.width)/2), 0);
  ctx.drawImage(coins, ((500-coins.width)/2), 0);
  ctx.drawImage(sparkle, ((500-sparkle.width)/2), 0);

  }

  dwn.onclick = function() {
     download(canvas, 'blob.jpg');
  }

}

function download(canvas, filename) {

  var lnk = document.createElement('a'), e;
  lnk.download = filename;
  lnk.href = canvas.toDataURL("image/jpg;base64");

  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
    lnk.dispatchEvent(e);
  }

  else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }

}
