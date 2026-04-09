'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

interface Node {
  id: string
  type: 'skill' | 'project'
  label: string
  color: string
  size: number
  x: number
  y: number
  z: number
}

interface Edge {
  from: string
  to: string
}

interface NeuralNetworkCanvasProps {
  nodes?: Node[]
  edges?: Edge[]
  onNodeClick?: (node: Node) => void
}

// Demo data for initial display before Supabase is wired up
const DEMO_NODES: Node[] = [
  // Skills
  { id: 's1', type: 'skill', label: 'PyTorch', color: '#6366f1', size: 1.0, x: -2, y: 1, z: 0 },
  { id: 's2', type: 'skill', label: 'Python', color: '#6366f1', size: 1.0, x: -1.5, y: -1.5, z: 0.5 },
  { id: 's3', type: 'skill', label: 'LangChain', color: '#818cf8', size: 0.8, x: 1, y: 2, z: -0.5 },
  { id: 's4', type: 'skill', label: 'Next.js', color: '#a78bfa', size: 0.8, x: 2.5, y: 0.5, z: 0 },
  { id: 's5', type: 'skill', label: 'Supabase', color: '#a78bfa', size: 0.7, x: 2, y: -1.5, z: 0.5 },
  { id: 's6', type: 'skill', label: 'Transformers', color: '#6366f1', size: 0.9, x: -2.5, y: -0.5, z: -0.5 },
  { id: 's7', type: 'skill', label: 'RAG', color: '#818cf8', size: 0.8, x: 0.5, y: -2.5, z: -0.5 },
  { id: 's8', type: 'skill', label: 'FastAPI', color: '#a78bfa', size: 0.7, x: -0.5, y: 2.5, z: 0.5 },
  // Projects
  { id: 'p1', type: 'project', label: 'AI Assistant', color: '#8b5cf6', size: 1.2, x: -0.5, y: -0.5, z: 1 },
  { id: 'p2', type: 'project', label: 'RAG Pipeline', color: '#8b5cf6', size: 1.0, x: 1, y: 0.5, z: -1 },
  { id: 'p3', type: 'project', label: 'Portfolio', color: '#7c3aed', size: 1.1, x: -1, y: 1, z: -1 },
]

const DEMO_EDGES: Edge[] = [
  { from: 's1', to: 'p1' }, { from: 's2', to: 'p1' }, { from: 's3', to: 'p1' },
  { from: 's6', to: 'p2' }, { from: 's7', to: 'p2' }, { from: 's2', to: 'p2' },
  { from: 's4', to: 'p3' }, { from: 's5', to: 'p3' }, { from: 's2', to: 'p3' }, { from: 's8', to: 'p3' },
  { from: 's1', to: 's6' }, { from: 's3', to: 's7' }, { from: 's4', to: 's5' },
]

