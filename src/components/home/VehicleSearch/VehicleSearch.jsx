import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  MapPin,
  Repeat2,
  Search,
  Sparkles,
} from 'lucide-react'
import Button from '../../shared/Button/Button'
import LocationSearchField from './LocationSearchField'
import MobileCarAnimation from './MobileCarAnimation'
import { saveVehicleSearchCriteria } from '../../../features/search/utils/searchStorage'

const emptySelectedLocations = {
  pickupLocation: null,
  dropoffLocation: null,
}

const vehicleTabs = [{ id: 'car', label: 'Car', Icon: CarFront }]

const tripTypes = [
  { id: 'oneWay', label: 'One way', Icon: ArrowRight },
  { id: 'roundTrip', label: 'Round trip', Icon: Repeat2 },
]

const fieldDefinitions = {
  pickupLocation: {
    id: 'pickupLocation',
    label: 'Pickup location',
    type: 'text',
    placeholder: 'Enter pickup location',
    autoComplete: 'off',
    Icon: MapPin,
  },
  dropoffLocation: {
    id: 'dropoffLocation',
    label: 'Drop-off location',
    type: 'text',
    placeholder: 'Enter drop-off location',
    autoComplete: 'off',
    Icon: MapPin,
  },
  pickupDateTime: {
    id: 'pickupDateTime',
    label: 'Pickup date & time',
    type: 'datetime-local',
    required: true,
    Icon: CalendarDays,
  },
  returnDateTime: {
    id: 'returnDateTime',
    label: 'Return date & time',
    type: 'datetime-local',
    required: true,
    Icon: CalendarDays,
  },
}

const commonFieldIds = [
  'pickupLocation',
  'dropoffLocation',
  'pickupDateTime',
]

const fieldIdsByTripType = {
  oneWay: commonFieldIds,
  roundTrip: [...commonFieldIds, 'returnDateTime'],
}

const locationFieldIds = new Set(['pickupLocation', 'dropoffLocation'])

function getCurrentLocalDateTime() {
  const now = new Date()
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

  return localTime.toISOString().slice(0, 16)
}

function isReturnAfterPickup(pickupDateTime, returnDateTime) {
  const pickupTime = new Date(pickupDateTime).getTime()
  const returnTime = new Date(returnDateTime).getTime()

  return (
    Number.isFinite(pickupTime) &&
    Number.isFinite(returnTime) &&
    returnTime > pickupTime
  )
}

function getMinimumReturnDateTime(pickupDateTime) {
  if (!pickupDateTime) return undefined

  const minimumReturn = new Date(pickupDateTime)
  if (Number.isNaN(minimumReturn.getTime())) return undefined

  minimumReturn.setMinutes(minimumReturn.getMinutes() + 1)
  const localTime = new Date(
    minimumReturn.getTime() - minimumReturn.getTimezoneOffset() * 60000,
  )

  return localTime.toISOString().slice(0, 16)
}

function SearchField({ field, minimumValue, onChange, value }) {
  const { Icon, id, label, ...inputProps } = field
  const minimumDateTime =
    minimumValue ||
    (inputProps.type === 'datetime-local'
      ? getCurrentLocalDateTime()
      : undefined)

  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <span className="flex min-h-12 items-center gap-2.5 rounded-xl border border-emerald-100 bg-white px-3 shadow-sm transition focus-within:border-[#18723a] focus-within:ring-4 focus-within:ring-emerald-700/10 sm:border-slate-200 sm:bg-slate-50/70 sm:shadow-none sm:focus-within:bg-white">
        <Icon className="size-4 shrink-0 text-[#18723a]" aria-hidden="true" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          id={id}
          name={id}
          min={minimumDateTime}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
      </span>
    </label>
  )
}

