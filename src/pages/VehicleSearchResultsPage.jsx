import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bluetooth,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Radio,
  Snowflake,
  Users,
  Wind,
} from 'lucide-react'
import Button from '../components/shared/Button/Button'
import VehicleSearch from '../components/home/VehicleSearch/VehicleSearch'
import { useAuth } from '../context/AuthStateContext'
import { savePendingBooking } from '../features/booking/utils/bookingStorage'
import {
  getVehicleSearchCriteria,
  saveVehicleSearchCriteria,
} from '../features/search/utils/searchStorage'
import { getRouteSummary } from '../services/osrmService'
import { getVehicleTypes } from '../services/vehicleTypeService'


function formatDuration(totalMinutes) {
  const roundedMinutes = Math.max(1, Math.round(totalMinutes))
  const hours = Math.floor(roundedMinutes / 60)
  const minutes = roundedMinutes % 60

  if (!hours) return `${minutes} min`
  if (!minutes) return `${hours} hr`
  return `${hours} hr ${minutes} min`
}

function formatDateTime(value) {
  if (!value) return 'Not selected'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getErrorMessage(reason, fallback) {
  return reason instanceof Error ? reason.message : fallback
}

function getLocationHeading(address) {
  return String(address || '').split(',')[0]?.trim() || String(address || '')
}

function FeatureItem({ Icon, children }) {
  return (
    <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <Icon className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

function RoutePoint({ address, label }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-emerald-700">
        <MapPin className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <h3 className="mt-1 truncate text-lg font-black tracking-[-0.03em] text-slate-950">
        {getLocationHeading(address)}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {address}
      </p>
    </div>
  )
}

function VehicleCard({
  dropoffName,
  isSelected,
  isSelectionDisabled,
  onSelect,
  pickupDateTime,
  pickupName,
  returnDateTime,
  routeStatus,
  routeSummary,
  tripType,
  vehicle,
}) {
  const facilities = [
    vehicle.aircondition === 'Yes' && {
      label: 'Air conditioning',
      Icon: Snowflake,
    },
    vehicle.fm_radio === 'Yes' && { label: 'FM radio', Icon: Radio },
    vehicle.blutooth_audio === 'Yes' && {
      label: 'Bluetooth audio',
      Icon: Bluetooth,
    },
    vehicle.power_window === 'Yes' && {
      label: 'Power windows',
      Icon: Wind,
    },
  ].filter(Boolean)

  const distance =
    routeStatus === 'success'
      ? `${routeSummary.distanceKm.toFixed(1)} km`
      : routeStatus === 'loading'
        ? 'Calculating...'
        : 'Unavailable'
  const duration =
    routeStatus === 'success'
      ? formatDuration(routeSummary.durationMinutes)
      : routeStatus === 'loading'
        ? 'Calculating...'
        : 'Unavailable'

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_16px_45px_-32px_rgba(15,23,42,0.45)] transition ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-600/20'
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span className="self-start rounded-md bg-[#294f71] px-3 py-1.5 text-xs font-bold text-white">
          Vehicle option
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-emerald-700" aria-hidden="true" />
            {formatDateTime(pickupDateTime)}
          </span>
          <span>{tripType === 'roundTrip' ? 'Round trip' : 'One way'}</span>
          {tripType === 'roundTrip' && returnDateTime && (
            <span>Return: {formatDateTime(returnDateTime)}</span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[14rem_minmax(0,1fr)_13rem]">
        <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-4 lg:block">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700 lg:mb-4">
              {vehicle.vehical_image ? (
                <img
                  className="h-full w-full object-contain p-1"
                  src={vehicle.vehical_image}
                  alt={vehicle.vehical_name}
                />
              ) : (
                <CarFront className="size-9" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                {vehicle.vehical_name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Model year: {vehicle.model_year}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                {vehicle.ac_status}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] items-center gap-3">
            <RoutePoint address={pickupName} label="Pickup" />

            <div className="flex flex-col items-center gap-1 text-center text-xs font-semibold text-slate-500">
              <span>{duration}</span>
              <div className="flex w-full items-center text-emerald-600">
                <span className="h-px flex-1 bg-emerald-200" />
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </div>
            </div>

            <RoutePoint address={dropoffName} label="Drop-off" />
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <FeatureItem Icon={Users}>{vehicle.seat_capacity}</FeatureItem>
              <FeatureItem Icon={BriefcaseBusiness}>
                {vehicle.no_of_suitecase}
              </FeatureItem>
              {facilities.map(({ Icon, label }) => (
                <FeatureItem key={label} Icon={Icon}>
                  {label}
                </FeatureItem>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center border-t border-dashed border-slate-300 bg-slate-50/60 p-5 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                Distance
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">{distance}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                <Clock3 className="size-3.5" aria-hidden="true" />
                Est. time
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">{duration}</p>
            </div>
          </div>

          <Button
            className={`mt-5 w-full ${isSelected ? 'bg-emerald-800' : ''}`}
            type="button"
            disabled={isSelectionDisabled}
            onClick={onSelect}
          >
            {isSelected ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="order-2 size-4" aria-hidden="true" />
            )}
            {isSelected ? 'Selected' : 'Select vehicle'}
          </Button>
        </div>
      </div>
    </article>
  )
}

function VehicleSearchResultsPage() {
  const navigate = useNavigate()
  const { loading: authLoading, token } = useAuth()
  const [searchCriteria, setSearchCriteria] = useState(getVehicleSearchCriteria)
  const [vehicles, setVehicles] = useState([])
  const [vehicleStatus, setVehicleStatus] = useState('loading')
  const [vehicleError, setVehicleError] = useState('')
  const [routeSummary, setRouteSummary] = useState(null)
  const [routeStatus, setRouteStatus] = useState('loading')
  const [routeError, setRouteError] = useState('')
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [searchRevision, setSearchRevision] = useState(0)

  const pickupLatitude = Number(searchCriteria?.pickup?.latitude)
  const pickupLongitude = Number(searchCriteria?.pickup?.longitude)
  const dropoffLatitude = Number(searchCriteria?.dropoff?.latitude)
  const dropoffLongitude = Number(searchCriteria?.dropoff?.longitude)
  const pickupName = searchCriteria?.pickup?.displayAddress || 'Pickup location'
  const dropoffName = searchCriteria?.dropoff?.displayAddress || 'Drop-off location'
  const pickupDateTime = searchCriteria?.pickupDateTime || ''
  const returnDateTime = searchCriteria?.returnDateTime || ''
  const tripType = searchCriteria?.tripType || 'oneWay'
  const hasValidCoordinates = [
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
  ].every(Number.isFinite)

  const handleModifySearch = (criteria) => {
    setSelectedVehicleId(null)
    setVehicleError('')
    setRouteSummary(null)
    setRouteError('')
    setVehicleStatus('loading')
    setRouteStatus('loading')
    saveVehicleSearchCriteria(criteria)
    setSearchCriteria(criteria)
    setSearchRevision((current) => current + 1)
  }
  const handleVehicleSelect = (vehicle) => {
    if (!routeSummary) return

    setSelectedVehicleId(vehicle.id)
    saveVehicleSearchCriteria({
      ...searchCriteria,
      distance: `${routeSummary.distanceKm.toFixed(1)} km`,
      duration: formatDuration(routeSummary.durationMinutes),
    })
    savePendingBooking({
      approximateFare: 1000,
      note: '',
      payMode: 'cash',
      promoCode: '',
      vehicle,
    })

    const bookingPath = '/car/booking-details'

    if (!token) {
      navigate('/login', { state: { from: bookingPath } })
      return
    }

    navigate(bookingPath)
  }

  useEffect(() => {
    if (!hasValidCoordinates) return undefined

    const controller = new AbortController()
    const pickup = {
      latitude: pickupLatitude,
      longitude: pickupLongitude,
    }
    const dropoff = {
      latitude: dropoffLatitude,
      longitude: dropoffLongitude,
    }

    Promise.allSettled([
      getVehicleTypes({ signal: controller.signal }),
      getRouteSummary(pickup, dropoff, tripType, {
        signal: controller.signal,
      }),
    ]).then(([vehicleResult, routeResult]) => {
      if (controller.signal.aborted) return

      if (vehicleResult.status === 'fulfilled') {
        setVehicles(vehicleResult.value)
        setVehicleStatus('success')
      } else {
        setVehicleError(
          getErrorMessage(
            vehicleResult.reason,
            'Unable to load vehicle options.',
          ),
        )
        setVehicleStatus('error')
      }

      if (routeResult.status === 'fulfilled') {
        setRouteSummary(routeResult.value)
        setRouteStatus('success')
      } else {
        setRouteError(
          getErrorMessage(routeResult.reason, 'Unable to calculate the route.'),
        )
        setRouteStatus('error')
      }
    })

    return () => controller.abort()
  }, [
    dropoffLatitude,
    dropoffLongitude,
    hasValidCoordinates,
    pickupLatitude,
    pickupLongitude,
    searchRevision,
    tripType,
  ])

  const displayVehicleStatus = hasValidCoordinates ? vehicleStatus : 'error'
  const displayVehicleError = hasValidCoordinates
    ? vehicleError
    : 'Please start a new search with valid locations.'
  const displayRouteStatus = hasValidCoordinates ? routeStatus : 'error'
  const displayRouteError = hasValidCoordinates
    ? routeError
    : 'Route details are unavailable.'

  return (
    <main className="min-h-[70vh] bg-[#f4f7f5] pb-16">
      <VehicleSearch
        initialCriteria={searchCriteria}
        onSearch={handleModifySearch}
        submitLabel="Modify search"
        variant="results"
      />

      <section className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Available options
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
          Choose your vehicle
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Compare the available vehicle types and select the best option for
          your journey.
        </p>

        {displayRouteError && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {displayRouteError}
          </p>
        )}

        {displayVehicleStatus === 'loading' && vehicles.length === 0 && (
          <div className="mt-7 grid gap-5" aria-label="Loading vehicle options">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {displayVehicleStatus === 'error' && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {displayVehicleError}
          </div>
        )}

        {displayVehicleStatus === 'success' && vehicles.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No vehicle options are currently available.
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="mt-7 grid gap-5">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                pickupName={pickupName}
                dropoffName={dropoffName}
                pickupDateTime={pickupDateTime}
                returnDateTime={returnDateTime}
                tripType={tripType}
                routeStatus={displayRouteStatus}
                routeSummary={routeSummary}
                isSelected={selectedVehicleId === vehicle.id}
                isSelectionDisabled={authLoading || displayRouteStatus !== 'success'}
                onSelect={() => handleVehicleSelect(vehicle)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default VehicleSearchResultsPage