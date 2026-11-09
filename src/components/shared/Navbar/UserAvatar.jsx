function UserAvatar({ user, size = "size-10" }) {
  const displayName =
    user?.name || user?.full_name || user?.mobile_no || "Account";
  const avatarUrl =
    user?.avatar || user?.avatar_url || user?.profile_image || user?.photo;
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <span
      className={`relative grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-700 font-bold text-white`}
      aria-hidden="true"
    >
      {initial}
      {avatarUrl && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={avatarUrl}
          alt=""
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      )}
    </span>
  );
}

export default UserAvatar;