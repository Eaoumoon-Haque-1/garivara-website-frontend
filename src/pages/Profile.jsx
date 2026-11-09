import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Button from "../components/shared/Button/Button";
import { useAuth } from "../context/AuthStateContext";

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name = "User") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "U";

function ProfileAvatar({ user }) {
  return (
    <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-white/20 bg-white/15 text-3xl font-bold text-white shadow-lg sm:size-28">
      {getInitials(user.full_name)}
      {user.profile_image && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={user.profile_image}
          alt={`${user.full_name || "User"} profile`}
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => ({
    full_name: user?.full_name || "",
    user_name: user?.user_name || "",
    email: user?.email || "",
    mobile_no: user?.mobile_no || "",
    gender: user?.gender || "",
    division: user?.division || "",
    address: user?.address || "",
  }));

  if (!user) return null;

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const cancelEditing = () => {
    setDraft({
      full_name: user.full_name || "",
      user_name: user.user_name || "",
      email: user.email || "",
      mobile_no: user.mobile_no || "",
      gender: user.gender || "",
      division: user.division || "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 shadow-xl">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-10">
            <ProfileAvatar user={user} />

            <div className="min-w-0 flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">
                  Passenger profile
                </p>
                {Boolean(user.is_verified) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Verified
                  </span>
                )}
              </div>
              <h1 className="mt-2 truncate text-3xl font-bold tracking-tight sm:text-4xl">
                {user.full_name || "Passenger"}
              </h1>
              <p className="mt-2 text-sm text-emerald-100/80 sm:text-base">
                {user.mobile_no}
              </p>
            </div>

            <Button
              className="shrink-0 self-start border border-white/2 bg-success hover:bg-emerald-50 sm:self-center"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="size-4" aria-hidden="true" />
              Edit profile
            </Button>
          </div>
        </section>

        {isEditing ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Edit profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update API integration will be added later.
                </p>
              </div>
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                onClick={cancelEditing}
                aria-label="Close edit profile"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <form className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                name="full_name"
                value={draft.full_name}
                onChange={updateDraft}
              />
              <FormField
                label="Username"
                name="user_name"
                value={draft.user_name}
                onChange={updateDraft}
              />
              <FormField
                label="Email address"
                name="email"
                type="email"
                value={draft.email}
                onChange={updateDraft}
              />
              <FormField
                label="Verified mobile number"
                name="mobile_no"
                value={draft.mobile_no}
                onChange={updateDraft}
                disabled
              />
              <FormField
                label="Gender"
                name="gender"
                value={draft.gender}
                onChange={updateDraft}
              />
              <FormField
                label="Division"
                name="division"
                value={draft.division}
                onChange={updateDraft}
              />
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </span>
                <textarea
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                  name="address"
                  value={draft.address}
                  onChange={updateDraft}
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button disabled title="Connect the profile update API to enable saving">
                  <Save className="size-4" aria-hidden="true" />
                  Save changes
                </Button>
              </div>
            </form>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <UserRound className="size-5 text-emerald-700" aria-hidden="true" />
                <h2 className="text-xl font-bold text-slate-950">
                  Personal information
                </h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailItem icon={Phone} label="Mobile number" value={user.mobile_no} />
                <DetailItem icon={Mail} label="Email address" value={user.email} />
                <DetailItem icon={UserRound} label="Username" value={user.user_name} />
                <DetailItem icon={MapPin} label="Address" value={user.address} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-emerald-700" aria-hidden="true" />
                <h2 className="text-xl font-bold text-slate-950">Account</h2>
              </div>
              <div className="mt-6 grid gap-4">
                <DetailItem
                  icon={ShieldCheck}
                  label="Account status"
                  value={user.is_active ? "Active" : "Inactive"}
                />
                <DetailItem
                  icon={CheckCircle2}
                  label="Verification"
                  value={user.is_verified ? "Verified" : "Not verified"}
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Member since"
                  value={formatDate(user.created_at)}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;