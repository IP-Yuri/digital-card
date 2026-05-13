/**
 * AVYR ENGINEERING STANDARDS
 * Vanilla JS Module: Cyber-VCard Kinetics & Particle System
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------------
       1. Encapsulated Particle Network
       ------------------------------------------------------------------------ */
    class CyberParticleSystem {
        constructor(canvasElement) {
            this.canvas = canvasElement;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.container = this.canvas.parentElement;
            
            // Interaction radius
            this.connectionDistance = 120;
            this.particleColor = '#A7EBF2'; // clr-cyan-bright
            
            this.init();
            this.animate();
            this.setupResizeObserver();
        }

        resize() {
            // Scope canvas dimensions to the parent module, not the global window
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
        }

        setupResizeObserver() {
            const resizeObserver = new ResizeObserver(() => {
                this.resize();
                this.createParticles();
            });
            resizeObserver.observe(this.container);
        }

        createParticles() {
            this.particles = [];
            // Calculate particle density based on current module area
            const density = (this.canvas.width * this.canvas.height) / 12000;
            
            for (let i = 0; i < density; i++) {
                const size = (Math.random() * 2) + 1;
                const x = Math.random() * (this.canvas.width - size * 2) + size;
                const y = Math.random() * (this.canvas.height - size * 2) + size;
                const velX = (Math.random() * 1) - 0.5;
                const velY = (Math.random() * 1) - 0.5;
                
                this.particles.push({ x, y, velX, velY, size });
            }
        }

        init() {
            this.resize();
            this.createParticles();
        }

        drawParticle(p) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.particleColor;
            this.ctx.fill();
        }

        updateParticle(p) {
            // Boundary collision
            if (p.x > this.canvas.width || p.x < 0) p.velX = -p.velX;
            if (p.y > this.canvas.height || p.y < 0) p.velY = -p.velY;
            
            // Movement
            p.x += p.velX;
            p.y += p.velY;
            
            this.drawParticle(p);
        }

        drawConnections() {
            for (let a = 0; a < this.particles.length; a++) {
                for (let b = a; b < this.particles.length; b++) {
                    const dx = this.particles[a].x - this.particles[b].x;
                    const dy = this.particles[a].y - this.particles[b].y;
                    const distanceSq = (dx * dx) + (dy * dy);
                    
                    if (distanceSq < (this.connectionDistance * this.connectionDistance)) {
                        const opacity = 1 - (Math.sqrt(distanceSq) / this.connectionDistance);
                        this.ctx.strokeStyle = `rgba(167, 235, 242, ${opacity * 0.5})`; // clr-cyan-bright with calculated opacity
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                        this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        animate = () => {
            requestAnimationFrame(this.animate);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(p => this.updateParticle(p));
            this.drawConnections();
        }
    }

    // Initialize the particle system securely mapped only to the vcard canvas
    const canvasEl = document.querySelector('.vcard-particle-canvas');
    if (canvasEl) {
        new CyberParticleSystem(canvasEl);
    }

    /* ------------------------------------------------------------------------
       2. Kinetic Scroll Observer
       ------------------------------------------------------------------------ */
    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -5% 0px', 
        threshold: 0.1 
    };

    const kineticObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.cyber-vcard-module .avyr-reveal');
    elementsToReveal.forEach(el => kineticObserver.observe(el));

    /* ------------------------------------------------------------------------
       3. VCF Download Trigger
       ------------------------------------------------------------------------ */
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'Salaheddine_Chikhi.vcf';
            link.download = 'Salaheddine_Chikhi.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});