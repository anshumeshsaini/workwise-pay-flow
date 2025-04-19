
import { useEffect } from "react";

// Simple confetti effect for successful payments
export function Confetti() {
  useEffect(() => {
    const confettiCount = 150;
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    for (let i = 0; i < confettiCount; i++) {
      createConfetti(container, colors);
    }
    
    const timer = setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  return null;
}

function createConfetti(container: HTMLDivElement, colors: string[]) {
  const confetti = document.createElement('div');
  const size = Math.random() * 10 + 5;
  
  confetti.style.position = 'absolute';
  confetti.style.width = `${size}px`;
  confetti.style.height = `${size}px`;
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.top = '-20px';
  confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '0'}`;
  confetti.style.opacity = '0.8';
  
  container.appendChild(confetti);
  
  const startTime = Date.now();
  const duration = Math.random() * 3000 + 2000; // 2-5 seconds
  const endTime = startTime + duration;
  
  const horizontalMovement = Math.random() * 15 - 7.5; // -7.5 to 7.5
  const initialVerticalVelocity = Math.random() * 2 + 3; // 3-5
  const gravity = 0.1;
  const rotation = Math.random() * 360;
  const rotationSpeed = Math.random() * 6 - 3; // -3 to 3
  
  let verticalPosition = -20;
  let verticalVelocity = initialVerticalVelocity;
  let horizontalPosition = parseFloat(confetti.style.left);
  
  function animateConfetti() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    verticalVelocity += gravity;
    verticalPosition += verticalVelocity;
    horizontalPosition += horizontalMovement * 0.1;
    
    const currentRotation = rotation + rotationSpeed * elapsed / 100;
    
    confetti.style.transform = `translate(${horizontalMovement * progress}px, ${verticalPosition}px) rotate(${currentRotation}deg)`;
    confetti.style.opacity = `${1 - progress}`;
    
    if (progress < 1 && verticalPosition < window.innerHeight) {
      requestAnimationFrame(animateConfetti);
    } else {
      container.removeChild(confetti);
    }
  }
  
  requestAnimationFrame(animateConfetti);
}
