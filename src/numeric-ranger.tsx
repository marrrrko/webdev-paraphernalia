type ComponentProps = {
  minValue?: number
  maxValue?: number
  subtext?: string
  value: number
  updateValue: (newValue: number) => void
}

export default function NumericRanger({
  minValue = 1,
  maxValue = 9999,
  subtext,
  value,
  updateValue,
}: ComponentProps) {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex flex-row justify-center">
        <button
          className="lowkey"
          onClick={() => {
            if (value > minValue) updateValue(value - 1)
          }}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max="9999"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value)
            if (newValue >= minValue && newValue <= maxValue) {
              updateValue(newValue)
            }
          }}
          className="w-10 bg-transparent text-center"
        />
        <button
          className="lowkey"
          onClick={() => {
            if (value < maxValue) updateValue(value + 1)
          }}
        >
          +
        </button>
      </div>
      {subtext && (
        <div className="text-xs text-center font-bold -m-1 text-gray-200">
          {subtext}
        </div>
      )}
    </div>
  )
}
