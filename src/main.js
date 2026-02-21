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
  const w = window.innerWidth
  const h = window.innerHeight
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.style.position = 'fixed'
  svg.style.top = '0'
  svg.style.left = '0'
  svg.style.width = '100%'
  svg.style.height = '100%'
  svg.style.pointerEvents = 'none'
  return svg
}

function spawnConfetti(container) {
  const svg = createCelebrationSVG()
  container.appendChild(svg)

  const w = window.innerWidth
  const h = window.innerHeight
  const cx = w / 2
  const cy = h / 2
  // 画面の対角線の半分を最大飛距離のベースにする
  const maxRadius = Math.hypot(w, h) * 0.5
  const particleCount = 60

  for (let i = 0; i < particleCount; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
    const distance = maxRadius * (0.3 + Math.random() * 0.7)

    // 紙吹雪: 小さな矩形
    const rect = document.createElementNS(SVG_NS, 'rect')
    const size = 6 + Math.random() * 8
    rect.setAttribute('x', cx - size / 2)
    rect.setAttribute('y', cy - size / 2)
    rect.setAttribute('width', size)
    rect.setAttribute('height', size * (0.6 + Math.random() * 0.8))
    rect.setAttribute('rx', '2')
    rect.setAttribute('fill', color)
    rect.setAttribute('opacity', '0')
    rect.setAttribute('transform', `rotate(${Math.random() * 360} ${cx} ${cy})`)
    svg.appendChild(rect)

    const targetX = cx + Math.cos(angle) * distance
    const targetY = cy + Math.sin(angle) * distance

    gsap.to(rect, {
      attr: { x: targetX, y: targetY, opacity: 1 },
      duration: 0.5,
      ease: 'power2.out',
    })

    gsap.to(rect, {
      attr: {
        y: targetY + 60 + Math.random() * 80,
        opacity: 0,
      },
      duration: 0.8 + Math.random() * 0.6,
      delay: 0.4,
      ease: 'power1.in',
    })

    // 回転アニメーション
    gsap.to(rect, {
      attr: {
        transform: `rotate(${Math.random() * 720} ${targetX} ${targetY})`,
      },
      duration: 1.2,
      ease: 'none',
    })
  }
}

function spawnSparks(container) {
  const svg = createCelebrationSVG()
  container.appendChild(svg)

  const w = window.innerWidth
  const h = window.innerHeight
  const cx = w / 2
  const cy = h / 2
  const maxRadius = Math.hypot(w, h) * 0.45
  const sparkCount = 30

  for (let i = 0; i < sparkCount; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.3
    const distance = maxRadius * (0.4 + Math.random() * 0.6)

    // スパーク: 細い線
    const line = document.createElementNS(SVG_NS, 'line')
    line.setAttribute('x1', cx)
    line.setAttribute('y1', cy)
    line.setAttribute('x2', cx)
    line.setAttribute('y2', cy)
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', '2')
    line.setAttribute('stroke-linecap', 'round')
    line.setAttribute('opacity', '1')
    svg.appendChild(line)

    const targetX = cx + Math.cos(angle) * distance
    const targetY = cy + Math.sin(angle) * distance
    const midX = cx + Math.cos(angle) * (distance * 0.6)
    const midY = cy + Math.sin(angle) * (distance * 0.6)

    gsap.to(line, {
      attr: { x1: midX, y1: midY, x2: targetX, y2: targetY },
      duration: 0.5,
      ease: 'power3.out',
    })

    gsap.to(line, {
      attr: { opacity: 0 },
      duration: 0.4,
      delay: 0.4,
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
