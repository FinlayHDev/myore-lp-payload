export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center text-foreground">
      <div>
        <h1 className="display-tight text-5xl">Page not found</h1>
        <p className="mt-4 text-ink-soft">That page doesn&apos;t exist.</p>
        <a href="/" className="mt-8 inline-flex bg-ink px-5 py-3 font-semibold text-paper hover:bg-primary">
          Back to My Ore
        </a>
      </div>
    </div>
  )
}
