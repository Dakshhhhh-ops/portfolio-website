import { useEffect, useRef } from 'react'
import { useMotionPref } from '../context/MotionContext'

const VERTEX = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

/**
 * A slowly drifting topographic map. Contour lines bend around the pointer like a lens
 * and light up in the accent colour where it passes.
 */
const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLens;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;

  float d = length(p - m);
  float lens = exp(-d * d * 16.0) * uLens;
  p -= (p - m) * lens * 0.5;

  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 4.1));
  float f = fbm(p * 1.3 + 2.4 * q + vec2(t * 0.6, -t * 0.4));

  float bands = f * 16.0;
  float fw = fwidth(bands);
  float minor = 1.0 - smoothstep(0.0, fw * 1.4, abs(fract(bands + 0.5) - 0.5));
  float major = 1.0 - smoothstep(0.0, fw * 1.4, abs(fract(bands / 4.0 + 0.5) - 0.5) * 4.0);

  vec3 bg = vec3(0.039, 0.039, 0.035);
  vec3 col = bg + vec3(0.045, 0.045, 0.04) * smoothstep(0.35, 0.85, f);
  vec3 lineCol = vec3(0.26, 0.255, 0.24);
  vec3 accent = vec3(0.831, 1.0, 0.247);
  float glow = smoothstep(0.05, 0.9, lens);
  col = mix(col, mix(lineCol, accent, glow), minor * (0.35 + 0.65 * glow));
  col = mix(col, mix(lineCol * 1.6, accent, glow), major * (0.7 + 0.3 * glow));

  float v = length((uv - 0.5) * vec2(1.0, 1.25));
  col *= 1.0 - 0.75 * smoothstep(0.25, 0.85, v);
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

export function Shader({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { motionOn } = useMotionPref()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    const fail = () => canvas.classList.add('is-fallback')
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return fail()

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return fail()
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail()
    gl.useProgram(program)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uLens = gl.getUniformLocation(program, 'uLens')

    // Rendered below native resolution: the field is soft by nature and this keeps it cheap
    const scale = Math.min(window.devicePixelRatio, 2) * 0.75
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    // Pointer in canvas pixels (GL's y axis points up). Until the pointer moves, the lens drifts on its own.
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, lens: 0, pointer: false }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.pointer = e.pointerType === 'mouse'
      mouse.tx = (e.clientX - r.left) * scale
      mouse.ty = (r.height - (e.clientY - r.top)) * scale
    }

    const start = performance.now()
    let raf = 0
    let visible = true

    const draw = (now: number) => {
      const t = (now - start) / 1000 + 20
      if (!mouse.pointer) {
        mouse.tx = canvas.width * (0.5 + 0.28 * Math.cos(t * 0.23))
        mouse.ty = canvas.height * (0.5 + 0.22 * Math.sin(t * 0.31))
      }
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      mouse.lens += (1 - mouse.lens) * 0.03
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.uniform1f(uLens, mouse.lens)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      // Skip frames while the hero is off screen or covered by the sections that scroll over it
      if (visible && !document.hidden && window.scrollY < window.innerHeight * 1.2) draw(now)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!motionOn) draw(start + 4000)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    resize()
    mouse.x = mouse.tx = canvas.width * 0.6
    mouse.y = mouse.ty = canvas.height * 0.55
    if (motionOn) {
      window.addEventListener('pointermove', onMove, { passive: true })
      raf = requestAnimationFrame(loop)
    } else {
      mouse.lens = 1
      draw(start + 4000)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [motionOn])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
