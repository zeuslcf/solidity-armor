import { ImageResponse } from 'next/og'
import { Shield } from 'lucide-react'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#29ABE2',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <Shield />
      </div>
    ),
    {
      ...size,
    }
  )
}
