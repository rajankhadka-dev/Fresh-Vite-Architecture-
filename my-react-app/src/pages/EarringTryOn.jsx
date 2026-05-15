import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { EARRING_CATALOG } from '../data/earrings'
import CustomCursor from '../components/CustomCursor'
import FloatingShapes from '../components/FloatingShapes'
import ScrollIndicator from '../components/ScrollIndicator'
import Header from '../components/Header'
import './EarringTryOn.css'

export default function EarringTryOn() {
  const videoRef    = useRef(null)
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const faceMeshRef = useRef(null)
  const landmarksRef= useRef(null)
  const earImgRef   = useRef(null)
  const earScaleRef = useRef(1) 

  const [modelReady,    setModelReady]    = useState(false)
  const [modelStatus,   setModelStatus]   = useState('Loading face detection…')
  const [camActive,     setCamActive]     = useState(false)
  const [camError,      setCamError]      = useState('')
  const [selected,      setSelected]      = useState(null)
  const [earScale,      setEarScale]      = useState(1)
  const [uploads,       setUploads]       = useState([])
  const [isAuth,        setIsAuth]        = useState(false)
  const [passInput,     setPassInput]     = useState('')
  const [passError,     setPassError]     = useState('')

  const PASSPHRASE = 'jackal#321'

  const handlePassSubmit = (e) => {
    e.preventDefault()
    if (passInput === PASSPHRASE) {
      setIsAuth(true)
      setPassError('')
    } else {
      setPassError('Incorrect passphrase. Please try again.')
      setPassInput('')
    }
  }

  // ── 1. Load MediaPipe Tasks Vision ────────────────────────────────────────
  useEffect(() => {
    let alive = true
    let landmarker = null

    const initLandmarker = async () => {
      try {
        setModelStatus('Fetching MediaPipe Vision tasks…')
        const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3')
        const { FaceLandmarker, FilesetResolver } = vision

        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        )

        setModelStatus('Initializing FaceLandmarker model…')
        landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1,
        })

        if (alive) {
          faceMeshRef.current = landmarker
          setModelReady(true)
          setModelStatus('Ready')
        }
      } catch (err) {
        console.error('FaceLandmarker init failed:', err)
        if (alive) setModelStatus('⚠ Failed to load AR engine.')
      }
    }

    initLandmarker()

    return () => {
      alive = false
      stopLoop()
      if (landmarker) landmarker.close()
    }
  }, [])

  const startCam = async () => {
    setCamError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCamActive(true)
      startLoop()
    } catch {
      setCamError('Camera access denied.')
    }
  }

  const stopCam = () => {
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    stopLoop()
    setCamActive(false)
  }

  const stopLoop = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  const startLoop = useCallback(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    const ctx    = canvas.getContext('2d')
    let lastTime = -1

    const tick = async () => {
      if (!video.videoWidth) { rafRef.current = requestAnimationFrame(tick); return }
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight

      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-canvas.width, 0)
      ctx.drawImage(video, 0, 0)
      ctx.restore()

      if (faceMeshRef.current && video.currentTime !== lastTime) {
        lastTime = video.currentTime
        const results = faceMeshRef.current.detectForVideo(video, performance.now())
        landmarksRef.current = results.faceLandmarks?.[0] || null
      }

      if (landmarksRef.current && earImgRef.current?.complete) {
        drawEarrings(ctx, landmarksRef.current, canvas.width, canvas.height)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── 4. Stabilization & Pose Helpers ───────────────────────────────────────
  const stabilizerRef = useRef({
    left:  { x: 0, y: 0, z: 0, alpha: 0.35 },
    right: { x: 0, y: 0, z: 0, alpha: 0.35 },
    yaw:   { val: 0, alpha: 0.2 },
    initialized: false
  })

  const smooth = (key, target, val) => {
    const s = stabilizerRef.current[key]
    if (!stabilizerRef.current.initialized) { s[target] = val; return val }
    s[target] = s[target] + (val - s[target]) * s.alpha
    return s[target]
  }

  const smoothVal = (key, val) => {
    const s = stabilizerRef.current[key]
    if (!stabilizerRef.current.initialized) { s.val = val; return val }
    s.val = s.val + (val - s.val) * s.alpha
    return s.val
  }

  const drawEarrings = (ctx, lm, W, H) => {
    const img = earImgRef.current
    if (!img?.complete || !img.naturalWidth) return

    const mx = v => (1 - v) * W
    const py = v => v * H

    const l_tragus = lm[234], r_tragus = lm[454]
    const forehead = lm[10], chin = lm[152]
    const l_eye = lm[33], r_eye = lm[263]

    const faceH = py(chin.y) - py(forehead.y)
    const faceW = Math.abs(mx(l_eye.x) - mx(r_eye.x)) * 2
    
    // Position: Moved UP to 2% offset based on feedback
    const down = faceH * 0.02
    const side = faceW * 0.05

    const lx = smooth('left', 'x', mx(l_tragus.x) + side)
    const ly = smooth('left', 'y', py(l_tragus.y) + down)
    const rx = smooth('right', 'x', mx(r_tragus.x) - side)
    const ry = smooth('right', 'y', py(r_tragus.y) + down)
    
    stabilizerRef.current.initialized = true

    const yaw = smoothVal('yaw', (r_tragus.z - l_tragus.z) * 10)
    const scale = (faceW * 0.20) / img.naturalWidth

    const stamp = (cx, cy, sFactor, mirror, sideYaw) => {
      const visibility = 1 - Math.max(0, Math.min(1, (sideYaw * yaw * 1.5)))
      if (visibility < 0.1) return
      
      const eW = img.naturalWidth * sFactor
      const eH = img.naturalHeight * sFactor

      ctx.save()
      ctx.translate(cx, cy)
      // Removed rotation: "put it as it is"
      ctx.scale(mirror ? -1 : 1, 1)
      ctx.globalAlpha = Math.min(0.95, visibility)
      ctx.drawImage(img, -eW / 2, 0, eW, eH)
      ctx.restore()
    }

    if (yaw > 0) {
      stamp(lx, ly, scale, false, -1)
      stamp(rx, ry, scale, true, 1)
    } else {
      stamp(rx, ry, scale, true, 1)
      stamp(lx, ly, scale, false, -1)
    }
  }

  const pickEarring = (earring) => {
    setSelected(earring)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = earring.src
    img.onload = () => { earImgRef.current = img }
  }

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    files.forEach(f => {
      const src = URL.createObjectURL(f)
      const entry = { id: Date.now() + Math.random(), name: f.name.replace(/\.[^.]+$/, ''), src }
      setUploads(prev => [...prev, entry])
    })
  }

  const allEarrings = [
    ...EARRING_CATALOG.map(e => ({ ...e, src: `/earrings/${e.file}` })),
    ...uploads,
  ]

  if (!isAuth) {
    return (
      <div className="App">
        <CustomCursor />
        <ScrollIndicator />
        <FloatingShapes />
        <Header />
        <section className="password-section">
          <div className="container">
            <div className="password-container">
              <h1 className="password-title"><span className="gradient-text">Secure Access</span></h1>
              <p className="password-subtitle">Please enter the passphrase to access the AR Try-On Studio</p>
              <form onSubmit={handlePassSubmit} className="password-form">
                <div className="input-group">
                  <input type="password" autoFocus value={passInput} onChange={e => setPassInput(e.target.value)} placeholder="Enter passphrase" className="password-input" required />
                </div>
                {passError && <div className="error-message">{passError}</div>}
                <button type="submit" className="stylish-button">Access Try-On Studio</button>
              </form>
              <div className="demo-access-notice">
                <p>This experience is available exclusively to authorized partners and collaborators.</p>
                <Link to="/?subject=Request+for+AR+Try-On+Access#contact" className="access-request-link">Request Access Credentials →</Link>
              </div>
              <div className="form-buttons" style={{ marginTop: '30px' }}>
                <Link to="/" className="stylish-button secondary">← Back to Home</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="ert-page">
      {!modelReady && (
        <div className="ert-overlay">
          <div className="ert-overlay-card">
            <div className="ert-spin" />
            <p className="ert-ov-title">AR Engine Starting</p>
            <p className="ert-ov-sub">{modelStatus}</p>
          </div>
        </div>
      )}

      <nav className="ert-nav">
        <Link to="/" className="ert-back">← Portfolio</Link>
        <div className="ert-nav-center"><span className="ert-ar-badge">AR</span> Earring Try-On Studio</div>
        <div style={{ width: 120 }} />
      </nav>

      <div className="ert-layout">
        <div className="ert-cam-col">
          <div className="ert-viewport">
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
            <canvas ref={canvasRef} className="ert-canvas" />
            {!camActive && (
              <div className="ert-cam-idle">
                <div className="ert-cam-idle-icon">📷</div>
                <h2>Start Your AR Try-On</h2>
                <button className="ert-start-btn" onClick={startCam} disabled={!modelReady}>
                  {modelReady ? '✦ Enable Camera' : 'Loading…'}
                </button>
              </div>
            )}
            {camActive && !selected && <div className="ert-hint">👈 Select an earring from the panel</div>}
            {camActive && <button className="ert-stop" onClick={stopCam}>■ Stop</button>}
          </div>
        </div>

        <div className="ert-panel">
          <div className="ert-panel-head">
            <h2>Earring Catalog</h2>
            <p>Select an earring to try it on instantly.</p>
          </div>
          <label className="ert-upload">
            <input type="file" accept="image/*" multiple onChange={handleUpload} />
            <span className="ert-upload-icon">＋</span>
            <span className="ert-upload-label">Upload Your Own</span>
          </label>
          <div className="ert-grid">
            {allEarrings.map(e => (
              <div key={e.id} className={`ert-card ${selected?.id === e.id ? 'ert-card--on' : ''}`} onClick={() => pickEarring(e)}>
                <div className="ert-card-img"><img src={e.src} alt={e.name} /></div>
                <p>{e.name}</p>
                {selected?.id === e.id && <span className="ert-wearing">✓ Wearing</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
