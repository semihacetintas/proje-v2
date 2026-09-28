/**
 * Confetti (Kutlama Konfetisi) Bileşeni
 * 
 * Staj Eğitim Notu: Oyuncu bir bulmacayı başarıyla çözdüğünde (kazandığında)
 * HTML5 Canvas API kullanarak ekranda renkli konfetiler düşüren animasyon bileşenidir.
 */

import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  /** Konfeti animasyonunun aktif / pasif durumu */
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  // HTML5 Canvas elemanına erişim için React Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Animasyon aktif değilse çalıştırma
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas boyutunu ekran genişlik ve yüksekliğine eşitliyoruz
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;
    // Konfeti parçacıklarının kullanacağı canlı renk paleti
    const colors = ["#8b5cf6", "#a78bfa", "#14b8a6", "#2dd4bf", "#f59e0b", "#fbcfe8"];
    const particles: ConfettiParticle[] = [];

    // Tek bir konfeti parçacığının konum, hız ve çizim sınıfı (Class)
    class ConfettiParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        // Rastgele başlangıç koordinatları ve düşüş hızları
        this.x = Math.random() * canvas!.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = Math.random() * 5 + 4;
        this.size = Math.random() * 8 + 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      }

      // Parçacığın konumunu ve yerçekimi ivmesini günceller
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.vy += 0.05; // Yerçekimi etkisi
      }

      // Parçacığı 2D Canvas üzerine çizer
      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.fillStyle = this.color;
        c.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        c.restore();
      }
    }

    // Başlangıçta 150 adet konfeti parçacığı oluşturuyoruz
    for (let i = 0; i < 150; i++) {
      particles.push(new ConfettiParticle());
    }

    // Animasyon döngüsü (requestAnimationFrame)
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        // Ekranın altına düşen parçacıkları hafızadan temizle
        if (p.y > canvas.height) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Pencere boyutu değiştiğinde canvas boyutunu güncelle
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Temizleme fonksiyonu (Cleanup)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none w-screen h-screen"
    />
  );
}

