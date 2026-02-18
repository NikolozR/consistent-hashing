import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Consistent Hashing — Interactive Simulator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const containerW = 500;
  const containerH = 630;
  const r = 150;
  const ringCx = containerW / 2;
  const ringCy = containerH / 2;

  const getPos = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: ringCx + radius * Math.cos(rad),
      y: ringCy + radius * Math.sin(rad),
    };
  };

  const nodes = [
    { angle: 0, id: 1, color: '#22d3ee' },
    { angle: 120, id: 2, color: '#a78bfa' },
    { angle: 240, id: 3, color: '#facc15' },
  ];

  const dataPoints = [
    { angle: 50, label: 'photo.jpg' },
    { angle: 175, label: 'video.mp4' },
    { angle: 295, label: 'backup.zip' },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.06) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            width: `${containerW}px`,
            height: `${containerH}px`,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${r * 2}px`,
              height: `${r * 2}px`,
              borderRadius: '50%',
              border: '3px solid #1e293b',
              position: 'absolute',
              left: `${ringCx - r}px`,
              top: `${ringCy - r}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: '#475569',
                letterSpacing: '0.15em',
                fontWeight: 700,
                opacity: 0.5,
              }}
            >
              HASH RING
            </span>
          </div>

          {nodes.map((node) => {
            const pos = getPos(node.angle, r);
            return (
              <div key={node.id} style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: node.color,
                    border: '3px solid #0f172a',
                    position: 'absolute',
                    left: `${pos.x - 11}px`,
                    top: `${pos.y - 11}px`,
                    display: 'flex',
                    boxShadow: `0 0 14px ${node.color}50`,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: `${pos.x - 11}px`,
                    top: `${pos.y - 30}px`,
                    fontSize: '11px',
                    color: '#cbd5e1',
                    fontWeight: 700,
                    display: 'flex',
                    width: '22px',
                    justifyContent: 'center',
                  }}
                >
                  #{node.id}
                </span>
              </div>
            );
          })}

          {dataPoints.map((dp) => {
            const pos = getPos(dp.angle, r - 35);
            return (
              <div key={dp.label} style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid white',
                    position: 'absolute',
                    left: `${pos.x - 5}px`,
                    top: `${pos.y - 5}px`,
                    display: 'flex',
                    boxShadow: '0 0 10px #10b98150',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: `${pos.x - 22}px`,
                    top: `${pos.y - 20}px`,
                    fontSize: '9px',
                    color: '#10b981',
                    fontWeight: 700,
                    display: 'flex',
                  }}
                >
                  {dp.label}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '80px',
            flex: 1,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              CH
            </div>
            <span style={{ fontSize: '13px', color: '#64748b', letterSpacing: '0.1em' }}>
              INTERACTIVE SIMULATOR
            </span>
          </div>

          <div
            style={{
              fontSize: '50px',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '18px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ color: '#22d3ee' }}>Consistent</span>
            <span style={{ color: '#e2e8f0' }}>Hashing</span>
          </div>

          <p
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              margin: 0,
              maxWidth: '420px',
              lineHeight: 1.5,
            }}
          >
            Visualize how distributed systems route data across servers using a hash ring
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            {['Next.js', 'TypeScript', 'Framer Motion'].map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  padding: '4px 12px',
                  border: '1px solid #1e293b',
                  borderRadius: '20px',
                  background: 'rgba(15, 23, 42, 0.8)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
