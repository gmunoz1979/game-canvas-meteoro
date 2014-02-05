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

/**
 * Mostrar Energia
 */
function showEnergy(ctx) {
  ctx.clearRect(388, 10, 104, 13);
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(390, 12, this.energy, 9);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(389, 11, 101, 1);
  ctx.fillRect(490, 11, 1, 11);
  ctx.fillRect(389, 21, 101, 1)
  ctx.fillRect(389, 11, 1, 11);;
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

function drawCity(ctx) {
  ctx.fillStyle = '#111111';
  ctx.fillRect(  0, 290, 225,  10);
  ctx.fillRect( 10, 260,  20,  30);
  ctx.fillRect( 40, 280,  40,  50);
  ctx.fillRect( 50, 260,  20,  50);
  ctx.fillRect( 90, 280,  30,  50);
  ctx.fillRect( 90, 260,  20,  50);
  ctx.fillRect(130, 260,  20,  30);
  ctx.fillRect(160, 260,  20,  30);
  ctx.beginPath();
  ctx.moveTo(161, 260);
  ctx.lineTo(170, 250);
  ctx.lineTo(179, 260);
  ctx.fill();
  ctx.fillRect(190, 260,  20,  30);

  ctx.fillRect(275, 290, 225,  10);
  ctx.fillRect(285, 280,  60,  30);
  ctx.fillRect(295, 260,  20,  50);
  ctx.fillRect(325, 260,  20,  50);
  ctx.fillRect(355, 260,  20,  30);
  ctx.beginPath();
  ctx.moveTo(356, 260);
  ctx.lineTo(365, 250);
  ctx.lineTo(374, 260);
  ctx.fill();
  ctx.fillRect(385, 260,  20,  30);
  ctx.fillRect(415, 280,  40,  50);
  ctx.fillRect(425, 260,  20,  50);
  ctx.fillRect(465, 260,  20,  30);
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

        if (tank.energy === 0) {
          showGameOver(ctx);
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