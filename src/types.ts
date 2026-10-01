export interface Point2D {
  x: number;
  y: number;
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  z: number; // 0.1 (distant) to 1.5 (foreground)
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: 'petal' | 'mote' | 'orb' | 'sparkle';
  color: string;
  alpha: number;
  targetAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  color: string;
  birth: number;
  lifetime: number;
}

export type AtmosphereTone = 'golden' | 'amber' | 'twilight';

export interface AtmosphereConfig {
  id: AtmosphereTone;
  name: string;
  japanese: string;
  skyTint: string;
  rimColor: string;
  rimIntensity: number;
  lightRaysAngle: number;
  ambientFreqBase: number;
}
