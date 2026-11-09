import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Snowflake,
  Tag,
  UserRound,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/shared/Button/Button";
import { useAuth } from "../context/AuthStateContext";
import { getStoredSessionToken } from "../features/auth/utils/authStorage";
import {
  clearPendingBooking,
  getPendingBooking,
  isValidPendingBooking,
  savePendingBooking,
} from "../features/booking/utils/bookingStorage";
import {
  clearVehicleSearchCriteria,
  getVehicleSearchCriteria,
  isValidVehicleSearchCriteria,
} from "../features/search/utils/searchStorage";
import { saveBiddingSession } from "../features/booking/utils/biddingStorage";
import { createTrip } from "../services/tripService";

const maximumNoteLength = 600;

function formatDate(value) {
  if (!value) return "Not selected";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "Not selected";

  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function splitDateTime(value) {
  const [date = "", time = ""] = value?.split("T") || [];
  return { date, time };
}

function ContactDetail({ Icon, value }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-sm text-slate-600">
      <Icon className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
      <span className="truncate">{value}</span>
    </span>
  );
}

function JourneyPoint({ address, label }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
        <MapPin className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
          {address}
        </p>
      </div>
    </div>
  );
}

function BookingDetailsPage() {
  const navigate = useNavigate();
  const { logout, token, user } = useAuth();
  const [booking, setBooking] = useState(getPendingBooking);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [searchCriteria] = useState(getVehicleSearchCriteria);
  const [showPromoInput, setShowPromoInput] = useState(
    Boolean(booking?.promoCode),
  );

  const updateBooking = (updates) => {
    setBooking((current) => {
      if (!current) return current;

      const updatedBooking = { ...current, ...updates };
      savePendingBooking(updatedBooking);
      return updatedBooking;
    });
  };
  const handleCreateTrip = async () => {
    const storedToken = getStoredSessionToken();
    const currentToken = typeof token === "string" ? token.trim() : "";

    if (!storedToken || storedToken !== currentToken) {
      logout();
      toast.error("Your session is missing or invalid. Please log in again.");
      navigate("/login", {
        replace: true,
        state: { from: "/car/booking-details" },
      });
      return;
    }

    const storedSearchCriteria = getVehicleSearchCriteria();
    if (
      !storedSearchCriteria ||
      !isValidVehicleSearchCriteria(storedSearchCriteria)
    ) {
      clearVehicleSearchCriteria();
      toast.error(
        "Your search information is incomplete. Please search again.",
      );
      navigate("/car", { replace: true });
      return;
    }

    const storedBooking = getPendingBooking();
    if (
      !storedBooking ||
      !isValidPendingBooking(storedBooking, { requirePayment: true })
    ) {
      clearPendingBooking();
      toast.error(
        "Your booking information is incomplete. Please select a vehicle again.",
      );
      navigate("/car/search-results", { replace: true });
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const { tripId } = await createTrip(
        storedBooking,
        storedSearchCriteria,
      );

      saveBiddingSession({
        tripId,
        startedAt: Date.now(),
        booking: storedBooking,
        searchCriteria: storedSearchCriteria,
      });

      clearVehicleSearchCriteria();
      clearPendingBooking();
      toast.success("Trip created successfully.");
      navigate(`/car/bidding/${tripId}`, { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error("Your session expired. Please log in again.");
        navigate("/login", {
          replace: true,
          state: { from: "/car/booking-details" },
        });
        return;
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create the trip. Please try again.";
      setSubmissionError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking?.vehicle || !searchCriteria) {
    return (
      <main className="min-h-[70vh] bg-[#f4f7f5] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CarFront
            className="mx-auto size-12 text-emerald-700"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-2xl font-black text-slate-950">
            No pending vehicle selection
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a vehicle before opening booking details.
          </p>
          <Button as={Link} className="mt-6" to="/car/search-results">
            View vehicle options
          </Button>
        </div>
      </main>
    );
  }

  const vehicle = booking.vehicle;
  const pickup = splitDateTime(searchCriteria.pickupDateTime);
  const returnTrip = splitDateTime(searchCriteria.returnDateTime);
  const travelerName = user?.full_name || user?.name || "No name added";
  const travelerMobile = user?.mobile_no || "No mobile number";
  const travelerEmail = user?.email || "No email address";

  return (
    <main className="min-h-[70vh] bg-[#f4f7f5] pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5 sm:px-6">
          <Link
            className="grid size-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100"
            to="/car/search-results"
            aria-label="Back to vehicle options"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Review your journey
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
              Booking details
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700">
                {vehicle.vehical_image ? (
                  <img
                    className="h-full w-full object-contain p-1"
                    src={vehicle.vehical_image}
                    alt={vehicle.vehical_name}
                  />
                ) : (
                  <CarFront className="size-8" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-950">
                  {vehicle.vehical_name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Users
                      className="size-4 text-emerald-700"
                      aria-hidden="true"
                    />
                    {vehicle.seat_capacity}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Snowflake
                      className="size-4 text-emerald-700"
                      aria-hidden="true"
                    />
                    {vehicle.ac_status}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness
                      className="size-4 text-emerald-700"
                      aria-hidden="true"
                    />
                    {vehicle.no_of_suitecase}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Approximate fare
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  BDT {Number(booking.approximateFare).toLocaleString("en-BD")}
                </p>
              </div>
              <Link
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
                to="/car/search-results"
              >
                Change
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-950">
              Journey details
            </h2>
            <Link
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
              to="/car/search-results"
            >
              Change
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            <JourneyPoint
              address={searchCriteria.pickup.displayAddress}
              label="From"
            />
            <div className="ml-5 h-5 border-l border-dashed border-emerald-300" />
            <JourneyPoint
              address={searchCriteria.dropoff.displayAddress}
              label="To"
            />
          </div>

          <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                <CalendarDays className="size-4" aria-hidden="true" />
                Start date
              </p>
              <p className="mt-2 font-bold text-slate-900">
                {formatDate(pickup.date)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                <Clock3 className="size-4" aria-hidden="true" />
                Start time
              </p>
              <p className="mt-2 font-bold text-slate-900">
                {formatTime(pickup.time)}
              </p>
            </div>
          </div>

          {searchCriteria.tripType === "roundTrip" && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Return date
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {formatDate(returnTrip.date)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Return time
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {formatTime(returnTrip.time)}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-950">
              Traveler details
            </h2>
            <Link
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
              to="/profile"
            >
              Update profile
            </Link>
          </div>

          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <ContactDetail Icon={UserRound} value={travelerName} />
            <ContactDetail Icon={Phone} value={travelerMobile} />
            <ContactDetail Icon={Mail} value={travelerEmail} />
          </div>

          <label className="mt-5 block" htmlFor="driver-note">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Note for the driver
            </span>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-slate-300 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              id="driver-note"
              maxLength={maximumNoteLength}
              placeholder="Add any pickup or journey instructions"
              value={booking.note || ""}
              onChange={(event) => updateBooking({ note: event.target.value })}
            />
          </label>
          <p className="mt-1 text-right text-xs text-slate-500">
            {(booking.note || "").length}/{maximumNoteLength}
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
            type="button"
            aria-expanded={showPromoInput}
            onClick={() => setShowPromoInput((current) => !current)}
          >
            <span className="flex items-center gap-3">
              <Tag className="size-5 text-emerald-700" aria-hidden="true" />
              <span>
                <span className="block font-bold text-slate-900">
                  Have a promo code?
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Add it now and validate it when booking is enabled.
                </span>
              </span>
            </span>
            <span className="text-2xl text-emerald-700" aria-hidden="true">
              {showPromoInput ? "−" : "+"}
            </span>
          </button>

          {showPromoInput && (
            <div className="border-t border-slate-100 p-5 sm:p-6">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="promo-code"
              >
                Promo code
              </label>
              <input
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold uppercase outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                id="promo-code"
                placeholder="Enter promo code"
                value={booking.promoCode || ""}
                onChange={(event) =>
                  updateBooking({ promoCode: event.target.value })
                }
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label
            className="flex items-center justify-between gap-4"
            htmlFor="payment-method"
          >
            <span className="flex items-center gap-3 font-bold text-slate-900">
              <CreditCard
                className="size-5 text-emerald-700"
                aria-hidden="true"
              />
              Payment method
            </span>
            <select
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              id="payment-method"
              value={booking.payMode || ""}
              onChange={(event) =>
                updateBooking({ payMode: event.target.value })
              }
            >
              {/* <option value="" disabled>
                Select payment
              </option> */}
              <option value="cash">Cash</option>
              <option value="digital">Digital</option>
            </select>
          </label>
        </section>

        <div>
          {submissionError && (
            <p
              className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {submissionError}
            </p>
          )}
          <Button
            fullWidth
            className="min-h-13 text-base"
            disabled={!booking.payMode}
            isLoading={isSubmitting}
            onClick={handleCreateTrip}
          >
            Continue
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            {booking.payMode
              ? "Continue to create your trip request."
              : "Select a payment method to continue."}
          </p>
        </div>
      </div>
    </main>
  );
}

export default BookingDetailsPage;
