import { LoaderCircle } from 'lucide-react'
import useLocationAutocomplete from '../../../features/search/hooks/useLocationAutocomplete'

function LocationSearchField({ field, initialLocation, onSelectionChange }) {
  const { Icon, id, label, ...inputProps } = field
  const {
    inputText,
    isOpen,
    selectLocation,
    setIsOpen,
    status,
    suggestions,
    updateInputText,
  } = useLocationAutocomplete({ initialLocation, onSelectionChange })
  const showDropdown = isOpen && inputText.trim().length > 3

  return (
    <div
      className={`relative block min-w-0 ${showDropdown ? 'z-50' : 'z-0'}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <label htmlFor={id}>
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          {label}
        </span>
        <span className="flex min-h-12 items-center gap-2.5 rounded-xl border border-emerald-100 bg-white px-3 shadow-sm transition focus-within:border-[#18723a] focus-within:ring-4 focus-within:ring-emerald-700/10 sm:border-slate-200 sm:bg-slate-50/70 sm:shadow-none sm:focus-within:bg-white">
          <Icon className="size-4 shrink-0 text-[#18723a]" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            id={id}
            name={id}
            value={inputText}
            aria-autocomplete="list"
            aria-controls={`${id}-suggestions`}
            aria-expanded={showDropdown}
            onChange={(event) => updateInputText(event.target.value)}
            onFocus={() => {
              if (inputText.trim().length >= 3) setIsOpen(true)
            }}
            {...inputProps}
          />
          {status === 'loading' && (
            <LoaderCircle className="size-4 shrink-0 animate-spin text-[#18723a]" aria-label="Searching locations" />
          )}
        </span>
      </label>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-50 isolate mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white opacity-100 shadow-xl backdrop-blur-none" id={`${id}-suggestions`} role="listbox">
          {status === 'loading' && <p className="px-3 py-3 text-sm text-slate-500">Searching locations...</p>}
          {status === 'empty' && <p className="px-3 py-3 text-sm text-slate-500">No locations found.</p>}
          {status === 'error' && <p className="px-3 py-3 text-sm text-red-600">Unable to load locations. Please try again.</p>}
          {status === 'success' && (
            <ul className="max-h-60 overflow-y-auto bg-white py-1">
              {suggestions.map((location) => (
                <li key={location.placeId} role="option" aria-selected="false">
                  <button
                    className="flex w-full gap-2 bg-white px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none"
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectLocation(location)}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-[#18723a]" aria-hidden="true" />
                    <span>{location.displayAddress}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default LocationSearchField

