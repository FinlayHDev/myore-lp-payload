export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src="/favicon-192.png" alt="" width={56} height={56} style={{ borderRadius: 14 }} />
      <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '0.12em' }}>MY ORE</span>
    </div>
  )
}
