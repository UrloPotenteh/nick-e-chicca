var $window = $(window);
var offsetX, offsetY;
var gardenCanvas, gardenCtx, garden;

$(function () {
    // Setup canvas responsive
    initGarden();

    setInterval(function () {
        if (garden) garden.render();
    }, Garden.options.growSpeed);
});


function initGarden() {
    var container = document.getElementById('loveHeart');
    if (!container) return;
    
    // Calcola la dimensione del contenitore
    var size = Math.min(container.offsetWidth, container.offsetHeight);
    gardenCanvas = document.getElementById('garden');
    
    // --- FIX PER MOBILE (NITIDEZZA) ---
    // Rileviamo la densità dei pixel dello schermo (es. iPhone ha 3x)
    var ratio = window.devicePixelRatio || 1;
    
    // Moltiplichiamo la risoluzione interna per il ratio
    gardenCanvas.width = size * ratio;      
    gardenCanvas.height = size * ratio;
    
    // Impediamo al canvas di ingrandirsi visivamente
    gardenCanvas.style.width = size + 'px';  
    gardenCanvas.style.height = size + 'px';
    
    gardenCtx = gardenCanvas.getContext('2d');
    
    // Scaliamo il contesto di disegno in base al ratio
    // Senza questo, i fiori verrebbero disegnati piccolissimi in un angolo
    gardenCtx.setTransform(ratio, 0, 0, ratio, 0, 0); 
    // ----------------------------------

    gardenCtx.globalCompositeOperation = 'lighter';
    garden = new Garden(gardenCtx, gardenCanvas);
    
    // Centra il cuore nel canvas
    offsetX = size / 2;
    // Sposta leggermente il centro verso l'alto (9% della dimensione)
    offsetY = size / 2 - size * 0.09;
}

function getHeartPoint(angle) {
    var size = gardenCanvas.width;
    var sc = size / 36;
    var t = angle / Math.PI;
    var x = sc * (16 * Math.pow(Math.sin(t), 3));
    var y = -sc * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return [offsetX + x, offsetY + y];
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = [];
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0]-bloom[0],2) + Math.pow(p[1]-bloom[1],2));
            if (distance < Garden.options.bloomRadius.max * 1.3) { draw = false; break; }
        }
        if (draw) { heart.push(bloom); garden.createRandomBloom(bloom[0], bloom[1]); }
        if (angle >= 30) { clearInterval(animationTimer); showMessages(); }
        else { angle += 0.2; }
    }, interval);
}

function showMessages() {
    $('#messages').fadeIn(2000, function() { showLoveU(); });
}

function showLoveU() {
    $('#loveu').fadeIn(2000);
}

function adjustCodePosition() {} // non usata ma tenuta per compatibilità
function timeElapse(date) {}    // non usata — timer gestito nel JS principale
