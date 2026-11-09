import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Gavel,
  History,
  MapPin,
  RefreshCw,
  Route,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthStateContext'
import {
  getApprovedTripBid,
  getBiddingSession,
  markTripBidApproved,
  saveBiddingSession,
} from '../features/booking/utils/biddingStorage'
import { getPassengerBids } from '../services/bidService'
import { getPassengerTrips } from '../services/tripService'

const terminalStatuses = new Set([
  'completed',
  'complete',
  'cancelled',
  'canceled',
  'expired',
  'rejected',
  'finished',
  'done',
])

function getTripId(trip) {
  return trip?.id ?? trip?.trip_id ?? trip?.trip_info_id
}

function getTripStatus(trip) {
  return String(
    trip?.trip_status ?? trip?.request_status ?? trip?.status_text ?? trip?.status ?? 'pending',
  ).toLowerCase()
}

function isTripApproved(trip, serverApprovedTripIds) {
  const approvalValue = trip?.is_approved ?? trip?.is_approve
  const status = getTripStatus(trip)
  return (
    String(approvalValue).toUpperCase() === 'YES' ||
    ['approved', 'confirmed'].includes(status) ||
    Boolean(getApprovedTripBid(getTripId(trip))) ||
    serverApprovedTripIds?.has(String(getTripId(trip)))
  )
}

function formatStatus(status) {
  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getLocation(trip, direction) {
  const prefix = direction === 'from' ? 'from' : 'to'
  const nested = direction === 'from' ? trip?.pickup : trip?.dropoff
  return (
    trip?.[`${prefix}_location_name`] ??
    trip?.[`${prefix}_location`] ??
    trip?.[`${prefix}_address`] ??
    nested?.displayAddress ??
    nested?.address ??
    ''
  )
}

function getVehicle(trip) {
  return (
    trip?.vehical_type_info ??
    trip?.vehical_type ??
    trip?.vehicle_type ??
    trip?.vehicle ??
    {}
  )
}

function combineDateTime(date, time) {
  if (!date) return ''
  return time ? `${date}T${String(time).slice(0, 5)}` : date
}

function getStartDateTime(trip) {
  return (
    trip?.pickupDateTime ??
    trip?.travel_start_datetime ??
    combineDateTime(trip?.travel_start_date, trip?.travel_start_time)
  )
}

function getReturnDateTime(trip) {
  return (
    trip?.returnDateTime ??
    trip?.travel_return_datetime ??
    combineDateTime(trip?.travel_return_date, trip?.travel_return_time)
  )
}

function formatDateTime(value) {
  if (!value) return 'Date not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: value.includes('T') ? 'short' : undefined,
  }).format(date)
}

function getTripType(trip) {
  const value = trip?.request_type ?? trip?.trip_type ?? trip?.tripType
  return value === 'roundTrip' || value === 'round_trip' ? 'Round trip' : 'One way'
}

function getFare(trip) {
  const fare = Number(trip?.approximate_fare ?? trip?.approximateFare ?? trip?.fare)
  return Number.isFinite(fare) ? `BDT ${fare.toLocaleString('en-BD')}` : ''
}

function createBiddingSession(trip, existingStartedAt) {
  const tripId = getTripId(trip)
  const vehicle = getVehicle(trip)
  const createdTime = new Date(trip?.created_at ?? trip?.createdAt ?? Date.now()).getTime()

  return {
    tripId,
    startedAt: Number.isFinite(Number(existingStartedAt))
      ? Number(existingStartedAt)
      : Number.isFinite(createdTime)
        ? createdTime
        : Date.now(),
    searchCriteria: {
      tripType:
        trip?.request_type ?? trip?.trip_type ?? trip?.tripType ?? 'oneWay',
      pickup: {
        displayAddress: getLocation(trip, 'from'),
        latitude: Number(trip?.from_latitude ?? trip?.pickup?.latitude),
        longitude: Number(trip?.from_longitude ?? trip?.pickup?.longitude),
      },
      dropoff: {
        displayAddress: getLocation(trip, 'to'),
        latitude: Number(trip?.to_latitude ?? trip?.dropoff?.latitude),
        longitude: Number(trip?.to_longitude ?? trip?.dropoff?.longitude),
      },
      pickupDateTime: getStartDateTime(trip),
      returnDateTime: getReturnDateTime(trip),
      duration: trip?.duration ?? '',
      distance: trip?.distance ?? '',
    },
    booking: {
      approximateFare:
        trip?.approximate_fare ?? trip?.approximateFare ?? trip?.fare ?? '',
      note: trip?.note ?? '',
      payMode: trip?.pay_mode ?? trip?.payMode ?? '',
      promoCode: trip?.promo_code ?? '',
      vehicle,
    },
  }
}

