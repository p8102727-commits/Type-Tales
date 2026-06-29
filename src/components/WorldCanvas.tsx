import React, { useEffect, useRef } from 'react';
import { Area, Boss } from '../types';

interface WorldCanvasProps {
  currentArea: Area;
  currentBoss: Boss | null;
  bossHp: number;
  isCorrupted: boolean;
  timeOfDay: 'day' | 'sunset' | 'night';
  weather: 'sunny' | 'rain' | 'snow' | 'aurora';
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  triggerMagicBlast: boolean;
  onMagicBlastComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'leaf' | 'petal' | 'butterfly' | 'sparkle';
  alpha: number;
  life: number;
  maxLife: number;
}

export default function WorldCanvas({
  currentArea,
  currentBoss,
  bossHp,
  isCorrupted,
  timeOfDay,
  weather,
  graphicsQuality,
  triggerMagicBlast,
  onMagicBlastComplete
}: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Keep track of wind/time variables for sways
  const windTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const botFiringTimerRef = useRef<number>(0);

  // Trigger magic particles when player types correctly
  useEffect(() => {
    if (triggerMagicBlast) {
      botFiringTimerRef.current = 15; // fire for 15 frames
      spawnMagicParticles();
      onMagicBlastComplete();
    }
  }, [triggerMagicBlast]);

  const spawnMagicParticles = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Determine particle count based on graphics quality
    const maxParticles = 
      graphicsQuality === 'low' ? 5 :
      graphicsQuality === 'medium' ? 12 :
      graphicsQuality === 'high' ? 25 : 45;

    // Pick colors based on area
    let colors = ['#10b981', '#6ee7b7', '#34d399', '#a7f3d0']; // green default
    if (currentArea.id === 'sunflower_plains') {
      colors = ['#fbbf24', '#f59e0b', '#fef3c7', '#fcd34d']; // yellow/gold
    } else if (currentArea.id === 'cherry_garden') {
      colors = ['#f472b6', '#ec4899', '#fbcfe8', '#fce7f3']; // pink/sakura
    } else if (currentArea.id === 'crystal_mountains' || currentArea.id === 'floating_islands') {
      colors = ['#60a5fa', '#93c5fd', '#3b82f6', '#dbeafe']; // sky blue/crystal
    } else if (currentArea.id === 'cozy_village') {
      colors = ['#fb923c', '#f97316', '#ffedd5', '#fed7aa']; // orange solarpunk
    } else if (currentArea.id === 'mushroom_valley') {
      colors = ['#c084fc', '#a855f7', '#e9d5ff', '#f3e8ff']; // purple/lavender
    } else if (currentArea.id === 'star_observatory') {
      colors = ['#818cf8', '#6366f1', '#e0e7ff', '#c7d2fe']; // indigo stars
    } else if (currentArea.id === 'coral_sea') {
      colors = ['#22d3ee', '#06b6d4', '#cffafe', '#a5f3fc']; // bioluminescent cyan
    } else if (currentArea.id === 'ancient_library') {
      colors = ['#fbbf24', '#f59e0b', '#fef3c7', '#fbcfe8']; // bright golden sheets
    }

    const types: ('leaf' | 'petal' | 'butterfly' | 'sparkle')[] = ['sparkle'];
    if (currentArea.id === 'whispering_forest' || currentArea.id === 'cozy_village' || currentArea.id === 'ancient_library') {
      types.push('leaf');
    }
    if (currentArea.id === 'cherry_garden' || currentArea.id === 'sunflower_plains' || currentArea.id === 'mushroom_valley') {
      types.push('petal');
    }
    if (graphicsQuality !== 'low') {
      types.push('butterfly');
    }

    for (let i = 0; i < maxParticles; i++) {
      // Spawn at the companion bot location (with float movement)
      const botFloatY = canvas.height * 0.58 + Math.sin(windTimeRef.current * 2) * 6;
      const startX = canvas.width / 2 + (Math.random() * 30 - 15);
      const startY = botFloatY + (Math.random() * 12 - 6);

      // Aim towards the boss location (32% from the top)
      const targetX = canvas.width / 2;
      const targetY = canvas.height * 0.32;

      const angle = Math.atan2(targetY - startY, targetX - startX) + (Math.random() * 0.3 - 0.15);
      const speed = 5 + Math.random() * 7;

      const pType = types[Math.floor(Math.random() * types.length)];
      
      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: pType === 'butterfly' ? 6 + Math.random() * 5 : 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: pType,
        alpha: 1,
        life: 0,
        maxLife: 50 + Math.floor(Math.random() * 30)
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 500;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Game loop
    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update wind simulation
      windTimeRef.current += dt * (graphicsQuality === 'low' ? 0.0005 : 0.0015);

      if (botFiringTimerRef.current > 0) {
        botFiringTimerRef.current--;
      }

      draw();
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentArea, currentBoss, bossHp, isCorrupted, timeOfDay, weather, graphicsQuality]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw Sky Background based on time of day
    let skyGradient = ctx.createLinearGradient(0, 0, 0, h);
    if (timeOfDay === 'day') {
      skyGradient.addColorStop(0, '#bae6fd'); // sky blue
      skyGradient.addColorStop(1, '#fef08a'); // soft morning warm yellow
    } else if (timeOfDay === 'sunset') {
      skyGradient.addColorStop(0, '#fda4af'); // rose pink
      skyGradient.addColorStop(0.5, '#f97316'); // deep orange
      skyGradient.addColorStop(1, '#fef3c7'); // beige cream
    } else { // night
      skyGradient.addColorStop(0, '#0f172a'); // deep navy
      skyGradient.addColorStop(0.6, '#1e1b4b'); // deep twilight purple
      skyGradient.addColorStop(1, '#020617'); // obsidian
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, w, h);

    // Draw Twinkling Stars at Night
    if (timeOfDay === 'night' && graphicsQuality !== 'low') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 35; i++) {
        const starX = (Math.sin(i * 12345) * 0.5 + 0.5) * w;
        const starY = (Math.cos(i * 54321) * 0.5 + 0.5) * (h * 0.6);
        const starSize = (Math.sin(windTimeRef.current * 2 + i) * 0.5 + 0.5) * 1.8 + 0.5;
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Aurora Borealis in Observatory area or Aurora weather
    if ((currentArea.id === 'star_observatory' || weather === 'aurora') && timeOfDay === 'night' && graphicsQuality !== 'low') {
      ctx.save();
      const auroraGradient = ctx.createLinearGradient(0, 0, w, 0);
      auroraGradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
      auroraGradient.addColorStop(0.3, `rgba(52, 211, 153, ${0.15 + Math.sin(windTimeRef.current) * 0.05})`);
      auroraGradient.addColorStop(0.6, `rgba(6, 182, 212, ${0.12 + Math.cos(windTimeRef.current * 0.7) * 0.04})`);
      auroraGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = auroraGradient;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.4);
      for (let x = 0; x <= w; x += 30) {
        const waveY = h * 0.25 + Math.sin(x * 0.005 + windTimeRef.current * 0.5) * 40;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(w, h * 0.55);
      ctx.lineTo(0, h * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw Rolling Background Hills/Sea
    const hillSway = Math.sin(windTimeRef.current * 0.2) * 5;
    
    // Back Hills
    ctx.fillStyle = timeOfDay === 'day' ? '#a7f3d0' : timeOfDay === 'sunset' ? '#fca5a5' : '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(w * 0.25, h * 0.6 + hillSway, w * 0.5, h * 0.7);
    ctx.quadraticCurveTo(w * 0.75, h * 0.55 - hillSway, w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Middle Hills / Sea level
    if (currentArea.id === 'coral_sea') {
      ctx.fillStyle = isCorrupted ? 'rgba(8, 47, 73, 0.9)' : 'rgba(6, 95, 124, 0.85)';
    } else {
      ctx.fillStyle = timeOfDay === 'day' ? '#34d399' : timeOfDay === 'sunset' ? '#f87171' : '#0f172a';
    }
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(w * 0.3, h * 0.75 - hillSway, w * 0.6, h * 0.72);
    ctx.quadraticCurveTo(w * 0.85, h * 0.78 + hillSway, w, h * 0.68);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // 3. Draw Solarpunk Elements based on current area
    const windAngle = Math.sin(windTimeRef.current) * 0.08;

    // Draw Windmill for Cozy Village or Sunflower Plains
    if (currentArea.id === 'cozy_village' || currentArea.id === 'sunflower_plains') {
      const millX = w * 0.15;
      const millY = h * 0.75;
      
      // Draw windmill tower
      ctx.fillStyle = '#fef3c7'; // warm cream
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(millX - 25, millY);
      ctx.lineTo(millX - 12, millY - 70);
      ctx.lineTo(millX + 12, millY - 70);
      ctx.lineTo(millX + 25, millY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Windmill head/dome
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(millX, millY - 70, 15, Math.PI, 0);
      ctx.fill();

      // Blades rotation (still if corrupted, rotating if healed!)
      const speedFactor = isCorrupted ? 0.005 : 0.05;
      const bladeAngle = windTimeRef.current * 10 * speedFactor;

      ctx.save();
      ctx.translate(millX, millY - 70);
      ctx.rotate(bladeAngle);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50);
        ctx.stroke();
        
        // Blade sail mesh
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(-5, -45, 10, 25);
      }
      ctx.restore();
    }

    // Draw cherry blossom trees
    if (currentArea.id === 'cherry_garden') {
      drawCozyTree(ctx, w * 0.8, h * 0.75, 55, '#fbcfe8', '#db2777', windAngle);
      drawCozyTree(ctx, w * 0.2, h * 0.8, 45, '#fbcfe8', '#be185d', -windAngle);
    }

    // Draw typical trees for forest
    if (currentArea.id === 'whispering_forest' || currentArea.id === 'ancient_library') {
      drawCozyTree(ctx, w * 0.82, h * 0.78, 65, '#059669', '#064e3b', windAngle);
      drawCozyTree(ctx, w * 0.12, h * 0.82, 55, '#10b981', '#065f46', -windAngle * 1.2);
    }

    // Draw giant glowing mushrooms
    if (currentArea.id === 'mushroom_valley') {
      drawCozyMushroom(ctx, w * 0.8, h * 0.76, 50, '#c084fc', '#581c87', windAngle);
      drawCozyMushroom(ctx, w * 0.15, h * 0.81, 35, '#f472b6', '#701a75', -windAngle * 0.8);
    }

    // Draw giant sunflowers
    if (currentArea.id === 'sunflower_plains') {
      const petalColor = isCorrupted ? '#6b7280' : '#fbbf24';
      const centerColor = isCorrupted ? '#374151' : '#78350f';
      drawCozySunflower(ctx, w * 0.8, h * 0.78, 40, petalColor, centerColor, windAngle);
      drawCozySunflower(ctx, w * 0.73, h * 0.8, 30, petalColor, centerColor, -windAngle * 0.7);
      drawCozySunflower(ctx, w * 0.23, h * 0.82, 35, petalColor, centerColor, windAngle * 0.9);
    }

    // Draw Floating Islands in sky
    if (currentArea.id === 'floating_islands') {
      ctx.save();
      const floatOffset = Math.sin(windTimeRef.current * 0.5) * 12;
      ctx.fillStyle = '#6b7280'; // grey stone base
      // Draw a floating island on the right
      ctx.beginPath();
      ctx.moveTo(w * 0.7, h * 0.45 + floatOffset);
      ctx.lineTo(w * 0.9, h * 0.45 + floatOffset);
      ctx.lineTo(w * 0.85, h * 0.6 + floatOffset);
      ctx.lineTo(w * 0.75, h * 0.58 + floatOffset);
      ctx.closePath();
      ctx.fill();

      // Green grass top
      ctx.fillStyle = isCorrupted ? '#4b5563' : '#10b981';
      ctx.beginPath();
      ctx.ellipse(w * 0.8, h * 0.45 + floatOffset, 65, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Solarpunk chains
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)'; // golden energy chain
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.8, h * 0.55 + floatOffset);
      ctx.lineTo(w * 0.8, h * 0.85);
      ctx.stroke();

      ctx.restore();
    }

    // Draw ancient star dome observatory
    if (currentArea.id === 'star_observatory') {
      const domeX = w * 0.8;
      const domeY = h * 0.75;
      ctx.fillStyle = '#b45309'; // ancient bronze
      ctx.beginPath();
      ctx.arc(domeX, domeY, 45, Math.PI, 0);
      ctx.fill();

      // Telescope
      ctx.save();
      ctx.translate(domeX, domeY - 20);
      ctx.rotate(-0.6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-8, -40, 16, 50);
      ctx.restore();
    }

    // 4. Draw Corrupted overlay/atmosphere if still cursed
    if (isCorrupted) {
      const darkGradient = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
      darkGradient.addColorStop(0, 'rgba(88, 28, 135, 0.08)'); // violet shadow
      darkGradient.addColorStop(1, 'rgba(15, 23, 42, 0.35)'); // deep slate border
      ctx.fillStyle = darkGradient;
      ctx.fillRect(0, 0, w, h);
    }

    // 5. Draw Active Boss (Corrupted Guardian)
    if (currentBoss) {
      const bossX = w / 2;
      const bossY = h * 0.32 + Math.sin(windTimeRef.current * 0.8) * 10;
      
      // Outer aura
      const auraPulse = Math.sin(windTimeRef.current * 1.5) * 15 + 40;
      const auraGrad = ctx.createRadialGradient(bossX, bossY, 10, bossX, bossY, auraPulse);
      
      if (isCorrupted) {
        // Reddish/purple corrupted aura
        auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
        auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        // Glorious golden/emerald purified aura
        auraGrad.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
        auraGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(bossX, bossY, auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Draw the Boss Entity
      ctx.save();
      ctx.translate(bossX, bossY);

      // Draw standard cute guardian shape
      ctx.fillStyle = isCorrupted ? '#581c87' : '#fef08a'; // Purple or happy Golden Yellow
      ctx.strokeStyle = isCorrupted ? '#2e1065' : '#ca8a04';
      ctx.lineWidth = 4;

      // Draw rounded head/body
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big cute expressive eyes
      ctx.fillStyle = isCorrupted ? '#ef4444' : '#1e293b'; // Angry red eyes or peaceful blue eyes
      ctx.beginPath();
      // Left Eye
      ctx.arc(-14, -6, isCorrupted ? 5 : 7, 0, Math.PI * 2);
      // Right Eye
      ctx.arc(14, -6, isCorrupted ? 5 : 7, 0, Math.PI * 2);
      ctx.fill();

      // Happy white sparkles inside eyes when healed
      if (!isCorrupted) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-16, -9, 2.5, 0, Math.PI * 2);
        ctx.arc(12, -9, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouth
      ctx.strokeStyle = isCorrupted ? '#ffffff' : '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (isCorrupted) {
        // Sad / angry mouth
        ctx.arc(0, 16, 8, Math.PI, 0);
      } else {
        // Happy smiling mouth
        ctx.arc(0, 10, 8, 0, Math.PI);
      }
      ctx.stroke();

      // Boss decorative ears/horns depending on creature
      if (currentBoss.id === 'ancient_fox') {
        // Cute ears
        ctx.fillStyle = isCorrupted ? '#6b21a8' : '#fb923c';
        ctx.beginPath();
        ctx.moveTo(-25, -25); ctx.lineTo(-35, -55); ctx.lineTo(-10, -35); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(25, -25); ctx.lineTo(35, -55); ctx.lineTo(10, -35); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else if (currentBoss.id === 'sky_whale') {
        // Whale fins
        ctx.fillStyle = isCorrupted ? '#4c1d95' : '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(-48, 8, 18, 6, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(48, 8, 18, 6, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (currentBoss.id === 'tree_spirit') {
        // Tree twigs on head
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-10, -38); ctx.lineTo(-20, -58);
        ctx.moveTo(10, -38); ctx.lineTo(20, -58);
        ctx.stroke();
      } else if (currentBoss.id === 'crystal_turtle') {
        // Crystal shell plates / turtle flippers
        ctx.fillStyle = isCorrupted ? '#581c87' : '#22d3ee';
        ctx.beginPath();
        ctx.ellipse(-46, 12, 14, 8, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(46, 12, 14, 8, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (currentBoss.id === 'forest_guardian') {
        // Beautiful antlers
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        // Left antler
        ctx.moveTo(-12, -36); ctx.lineTo(-30, -60);
        ctx.lineTo(-42, -55);
        ctx.moveTo(-24, -52); ctx.lineTo(-18, -66);
        // Right antler
        ctx.moveTo(12, -36); ctx.lineTo(30, -60);
        ctx.lineTo(42, -55);
        ctx.moveTo(24, -52); ctx.lineTo(18, -66);
        ctx.stroke();
      } else if (currentBoss.id === 'moon_owl') {
        // Feathered owl ears/crown
        ctx.fillStyle = isCorrupted ? '#4c1d95' : '#818cf8';
        ctx.beginPath();
        ctx.moveTo(-22, -30); ctx.lineTo(-34, -50); ctx.lineTo(-12, -36); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(22, -30); ctx.lineTo(34, -50); ctx.lineTo(12, -36); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else if (currentBoss.id === 'wind_dragon') {
        // Dragon whiskers and horns
        ctx.strokeStyle = isCorrupted ? '#c084fc' : '#ec4899';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Left horn
        ctx.moveTo(-10, -36); ctx.quadraticCurveTo(-25, -60, -35, -55);
        // Right horn
        ctx.moveTo(10, -36); ctx.quadraticCurveTo(25, -60, 35, -55);
        ctx.stroke();
      } else if (currentBoss.id === 'coral_leviathan') {
        // Bioluminescent sea dragon ears
        ctx.fillStyle = isCorrupted ? '#581c87' : '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(-20, -28); ctx.lineTo(-40, -42); ctx.lineTo(-14, -34); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(20, -28); ctx.lineTo(40, -42); ctx.lineTo(14, -34); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else if (currentBoss.id === 'spore_golem') {
        // A huge mushroom cap on top of its head!
        ctx.fillStyle = isCorrupted ? '#7e22ce' : '#ef4444'; // Purple or happy solarpunk red
        ctx.beginPath();
        ctx.arc(0, -34, 25, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Mushroom spots!
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-10, -44, 3, 0, Math.PI * 2);
        ctx.arc(10, -44, 3, 0, Math.PI * 2);
        ctx.arc(0, -52, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentBoss.id === 'book_wyrm') {
        // Floating paper wings on sides
        ctx.fillStyle = isCorrupted ? '#6b21a8' : '#fef08a';
        ctx.beginPath();
        // Left paper sheet wing
        ctx.rect(-50, -18, 14, 22);
        // Right paper sheet wing
        ctx.rect(36, -18, 14, 22);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();

      // HP indicators using small cute flowers
      const totalFlowers = 5;
      const healedFlowers = Math.ceil((bossHp / currentBoss.maxHp) * totalFlowers);
      const flowerY = bossY + 60;
      
      ctx.save();
      for (let f = 0; f < totalFlowers; f++) {
        const flowerX = bossX - 50 + f * 25;
        const color = f < healedFlowers ? '#10b981' : '#ef4444'; // Green is purified/healthy, red is corrupted
        drawHpFlower(ctx, flowerX, flowerY, color);
      }
      ctx.restore();
    }

    // 5b. Draw Interactive Solarpunk Companion Bot (Visible shooting buddy)
    const botX = w / 2;
    const botY = h * 0.58;
    const isFiring = botFiringTimerRef.current > 0;
    
    ctx.save();
    // Hovering float movement
    const floatY = botY + Math.sin(windTimeRef.current * 2) * 6;
    ctx.translate(botX, floatY);

    // Subtle shadow on the air below
    const shadowGrad = ctx.createRadialGradient(0, 30, 2, 0, 30, 20);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 30, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bot body (warm brass/silver solarpunk orb)
    ctx.fillStyle = '#e2e8f0'; // slate silver
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Digital Visor (happy screen face)
    ctx.fillStyle = isFiring ? '#10b981' : '#0ea5e9'; // Green firing or cyan peaceful
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute glowing digital eyes/sparkles on screen
    ctx.fillStyle = '#ffffff';
    if (isFiring) {
      // Firing arrows/hearts '^ ^'
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 2); ctx.lineTo(-3, -2); ctx.lineTo(0, 2);
      ctx.moveTo(0, 2); ctx.lineTo(3, -2); ctx.lineTo(6, 2);
      ctx.stroke();
    } else {
      // Peaceful blinking eyes
      ctx.beginPath();
      ctx.arc(-4, 0, 1.8, 0, Math.PI * 2);
      ctx.arc(4, 0, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Solarpunk Leaf antenna
    ctx.save();
    ctx.translate(0, -18);
    // Rotating leaf propeller
    const propRotation = windTimeRef.current * (isFiring ? 12 : 6);
    ctx.rotate(propRotation);
    ctx.strokeStyle = '#b45309'; // copper stem
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -6);
    ctx.stroke();
    
    // Green leaves
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(-6, -6, 5, 2.5, 0.4, 0, Math.PI * 2);
    ctx.ellipse(6, -6, 5, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Side hovering thruster wings
    ctx.fillStyle = '#fb923c'; // golden copper wings
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-18, -4); ctx.lineTo(-28, -12); ctx.lineTo(-24, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Right Wing
    ctx.beginPath();
    ctx.moveTo(18, -4); ctx.lineTo(28, -12); ctx.lineTo(24, 6); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.restore();

    // 6. Update and Draw Particles
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      
      // Update physics
      p.x += p.vx;
      p.y += p.vy;

      // Wind drift/wave effect
      p.vx += Math.sin(windTimeRef.current + p.life * 0.1) * 0.15;
      p.vy -= 0.05; // float upwards

      // Slow fade out at end of life
      if (p.life > p.maxLife * 0.7) {
        p.alpha = 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3);
      }

      // Render
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.type === 'leaf') {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size / 2, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'petal') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'butterfly') {
        // Cute butterfly wings flapping
        const flap = Math.sin(p.life * 0.4) * p.size;
        ctx.beginPath();
        ctx.ellipse(p.x - 3, p.y, flap, p.size / 2, 0.4, 0, Math.PI * 2);
        ctx.ellipse(p.x + 3, p.y, flap, p.size / 2, -0.4, 0, Math.PI * 2);
        ctx.fill();
      } else { // sparkle
        // Glowing star sparkle
        const sizeHalf = p.size / 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size);
        ctx.lineTo(p.x + sizeHalf, p.y - sizeHalf);
        ctx.lineTo(p.x + p.size, p.y);
        ctx.lineTo(p.x + sizeHalf, p.y + sizeHalf);
        ctx.lineTo(p.x, p.y + p.size);
        ctx.lineTo(p.x - sizeHalf, p.y + sizeHalf);
        ctx.lineTo(p.x - p.size, p.y);
        ctx.lineTo(p.x - sizeHalf, p.y - sizeHalf);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Remove dead particles
      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
      }
    }

    // Weather Effects
    if (weather === 'rain' && graphicsQuality !== 'low') {
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < (graphicsQuality === 'ultra' ? 40 : 20); r++) {
        const rx = (Math.sin(r * 9876) * 0.5 + 0.5) * w;
        const ry = ((windTimeRef.current * 150 + r * 100) % h);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 5, ry + 18);
        ctx.stroke();
      }
    } else if (weather === 'snow' && graphicsQuality !== 'low') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let s = 0; s < (graphicsQuality === 'ultra' ? 30 : 15); s++) {
        const sx = ((Math.sin(s * 1234) * 0.5 + 0.5) * w) + Math.sin(windTimeRef.current + s) * 20;
        const sy = (windTimeRef.current * 40 + s * 150) % h;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + Math.sin(s) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawCozyTree = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    foliageColor: string,
    trunkColor: string,
    sway: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Tree Trunk
    ctx.fillStyle = trunkColor;
    ctx.fillRect(-5, -height, 10, height);

    // Leaves / Foliage
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.arc(0, -height, height * 0.6, 0, Math.PI * 2);
    ctx.arc(-height * 0.3, -height * 1.1, height * 0.45, 0, Math.PI * 2);
    ctx.arc(height * 0.3, -height * 1.1, height * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawCozyMushroom = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    capColor: string,
    stemColor: string,
    sway: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Stem
    ctx.fillStyle = stemColor;
    ctx.fillRect(-size * 0.15, -size, size * 0.3, size);

    // Cap
    ctx.fillStyle = capColor;
    ctx.beginPath();
    ctx.arc(0, -size, size * 0.6, Math.PI, 0);
    ctx.fill();

    // Spots on Mushroom
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size - size * 0.3, size * 0.1, 0, Math.PI * 2);
    ctx.arc(size * 0.2, -size - size * 0.2, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawCozySunflower = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    petalColor: string,
    centerColor: string,
    sway: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Stem
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(5, -height/2, 0, -height);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.ellipse(-10, -height * 0.4, 8, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Draw Petals
    ctx.translate(0, -height);
    ctx.fillStyle = petalColor;
    for (let p = 0; p < 8; p++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, -14, 6, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center
    ctx.fillStyle = centerColor;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawHpFlower = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    // Draw 4 small petals
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.arc(0, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // Gold center
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
    />
  );
}
