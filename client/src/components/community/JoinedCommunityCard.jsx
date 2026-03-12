import { Link } from "react-router-dom";

const JoinedCommunityCard = ({ community }) => {
  return (
 
  <Link to={`/community/${community.name}`} className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img className="h-36 w-full rounded-xl object-cover" src={community.banner} alt={community.name} loading="lazy" />
      <h3 className="mb-1 mt-3 text-lg font-semibold text-slate-900">{community.name}</h3>
      <p className="mb-1 text-sm text-slate-600">{community.members.length} members</p>
    </Link>
  
  
  );
};

export default JoinedCommunityCard;
