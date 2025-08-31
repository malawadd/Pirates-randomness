import React, { useRef, useEffect } from 'react';

interface SeaBackgroundProps {
  className?: string;
}

export const SeaBackground: React.FC<SeaBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - lower resolution for performance
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      // Use lower resolution for better performance
      canvas.width = Math.min(rect.width * 0.5, 800);
      canvas.height = Math.min(rect.height * 0.5, 600);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Much fewer clouds for performance
    const clouds = Array.from(Array(8)).map((_, i) => ({ 
      x: i * 120 + Math.random() * 100, 
      y: 50 + Math.random() * 150, 
      speed: 0.2 + Math.random() * 0.3,
      scale: 0.8 + Math.random() * 0.4
    }));

    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001; // Convert to seconds
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#B0E0E6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple diagonal pattern (much less intensive)
      ctx.strokeStyle = '#0000ff05';
      ctx.lineWidth = 20;
      ctx.setLineDash([0, 25]);
      for (let i = 0; i < 10; i++) {
        ctx.save();
        ctx.translate(i * 80, 0);
        ctx.rotate(Math.PI * 0.25);
        ctx.beginPath();
        ctx.moveTo(0, -canvas.height);
        ctx.lineTo(0, canvas.height * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Simple clouds
      clouds.forEach(cloud => {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, 40 * cloud.scale, 15 * cloud.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Move clouds slowly
        cloud.x -= cloud.speed;
        if (cloud.x < -50) {
          cloud.x = canvas.width + 50;
        }
      });

      // Simple water
      const waterY = canvas.height * 0.75;
      const waterGradient = ctx.createLinearGradient(0, waterY, 0, canvas.height);
      waterGradient.addColorStop(0, '#4682B4');
      waterGradient.addColorStop(1, '#191970');
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, waterY, canvas.width, canvas.height - waterY);

      // Simple water waves
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      
      const waveHeight = 5;
      const segments = 20; // Much fewer segments
      
      for (let i = 0; i <= segments; i++) {
        const x = (i * canvas.width) / segments;
        const wave1 = Math.sin((x + elapsed * 30) * 0.02) * waveHeight;
        const wave2 = Math.cos((x + elapsed * 20) * 0.015) * waveHeight * 0.5;
        const y = waterY + wave1 + wave2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        imageRendering: 'pixelated'
      }}
    />
  );
};