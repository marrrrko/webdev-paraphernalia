import { useState } from "react"
import { nanoid, customAlphabet } from "nanoid"
import {
  lowercase,
  alphanumeric,
  nolookalikes,
  numbers,
  uppercase,
} from "nanoid-dictionary"
import { DateTime } from "luxon"

type Paraphernalia = {
  kind:
    | "urlencode"
    | "urldecode"
    | "uppercase"
    | "lowercase"
    | "uuidv4"
    | "nanoid"
    | "now-local-iso"
    | "now-utc-iso"
    | "iso-to-msts"
    | "msts-to-iso"
  originalText?: string
  nextText: string
  appliedAt: string
}

import VerticalButtonGroup from "./vertical-button-group"
import { Listbox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import NumericRanger from "./numeric-ranger"

const nanoidOptions = [
  { name: "Default", value: "default" },
  { name: "Alphanumeric", value: "alphanumeric" },
  { name: "Hex", value: "hex" },
  { name: "Lowercase Only", value: "lowercase" },
  { name: "Uppercase Only", value: "uppercase" },
  { name: "Numbers Only", value: "numbers" },
  { name: "No lookalikes", value: "nolookalikes" },
  { name: "Easy 3s", value: "easy-3s" },
] as const

const nanoidKinds = nanoidOptions.map((nk) => nk.value)

type ParaphernaliaConfig = {
  numRandomIds: number
  selectedNanoidKind: typeof nanoidKinds[number]
  nanoidSize: number
}

const defaultConfig: ParaphernaliaConfig = {
  numRandomIds: 1,
  selectedNanoidKind: "default",
  nanoidSize: 21,
}

function App() {
  const [theText, setTheText] = useState("")
  const [config, setConfig] = useState(defaultConfig)

  const getNanoid = () => {
    switch (config.selectedNanoidKind) {
      case "default":
        return nanoid(config.nanoidSize)
      case "alphanumeric":
        return customAlphabet(alphanumeric, config.nanoidSize)()
      case "hex":
        return customAlphabet("0123456789ABCDEF", config.nanoidSize)()
      case "lowercase":
        return customAlphabet(lowercase, config.nanoidSize)()
      case "uppercase":
        return customAlphabet(uppercase, config.nanoidSize)()
      case "numbers":
        return customAlphabet(numbers, config.nanoidSize)()
      case "nolookalikes":
        return customAlphabet(nolookalikes, config.nanoidSize)()
      case "easy-3s":
        return customAlphabet(nolookalikes, config.nanoidSize)()
          .toLocaleLowerCase()
          .split("")
          .reduce((acc, next, idx) => {
            const needsDash = (acc.length - 3) % 4 === 0
            if (needsDash) return `${acc}-${next}`
            return `${acc}${next}`
          }, "")
      default:
        const exhaustiveCheck: never = config.selectedNanoidKind
        throw new Error(`Unhandled transform: ${exhaustiveCheck}`)
    }
  }

  const doParaphernalia = (transformKind: Paraphernalia["kind"]) => {
    switch (transformKind) {
      case "urlencode":
        setTheText(encodeURIComponent(theText))
        return
      case "urldecode":
        setTheText(decodeURIComponent(theText))
        return
      case "lowercase":
        setTheText((theText || "").toLocaleLowerCase())
        return
      case "uppercase":
        setTheText((theText || "").toLocaleUpperCase())
        return
      case "uuidv4":
        const uuids = new Array(config.numRandomIds)
          .fill(-1)
          .map((v) => crypto.randomUUID())
          .join("\n")
        setTheText(uuids)
        return
      case "nanoid":
        const nanoids = new Array(config.numRandomIds)
          .fill(-1)
          .map((v) => getNanoid())
          .join("\n")
        setTheText(nanoids)
        return
      case "now-local-iso":
        setTheText(DateTime.now().toISO())
        return
      case "now-utc-iso":
        setTheText(DateTime.utc().toISO())
      case "iso-to-msts":
        setTheText((currentText) => {
          if (DateTime.fromISO(currentText).isValid) {
            return DateTime.fromISO(currentText).toMillis().toString()
          }
          return currentText
        })
        return
      case "msts-to-iso":
        setTheText((currentText) => {
          const ms = parseInt(currentText)
          if (ms == currentText && ms > 0 && ms < 5000000000000)
            return DateTime.fromMillis(ms).toUTC().toISO()
          else return currentText
        })
        return
      default:
        const exhaustiveCheck: never = transformKind
        throw new Error(`Unhandled transform: ${exhaustiveCheck}`)
    }
  }

  return (
    <div className="App bg-emerald-600 text-white w-full min-h-screen p-3 flex flex-col gap-5 font-sen">
      <div className="text-3xl font-bold">Web Development Paraphernalia</div>
      <div className="flex flex-row gap-3">
        <div className="min-h-[25rem] border-r-white border-r-2 pr-2 flex-col">
          <VerticalButtonGroup label="URL">
            <button
              className="w-full"
              onClick={() => doParaphernalia("urlencode")}
            >
              Encode
            </button>

            <button
              className="w-full"
              onClick={() => doParaphernalia("urldecode")}
            >
              Decode
            </button>
          </VerticalButtonGroup>
          <VerticalButtonGroup label="Casing">
            <button
              className="w-full"
              onClick={() => doParaphernalia("uppercase")}
            >
              Uppercase
            </button>

            <button
              className="w-full"
              onClick={() => doParaphernalia("lowercase")}
            >
              Lowercase
            </button>
          </VerticalButtonGroup>

          <VerticalButtonGroup label="Random IDs">
            <div>
              <NumericRanger
                value={config.numRandomIds}
                updateValue={(newValue) =>
                  setConfig({ ...config, numRandomIds: newValue })
                }
                subtext="Count"
              />
            </div>
            <button
              className="w-full"
              onClick={() => doParaphernalia("uuidv4")}
            >
              v4 UUID
            </button>
            <div className="mt-6">
              <button
                className="w-full mb-1"
                onClick={() => doParaphernalia("nanoid")}
              >
                Nanoid
              </button>

              <Listbox
                value={nanoidOptions.find(
                  (o) =>
                    o.value.toString() === config.selectedNanoidKind.toString()
                )}
                onChange={(newValue) =>
                  setConfig({
                    ...config,
                    selectedNanoidKind: newValue.value,
                  })
                }
              >
                <div className="relative">
                  <Listbox.Button className="relative w-full min-w-36 text-center cursor-default bg-emerald-400 hover:bg-emerald-300 p-1 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate mr-3">
                      {nanoidOptions.find(
                        (o) => o.value === config.selectedNanoidKind
                      )?.name || "Nope"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-9400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute max-h-60 w-56 overflow-auto bg-emerald-900 p-3 pt-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {nanoidOptions.map((nk) => (
                      <Listbox.Option
                        key={nk.value}
                        value={nk}
                        className={({ active }) =>
                          `relative cursor-default select-none p-1 ${
                            active ? "bg-emerald-800 text-white" : "text-white0"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ml-5 ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {nk.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              <NumericRanger
                minValue={2}
                maxValue={99}
                subtext="Size"
                value={config.nanoidSize}
                updateValue={(newValue) =>
                  setConfig({ ...config, nanoidSize: newValue })
                }
              />
            </div>
          </VerticalButtonGroup>
          <VerticalButtonGroup label="Time">
            <button
              className="w-full"
              onClick={() => doParaphernalia("now-local-iso")}
            >
              Now Local ISO
            </button>
            <button
              className="w-full"
              onClick={() => doParaphernalia("now-utc-iso")}
            >
              Now UTC ISO
            </button>
            <button
              className="w-full"
              onClick={() => doParaphernalia("iso-to-msts")}
            >
              ISO to ms timestamp
            </button>
            <button
              className="w-full"
              onClick={() => doParaphernalia("msts-to-iso")}
            >
              ms timestamp to ISO
            </button>
          </VerticalButtonGroup>
        </div>
        <div className="grow">
          <textarea
            className="w-full h-full text-black bg-emerald-200 p-2 font-dm"
            style={{ resize: "none" }}
            value={theText}
            onChange={(e) => setTheText(e.target.value)}
          />
        </div>
      </div>
      {/* <div className="mt-4 border-t-2"></div>
      <div className="text-xl font-bold">History</div> */}
    </div>
  )
}

export default App
