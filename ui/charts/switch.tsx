type PropTypes = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}

export function Switch({ onChange, label }: PropTypes) {
  return (
    <div className='flex gap-1 items-center relative'>
      <input
        className='peer sr-only'
        id={`switch-${label}`}
        type='checkbox'
        onChange={onChange}
      />
      <label
        className='relative w-[40px] h-[24px] bg-gray-200 peer-checked:bg-accent rounded-[34px] cursor-pointer [transition:background-color_0.3s] before:content-[""] before:absolute before:w-[20px] before:h-[20px] before:rounded-[50%] before:top-[2px] before:left-[2px] before:bg-[#fff] before:[box-shadow:0px_2px_5px_0px_rgba(0,_0,_0,_0.3)] before:[transition:transform_0.3s] peer-checked:before:translate-x-[16px]'
        htmlFor={`switch-${label}`}
      >
        <span className='absolute text-sm text-gray-600 left-[115%] top-[50%] translate-y-[-50%] text-nowrap'>
          {label}
        </span>
      </label>
      <span style={{ minWidth: label.length * 7 }} className='opacity-0 z-0' />
    </div>
  )
}
