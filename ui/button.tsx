import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode
}

export function Button({
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(
        'button flex h-10 items-center text-sm font-medium',
        className
      )}
    >
      {children}
    </button>
  )
}
