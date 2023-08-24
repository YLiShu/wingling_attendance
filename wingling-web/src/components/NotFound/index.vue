<template>
  <div class="not-found">
    <canvas id="c"></canvas>
    <div class="content">
      <h1 class="glitch" data-text="404">404</h1>
      <p><span class="sub">OOPS! PAGE NOT FOUND</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    this.initCanvas();
    setTimeout(() => {
      this.$router.push('/login');
    }, 5000);
  },
  methods: {
    initCanvas() {
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const properties = {
        bgColor: 'rgba(0, 0, 0, 1)',
        particleColor: 'rgba(173, 216, 230, 1)',
        particleRadius: 3,
        particleCount: 60,
        particleMaxVelocity: 0.5,
        lineLength: 150,
        particleLife: 6,
      };

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.velocityX =
            Math.random() * (properties.particleMaxVelocity * 2) -
            properties.particleMaxVelocity;
          this.velocityY =
            Math.random() * (properties.particleMaxVelocity * 2) -
            properties.particleMaxVelocity;
          this.life = Math.random() * properties.particleLife * 60;
        }

        position() {
          this.x + this.velocityX > canvas.width || this.x + this.velocityX < 0
            ? (this.velocityX *= -1)
            : this.velocityX;
          this.y + this.velocityY > canvas.height || this.y + this.velocityY < 0
            ? (this.velocityY *= -1)
            : this.velocityY;
          this.x += this.velocityX;
          this.y += this.velocityY;
        }

        reDraw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = properties.particleColor;
          ctx.fill();
        }

        reCalculateLife() {
          if (this.life < 1) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.velocityX =
              Math.random() * (properties.particleMaxVelocity * 2) -
              properties.particleMaxVelocity;
            this.velocityY =
              Math.random() * (properties.particleMaxVelocity * 2) -
              properties.particleMaxVelocity;
            this.life = Math.random() * properties.particleLife * 60;
          }
          this.life--;
        }
      }

      function reDrawBackground() {
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      function drawLines() {
        let x1, y1, x2, y2, length, opacity;
        for (let i in particles) {
          for (let j in particles) {
            x1 = particles[i].x;
            y1 = particles[i].y;
            x2 = particles[j].x;
            y2 = particles[j].y;
            length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            if (length < properties.lineLength) {
              opacity = 1 - length / properties.lineLength;
              ctx.lineWidth = '0.5';
              ctx.strokeStyle = `rgba(173, 216, 230, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
      }

      function reDrawParticles() {
        for (let i in particles) {
          particles[i].reCalculateLife();
          particles[i].position();
          particles[i].reDraw();
        }
      }

      function loop() {
        reDrawBackground();
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
      }

      function init() {
        for (let i = 0; i < properties.particleCount; i++) {
          particles.push(new Particle());
        }
        loop();
      }

      init();
    },
  },
};
</script>

<style scoped>
.not-found {
  position: relative;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Courier New", Courier, monospace;
  text-align: center;
  color: #fff;
  z-index: 1;
}

h1 {
  font-size: 10em;
  margin: 0;
  font-weight: 700;
  position: relative;
  -webkit-animation: glitch 1s infinite, deform 1s infinite;
  animation: glitch 1s infinite, deform 1s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  color: #000;
  background: #1e1e1e;
  overflow: hidden;
  clip: rect(44px, 450px, 56px, 0);
  -webkit-animation: glitch 5s infinite linear alternate-reverse, deform 5s infinite linear alternate-reverse;
  animation: glitch 5s infinite linear alternate-reverse, deform 5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #00fff9, -5px 0 #ff00c1;
  color: #000;
  background: #1e1e1e;
  overflow: hidden;
  clip: rect(85px, 450px, 86px, 0);
  -webkit-animation: glitch 1s infinite linear alternate-reverse, deform 1s infinite linear alternate-reverse;
  animation: glitch 1s infinite linear alternate-reverse, deform 1s infinite linear alternate-reverse;
}

.sub {
  display: block;
  font-size: 2em;
  letter-spacing: 2px;
  position: relative;
  -webkit-animation: glitch 2s infinite, deform 2s infinite;
  animation: glitch 2s infinite, deform 2s infinite;
}

@keyframes glitch {
  0% {
    clip: rect(79px, 9999px, 80px, 0);
  }
  5% {
    clip: rect(73px, 9999px, 33px, 0);
  }
  10% {
    clip: rect(86px, 9999px, 23px, 0);
  }
  15% {
    clip: rect(26px, 9999px, 94px, 0);
  }
  20% {
    clip: rect(65px, 9999px, 90px, 0);
  }
  25% {
    clip: rect(92px, 9999px, 28px, 0);
  }
  30% {
    clip: rect(8px, 9999px, 20px, 0);
  }
  35% {
    clip: rect(41px, 9999px, 32px, 0);
  }
  40% {
    clip: rect(66px, 9999px, 76px, 0);
  }
  45% {
    clip: rect(79px, 9999px, 60px, 0);
  }
  50% {
    clip: rect(93px, 9999px, 28px, 0);
  }
  55% {
    clip: rect(40px, 9999px, 72px, 0);
  }
  60% {
    clip: rect(30px, 9999px, 63px, 0);
  }
  65% {
    clip: rect(76px, 9999px, 55px, 0);
  }
  70% {
    clip: rect(50px, 9999px, 28px, 0);
  }
  75% {
    clip: rect(92px, 9999px, 100px, 0);
  }
  80% {
    clip: rect(7px, 9999px, 13px, 0);
  }
  85% {
    clip: rect(66px, 9999px, 86px, 0);
  }
  90% {
    clip: rect(69px, 9999px, 70px, 0);
  }
  95% {
    clip: rect(14px, 9999px, 34px, 0);
  }
  100% {
    clip: rect(70px, 9999px, 95px, 0);
  }
}

@keyframes deform {
  0% {
    transform: translate(0);
  }
  5% {
    transform: translate(-5px, -5px);
  }
  10% {
    transform: translate(5px, -5px);
  }
  15% {
    transform: translate(-5px, -5px);
  }
  20% {
    transform: translate(5px, 5px);
  }
  25% {
    transform: translate(-5px, 5px);
  }
  30% {
    transform: translate(5px, 5px);
  }
  35% {
    transform: translate(-5px, -5px);
  }
  40% {
    transform: translate(-5px, 5px);
  }
  45% {
    transform: translate(-5px, -5px);
  }
  50% {
    transform: translate(5px, -5px);
  }
  55% {
    transform: translate(5px, -5px);
  }
  60% {
    transform: translate(-5px, 5px);
  }
  65% {
    transform: translate(5px, 5px);
  }
  70% {
    transform: translate(-5px, -5px);
  }
  75% {
    transform: translate(-5px, 5px);
  }
  80% {
    transform: translate(-5px, -5px);
  }
  85% {
    transform: translate(5px, -5px);
  }
  90% {
    transform: translate(-5px, -5px);
  }
  95% {
    transform: translate(-5px, 5px);
  }
  100% {
    transform: translate(0);
  }
}
</style>