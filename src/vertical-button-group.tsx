import { Children, cloneElement, PropsWithChildren, ReactNode } from "react"

type ComponentProps = {
  label: string
  children: ReactNode
}

export default function VerticalButtonGroup({
  label,
  children,
}: ComponentProps) {
  const childElements = Children.toArray(children)

  return (
    <div className="mb-4">
      <div className="font-bold text-lg">{label}</div>
      <div className="flex flex-col gap-1 pl-2">
        {Children.map(childElements, (child, idx) => {
          return <div key={idx}>{cloneElement(child as any, {})}</div>
        })}
      </div>
    </div>
  )
}
