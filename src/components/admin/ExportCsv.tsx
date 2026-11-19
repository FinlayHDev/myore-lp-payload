export function ExportCsv() {
  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <a
        href="/api/waitlist/export"
        style={{ color: 'var(--theme-text)', textDecoration: 'underline' }}
      >
        Export all signups as CSV
      </a>
    </div>
  )
}
