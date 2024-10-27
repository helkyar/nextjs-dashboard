export default function InputErrorMessage({
  error,
  id,
}: {
  error: undefined | null | string
  id: string
}) {
  if (!error) return null
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      <p className="mt-2 text-sm text-red-500">{error}</p>
    </div>
  )
}
