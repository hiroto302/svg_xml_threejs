import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// ------------------------------------------------------------
// Loading overlay - SVG を XML として fetch して DOM に挿入
// ------------------------------------------------------------
const overlay = document.getElementById('loading-overlay')

fetch('./svg/loading.svg')
  .then((res) => res.text())
  .then((svgText) => {
    overlay.innerHTML = svgText
  })

// ------------------------------------------------------------
// 100% 到達時のパーティクルエフェクト (SVG)
// ------------------------------------------------------------
const COLORS = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#A855F7', '#EC4899', '#ffffff']
const SVG_NS = 'http://www.w3.org/2000/svg'

function createCelebrationSVG() {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 200 200')
  svg.setAttribute('width', '400')
  svg.setAttribute('height', '400')
  svg.style.position = 'absolute'
  svg.style.pointerEvents = 'none'
  return svg
}

function spawnConfetti(container) {
  const svg = createCelebrationSVG()
  container.appendChild(svg)

  const cx = 100
  const cy = 100
  const particleCount = 40

  for (let i = 0; i < particleCount; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
    const distance = 60 + Math.random() * 80

    // 紙吹雪: 小さな矩形
    const rect = document.createElementNS(SVG_NS, 'rect')
    const size = 3 + Math.random() * 4
    rect.setAttribute('x', cx - size / 2)
    rect.setAttribute('y', cy - size / 2)
    rect.setAttribute('width', size)
    rect.setAttribute('height', size * (0.6 + Math.random() * 0.8))
    rect.setAttribute('rx', '1')
    rect.setAttribute('fill', color)
    rect.setAttribute('opacity', '0')
    rect.setAttribute('transform', `rotate(${Math.random() * 360} ${cx} ${cy})`)
    svg.appendChild(rect)

    const targetX = cx + Math.cos(angle) * distance
    const targetY = cy + Math.sin(angle) * distance

    gsap.to(rect, {
      attr: { x: targetX, y: targetY, opacity: 1 },
      duration: 0.3,
      ease: 'power2.out',
    })

    gsap.to(rect, {
      attr: {
        y: targetY + 30 + Math.random() * 40,
        opacity: 0,
      },
      duration: 0.6 + Math.random() * 0.4,
      delay: 0.3,
      ease: 'power1.in',
    })

    // 回転アニメーション
    gsap.to(rect, {
      attr: {
        transform: `rotate(${Math.random() * 720} ${targetX} ${targetY})`,
      },
      duration: 1.0,
      ease: 'none',
    })
  }
}

function spawnSparks(container) {
  const svg = createCelebrationSVG()
  container.appendChild(svg)

  const cx = 100
  const cy = 100
  const sparkCount = 20

  for (let i = 0; i < sparkCount; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.3
    const distance = 50 + Math.random() * 60

    // スパーク: 細い線
    const line = document.createElementNS(SVG_NS, 'line')
    line.setAttribute('x1', cx)
    line.setAttribute('y1', cy)
    line.setAttribute('x2', cx)
    line.setAttribute('y2', cy)
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', '1.5')
    line.setAttribute('stroke-linecap', 'round')
    line.setAttribute('opacity', '1')
    svg.appendChild(line)

    const targetX = cx + Math.cos(angle) * distance
    const targetY = cy + Math.sin(angle) * distance
    const midX = cx + Math.cos(angle) * (distance * 0.6)
    const midY = cy + Math.sin(angle) * (distance * 0.6)

    gsap.to(line, {
      attr: { x1: midX, y1: midY, x2: targetX, y2: targetY },
      duration: 0.4,
      ease: 'power3.out',
    })

    gsap.to(line, {
      attr: { opacity: 0 },
      duration: 0.3,
      delay: 0.35,
      ease: 'power1.in',
    })
  }
}

// ------------------------------------------------------------
// Three.js - basic scene
// ------------------------------------------------------------
const canvas = document.getElementById('webgl')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#1a1a2e')

// Simple cube as placeholder
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ------------------------------------------------------------
// タイムライン: 100% 到達 → エフェクト → フェードアウト
// ------------------------------------------------------------
const tl = gsap.timeline()

// 3秒: 100% に到達 → パーティクル発射
tl.call(
  () => {
    spawnSparks(overlay)
    spawnConfetti(overlay)
  },
  null,
  3.0
)

// 3.5秒: フェードアウト開始
tl.to(
  overlay,
  {
    opacity: 0,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      overlay.remove()
    },
  },
  3.5
)

// ------------------------------------------------------------
// Animation loop
// ------------------------------------------------------------
const clock = new THREE.Clock()

const tick = () => {
  const elapsed = clock.getElapsedTime()

  mesh.rotation.x = elapsed * 0.5
  mesh.rotation.y = elapsed * 0.3

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
