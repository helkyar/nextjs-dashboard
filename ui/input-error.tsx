export default function InputError({
  errors,
  id,
}: {
  errors: string[] | undefined
  id: string
}) {
  if (!errors) return null
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  )
}
