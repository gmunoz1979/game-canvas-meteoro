/**
 * Filename: src/rain.js
 * Author: Gerard Muñoz <gmunoz1979@gmail.com>
 * Description: 
 *  Función demo creada para simular la caida de 
 *  lluvia.
 */

/**
 * Definimos los margenes
 */
MINWIDTH  = 0;
MINHEIGHT = 0;
MAXWIDTH  = 0;
MAXHEIGHT = 0;

KEYS = {
  'LEFT':  37,
  'RIGHT': 39,
  'SPACE': 32
};

/**
 * Función encargada de definir IDs
 */
id = 0;
function getId() { return 'obj-' + id++; };

/**
 * Mostrar Puntos
 */
function showPoints(ctx) {
  var text = 'Points: ' + this.points,
      metrics = ctx.measureText(text);

  ctx.clearRect(11, 12, metrics.width+1, 10);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Points: ' + this.points, 11, 21);
}

var bordeEnergy = new Path2D();
bordeEnergy.rect(389, 11, 101, 1);
bordeEnergy.rect(490, 11, 1, 11);
bordeEnergy.rect(389, 21, 101, 1);
bordeEnergy.rect(389, 11, 1, 11);

/**
 * Mostrar Energia
 */
function showEnergy(ctx) {
  ctx.clearRect(388, 10, 104, 13);

  var energy = new Path2D();
  energy.rect(390, 12, this.energy, 9);

  ctx.fillStyle = '#FF0000';
  ctx.fill(energy)
  ctx.fillStyle = '#FFFFFF';
  ctx.fill(bordeEnergy);
}

/**
 * Mostrar Game Over
 */
function showGameOver(ctx) {

  ctx.save();
  ctx.font = '20px sans-serif';

  var text    = 'Game Over',
      metrics = ctx.measureText(text);

  ctx.clearRect(251-(metrics.width/2), 132, metrics.width, 19);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, 250-(metrics.width/2), 150);
  ctx.restore();
}

var city = new Path2D('m 1.049399,301.2515 0.0884,-10.96015 10.03208,0 -0.0442,-30.18463 19.93157,0.0442 0.0442,30.09623 10.03208,0.0884 0,-9.94369 9.89949,-0.0442 -0.0442,-20.19674 19.97576,0.0442 0.0442,20.06416 10.12046,0.0442 -0.0442,9.94369 10.07627,0 -0.13258,-30.09623 19.931571,0.13258 0.17678,20.01996 9.76691,0.0884 0,9.8995 10.25305,0 0,-30.05204 19.53382,0.0442 0.13258,30.09623 10.34144,-0.17677 0.0442,-30.05204 9.94368,-10.12047 9.85531,10.25305 0.0442,29.83107 10.16466,0 -0.0442,-29.78687 19.93157,-0.13259 -0.0442,30.09624 14.84925,0.0442 -0.0442,9.98788 50.20458,-0.0884 0.0442,-9.98788 10.29724,0.0884 0,-9.98788 9.63433,-0.0884 0.0884,-20.01996 19.75479,0.0442 0.0442,20.10835 10.20885,-0.0884 0,-20.15254 19.97577,0.0884 -0.0442,30.00784 9.8995,-0.0442 0.0442,-30.05204 10.07628,-9.98788 9.8553,10.12046 0.0884,30.00785 9.98789,0 0.13258,-30.05204 19.84318,0 0.13259,30.05204 9.94369,0 0.0442,-9.98789 10.12047,0.0442 -0.0884,-20.01996 19.93157,-0.0442 -0.0442,19.97577 20.19673,0 -0.22097,-20.01996 20.10835,0 -0.17678,30.00784 15.15861,0.0442 -0.0884,10.96015 z');
var moon = new Path2D('m 66.556881,55.622602 c -8.188,0 -14.82,-6.637002 -14.82,-14.820002 0,-2.695 0.773,-5.188 2.031,-7.363 -6.824,1.968 -11.844,8.187 -11.844,15.644 0,9.031002 7.32,16.355002 16.352,16.355002 7.457,0 13.68,-5.023 15.648,-11.844 -2.18,1.254 -4.672,2.028 -7.367,2.028 z');

function drawCity(ctx) {
  ctx.fillStyle = '#111111';
  ctx.fill(city);
  ctx.fillStyle = '#FFFF00';
  ctx.fill(moon);
}

(
  function(root) {

    var canvas;

    var getContext = function() {
      canvas = document.getElementById('world');

      if (!canvas || !canvas.getContext) {
        console.debug('Cavas no soporta la funcion getContext');
        return null;
      }

      return canvas.getContext('2d');
    }

    root.onload = function() {
      /**
       * Obtenemos el contexto
       */
      var ctx = getContext();

      if (!ctx) {
        console.error('No se encontro contexto. No se puede seguir ejecutando la funcion.');
        return;
      }
      
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled    = false;

      /**
       * Definimos los margenes maximos
       */
      MAXWIDTH  = canvas.clientWidth,
      MAXHEIGHT = canvas.clientHeight;

      var tank = new Tank({ ctx: ctx });

      window.addEventListener('keydown',
        function(e) { 
          if (tank.energy <= 0) {
            return;
          }

          switch(e.keyCode) {
            case KEYS['RIGHT']:
              tank.startMove(+1.5);
              break;
            case KEYS['LEFT']:
              tank.startMove(-1.5);
              break;
            case KEYS['SPACE']:
              tank.startFire();
              break;
          }
        }
      );

      window.addEventListener('keyup',
        function(e) { 

          switch(e.keyCode) {
            case KEYS['RIGHT']:
              tank.stopMove(+1.5);
            case KEYS['LEFT']:
              tank.stopMove(-1.5);
              break;
            case KEYS['SPACE']:
              tank.stopFire();
              break;
          }
        }
      );

      var onExploit = function() {
        tank.onExploit();
      }

      var dTime = 0;
      var loop  = function() {
        if (new Date().getTime() > dTime && tank.energy > 0) {
          /**
           * Creamos un nuevo meteoro
           */
          MeteoroManager.add(new Meteoro(
            { 
              ctx: ctx, 
              onExploit: onExploit 
            }
          ));

          dTime = new Date().getTime() + Math.floor((Math.random() * 6000 - 2000) + 2000);
        }

        ctx.clearRect(0, 0, 500, 300);

        if (tank.energy === 0) {
          showGameOver(ctx);
          return;
        }

        drawCity(ctx);
        MeteoroManager.update();
        tank.update();
        showPoints.apply(tank, [ctx]);
        showEnergy.apply(tank, [ctx]);

        /**
         * La función quedará ejecutandose en un Loop.
         */
        requestAnimationFrame(loop);
      }

      loop.call();
    }
  }
)(window);