function TripCard({ trip, isPast, isApproved, onOpenBids }) {
  const tripId = getTripId(trip)
  const status = getTripStatus(trip)
  const vehicle = getVehicle(trip)
  const vehicleName =
    vehicle?.vehical_name ?? vehicle?.vehicle_name ?? vehicle?.name ?? 'Vehicle pending'
  const vehicleImage = vehicle?.vehical_image ?? vehicle?.image

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {vehicleImage ? (
            <img className="h-full w-full object-contain p-1" src={vehicleImage} alt={vehicleName} />
          ) : (
            <CarFront className="size-7 text-slate-400" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-emerald-700">Trip #{tripId}</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">{vehicleName}</h2>
            </div>
            <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${isPast ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-800'}`}>
              {isApproved ? 'Confirmed' : formatStatus(status)}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <p className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>{getLocation(trip, 'from') || 'Pickup unavailable'}</span>
            </p>
            <Route className="hidden size-4 text-slate-400 sm:block" aria-hidden="true" />
            <p className="flex min-w-0 items-start gap-2 text-sm text-slate-600 sm:justify-end sm:text-right">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden="true" />
              <span>{getLocation(trip, 'to') || 'Destination unavailable'}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDateTime(getStartDateTime(trip))}
            </span>
            <span>{getTripType(trip)}</span>
            {trip?.distance && <span>{trip.distance}</span>}
            {trip?.duration && <span>{trip.duration}</span>}
            {getFare(trip) && <span className="font-bold text-slate-800">{getFare(trip)}</span>}
          </div>
        </div>

        {!isPast && !isApproved && (
          <button
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
            type="button"
            onClick={() => onOpenBids(trip)}
          >
            <Gavel className="size-4" aria-hidden="true" />
            View bids
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        )}
        {!isPast && isApproved && (
          <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Bid confirmed
          </span>
        )}
      </div>
    </article>
  )
}

function MyTravelsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [trips, setTrips] = useState([])
  const [activeTab, setActiveTab] = useState('present')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [serverApprovedTripIds, setServerApprovedTripIds] = useState(() => new Set())

  useEffect(() => {
    const controller = new AbortController()

    getPassengerTrips({ signal: controller.signal })
      .then((nextTrips) => {
        setTrips(nextTrips)
        setStatus('success')
        setError('')
      })
      .catch((requestError) => {
        if (requestError.name === 'CanceledError') return
        if (requestError.response?.status === 401) {
          logout()
          navigate('/login', { replace: true, state: { from: '/my-travels' } })
          return
        }
        setStatus('error')
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            'Unable to load your trips.',
        )
      })

    return () => controller.abort()
  }, [logout, navigate, revision])

  useEffect(() => {
    const candidates = trips.filter(
      (trip) =>
        !terminalStatuses.has(getTripStatus(trip)) && !isTripApproved(trip),
    )
    if (!candidates.length) return undefined

    const controller = new AbortController()
    Promise.allSettled(
      candidates.map(async (trip) => {
        const tripId = getTripId(trip)
        const bids = await getPassengerBids(tripId, { signal: controller.signal })
        const approvedBid = bids.find(
          (bid) => String(bid?.is_approved).toUpperCase() === 'YES',
        )
        return approvedBid ? { tripId, bidId: approvedBid.id } : null
      }),
    ).then((results) => {
      const approvedIds = new Set()
      results.forEach((result) => {
        if (result.status !== 'fulfilled' || !result.value) return
        const { tripId, bidId } = result.value
        approvedIds.add(String(tripId))
        markTripBidApproved(tripId, bidId)
      })
      if (approvedIds.size) {
        setServerApprovedTripIds((current) => new Set([...current, ...approvedIds]))
      }
    })

    return () => controller.abort()
  }, [trips])

  const groupedTrips = useMemo(() => {
    const present = []
    const past = []
    trips.forEach((trip) => {
      if (terminalStatuses.has(getTripStatus(trip))) past.push(trip)
      else present.push(trip)
    })
    return { present, past }
  }, [trips])

  const visibleTrips = groupedTrips[activeTab]

  const handleOpenBids = (trip) => {
    const tripId = getTripId(trip)
    if (!tripId) return
    if (isTripApproved(trip, serverApprovedTripIds)) return
    const existingSession = getBiddingSession(tripId)
    saveBiddingSession(createBiddingSession(trip, existingSession?.startedAt))
    navigate(`/car/bidding/${tripId}`)
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700">Passenger account</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">My Travels</h1>
            <p className="mt-2 text-sm text-slate-600">Review active bookings and your complete trip history.</p>
          </div>
          <button
            className="grid size-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 disabled:opacity-50"
            type="button"
            title="Refresh trips"
            aria-label="Refresh trips"
            disabled={status === 'loading'}
            onClick={() => {
              setStatus('loading')
              setRevision((current) => current + 1)
            }}
          >
            <RefreshCw className={`size-5 ${status === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </header>

        <div className="mt-7 inline-flex rounded-lg border border-slate-200 bg-white p-1" role="tablist" aria-label="Trip history">
          {['present', 'past'].map((tab) => (
            <button
              key={tab}
              className={`min-h-10 rounded-md px-5 text-sm font-bold capitalize ${activeTab === tab ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({groupedTrips[tab].length})
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {status === 'loading' ? (
          <div className="mt-6 grid gap-4">
            {[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-lg bg-slate-200" />)}
          </div>
        ) : visibleTrips.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {visibleTrips.map((trip, index) => (
              <TripCard
                key={getTripId(trip) ?? index}
                trip={trip}
                isPast={activeTab === 'past'}
                isApproved={isTripApproved(trip, serverApprovedTripIds)}
                onOpenBids={handleOpenBids}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid min-h-80 place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <div>
              {activeTab === 'present' ? <Clock3 className="mx-auto size-10 text-slate-400" aria-hidden="true" /> : <History className="mx-auto size-10 text-slate-400" aria-hidden="true" />}
              <h2 className="mt-4 text-lg font-black text-slate-900">No {activeTab} trips</h2>
              <p className="mt-2 text-sm text-slate-500">Your {activeTab} trips will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default MyTravelsPage
