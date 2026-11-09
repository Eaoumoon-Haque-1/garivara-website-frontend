import { useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  ChevronRight,
  CarFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gavel,
  Home,
  MapPin,
  RefreshCw,
  Route,
  Snowflake,
  Star,
  Timer,
  Users,
  X,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../components/shared/Button/Button'
import { useAuth } from '../context/AuthStateContext'
import {
  getApprovedTripBid,
  getBiddingSession,
  markTripBidApproved,
  saveBiddingSession,
} from '../features/booking/utils/biddingStorage'
import { approveBid, getPassengerBids } from '../services/bidService'

const biddingDurationMs = 30 * 60 * 1000
const bidPollingIntervalMs = 60 * 1000

function getBidId(bid) {
  return bid?.id ?? bid?.bid_id ?? bid?.trip_bid_id
}

function getBidAmount(bid) {
  return (
    bid?.bid_price ??
    bid?.bid_amount ??
    bid?.amount ??
    bid?.offer_price ??
    bid?.price ??
    bid?.fare
  )
}

function getPartnerName(bid) {
  return (
    bid?.partner_name ??
    bid?.driver_name ??
    bid?.partner?.name ??
    bid?.driver?.name ??
    bid?.user?.name ??
(bid?.partner_id ? `Partner #${bid.partner_id}` : 'Transport partner')
  )
}

function getVehicleName(bid) {
  const partnerCar = bid?.partner_cars
  const partnerCarName = [partnerCar?.brand_name, partnerCar?.model_no]
    .filter(Boolean)
    .join(' ')

  return (
    partnerCarName ||
    bid?.vehical_name ||
    bid?.vehicle_name ||
    bid?.vehicle?.vehical_name ||
    bid?.vehicle?.name ||
    'Assigned vehicle'
  )
}

function formatMoney(value) {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? `BDT ${amount.toLocaleString('en-BD')}`
    : 'Fare pending'
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatTripDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getShortAddress(value) {
  const address = String(value || '')
  return address.split(',')[0]?.trim() || address
}
function formatTripType(value) {
  return value === 'roundTrip' ? 'Round trip' : 'One way'
}

function formatPaymentMethod(value) {
  if (!value) return 'Not selected'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function BidCard({ bid, isApproved, onSelect }) {
  const bidId = getBidId(bid)
  const partnerCar = bid?.partner_cars || {}
  const vehicleImage = partnerCar.front_image
  const seats = partnerCar.no_of_seat ?? ''
  const registration = partnerCar.registration_no ?? bid?.registration_no ?? ''
  const color = partnerCar.color ?? bid?.color ?? ''
  const year = partnerCar.model_year ?? partnerCar.year ?? bid?.year ?? ''
  const acStatus = partnerCar.ac_status ?? bid?.ac_status ?? ''
  const luggage = partnerCar.no_of_luggage ?? bid?.no_of_luggage ?? ''
  const fuelType = partnerCar.fuel_type ?? bid?.fuel_type ?? ''
  const rating = bid?.rating ?? bid?.partner_rating ?? ''
  const reviewCount = bid?.review_count ?? ''
  const completionRate = bid?.completion_rate ?? ''
  const approvedByApi = String(bid?.is_approved).toUpperCase() === 'YES'
  const bidIsApproved = isApproved || approvedByApi

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid md:grid-cols-[8rem_minmax(0,1fr)] xl:grid-cols-[8rem_minmax(15rem,1fr)_9rem_8.5rem_10rem]">
        <div className="grid min-h-32 place-items-center border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          {vehicleImage ? (
            <img
              className="block max-h-28 w-full object-contain"
              src={vehicleImage}
              alt={getVehicleName(bid)}
            />
          ) : (
            <CarFront className="size-12 text-slate-300" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 p-4">
          <h3 className="truncate text-lg font-black text-slate-950">
            {getVehicleName(bid)}
          </h3>
          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1.5 text-sm text-slate-500">
            {registration && <span>{registration}</span>}
            {registration && color && <span className="text-slate-300">•</span>}
            {color && <span>{color}</span>}
            {(registration || color) && year && <span className="text-slate-300">•</span>}
            {year && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {year}
              </span>
            )}
          </div>

          <div className="mt-4 flex min-h-10 flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-slate-400" aria-hidden="true" />
              {seats}
            </span>
            {acStatus && (
              <span className="inline-flex items-center gap-1.5">
                <Snowflake className="size-4 text-slate-400" aria-hidden="true" />
                {acStatus}
              </span>
            )}
            {luggage && (
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="size-4 text-slate-400" aria-hidden="true" />
                {luggage}
              </span>
            )}
            {fuelType && (
              <span>{fuelType}</span>
            )}
          </div>
          <p className="mt-2 text-xs font-bold uppercase text-emerald-700">
            Partner #{bid?.partner_id ?? ''}
          </p>
        </div>

        <div className="grid grid-cols-2 border-t border-slate-100 md:col-start-2 xl:col-start-auto xl:grid-cols-1 xl:border-l xl:border-t-0">
          <div className="p-4">
            <p className="text-sm text-slate-500">Rating</p>
            <p className="mt-2 min-h-6 font-black text-slate-900">
              {rating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="size-4 fill-emerald-500 text-emerald-500" aria-hidden="true" />
                  {rating}{reviewCount ? ` (${reviewCount})` : ''}
                </span>
              )}
            </p>
          </div>
          <div className="border-l border-slate-100 p-4 xl:border-l-0 xl:border-t">
            <p className="text-sm text-slate-500">Completion rate</p>
            <p className="mt-2 min-h-6 font-black text-slate-900">
              {completionRate ? `${completionRate}%` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center border-t border-slate-100 p-4 md:col-start-2 xl:col-start-auto xl:border-l xl:border-t-0">
          <p className="text-sm text-slate-500">Quoted price</p>
          <p className="mt-2 text-xl font-black text-slate-950">
            {formatMoney(getBidAmount(bid))}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-slate-100 p-4 md:col-start-2 xl:col-start-auto xl:border-l xl:border-t-0">
          <Button
            disabled={!bidId || bidIsApproved}
            onClick={() => onSelect(bid)}
          >
            {bidIsApproved ? 'Approved' : 'Confirm'}
          </Button>
          <button
            className="min-h-9 font-bold text-emerald-700 hover:text-emerald-800"
            type="button"
            onClick={() => onSelect(bid)}
          >
            View details
          </button>
        </div>
      </div>
    </article>
  )
}
function TripBiddingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const session = useMemo(() => getBiddingSession(tripId), [tripId])
  const [deadline] = useState(
    () => Number(session?.startedAt || Date.now()) + biddingDurationMs,
  )
  const [remainingMs, setRemainingMs] = useState(() => deadline - Date.now())
  const [bids, setBids] = useState([])
  const [bidStatus, setBidStatus] = useState('loading')
  const [bidError, setBidError] = useState('')
  const [refreshRevision, setRefreshRevision] = useState(0)
  const [selectedBid, setSelectedBid] = useState(null)
  const [approvedBidId, setApprovedBidId] = useState(
    () => session?.approvedBidId ?? getApprovedTripBid(tripId)?.bidId ?? null,
  )
  const [isApproving, setIsApproving] = useState(false)

  const isExpired = remainingMs <= 0
  const searchCriteria = session?.searchCriteria
  const booking = session?.booking

  useEffect(() => {
    if (approvedBidId) return undefined

    const timerId = window.setInterval(() => {
      setRemainingMs(Math.max(0, deadline - Date.now()))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [approvedBidId, deadline])

  useEffect(() => {
    if (!tripId || isExpired || approvedBidId) return undefined

    const controller = new AbortController()
    let isActive = true

    const loadBids = async () => {
      try {
        const nextBids = await getPassengerBids(tripId, {
          signal: controller.signal,
        })
        if (!isActive) return
        setBids(nextBids)
        const approvedBid = nextBids.find(
          (bid) => String(bid?.is_approved).toUpperCase() === 'YES',
        )
        if (approvedBid) {
          const approvedId = getBidId(approvedBid)
          setApprovedBidId(approvedId)
          markTripBidApproved(tripId, approvedId)
          saveBiddingSession({
            ...(session || {}),
            tripId,
            startedAt: deadline - biddingDurationMs,
            approvedBidId: approvedId,
          })
        }
        setBidStatus('success')
        setBidError('')
      } catch (error) {
        if (!isActive || error.name === 'CanceledError') return
        if (error.response?.status === 401) {
          logout()
          navigate('/login', {
            replace: true,
            state: { from: `/car/bidding/${tripId}` },
          })
          return
        }
        setBidStatus('error')
        setBidError(
          error.response?.data?.message ||
            error.message ||
            'Unable to load bids right now.',
        )
      }
    }

    loadBids()
    const pollingId = window.setInterval(loadBids, bidPollingIntervalMs)

    return () => {
      isActive = false
      controller.abort()
      window.clearInterval(pollingId)
    }
  }, [approvedBidId, deadline, isExpired, logout, navigate, refreshRevision, session, tripId])

  const handleApprove = async () => {
    const bidId = getBidId(selectedBid)
    if (!bidId) return

    setIsApproving(true)
    try {
      await approveBid(bidId)
      setApprovedBidId(bidId)
      setSelectedBid(null)
      markTripBidApproved(tripId, bidId)
      saveBiddingSession({
        ...(session || {}),
        tripId,
        startedAt: deadline - biddingDurationMs,
        approvedBidId: bidId,
      })
      toast.success('Bid approved successfully.')
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', {
          replace: true,
          state: { from: `/car/bidding/${tripId}` },
        })
        return
      }
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to approve this bid.',
      )
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <main className="min-h-[80vh] bg-[#f7fafc] pb-16">
      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 border-b border-emerald-200 pb-5 text-sm text-slate-500" aria-label="Booking progress">
          <Home className="size-5" aria-hidden="true" />
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span>Search results</span>
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span>Booking details</span>
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span className="font-bold text-emerald-700">Bidding &amp; vehicle selection</span>
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span>Confirmation</span>
        </nav>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <section aria-labelledby="bid-list-heading">
            <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-5">
              <div>
                <h1 id="bid-list-heading" className="flex items-center gap-3 text-xl font-black text-slate-950">
                  <span className={`grid size-5 place-items-center rounded-full border-2 ${isExpired ? 'border-slate-400' : 'border-emerald-500'}`}>
                    <span className={`size-2.5 rounded-full ${isExpired ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                  </span>
                  {approvedBidId ? 'Bid approved' : isExpired ? 'Bidding ended' : 'Bidding ongoing'}
                </h1>
                {bids.length > 0 && (
                  <p className="mt-1 pl-8 text-sm text-slate-500">
                    {bids.length} {bids.length === 1 ? 'partner offer' : 'partner offers'} received
                  </p>
                )}
              </div>
              <button
                className="grid size-10 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-white hover:text-emerald-700 disabled:opacity-40"
                type="button"
                title="Refresh bids"
                aria-label="Refresh bids"
                disabled={isExpired || bidStatus === 'loading' || Boolean(approvedBidId)}
                onClick={() => {
                  setBidStatus('loading')
                  setRefreshRevision((current) => current + 1)
                }}
              >
                <RefreshCw className={`size-5 ${bidStatus === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
              </button>
            </div>

            {bidError && (
              <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                <span>{bidError}</span>
                <button className="font-bold" type="button" onClick={() => setRefreshRevision((current) => current + 1)}>
                  Retry
                </button>
              </div>
            )}

            {bids.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {bids.map((bid, index) => (
                  <BidCard
                    key={getBidId(bid) ?? index}
                    bid={bid}
                    isApproved={String(approvedBidId) === String(getBidId(bid))}
                    onSelect={setSelectedBid}
                  />
                ))}
              </div>
            ) : (
              <div className="grid min-h-[38rem] place-items-center py-12 text-center">
                <div className="max-w-xl">
                  <span className="relative mx-auto grid size-44 place-items-center rounded-full bg-emerald-50 text-emerald-700 sm:size-56">
                    <span className="absolute inset-5 rounded-full border border-dashed border-emerald-200" />
                    {isExpired ? (
                      <Clock3 className="relative size-16" aria-hidden="true" />
                    ) : (
                      <Gavel className="relative size-16" aria-hidden="true" />
                    )}
                  </span>
                  <h2 className="mt-8 text-xl font-black text-slate-950">
                    {isExpired ? 'No bids arrived in this window' : 'Partner bids will appear here'}
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                    {isExpired
                      ? 'The 30-minute bidding period has ended without an offer.'
                      : 'We are looking for the best available rental offer. New partner bids are checked automatically every minute.'}
                  </p>
                </div>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-5 lg:self-start">
            <div className="flex min-h-14 items-center justify-between rounded-lg bg-emerald-100 px-4 text-emerald-900">
              <span className="inline-flex items-center gap-2 font-bold">
                {approvedBidId ? <CheckCircle2 className="size-5" aria-hidden="true" /> : <Timer className="size-5" aria-hidden="true" />}
                {approvedBidId ? 'Bid approved' : 'Time left'}
              </span>
              <span className="rounded-md bg-emerald-700 px-3 py-2 font-mono text-lg font-black text-white tabular-nums">
                {approvedBidId ? 'Complete' : formatCountdown(remainingMs)}
              </span>
            </div>

            <section className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {searchCriteria ? (
                <>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5">
                    <div className="min-w-0">
                      <p className="font-black text-slate-950">{getShortAddress(searchCriteria.pickup?.displayAddress)}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{searchCriteria.pickup?.displayAddress}</p>
                    </div>
                    <Route className="size-5 text-emerald-700" aria-hidden="true" />
                    <div className="min-w-0 text-right">
                      <p className="font-black text-slate-950">{getShortAddress(searchCriteria.dropoff?.displayAddress)}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{searchCriteria.dropoff?.displayAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-y border-slate-100 px-5 py-4 text-sm">
                    <span className="font-semibold text-slate-600">
                      {formatTripType(searchCriteria.tripType)} · {formatTripDate(searchCriteria.pickupDateTime)}
                    </span>
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {formatTripType(searchCriteria.tripType)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="p-5 text-sm leading-6 text-slate-500">
                  Trip details are unavailable in this browser session. Bidding will continue for trip #{tripId}.
                </p>
              )}

              {booking?.vehicle && (
                <div className="flex items-center gap-4 border-b border-slate-100 p-5">
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
                    {booking.vehicle.vehical_image ? (
                      <img className="h-full w-full object-contain p-1" src={booking.vehicle.vehical_image} alt={booking.vehicle.vehical_name} />
                    ) : (
                      <CarFront className="size-6 text-emerald-700" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">{booking.vehicle.vehical_name || 'Selected vehicle'}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      {booking.vehicle.seat_capacity && <span className="inline-flex items-center gap-1"><Users className="size-3.5" aria-hidden="true" />{booking.vehicle.seat_capacity} seats</span>}
                      {booking.vehicle.no_of_suitecase && <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="size-3.5" aria-hidden="true" />{booking.vehicle.no_of_suitecase}</span>}
                      {booking.vehicle.ac_status && <span>{booking.vehicle.ac_status}</span>}
                    </div>
                  </div>
                </div>
              )}

              {searchCriteria && (
                <div className="p-5">
                  <h2 className="border-b-2 border-emerald-600 pb-3 text-center font-black text-emerald-800">Journey timeline</h2>
                  <div className="mt-5 grid grid-cols-[1.25rem_1fr] gap-x-3">
                    <div className="flex flex-col items-center">
                      <MapPin className="size-5 text-emerald-700" aria-hidden="true" />
                      <span className="my-2 w-px flex-1 border-l border-dashed border-slate-300" />
                    </div>
                    <div className="pb-5">
                      <p className="font-bold text-slate-800">{searchCriteria.pickup?.displayAddress}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatTripDate(searchCriteria.pickupDateTime)}</p>
                    </div>

                    <div />
                    <div className="mb-5 flex flex-wrap gap-2">
                      {searchCriteria.duration && <span className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-600">{searchCriteria.duration}</span>}
                      {searchCriteria.distance && <span className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-600">{searchCriteria.distance}</span>}
                    </div>

                    <MapPin className="size-5 text-slate-500" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-slate-800">{searchCriteria.dropoff?.displayAddress}</p>
                      <p className="mt-1 text-xs text-slate-500">Destination</p>
                    </div>
                  </div>

                  {searchCriteria.tripType === 'roundTrip' && searchCriteria.returnDateTime && (
                    <div className="mt-5 border-t border-slate-100 pt-4 text-sm">
                      <p className="font-bold text-slate-800">Return journey</p>
                      <p className="mt-1 text-slate-500">{formatTripDate(searchCriteria.returnDateTime)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 border-t border-slate-100 p-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 font-bold text-slate-800"><CreditCard className="size-4 text-emerald-700" aria-hidden="true" />Payment method</span>
                  <span className="font-semibold text-slate-600">{formatPaymentMethod(booking?.payMode)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-slate-800">Approximate fare</span>
                  <span className="font-black text-emerald-800">{formatMoney(booking?.approximateFare)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 p-4 text-center">
                <button
                  className="inline-flex min-h-10 items-center justify-center gap-2 px-4 font-bold text-red-600 transition hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  type="button"
                  onClick={() =>
                    toast.info('Trip cancellation is not connected yet.')
                  }
                >
                  <X className="size-4" aria-hidden="true" />
                  Cancel request
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {selectedBid && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="presentation">
          <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="approve-bid-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Confirm partner</p>
                <h2 id="approve-bid-title" className="mt-1 text-xl font-black text-slate-950">Approve this bid?</h2>
              </div>
              <button className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" type="button" aria-label="Close confirmation" onClick={() => setSelectedBid(null)}>
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 border-y border-slate-100 py-4">
              <p className="font-bold text-slate-900">{getPartnerName(selectedBid)}</p>
              <p className="mt-1 text-sm text-slate-500">{getVehicleName(selectedBid)}</p>
              <p className="mt-3 text-2xl font-black text-emerald-800">{formatMoney(getBidAmount(selectedBid))}</p>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedBid(null)}>Cancel</Button>
              <Button isLoading={isApproving} onClick={handleApprove}>Approve bid</Button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default TripBiddingPage