export default function NeuralNetworkCanvas({
  nodes = DEMO_NODES,
  edges = DEMO_EDGES,
  onNodeClick,
}: NeuralNetworkCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    animId: number
    nodeMeshes: Map<string, THREE.Mesh>
    nodeData: Map<string, Node>
    labelDivs: HTMLDivElement[]
    labelContainer: HTMLDivElement
  } | null>(null)

  const hoveredRef = useRef<string | null>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const raycasterRef = useRef(new THREE.Raycaster())

  const cleanup = useCallback(() => {
    if (!sceneRef.current) return
    const { renderer, animId, labelContainer } = sceneRef.current
    cancelAnimationFrame(animId)
    renderer.domElement.remove()   // remove canvas from DOM
    renderer.dispose()
    labelContainer.remove()
    sceneRef.current = null
  }, [])

  useEffect(() => {
    if (!mountRef.current) return
    cleanup()

    const mount = mountRef.current
    const W = mount.clientWidth || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    // Silence Three.js's own console warnings during context creation
    const _warn = console.warn
    const _error = console.error
    console.warn = () => {}
    console.error = () => {}
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      console.warn = _warn
      console.error = _error
      return
    }
    console.warn = _warn
    console.error = _error
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Scene + Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.set(0, 0, 8)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0x818cf8, 1.2)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // Build node meshes
    const nodeMeshes = new Map<string, THREE.Mesh>()
    const nodeData = new Map<string, Node>()

    nodes.forEach(node => {
      nodeData.set(node.id, node)
      const geometry = node.type === 'project'
        ? new THREE.IcosahedronGeometry(0.18 * node.size, 1)
        : new THREE.SphereGeometry(0.15 * node.size, 16, 16)

      const color = new THREE.Color(node.color)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 80,
        transparent: true,
        opacity: 1,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(node.x, node.y, node.z)
      mesh.userData.id = node.id
      scene.add(mesh)
      nodeMeshes.set(node.id, mesh)
    })

    // Build edge lines
    const edgeGeometry = new THREE.BufferGeometry()
    const edgePositions: number[] = []

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from)
      const toNode = nodes.find(n => n.id === edge.to)
      if (!fromNode || !toNode) return
      edgePositions.push(fromNode.x, fromNode.y, fromNode.z)
      edgePositions.push(toNode.x, toNode.y, toNode.z)
    })

    edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3))
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 })
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    scene.add(edgeLines)

    // Background particles
    const particleCount = 120
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const pGeometry = new THREE.BufferGeometry()
    pGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3))
    const pMaterial = new THREE.PointsMaterial({ color: 0x2d2d4a, size: 0.04, transparent: true, opacity: 0.6 })
    scene.add(new THREE.Points(pGeometry, pMaterial))

    // CSS Labels container
    const labelContainer = document.createElement('div')
    labelContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;'
    mount.appendChild(labelContainer)
    const labelDivs: HTMLDivElement[] = []

    nodes.forEach(node => {
      const div = document.createElement('div')
      div.textContent = node.label
      div.style.cssText = `
        position:absolute;
        color:#e2e8f0;
        font-size:11px;
        font-family:var(--font-geist-sans,Arial,sans-serif);
        background:rgba(10,10,15,0.7);
        padding:2px 6px;
        border-radius:4px;
        pointer-events:none;
        white-space:nowrap;
        transition:opacity 0.2s;
        opacity:0.8;
        transform:translate(-50%,-120%);
      `
      labelContainer.appendChild(div)
      labelDivs.push(div)
    })

    // Drag to orbit
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    let rotX = 0, rotY = 0

    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY } }
    const onMouseUp = () => { isDragging = false }
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseRef.current.set(
        ((e.clientX - rect.left) / W) * 2 - 1,
        -((e.clientY - rect.top) / H) * 2 + 1,
      )
      if (isDragging) {
        rotY += (e.clientX - prevMouse.x) * 0.005
        rotX += (e.clientY - prevMouse.y) * 0.005
        prevMouse = { x: e.clientX, y: e.clientY }
      }
    }
    const onClick = () => {
      if (!hoveredRef.current || !onNodeClick) return
      const node = nodeData.get(hoveredRef.current)
      if (node) onNodeClick(node)
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)

    // Resize
    const onResize = () => {
      const W2 = mount.clientWidth
      const H2 = mount.clientHeight
      camera.aspect = W2 / H2
      camera.updateProjectionMatrix()
      renderer.setSize(W2, H2)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    const tempVec = new THREE.Vector3()

    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (document.hidden) return

      // Slow auto-rotation when not dragging
      if (!isDragging) {
        rotY += 0.001
      }

      scene.rotation.y = rotY
      scene.rotation.x = rotX * 0.5

      // Raycasting for hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      const meshArray = Array.from(nodeMeshes.values())
      const intersects = raycasterRef.current.intersectObjects(meshArray)

      const hovered = intersects.length > 0 ? intersects[0].object.userData.id as string : null
      if (hovered !== hoveredRef.current) {
        // Reset previous
        if (hoveredRef.current) {
          const prev = nodeMeshes.get(hoveredRef.current)
          if (prev) {
            prev.scale.setScalar(1)
            ;(prev.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3
          }
        }
        // Highlight new
        if (hovered) {
          const curr = nodeMeshes.get(hovered)
          if (curr) {
            curr.scale.setScalar(1.4)
            ;(curr.material as THREE.MeshPhongMaterial).emissiveIntensity = 1.0
          }
          mount.style.cursor = 'pointer'
        } else {
          mount.style.cursor = 'default'
        }
        hoveredRef.current = hovered
      }

      // Update label positions
      nodes.forEach((node, i) => {
        const div = labelDivs[i]
        if (!div) return
        tempVec.set(node.x, node.y, node.z)
        tempVec.applyEuler(scene.rotation)
        tempVec.project(camera)
        const x = (tempVec.x * 0.5 + 0.5) * W
        const y = (-tempVec.y * 0.5 + 0.5) * H
        div.style.left = `${x}px`
        div.style.top = `${y}px`
        div.style.opacity = hoveredRef.current && hoveredRef.current !== node.id ? '0.2' : '0.85'
      })

      renderer.render(scene, camera)
    }
    animate()
    sceneRef.current = { renderer, scene, camera, animId, nodeMeshes, nodeData, labelDivs, labelContainer }

    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      cleanup()
    }
  }, [nodes, edges, onNodeClick, cleanup])

  return <div ref={mountRef} className="absolute inset-0" />
}
