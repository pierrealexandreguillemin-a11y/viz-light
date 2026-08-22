// card-app.jsx — perspective, iridescence, specular, noise, tilt.

const { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle,
        TweakRadio, TweakSelect, TweakColor } = window;

// Relative luminance of a #rgb / #rrggbb color — drives the light/dark toggle
// state so the White-base switch always reflects the current base color.
function isLightHex(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return false;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 0.299 + g * 0.587 + b * 0.114) > 140;
}

// The two finished looks. On a dark base the bright STROKES catch the
// iridescence (color-dodge); on a white base the bright FIELD does, so the
// holo has to darken into it (multiply) instead of lifting off black.
const DARK_PRESET  = { baseColor: '#050403', strokeColor: '#ece4d2',
                       iriBlend: 'color-dodge', specularBlend: 'overlay', iridescence: 65, iriMask: true };
const LIGHT_PRESET = { baseColor: '#f4f1ea', strokeColor: '#1a1612',
                       iriBlend: 'multiply',    specularBlend: 'soft-light', iridescence: 30, iriMask: false };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tilt": 16,
  "perspective": 1100,
  "lift": 28,
  "hoverScale": 3,
  "iridescence": 65,
  "iriStyle": "conic",
  "iriChroma": 16,
  "iriBlend": "color-dodge",
  "iriSpeed": 220,
  "iriMask": true,
  "specular": 50,
  "specularSize": 45,
  "specularBlend": "overlay",
  "noise": 14,
  "glow": 55,
  "glowBlur": 60,
  "glowSize": 24,
  "glowFollowsHue": true,
  "showBackside": false,
  "strokeColor": "#ece4d2",
  "baseColor": "#050403",
  "returnEase": 350
}/*EDITMODE-END*/;

