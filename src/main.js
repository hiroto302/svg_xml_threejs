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
// 5秒後にローディング画面をフェードアウト
// ------------------------------------------------------------
gsap.to(overlay, {
  opacity: 0,
  duration: 1.2,
  delay: 3.5,
  ease: 'power2.inOut',
  onComplete: () => {
    overlay.remove()
  },
})

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
