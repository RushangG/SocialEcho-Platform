const OwnInfoCard = ({ user }) => {
  return (
    <div className="my-5 space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Profile Summary</h3>
        <div className="text-xs text-slate-500 md:text-sm">
          Joined {user.duration} ago (
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          )
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
        <div className="text-slate-500">Total Posts</div>
        <div className="font-semibold text-slate-800">{user.totalPosts}</div>
      </div>
      <div className="flex flex-wrap items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
        <div className="text-slate-500">Total Communities</div>
        <div className="font-semibold text-slate-800">{user.totalCommunities}</div>
      </div>
      {user.totalPosts > 0 && (
        <div className="flex flex-wrap items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <div className="text-slate-500">Posts in Communities</div>
          <div className="font-semibold text-slate-800">
            {user.totalPosts} in {user.totalPostCommunities}{" "}
            {user.totalPostCommunities === 1 ? "community" : "communities"}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
        <div className="text-slate-500">Followers</div>
        <div className="font-semibold text-slate-800">
          {user.followers?.length ?? 0}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
        <div className="text-slate-500">Following</div>
        <div className="font-semibold text-slate-800">
          {user.following?.length ?? 0}
        </div>
      </div>
    </div>
  );
};

export default OwnInfoCard;