// Iridescent gradient generators — three different textures the holo can wear.
function iriGradient(style, angle, C, L = 75) {
  const c = C / 100; // 0..0.35
  // Anchor hues evenly across 360°.
  const stop = (h) => `oklch(${L}% ${c} ${h})`;
  const ring = [0, 60, 120, 180, 240, 300, 360].map(stop).join(', ');
  if (style === 'conic') {
    return `conic-gradient(from ${angle}deg at 50% 50%, ${ring})`;
  }
  if (style === 'linear') {
    return `linear-gradient(${angle}deg, ${ring})`;
  }
  // holo: tight diagonal bands like a foil trading card
  const bands = [];
  const N = 12;
  for (let i = 0; i <= N; i++) {
    bands.push(`${stop((i / N) * 360 + angle)} ${(i / N) * 100}%`);
  }
  return `repeating-linear-gradient(${angle}deg, ${bands.join(', ')})`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const sceneRef = React.useRef(null);
  const cardRef = React.useRef(null);
  // Mouse held in a ref + applied via rAF — re-rendering React on every
  // mousemove makes the tilt feel laggy and burns frames in the iridescent
  // gradient recompute.
  const mRef = React.useRef({ x: 0.5, y: 0.5, hover: false });
  const rafRef = React.useRef(0);

  // Serialize the artwork once into a data-URI mask. The iridescent layer on
  // the dark card is masked by this so colour only lands on the ink/foil
  // strokes — the black field stays black. Geometry is constant, so build it
  // a single time from a white-on-black render of the same CardArt.
  const maskSrcRef = React.useRef(null);
  const [artMask, setArtMask] = React.useState('none');
  React.useEffect(() => {
    const svg = maskSrcRef.current && maskSrcRef.current.querySelector('svg');
    if (!svg) return;
    let s = new XMLSerializer().serializeToString(svg);
    // Give the serialized SVG an intrinsic size so it maps 1:1 onto the card
    // box when used as a mask image (some engines render 100%/100% at 0).
    s = s.replace(/width="100%"/, 'width="360"').replace(/height="100%"/, 'height="540"');
    setArtMask(`url("data:image/svg+xml,${encodeURIComponent(s)}")`);
  }, []);

  const apply = React.useCallback(() => {
    rafRef.current = 0;
    const c = cardRef.current;
    const s = sceneRef.current;
    if (!c || !s) return;
    const { x, y, hover } = mRef.current;
    const rx = (0.5 - y) * t.tilt * (hover ? 1 : 0);
    const ry = (x - 0.5) * t.tilt * (hover ? 1 : 0);
    const scale = 1 + (hover ? t.hoverScale / 100 : 0);
    const lift = hover ? t.lift : 0;
    c.style.transform = `translateZ(${lift}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`;
    c.style.setProperty('--mx', `${x * 100}%`);
    c.style.setProperty('--my', `${y * 100}%`);
    // Iridescent angle drifts as the mouse moves — gives the "tilt to see
    // the rainbow shift" feel of foil paper.
    const angle = (x * t.iriSpeed + y * (t.iriSpeed * 0.5)) % 360;
    c.style.setProperty('--ir-angle', `${angle}deg`);
    c.style.setProperty('--ir-bg', iriGradient(t.iriStyle, angle, t.iriChroma));
    // Glow hue tracks the same drift so the edge bloom matches what's
    // currently lit on the face. Set on the scene (common ancestor) so the
    // sibling .glow can read the variable.
    s.style.setProperty('--glow-hue', t.glowFollowsHue ? `${(angle * 1.5) % 360}deg` : '0deg');
  }, [t]);

  React.useEffect(() => { apply(); }, [apply]);

  const onMove = (e) => {
    const r = sceneRef.current.getBoundingClientRect();
    mRef.current = {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      hover: true,
    };
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  };
  const onLeave = () => {
    mRef.current = { x: 0.5, y: 0.5, hover: false };
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  };
  const onEnter = () => {
    mRef.current.hover = true;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  };

  // Specular highlight — radial wash following the cursor. The size knob
  // controls the falloff radius in % of card.
  const specBg = `radial-gradient(circle ${t.specularSize}% at var(--mx) var(--my),
    rgba(255,255,255,.85), rgba(255,255,255,.25) 25%, rgba(255,255,255,0) 60%)`;

  const light = isLightHex(t.baseColor);
  const maskOn = t.iriMask && artMask !== 'none';

  return (
    <>
      <div
        ref={sceneRef}
        className="scene"
        style={{ perspective: `${t.perspective}px` }}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerDown={onMove}
      >
        {/* Hidden white-on-black copy of the face, serialized into the
            iridescence mask above. Never shown. */}
        <div ref={maskSrcRef} aria-hidden="true"
             style={{ position: 'absolute', width: 360, height: 540,
                      left: -99999, top: 0, pointerEvents: 'none', opacity: 0 }}>
          <CardArt stroke="#ffffff" bg="#000000" />
        </div>
        {/* Soft conic bloom under the card — never participates in 3D so the
            blur stays cheap and the bloom doesn't clip to the card plane. */}
        <div
          className="glow"
          style={{
            inset: `-${t.glowSize}px`,
            filter: `blur(${t.glowBlur}px) hue-rotate(var(--glow-hue, 0deg))`,
            opacity: t.glow / 100,
          }}
        />
        <div
          ref={cardRef}
          className="card"
          style={{
            transition: `transform ${t.returnEase}ms cubic-bezier(.2,.7,.2,1)`,
            background: t.baseColor,
          }}
        >
          {/* Base — deep gradient and inner ring (vignette adapts to theme) */}
          <div className="layer base" style={{
            background: light
              ? `radial-gradient(120% 90% at 30% 12%,
                  color-mix(in oklab, ${t.baseColor}, white 60%) 0%,
                  ${t.baseColor} 55%,
                  color-mix(in oklab, ${t.baseColor}, black 14%) 100%)`
              : `radial-gradient(120% 90% at 30% 15%,
                  color-mix(in oklab, ${t.baseColor}, white 3%) 0%,
                  ${t.baseColor} 60%,
                  color-mix(in oklab, ${t.baseColor}, black 60%) 100%)`,
          }} />

          {/* The card face */}
          <div className="layer art" style={{ color: t.strokeColor }}>
            <CardArt stroke={t.strokeColor} bg={t.baseColor} />
          </div>

          {/* Iridescent wash. On the dark card it's masked to the artwork so
              it reflects off the ink instead of veiling the black field; on
              the white card it stays a full-field multiply tint. */}
          <div className="layer iri" style={{
            background: 'var(--ir-bg)',
            mixBlendMode: t.iriBlend,
            opacity: t.iridescence / 100,
            maskImage: maskOn ? artMask : undefined,
            WebkitMaskImage: maskOn ? artMask : undefined,
            maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
          }} />

          {/* Specular */}
          <div className="layer spec" style={{
            background: specBg,
            mixBlendMode: t.specularBlend,
            opacity: t.specular / 100,
          }} />

          {/* Noise — inline SVG fractalNoise, repeated. */}
          <div className="layer noise" style={{ opacity: t.noise / 100 }} />

          {/* Top edge highlight */}
          <div className="layer edge" />
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Perspective" />
        <TweakSlider label="Tilt" value={t.tilt} min={0} max={45} unit="°"
                     onChange={(v) => setTweak('tilt', v)} />
        <TweakSlider label="Perspective" value={t.perspective} min={400} max={2400} step={50} unit="px"
                     onChange={(v) => setTweak('perspective', v)} />
        <TweakSlider label="Lift" value={t.lift} min={0} max={80} unit="px"
                     onChange={(v) => setTweak('lift', v)} />
        <TweakSlider label="Hover scale" value={t.hoverScale} min={0} max={15} unit="%"
                     onChange={(v) => setTweak('hoverScale', v)} />
        <TweakSlider label="Return ease" value={t.returnEase} min={80} max={800} step={10} unit="ms"
                     onChange={(v) => setTweak('returnEase', v)} />

        <TweakSection label="Iridescence" />
        <TweakRadio  label="Style" value={t.iriStyle}
                     options={['conic', 'linear', 'holo']}
                     onChange={(v) => setTweak('iriStyle', v)} />
        <TweakSlider label="Intensity" value={t.iridescence} min={0} max={100} unit="%"
                     onChange={(v) => setTweak('iridescence', v)} />
        <TweakSlider label="Chroma" value={t.iriChroma} min={5} max={35}
                     onChange={(v) => setTweak('iriChroma', v)} />
        <TweakSlider label="Hue speed" value={t.iriSpeed} min={0} max={720} step={10} unit="°"
                     onChange={(v) => setTweak('iriSpeed', v)} />
        <TweakSelect label="Blend" value={t.iriBlend}
                     options={['color-dodge', 'screen', 'overlay', 'soft-light', 'hard-light', 'plus-lighter', 'multiply', 'color-burn', 'darken']}
                     onChange={(v) => setTweak('iriBlend', v)} />
        <TweakToggle label="Confine to artwork" value={t.iriMask}
                     onChange={(v) => setTweak('iriMask', v)} />

        <TweakSection label="Specular" />
        <TweakSlider label="Intensity" value={t.specular} min={0} max={100} unit="%"
                     onChange={(v) => setTweak('specular', v)} />
        <TweakSlider label="Size" value={t.specularSize} min={10} max={120} unit="%"
                     onChange={(v) => setTweak('specularSize', v)} />
        <TweakSelect label="Blend" value={t.specularBlend}
                     options={['overlay', 'screen', 'soft-light', 'hard-light', 'plus-lighter', 'normal']}
                     onChange={(v) => setTweak('specularBlend', v)} />

        <TweakSection label="Texture" />
        <TweakSlider label="Noise" value={t.noise} min={0} max={60} unit="%"
                     onChange={(v) => setTweak('noise', v)} />

        <TweakSection label="Glow" />
        <TweakSlider label="Intensity" value={t.glow} min={0} max={100} unit="%"
                     onChange={(v) => setTweak('glow', v)} />
        <TweakSlider label="Blur" value={t.glowBlur} min={10} max={160} unit="px"
                     onChange={(v) => setTweak('glowBlur', v)} />
        <TweakSlider label="Spread" value={t.glowSize} min={0} max={120} unit="px"
                     onChange={(v) => setTweak('glowSize', v)} />
        <TweakToggle label="Glow shifts hue" value={t.glowFollowsHue}
                     onChange={(v) => setTweak('glowFollowsHue', v)} />

        <TweakSection label="Card" />
        <TweakToggle label="White base" value={light}
                     onChange={(on) => setTweak(on ? LIGHT_PRESET : DARK_PRESET)} />
        <TweakColor label="Ink" value={t.strokeColor}
                    options={light
                      ? ['#1a1612', '#2a2320', '#3a2d4a', '#1f3a36', '#4a2a2a']
                      : ['#ece4d2', '#f5f5f5', '#d9c9a8', '#c4b8ff', '#a8e6cf']}
                    onChange={(v) => setTweak('strokeColor', v)} />
        <TweakColor label="Base" value={t.baseColor}
                    options={light
                      ? ['#f4f1ea', '#ffffff', '#eceaf2', '#eef3ef', '#f3edf0']
                      : ['#050403', '#080a10', '#0d0805', '#04100c', '#0c0410']}
                    onChange={(v) => setTweak('baseColor', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
