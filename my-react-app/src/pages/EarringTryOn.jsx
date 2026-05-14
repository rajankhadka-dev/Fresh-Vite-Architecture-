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
  const earScaleRef = useRef(1)  // live ref so drawEarrings always has latest value

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

  // ── 1. Load MediaPipe FaceMesh via CDN ─────────────────────────────────────
  useEffect(() => {
    let alive = true

    const addScript = (src) =>
      new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return }
        const s = Object.assign(document.createElement('script'), {
          src, crossOrigin: 'anonymous', onload: res, onerror: rej,
        })
        document.head.appendChild(s)
      })

    ;(async () => {
      try {
        setModelStatus('Fetching MediaPipe FaceMesh…')
        await addScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js')

        if (!alive) return
        setModelStatus('Initializing 468-point landmark detector…')

        const fm = new window.FaceMesh({
          locateFile: f =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${f}`,
        })
        fm.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence:  0.5,
        })
        fm.onResults(r => {
          landmarksRef.current =
            r.multiFaceLandmarks?.length ? r.multiFaceLandmarks[0] : null
        })

        faceMeshRef.current = fm
        if (alive) { setModelReady(true); setModelStatus('Ready') }
      } catch (e) {
        if (alive) setModelStatus('⚠ Failed to load model — check your internet connection.')
      }
    })()

    return () => { alive = false; stopLoop() }
  }, [])

  // ── 2. Camera ──────────────────────────────────────────────────────────────
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
      setCamError('Camera access denied. Please allow camera permissions in your browser and try again.')
    }
  }

  const stopCam = () => {
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    stopLoop()
    setCamActive(false)
  }

  // ── 3. Render Loop ─────────────────────────────────────────────────────────
  const stopLoop = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  const startLoop = useCallback(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    const ctx    = canvas.getContext('2d')

    const tick = async () => {
      if (!video.videoWidth) { rafRef.current = requestAnimationFrame(tick); return }

      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight

      // Mirror-draw the video frame
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-canvas.width, 0)
      ctx.drawImage(video, 0, 0)
      ctx.restore()

      // Send to FaceMesh (async, won't block paint)
      if (faceMeshRef.current) {
        try { await faceMeshRef.current.send({ image: video }) } catch { /* ignore */ }
      }

      // Overlay earrings
      if (landmarksRef.current && earImgRef.current?.complete) {
        drawEarrings(ctx, landmarksRef.current, canvas.width, canvas.height)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── 4. Precise Earring Placement ───────────────────────────────────────────
  // Uses face silhouette landmarks to interpolate the actual earlobe position:
  //   Tragus (ear canal top): landmark 234 (left) / 454 (right)
  //   Jaw near ear (below tragus): landmark 172 (left) / 397 (right)
  //   Earlobe ≈ 60% between tragus and jaw point, pushed slightly outward
  const drawEarrings = (ctx, lm, W, H) => {
    const img = earImgRef.current
    if (!img?.complete || !img.naturalWidth) return

    const mx = v => (1 - v) * W   // mirror-flip x
    const py = v => v * H

    // Tragus landmarks (top of ear, ear canal area)
    const lt = lm[234], rt = lm[454]
    const ltx = mx(lt.x), lty = py(lt.y)
    const rtx = mx(rt.x), rty = py(rt.y)

    // Jaw landmarks near each ear (one step below tragus along face oval)
    const lj = lm[172], rj = lm[397]
    const ljx = mx(lj.x), ljy = py(lj.y)
    const rjx = mx(rj.x), rjy = py(rj.y)

    // Interpolate earlobe: 60% from tragus toward jaw point
    const t = 0.60
    const lex = ltx + (ljx - ltx) * t
    const ley = lty + (ljy - lty) * t
    const rex = rtx + (rjx - rtx) * t
    const rey = rty + (rjy - rty) * t

    // Push earrings slightly outward past face edge
    const faceW = Math.abs(ltx - rtx)
    const push  = faceW * 0.03
    const finalLex = lex - push
    const finalRex = rex + push

    // Face height for size reference
    const chin = lm[152], crown = lm[10]
    const faceH = Math.abs(py(chin.y) - py(crown.y))

    // Earring dimensions — scale by user slider
    const scale  = earScaleRef.current
    const eW     = faceW * 0.22 * scale
    const aspect = img.naturalHeight / img.naturalWidth
    const eH     = Math.min(eW * aspect, faceH * 0.42 * scale)

    // Head tilt from ear-to-ear slope
    const tilt = Math.atan2(rty - lty, rtx - ltx)

    // Stamp earring; mirror=true flips it for the right ear
    const stamp = (cx, cy, mirror) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(tilt)
      if (mirror) ctx.scale(-1, 1)
      ctx.globalAlpha = 0.95
      ctx.drawImage(img, -eW / 2, 0, eW, eH)  // top-center at earlobe
      ctx.globalAlpha = 1
      ctx.restore()
    }

    stamp(finalLex, ley, false)   // left ear
    stamp(finalRex, rey, true)    // right ear (mirrored)
  }

  // ── 5. Select Earring ──────────────────────────────────────────────────────
  const pickEarring = (earring) => {
    setSelected(earring)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = earring.src
    img.onload = () => { earImgRef.current = img }
  }

  // sync scale slider to ref so render loop picks it up without re-mount
  const handleScale = (v) => { setEarScale(v); earScaleRef.current = v }

  // ── 6. User Uploads (session only) ─────────────────────────────────────────
  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    files.forEach(f => {
      const src = URL.createObjectURL(f)
      const entry = { id: Date.now() + Math.random(), name: f.name.replace(/\.[^.]+$/, ''), src }
      setUploads(prev => [...prev, entry])
    })
  }

  // Merge catalog + uploads
  const allEarrings = [
    ...EARRING_CATALOG.map(e => ({ ...e, src: `/earrings/${e.file}` })),
    ...uploads,
  ]

  // ── Render ─────────────────────────────────────────────────────────────────

  // ── Passphrase Gate (identical pattern to Demo page) ─────────────────────
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
              <h1 className="password-title">
                <span className="gradient-text">Secure Access</span>
              </h1>
              <p className="password-subtitle">
                Please enter the passphrase to access the AR Try-On Studio
              </p>

              <form onSubmit={handlePassSubmit} className="password-form">
                <div className="input-group">
                  <input
                    type="password"
                    autoFocus
                    value={passInput}
                    onChange={e => setPassInput(e.target.value)}
                    placeholder="Enter passphrase"
                    className="password-input"
                    required
                  />
                </div>

                {passError && <div className="error-message">{passError}</div>}

                <button type="submit" className="stylish-button">
                  Access Try-On Studio
                </button>
              </form>

              <div className="demo-access-notice">
                <p>
                  This experience is available exclusively to authorized partners and collaborators.
                  If you have not yet received a passphrase, please reach out via the contact form.
                </p>
                <Link
                  to="/?subject=Request+for+AR+Try-On+Access&message=Hi+Rajan,+I'm+interested+in+accessing+your+AR+Earring+Try-On+Studio.+Could+you+please+share+the+passphrase?#contact"
                  className="access-request-link"
                >
                  Request Access Credentials →
                </Link>
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

      {/* Loading overlay */}
      {!modelReady && (
        <div className="ert-overlay">
          <div className="ert-overlay-card">
            <div className="ert-spin" />
            <p className="ert-ov-title">AR Engine Starting</p>
            <p className="ert-ov-sub">{modelStatus}</p>
            <p className="ert-ov-note">Powered by Google MediaPipe · 468 facial landmarks · runs locally</p>
          </div>
        </div>
      )}

      {/* Top nav */}
      <nav className="ert-nav">
        <Link to="/" className="ert-back">← Portfolio</Link>
        <div className="ert-nav-center">
          <span className="ert-ar-badge">AR</span>
          Earring Try-On Studio
        </div>
        <div style={{ width: 120 }} />
      </nav>

      <div className="ert-layout">

        {/* ── Left: Camera ── */}
        <div className="ert-cam-col">
          <div className="ert-viewport">
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
            <canvas ref={canvasRef} className="ert-canvas" />

            {!camActive && (
              <div className="ert-cam-idle">
                <div className="ert-cam-idle-icon">📷</div>
                <h2>Start Your AR Try-On</h2>
                <p>Your camera never leaves your device.<br />No data is uploaded or stored.</p>
                {camError && <p className="ert-cam-err">{camError}</p>}
                <button className="ert-start-btn" onClick={startCam} disabled={!modelReady}>
                  {modelReady ? '✦ Enable Camera' : 'Loading…'}
                </button>
              </div>
            )}

            {camActive && !selected && (
              <div className="ert-hint">👈 Select an earring from the panel</div>
            )}

            {camActive && (
              <button className="ert-stop" onClick={stopCam}>■ Stop</button>
            )}
          </div>

          <div className="ert-feature-row">
            {[
              ['🎯','Real-Time Tracking'],
              ['🔒','100% Private'],
              ['⚡','Runs Locally'],
              ['📱','Any Device'],
            ].map(([icon, label]) => (
              <div key={label} className="ert-feat">
                <span>{icon}</span><p>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Product Panel ── */}
        <div className="ert-panel">
          <div className="ert-panel-head">
            <h2>Earring Catalog</h2>
            <p>Select an earring to try it on instantly.</p>
          </div>

          {/* Size Slider */}
          {selected && (
            <div className="ert-slider-row">
              <span>Size</span>
              <input
                type="range" min="0.4" max="2.2" step="0.05"
                value={earScale}
                onChange={e => handleScale(parseFloat(e.target.value))}
                className="ert-slider"
              />
              <button className="ert-slider-reset" onClick={() => handleScale(1)}>Reset</button>
            </div>
          )}

          {/* Upload your own */}
          <label className="ert-upload">
            <input type="file" accept="image/*" multiple onChange={handleUpload} />
            <span className="ert-upload-icon">＋</span>
            <span className="ert-upload-label">Upload Your Own</span>
            <small>JPG / PNG with white or transparent background</small>
          </label>

          {allEarrings.length === 0 ? (
            <div className="ert-empty">
              <div className="ert-empty-icon">💍</div>
              <p>No earrings yet</p>
              <small>
                Drop your earring images into<br />
                <code>public/earrings/</code><br />
                then add them to <code>src/data/earrings.js</code>
              </small>
            </div>
          ) : (
            <div className="ert-grid">
              {allEarrings.map(e => (
                <div
                  key={e.id}
                  className={`ert-card ${selected?.id === e.id ? 'ert-card--on' : ''}`}
                  onClick={() => pickEarring(e)}
                >
                  <div className="ert-card-img">
                    <img src={e.src} alt={e.name} />
                  </div>
                  <p>{e.name}</p>
                  {selected?.id === e.id && <span className="ert-wearing">✓ Wearing</span>}
                </div>
              ))}
            </div>
          )}

          <div className="ert-tips">
            <p>💡 <strong>Tips for best results</strong></p>
            <ul>
              <li>Use earring images on <strong>white or transparent</strong> background</li>
              <li>Face the camera straight on, with ears visible</li>
              <li>Good lighting improves tracking accuracy</li>
              <li>Remove hair from in front of ears if possible</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
