import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ELECTRIC    = '#1a6fff';
const ELECTRIC_LT = '#4d9fff';
const SILVER      = '#8ab4d4';
const NAVY        = '#0a1628';

const ORBIT_SHOES = [
  { src: '/aero-trainer-clean.png',   name: 'Aero Trainer',    color: '#4d9fff' },
  { src: '/trail-blazer-clean.png',   name: 'Trail Blazer',    color: '#ff6b35' },
  { src: '/court-dominion-clean.png', name: 'Court Dominion',  color: '#c084fc' },
  { src: '/speed-rocket-clean.png',   name: 'Speed Rocket',    color: '#4ade80' },
];

// ─────────────────────────────────────────────
//  Phases:
//  'hidden'   → shoes invisible inside center
//  'emerging' → shoes fly out one by one
//  'orbiting' → shoes orbit freely
//  'merging'  → shoes fly back to center
// ─────────────────────────────────────────────
type Phase = 'hidden' | 'emerging' | 'orbiting' | 'merging';

interface OrbitShoeProps {
  src: string; name: string; color: string;
  index: number; totalShoes: number;
  radius: number; orbitDuration: number;
  phase: Phase;
  orbitStartTime: number;
  onEmergeDone: () => void;
  onMergeDone:  () => void;
}

function OrbitShoe({
  src, name, color,
  index, totalShoes,
  radius, orbitDuration,
  phase,
  orbitStartTime,
  onEmergeDone,
  onMergeDone,
}: OrbitShoeProps) {

  // ── motion values for manual x/y/scale/opacity ──
  const mX  = useMotionValue(0);
  const mY  = useMotionValue(0);
  const mSc = useMotionValue(0.01);
  const mOp = useMotionValue(0);

  // ── continuous orbit via rAF ──
  const rafRef   = useRef<number>(0);
  const isOrbit  = phase === 'orbiting';

  useEffect(() => {
    if (!isOrbit) { cancelAnimationFrame(rafRef.current); return; }

    const tick = (ts: number) => {
      const elapsed = (ts - orbitStartTime) / 1000;
      const baseAngle = (index / totalShoes) * 360;
      const a = ((baseAngle + (elapsed / orbitDuration) * 360) % 360) * (Math.PI / 180);
      mX.set(Math.cos(a) * radius);
      mY.set(Math.sin(a) * radius * 0.38);
      mSc.set(0.72 + (Math.sin(a) + 1) * 0.16);
      mOp.set(0.62 + (Math.sin(a) + 1) * 0.19);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOrbit, orbitStartTime, index, totalShoes, radius, orbitDuration, mX, mY, mSc, mOp]);

  // ── EMERGE: fly out from center ──
  useEffect(() => {
    if (phase !== 'emerging') return;

    // stagger: each shoe emerges 300ms after previous
    const delay = index * 300;

    const targetAngle = (index / totalShoes) * 360 * (Math.PI / 180);
    const tx = Math.cos(targetAngle) * radius;
    const ty = Math.sin(targetAngle) * radius * 0.38;

    // start from center (0,0), scale 0, opacity 0
    mX.set(0); mY.set(0); mSc.set(0.01); mOp.set(0);

    const timer = setTimeout(() => {
      animate(mX,  tx,  { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
      animate(mY,  ty,  { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
      animate(mSc, 1.0, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
      animate(mOp, 1.0, {
        duration: 0.6,
        ease: 'easeOut',
        onComplete: index === totalShoes - 1 ? onEmergeDone : undefined,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [phase]); // eslint-disable-line

  // ── MERGE: fly back to center ──
  useEffect(() => {
    if (phase !== 'merging') return;

    const delay = index * 130;

    const timer = setTimeout(() => {
      animate(mX,  0,    { duration: 1.0, ease: [0.7, 0, 0.3, 1] });
      animate(mY,  0,    { duration: 1.0, ease: [0.7, 0, 0.3, 1] });
      animate(mSc, 0.05, { duration: 1.0, ease: [0.7, 0, 0.3, 1] });
      animate(mOp, 0,    {
        duration: 0.85,
        ease: 'easeIn',
        onComplete: onMergeDone,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [phase]); // eslint-disable-line

  if (phase === 'hidden') return null;

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        x: mX, y: mY,
        scale: mSc,
        opacity: mOp,
        zIndex: 15,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Halo */}
      <motion.div
        style={{
          position: 'absolute', inset: '-22%', borderRadius: '50%',
          background: `radial-gradient(circle, ${color}44, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div style={{ width: 130, height: 130, filter: `drop-shadow(0 4px 14px ${color}99) drop-shadow(0 0 28px ${color}55)` }}>
        <img
          src={src} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen' }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  Hero3DShoe — Main Component
// ─────────────────────────────────────────────
export function Hero3DShoe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shoeWrapRef  = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── mouse tilt ──
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp   = { stiffness: 55, damping: 22, mass: 0.9 };
  const springX = useSpring(rawX, sp);
  const springY = useSpring(rawY, sp);
  const rotateX    = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY    = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const glowX = useTransform(springX, [-0.5, 0.5], ['38%', '62%']);
  const glowY = useTransform(springY, [-0.5, 0.5], ['38%', '62%']);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [rawX, rawY]);
  const handleMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  // ── Auto animation state machine ──
  const [phase,          setPhase]          = useState<Phase>('hidden');
  const [mergedCount,    setMergedCount]    = useState(0);
  const [showFlash,      setShowFlash]      = useState(false);
  const [orbitStartTime, setOrbitStartTime] = useState(0);

  // Timeline (all in ms):
  // 0s    → page load
  // 1.5s  → start emerging (staggered 300ms each = last at 2.4s + 0.9s anim = done ~3.3s)
  // 3.5s  → switch to orbiting
  // 8.5s  → start merging
  // 10.5s → flash, reset, loop

  const EMERGE_START   = 1500;
  const ORBIT_START    = 3500;
  const MERGE_START    = 8500;
  const FLASH_DURATION = 1400;
  const CYCLE_TOTAL    = 11500; // full cycle before loop

  useEffect(() => {
    if (!isLoaded) return;

    let timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setPhase('hidden');
      setMergedCount(0);
      setShowFlash(false);

      timers.push(setTimeout(() => {
        setPhase('emerging');
      }, EMERGE_START));

      timers.push(setTimeout(() => {
        setOrbitStartTime(performance.now());
        setPhase('orbiting');
      }, ORBIT_START));

      timers.push(setTimeout(() => {
        setPhase('merging');
      }, MERGE_START));

      timers.push(setTimeout(() => {
        setShowFlash(true);
      }, MERGE_START + 1000));

      timers.push(setTimeout(() => {
        setShowFlash(false);
        // loop
        timers = [];
        run();
      }, CYCLE_TOTAL));
    };

    run();

    return () => timers.forEach(clearTimeout);
  }, [isLoaded]); // eslint-disable-line

  const handleMergeDone = () => {
    setMergedCount(prev => prev + 1);
  };

  const handleEmergeDone = () => {
    // called when last shoe finishes emerging (already handled by timeout)
  };

  // ── GSAP scroll parallax ──
  useEffect(() => {
    if (!shoeWrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(shoeWrapRef.current, {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });
      gsap.to(shoeWrapRef.current, {
        opacity: 0, scale: 0.9, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: '60% top', end: 'bottom top', scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, [isLoaded]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const particles = [
    { x:'12%',y:'18%',size:5,delay:0,   dur:4.2,color:ELECTRIC_LT },
    { x:'88%',y:'22%',size:3,delay:0.6, dur:5.0,color:SILVER },
    { x:'20%',y:'72%',size:4,delay:1.2, dur:3.8,color:ELECTRIC },
    { x:'78%',y:'68%',size:6,delay:0.3, dur:4.6,color:ELECTRIC_LT },
    { x:'50%',y:'8%', size:3,delay:1.8, dur:3.5,color:SILVER },
    { x:'5%', y:'45%',size:4,delay:0.9, dur:5.2,color:ELECTRIC },
    { x:'94%',y:'50%',size:5,delay:1.5, dur:4.0,color:ELECTRIC_LT },
    { x:'35%',y:'85%',size:3,delay:0.4, dur:4.8,color:SILVER },
    { x:'65%',y:'90%',size:4,delay:2.1, dur:3.9,color:ELECTRIC },
    { x:'72%',y:'12%',size:3,delay:0.7, dur:4.3,color:ELECTRIC_LT },
  ];

  const orbs = [
    { x:'65%',y:'28%',size:380,delay:0,  dur:9, opacity:0.22,color:ELECTRIC },
    { x:'18%',y:'58%',size:300,delay:1,  dur:11,opacity:0.14,color:NAVY },
    { x:'78%',y:'68%',size:240,delay:0.5,dur:8, opacity:0.13,color:ELECTRIC_LT },
    { x:'40%',y:'15%',size:200,delay:2,  dur:10,opacity:0.10,color:SILVER },
  ];

  const allMerged = mergedCount >= ORBIT_SHOES.length;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ perspective: '1200px' }}
    >

      {/* ── Flash on merge complete ── */}
      {showFlash && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          style={{ background: `radial-gradient(circle at 50% 50%, ${ELECTRIC_LT}dd 0%, transparent 65%)` }}
        />
      )}

      {/* ── Scan lines ── */}
      {[0, 4].map((delay, i) => (
        <motion.div
          key={`scan-${i}`}
          className="absolute inset-y-0 pointer-events-none"
          style={{ width:'1.5px', background:`linear-gradient(to bottom,transparent,${ELECTRIC_LT}66,${SILVER}33,transparent)`, filter:'blur(2px)' }}
          animate={{ x:['-5vw','105vw'] }}
          transition={{ duration:7, repeat:Infinity, delay, ease:'linear' }}
        />
      ))}

      {/* ── Ambient orbs ── */}
      {orbs.map((o,i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{ left:o.x, top:o.y, width:o.size, height:o.size, background:`radial-gradient(circle,${o.color}44,transparent 70%)`, transform:'translate(-50%,-50%)', filter:'blur(24px)' }}
          animate={{ scale:[1,1.2,1], opacity:[o.opacity*0.6,o.opacity,o.opacity*0.6] }}
          transition={{ duration:o.dur, repeat:Infinity, delay:o.delay, ease:'easeInOut' }}
        />
      ))}

      {/* ── Floating particles ── */}
      {particles.map((p,i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{ left:p.x, top:p.y, width:p.size, height:p.size, backgroundColor:p.color, boxShadow:`0 0 ${p.size*4}px ${p.size}px ${p.color}66` }}
          animate={{ y:[0,-22,0], opacity:[0.2,0.8,0.2], scale:[1,1.5,1] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, ease:'easeInOut' }}
        />
      ))}

      <div ref={shoeWrapRef} className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-8 lg:pr-16 xl:pr-24">
        <motion.div
          initial={{ opacity:0, scale:0.78, y:60, filter:'blur(16px)' }}
          animate={isLoaded ? { opacity:1, scale:1, y:0, filter:'blur(0px)' } : {}}
          transition={{ duration:1.4, delay:0.15, ease:[0.16,1,0.3,1] }}
          className="relative"
        >
          <motion.div style={{ rotateX, rotateY, x:translateX, y:translateY, transformStyle:'preserve-3d' }}>
            <motion.div
              animate={{ y:[0,-20,0,-14,0], x:[0,28,0,-28,0], rotateZ:[0,3,0,-3,0], rotateY:[0,8,0,-8,0] }}
              transition={{ duration:14, repeat:Infinity, ease:'easeInOut', times:[0,0.25,0.5,0.75,1] }}
              style={{ transformStyle:'preserve-3d' }}
              className="relative"
            >

              {/* Glow behind shoe */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ inset:'-30%', borderRadius:'50%', background:`radial-gradient(ellipse at ${glowX} ${glowY},${ELECTRIC}55 0%,${NAVY}33 40%,transparent 70%)`, filter:'blur(36px)' }}
                animate={{ opacity:[0.4,0.9,0.4], scale:[0.92,1.08,0.92] }}
                transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
              />

              {/* Extra glow after merge */}
              {allMerged && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{ inset:'-40%', borderRadius:'50%', background:`radial-gradient(ellipse at 50% 50%,${ELECTRIC_LT}88 0%,transparent 65%)`, filter:'blur(52px)' }}
                  animate={{ opacity:[0.6,1,0.6], scale:[1,1.18,1] }}
                  transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                />
              )}

              {/* Orbit rings */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ inset:'-18%', borderRadius:'50%', border:`1px solid ${SILVER}25`, boxShadow:`0 0 20px 4px ${ELECTRIC}18` }}
                animate={{ rotate:[0,360] }}
                transition={{ duration:22, repeat:Infinity, ease:'linear' }}
              />
              <motion.div
                className="absolute pointer-events-none"
                style={{ inset:'-26%', borderRadius:'50%', border:`1px dashed ${ELECTRIC_LT}18` }}
                animate={{ rotate:[360,0] }}
                transition={{ duration:34, repeat:Infinity, ease:'linear' }}
              />

              {/* ══ ORBIT SHOES ══ */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex:20 }}
              >
                {ORBIT_SHOES.map((shoe, i) => (
                  <OrbitShoe
                    key={shoe.src}
                    src={shoe.src} name={shoe.name} color={shoe.color}
                    index={i} totalShoes={ORBIT_SHOES.length}
                    radius={300} orbitDuration={12}
                    phase={phase}
                    orbitStartTime={orbitStartTime}
                    onEmergeDone={handleEmergeDone}
                    onMergeDone={handleMergeDone}
                  />
                ))}
              </div>

              {/* ══ Main Hero Shoe ══ */}
              <motion.img
                src="/hero-sneaker-nobg.png"
                alt="Premium Sports Sneaker"
                className="relative z-10 w-[360px] md:w-[480px] lg:w-[620px] xl:w-[720px] object-contain select-none"
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes('fallback')) {
                    img.src = '/hero-sneaker-B3rIUcQ3.jpg';
                    setIsLoaded(true);
                  }
                }}
                animate={allMerged ? {
                  filter:[
                    'drop-shadow(0 30px 60px rgba(26,111,255,0.65)) drop-shadow(0 8px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 80px rgba(26,111,255,0.30))',
                    'drop-shadow(0 30px 80px rgba(26,111,255,1.0)) drop-shadow(0 8px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 140px rgba(77,159,255,0.80))',
                    'drop-shadow(0 30px 60px rgba(26,111,255,0.65)) drop-shadow(0 8px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 80px rgba(26,111,255,0.30))',
                  ],
                } : {}}
                transition={allMerged ? { duration:3, repeat:Infinity, ease:'easeInOut' } : {}}
                style={{
                  filter:`drop-shadow(0 30px 60px rgba(26,111,255,0.65)) drop-shadow(0 8px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 80px rgba(26,111,255,0.30)) drop-shadow(0 -8px 24px rgba(77,159,255,0.25))`,
                  willChange:'transform',
                }}
                draggable={false}
              />

              {/* Reflection */}
              <div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden"
                style={{ bottom:'-15%', width:'80%', height:'28%' }}
              >
                <motion.img
                  src="/hero-sneaker-nobg.png" alt="" aria-hidden="true"
                  className="w-full object-contain"
                  style={{
                    transform:'scaleY(-1)',
                    maskImage:'linear-gradient(to bottom,rgba(0,0,0,0.22) 0%,transparent 75%)',
                    WebkitMaskImage:'linear-gradient(to bottom,rgba(0,0,0,0.22) 0%,transparent 75%)',
                    filter:'blur(3px)', opacity:0.28,
                  }}
                  animate={{ opacity:[0.20,0.32,0.20] }}
                  transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}
                />
              </div>

              {/* Floor glow */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ bottom:'-20%', width:'60%', height:24, background:`radial-gradient(ellipse at 50% 50%,${ELECTRIC}55 0%,rgba(0,0,0,0.2) 55%,transparent 80%)`, filter:'blur(12px)', borderRadius:'50%' }}
                animate={{ scaleX:[1,1.18,1], opacity:[0.4,0.75,0.4] }}
                transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}
              />

            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </motion.div>
  );
}