import {
  AdditiveBlending,
  BoxGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'

const PITCH = 64
// One block column and one block row stay empty: wide roads where the traffic can be seen from above.
const AVENUE_X = 64
const AVENUE_Z = -128
const STREET = 16

const vertex = /* glsl */ `
attribute vec2 aData; // seed, kind: 0 building, 1 tower, 2 ground
uniform vec3 uPointer;
varying vec3 vWorld;
varying vec3 vLocal;
varying vec3 vNormalL;
varying vec3 vScale;
varying vec2 vData;
varying float vHeat;
void main() {
  vec4 world = instanceMatrix * vec4(position, 1.0);
  vec3 centre = instanceMatrix[3].xyz;
  vScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
  float near = aData.y > 1.5 ? 0.0 : (1.0 - smoothstep(24.0, 150.0, distance(centre.xz, uPointer.xz))) * uPointer.y;
  world.y *= 1.0 + (aData.y > 0.5 ? 0.04 : 0.16) * near;
  vHeat = near;
  vWorld = world.xyz;
  vLocal = position * vScale;
  vNormalL = normal;
  vData = aData;
  gl_Position = projectionMatrix * viewMatrix * world;
}`

const fragment = /* glsl */ `
varying vec3 vWorld;
varying vec3 vLocal;
varying vec3 vNormalL;
varying vec3 vScale;
varying vec2 vData;
varying float vHeat;

const vec3 BLUE = vec3(0.302, 0.486, 1.0);
const vec3 VIOLET = vec3(0.561, 0.42, 1.0);
const vec3 WARM = vec3(1.0, 0.84, 0.62);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Fog resolves to the page behind the canvas, so there is no horizon line against the dusk gradient.
float haze = 0.0;
vec3 fogged(vec3 colour, float boost) {
  float d = distance(cameraPosition, vWorld);
  haze = clamp(1.0 - exp(-pow(d * 0.00168, 2.0)) - boost, 0.0, 1.0);
  return colour;
}

vec3 ground() {
  vec2 p = mod(vWorld.xz, ${PITCH.toFixed(1)}) - ${(PITCH / 2).toFixed(1)};
  vec2 a = abs(p);
  float street = max(1.0 - smoothstep(${(STREET / 2 - 1).toFixed(1)}, ${(STREET / 2 + 1).toFixed(1)}, a.x), 1.0 - smoothstep(${(STREET / 2 - 1).toFixed(1)}, ${(STREET / 2 + 1).toFixed(1)}, a.y));
  float centre = max(1.0 - smoothstep(0.2, 1.1, a.x), 1.0 - smoothstep(0.2, 1.1, a.y));
  vec3 colour = mix(vec3(0.01, 0.012, 0.022), vec3(0.03, 0.038, 0.1), street);
  colour += mix(BLUE, VIOLET, hash(floor(vWorld.xz / ${PITCH.toFixed(1)}))) * centre * 0.22;
  return fogged(colour, 0.0);
}

vec3 tower(vec3 n) {
  vec2 uv = abs(n.x) > 0.5 ? vec2(vLocal.z, vLocal.y) : vec2(vLocal.x, vLocal.y);
  float ribs = smoothstep(0.25, 0.8, abs(sin(uv.x * 1.15)));
  float floors = smoothstep(0.1, 0.7, abs(sin(uv.y * 0.8)));
  float rise = clamp(vWorld.y / 300.0, 0.0, 1.0);
  vec3 lit = mix(mix(BLUE, vec3(0.62, 0.7, 1.0), 0.6), WARM, smoothstep(0.42, 1.0, rise));
  float side = abs(n.x) > 0.5 ? 0.62 : 1.0;
  vec3 colour = vec3(0.03, 0.036, 0.08) + lit * side * (0.05 + 0.95 * ribs * (0.45 + 0.55 * floors)) * (0.5 + 1.0 * rise);
  if (n.y > 0.5) colour = lit * 0.5;
  return fogged(colour * (1.0 + vHeat * 0.6), 0.62);
}

vec3 building(vec3 n) {
  float seed = vData.x;
  float rise = clamp(vWorld.y / 120.0, 0.0, 1.0);
  // Faces take the dusk from the side, so boxes read as volumes rather than flat cut-outs.
  float side = abs(n.x) > 0.5 ? 1.0 : 0.0;
  vec3 wall = mix(vec3(0.03, 0.038, 0.086), vec3(0.058, 0.044, 0.118), side);
  wall += mix(BLUE, VIOLET, side) * 0.07 * (1.0 - smoothstep(0.0, 0.36, rise));
  if (n.y > 0.5) return fogged(vec3(0.05, 0.052, 0.1) + vHeat * BLUE * 0.2, 0.0);

  vec2 uv = side > 0.5 ? vec2(vLocal.z, vLocal.y) : vec2(vLocal.x, vLocal.y);
  vec2 cell = vec2(3.0 + floor(seed * 2.0), 3.8);
  vec2 g = uv / cell;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float px = max(length(vec2(dFdx(g.x), dFdy(g.x))), length(vec2(dFdx(g.y), dFdy(g.y))));
  float pane = (1.0 - smoothstep(0.3 - px, 0.3 + px, abs(f.x))) * (1.0 - smoothstep(0.32 - px, 0.32 + px, abs(f.y)));
  float h = hash(id + seed * 91.0 + side * 7.0);
  float busy = 0.1 + 0.42 * hash(vec2(seed, id.y * 0.17));
  float on = step(h, busy);
  float pick = hash(id.yx + seed * 37.0);
  vec3 light = pick < 0.5 ? BLUE : pick < 0.86 ? VIOLET : WARM;
  float level = (0.75 + 1.1 * fract(h * 17.0)) * mix(1.5, 0.55, rise);
  // Far away a pane is under a pixel: settle on its average so the city does not shimmer.
  float lod = clamp((px - 0.25) * 1.6, 0.0, 1.0);
  vec3 lit = mix(pane * on * light * level, light * busy * 0.34 * mix(1.5, 0.55, rise), lod);
  return fogged(wall + lit * (1.0 + vHeat * 1.1), 0.12);
}

void main() {
  vec3 n = vNormalL;
  vec3 colour = vData.y > 1.5 ? ground() : vData.y > 0.5 ? tower(n) : building(n);
  gl_FragColor = vec4(colour, 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * (1.0 - haze), 1.0 - haze);
}`

const trailVertex = /* glsl */ `
attribute vec4 aLane; // axis, fixed coordinate, offset, speed
attribute vec2 aLook; // length, colour mix
uniform float uTime;
uniform float uSpan;
varying float vAlong;
varying float vMix;
varying float vDistance;
void main() {
  float run = mod(aLane.z + uTime * abs(aLane.w), uSpan) - uSpan * 0.5;
  run *= sign(aLane.w);
  float along = run + position.z * aLook.x;
  float across = aLane.y + position.x * 1.7;
  vec3 world = aLane.x > 0.5 ? vec3(along, 0.7, across) : vec3(across, 0.7, along - 256.0);
  vAlong = sign(aLane.w) > 0.0 ? position.z + 0.5 : 0.5 - position.z;
  vMix = aLook.y;
  vDistance = distance(cameraPosition, world);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`

const trailFragment = /* glsl */ `
varying float vAlong;
varying float vMix;
varying float vDistance;
void main() {
  vec3 colour = mix(vec3(0.302, 0.486, 1.0), vec3(0.561, 0.42, 1.0), vMix);
  float fade = exp(-pow(vDistance * 0.00168, 2.0));
  gl_FragColor = vec4(colour * colour * 2.1 * vAlong * vAlong * fade, 1.0);
  #include <colorspace_fragment>
}`

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Box = { x: number; y: number; z: number; w: number; h: number; d: number; turn?: number; seed: number; kind: number }

const TOWERS = [
  { x: 214, z: -410 },
  { x: 268, z: -410 },
]

function twinTowers(): Box[] {
  const tiers = [
    [15, 0, 168],
    [13, 168, 42],
    [11, 210, 32],
    [8.5, 242, 26],
    [6, 268, 18],
  ]
  const boxes: Box[] = []
  for (const t of TOWERS) {
    for (const [half, y, h] of tiers) {
      boxes.push({ x: t.x, y, z: t.z, w: half * 2, h, d: half * 2, seed: 0, kind: 1 })
      boxes.push({ x: t.x, y, z: t.z, w: half * 2, h, d: half * 2, turn: Math.PI / 4, seed: 0, kind: 1 })
    }
    boxes.push({ x: t.x, y: 286, z: t.z, w: 1.6, h: 44, d: 1.6, seed: 0, kind: 1 })
  }
  boxes.push({ x: (TOWERS[0].x + TOWERS[1].x) / 2, y: 118, z: TOWERS[0].z, w: 28, h: 4, d: 5, seed: 0, kind: 1 })
  return boxes
}

function buildings(count: number): Box[] {
  const rand = random(597)
  const lots: (Box & { rank: number })[] = []
  for (let gx = -13; gx <= 13; gx++) {
    for (let gz = -18; gz <= 5; gz++) {
      const cuts = 1 + Math.floor(rand() * 3)
      const lot = (PITCH - STREET) / cuts
      for (let a = 0; a < cuts; a++) {
        for (let b = 0; b < cuts; b++) {
          const x = gx * PITCH + (a + 0.5) * lot - (PITCH - STREET) / 2
          const z = gz * PITCH + (b + 0.5) * lot - (PITCH - STREET) / 2
          if (TOWERS.some((t) => Math.hypot(x - t.x, z - t.z) < 36)) continue
          if (Math.abs(x - AVENUE_X) < PITCH / 2 && z > -330) continue
          if (Math.abs(z - AVENUE_Z) < PITCH / 2) continue
          // Taller around the towers. Anything near the flight path stays under the camera.
          const core = Math.exp(-Math.hypot(x - 240, z + 410) / 190)
          const tall = 10 + Math.pow(rand(), 2.6) * 52 + core * 74 * rand()
          const onPath = Math.abs(x) < 190 && z > -240
          const h = Math.min(tall, onPath ? 46 : 150)
          const gap = 1.6 + rand() * 2
          lots.push({ x, y: 0, z, w: lot - gap, h, d: lot - gap, seed: rand(), kind: 0, rank: Math.hypot(x - 60, (z + 200) * 0.7) + rand() * 60 })
        }
      }
    }
  }
  return lots.sort((a, b) => a.rank - b.rank).slice(0, count)
}

export function createCity(host: HTMLElement, { still }: { still: boolean }) {
  const small = host.clientWidth < 768
  const pointerOn = !small && !still && matchMedia('(pointer: fine)').matches

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.className = 'city-canvas pointer-events-none absolute inset-0 size-full'
  canvas.dataset.mode = still ? 'still' : 'live'
  host.append(canvas)

  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 1, 2400)

  const uniforms = { uPointer: { value: new Vector3(0, 0, 0) }, uTime: { value: 0 } }
  const boxGeometry = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms })

  const all: Box[] = [{ x: 0, y: -1, z: -500, w: 5000, h: 1, d: 5000, seed: 0, kind: 2 }, ...twinTowers(), ...buildings(small ? 700 : 1800)]
  const data = new Float32Array(all.length * 2)
  boxGeometry.setAttribute('aData', new InstancedBufferAttribute(data, 2))
  const mesh = new InstancedMesh(boxGeometry, material, all.length)
  const matrix = new Matrix4()
  const position = new Vector3()
  const scale = new Vector3()
  const turn = new Quaternion()
  const up = new Vector3(0, 1, 0)
  all.forEach((box, i) => {
    turn.setFromAxisAngle(up, box.turn ?? 0)
    mesh.setMatrixAt(i, matrix.compose(position.set(box.x, box.y, box.z), turn, scale.set(box.w, box.h, box.d)))
    data[i * 2] = box.seed
    data[i * 2 + 1] = box.kind
  })
  mesh.frustumCulled = false
  scene.add(mesh)

  const trailCount = small ? 110 : 280
  const span = PITCH * 26
  const rand = random(118)
  const lanes = new Float32Array(trailCount * 4)
  const looks = new Float32Array(trailCount * 2)
  for (let i = 0; i < trailCount; i++) {
    // Streets run between blocks, on the half pitch. Most traffic takes the two wide avenues.
    const across = rand() > 0.62
    const avenue = rand() < 0.62
    const direction = rand() > 0.5 ? 1 : -1
    const lane = direction * (6 + Math.floor(rand() * 4) * 7)
    const street = (Math.floor(rand() * 24) - (across ? 18 : 12) + 0.5) * PITCH + direction * 3.8
    const line = avenue ? (across ? AVENUE_Z : AVENUE_X) + lane : street
    lanes.set([across ? 1 : 0, line, rand() * span, direction * (34 + rand() * 54)], i * 4)
    looks.set([18 + rand() * 40, rand()], i * 2)
  }
  const trailGeometry = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
  trailGeometry.setAttribute('aLane', new InstancedBufferAttribute(lanes, 4))
  trailGeometry.setAttribute('aLook', new InstancedBufferAttribute(looks, 2))
  const trailMaterial = new ShaderMaterial({
    vertexShader: trailVertex,
    fragmentShader: trailFragment,
    uniforms: { uTime: uniforms.uTime, uSpan: { value: span } },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
  const trails = new InstancedMesh(trailGeometry, trailMaterial, trailCount)
  trails.frustumCulled = false
  scene.add(trails)

  // Camera path, always above the 46 m roof cap along the flight line.
  const startPos = new Vector3(0, 165, 320)
  const endPos = new Vector3(70, 72, -70)
  const startLook = new Vector3(0, 133, -200)
  const endLook = new Vector3(238, 196, -410)
  const look = new Vector3()
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 }
  let target = 0
  let progress = 0
  let wide = 1

  const place = () => {
    const ease = progress * progress * (3 - 2 * progress)
    camera.position.lerpVectors(startPos, endPos, ease)
    camera.position.x += parallax.x * 16
    camera.position.y += -parallax.y * 8
    look.lerpVectors(startLook, endLook, ease)
    // A portrait frame sees less width, so aim closer to the towers to keep them in shot.
    look.x += (1 - ease) * (wide < 1 ? 112 : wide < 1.3 ? 90 : 0)
    camera.lookAt(look)
  }

  const size = () => {
    const { clientWidth: w, clientHeight: h } = host
    renderer.setSize(w, h, false)
    wide = w / h
    camera.aspect = wide
    camera.fov = wide < 1 ? 52 : 40
    camera.updateProjectionMatrix()
  }

  const draw = () => {
    place()
    renderer.render(scene, camera)
  }

  let frame = 0
  let last = 0
  let onScreen = true
  const running = () => !still && onScreen && !document.hidden && !lost
  let lost = false

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const damp = 1 - Math.exp(-dt * 4)
    uniforms.uTime.value += dt
    progress += (target - progress) * (1 - Math.exp(-dt * 8))
    parallax.x += (parallax.tx - parallax.x) * damp
    parallax.y += (parallax.ty - parallax.y) * damp
    const pointer = uniforms.uPointer.value
    pointer.y += ((pointerOn && pointerSeen ? 1 : 0) - pointer.y) * damp
    if (pointerOn) {
      ray.set(parallax.tx, -parallax.ty, 0.5).unproject(camera).sub(camera.position)
      const t = -camera.position.y / ray.y
      if (ray.y < 0 && t < 3000) {
        pointer.x += (camera.position.x + ray.x * t - pointer.x) * damp
        pointer.z += (camera.position.z + ray.z * t - pointer.z) * damp
      }
    }
    draw()
  }

  const ray = new Vector3()
  let pointerSeen = false
  const sync = () => {
    cancelAnimationFrame(frame)
    frame = 0
    if (running()) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  const onPointer = (event: PointerEvent) => {
    pointerSeen = true
    parallax.tx = (event.clientX / window.innerWidth) * 2 - 1
    parallax.ty = (event.clientY / window.innerHeight) * 2 - 1
  }
  const onLost = (event: Event) => {
    event.preventDefault()
    lost = true
    sync()
  }
  const onRestored = () => {
    lost = false
    draw()
    sync()
  }

  const observer = new ResizeObserver(() => {
    size()
    if (!frame) draw()
  })
  const visible = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    sync()
  })

  size()
  uniforms.uTime.value = 40
  draw()
  canvas.style.opacity = '1'
  observer.observe(host)
  visible.observe(host)
  if (pointerOn) window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', sync)
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  sync()

  return {
    setProgress(value: number) {
      target = value
      if (still) {
        progress = value
        draw()
      }
    },
    dispose() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      visible.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      // Lose the context first: after a restore, deleting old objects on a live context is a WebGL error.
      renderer.forceContextLoss()
      boxGeometry.dispose()
      trailGeometry.dispose()
      material.dispose()
      trailMaterial.dispose()
      mesh.dispose()
      trails.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }
}