function VehicleSearch({
  initialCriteria = null,
  onSearch,
  submitLabel = 'Search cars',
  variant = 'home',
}) {
  const navigate = useNavigate()
  const [activeVehicle, setActiveVehicle] = useState(
    initialCriteria?.activeVehicle || 'car',
  )
  const [tripType, setTripType] = useState(
    initialCriteria?.tripType || 'oneWay',
  )
  const [selectedLocations, setSelectedLocations] = useState(() =>
    initialCriteria
      ? {
          pickupLocation: initialCriteria.pickup,
          dropoffLocation: initialCriteria.dropoff,
        }
      : { ...emptySelectedLocations },
  )
  const [pickupDateTime, setPickupDateTime] = useState(
    initialCriteria?.pickupDateTime || '',
  )
  const [returnDateTime, setReturnDateTime] = useState(
    initialCriteria?.returnDateTime || '',
  )
  const [validationMessage, setValidationMessage] = useState('')
  const activeFields = fieldIdsByTripType[tripType].map(
    (fieldId) => fieldDefinitions[fieldId],
  )
  const fieldGridClass =
    tripType === 'oneWay' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  const locationsAreConfirmed = Boolean(
    selectedLocations.pickupLocation && selectedLocations.dropoffLocation,
  )
  const sectionClassName =
    variant === 'results'
      ? 'relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'
      : 'relative z-10 mx-auto -mt-8 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:-top-4 lg:-mt-12 lg:px-8'

  const updateSelectedLocation = (fieldId, location) => {
    setSelectedLocations((current) => {
      const updatedLocations = {
        ...current,
        [fieldId]: location,
      }


      return updatedLocations
    })
    setValidationMessage('')
  }

  const handlePickupDateTimeChange = (event) => {
    const nextPickupDateTime = event.target.value
    setPickupDateTime(nextPickupDateTime)

    if (
      returnDateTime &&
      !isReturnAfterPickup(nextPickupDateTime, returnDateTime)
    ) {
      setReturnDateTime('')
      setValidationMessage(
        'Pickup changed. Please select a return date and time after pickup.',
      )
      return
    }

    setValidationMessage('')
  }

  const handleReturnDateTimeChange = (event) => {
    const nextReturnDateTime = event.target.value
    setReturnDateTime(nextReturnDateTime)

    if (
      nextReturnDateTime &&
      !isReturnAfterPickup(pickupDateTime, nextReturnDateTime)
    ) {
      setValidationMessage(
        'Return date and time must be after pickup date and time.',
      )
      return
    }

    setValidationMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!locationsAreConfirmed) {
      setValidationMessage('Please select a location from the suggestions.')
      return
    }

    setValidationMessage('')

    if (
      tripType === 'roundTrip' &&
      !isReturnAfterPickup(pickupDateTime, returnDateTime)
    ) {
      setValidationMessage(
        'Return date and time must be after pickup date and time.',
      )
      return
    }

    const pickup = selectedLocations.pickupLocation
    const dropoff = selectedLocations.dropoffLocation
    const searchCriteria = {
      activeVehicle,
      tripType,
      pickup,
      dropoff,
      pickupDateTime,
      returnDateTime,
    }
    saveVehicleSearchCriteria(searchCriteria)


    if (onSearch) {
      onSearch(searchCriteria)
      return
    }

    navigate('/car/search-results')
  }

  return (
    <section
      className={sectionClassName}
      aria-label="Find a vehicle"
    >
      <div className={variant === 'results' ? '' : 'vehicle-search-aura'}>
      <div className="vehicle-search-card relative z-10 overflow-visible rounded-2xl border border-white/80 bg-white/95 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.36)] backdrop-blur-xl sm:border-slate-200/80 sm:bg-white sm:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)]">
        <div
          className="flex items-center justify-between rounded-t-2xl border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-violet-50 px-4 pt-3 sm:rounded-2xl sm:border-slate-100 sm:bg-slate-50/80 sm:px-6"
          role="tablist"
          aria-label="Vehicle type"
        >
          {vehicleTabs.map(({ id, label, Icon }) => {
            const isActive = activeVehicle === id

            return (
              <button
                key={id}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#18723a] text-[#18723a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveVehicle(id)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            )
          })}
          <span className="vehicle-search-quick-badge mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-amber-700 sm:hidden">
            <Sparkles className="size-3" aria-hidden="true" />
            Quick booking
          </span>
        </div>

        <MobileCarAnimation />

        <form
          className="vehicle-search-form bg-[radial-gradient(circle_at_top_right,rgba(167,243,208,0.22),transparent_38%)] p-4 sm:bg-none sm:p-6"
          onSubmit={handleSubmit}
        >
          <div
            className={`grid gap-4 sm:grid-cols-2 ${fieldGridClass}`}
            role="tabpanel"
            aria-label={`${tripType === 'oneWay' ? 'One way' : 'Round trip'} search`}
          >
            {activeFields.map((field) =>
              locationFieldIds.has(field.id) ? (
                <LocationSearchField
                  key={field.id}
                  field={field}
                  initialLocation={selectedLocations[field.id]}
                  onSelectionChange={(location) =>
                    updateSelectedLocation(field.id, location)
                  }
                />
              ) : (
                <SearchField
                  key={field.id}
                  field={field}
                  value={
                    field.id === 'pickupDateTime'
                      ? pickupDateTime
                      : returnDateTime
                  }
                  minimumValue={
                    field.id === 'returnDateTime'
                      ? getMinimumReturnDateTime(pickupDateTime)
                      : undefined
                  }
                  onChange={
                    field.id === 'pickupDateTime'
                      ? handlePickupDateTimeChange
                      : handleReturnDateTimeChange
                  }
                />
              ),
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="grid w-full grid-cols-2 self-start rounded-xl border border-emerald-100 bg-emerald-50/80 p-1 shadow-inner sm:inline-flex sm:w-auto sm:border-slate-200 sm:bg-slate-100/80"
              role="tablist"
              aria-label="Trip type"
            >
              {tripTypes.map(({ id, label, Icon }) => {
                const isActive = tripType === id

                return (
                  <button
                    key={id}
                    className={`flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-all duration-200 sm:min-w-36 sm:px-5 ${
                      isActive
                        ? 'bg-[#18723a] text-white shadow-sm'
                        : 'text-slate-500 hover:bg-white hover:text-slate-800'
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTripType(id)}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </button>
                )
              })}
            </div>

            <Button
              className="vehicle-search-submit min-h-12 w-full shadow-[0_12px_24px_-12px_rgba(18,93,46,0.8)] sm:min-h-9 sm:w-50 sm:shadow-none"
              type="submit"
              size="small"
              aria-disabled={!locationsAreConfirmed}
            >
              <Search className="size-4" aria-hidden="true" />
              {submitLabel}
            </Button>
          </div>

          {validationMessage && (
            <p className="mt-3 text-sm font-medium text-red-600" role="alert">
              {validationMessage}
            </p>
          )}
        </form>
      </div>
      </div>
    </section>
  )
}

export default VehicleSearch





