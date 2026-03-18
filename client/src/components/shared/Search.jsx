import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import JoinModal from "../modals/JoinModal";
import { MoonLoader } from "react-spinners";
import { MdClear } from "react-icons/md";

const BASE_URL = process.env.REACT_APP_API_URL;

const Search = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'post' | 'user' | 'community' | 'all'
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCommunity(null);
    setJoinedCommunity(null);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        axios
          .get(
            `${BASE_URL}/search?q=${encodedQuery}&type=${encodeURIComponent(
              searchType
            )}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            const { posts, users, community, joinedCommunity } = res.data;
            setPosts(posts);
            setUsers(users);
            setCommunity(community);
            setJoinedCommunity(joinedCommunity);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }, 800),
    [accessToken, searchType]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
    }
  };

  useEffect(() => {
    if (inputValue.trim() === "") return;
    debouncedHandleSearch(inputValue);
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch, inputValue]); // re-run search when query or type changes

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };

  useEffect(() => {
    return () => {
      setInitialValue();
    };
  }, []);

  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const toggleModal = () => {
    setJoinModalVisibility((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-[1.2]">
          <input
            type="text"
            id="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              searchType === "user"
                ? "Search People"
                : searchType === "post"
                ? "Search posts"
                : searchType === "community"
                ? "Search communities"
                : "Search people, posts or communities"
            }
            className="h-10 w-full rounded-xl border border-slate-600 bg-slate-800/90 py-1 pl-4 pr-10 text-sm text-slate-100 shadow-inner transition duration-300 placeholder:text-slate-300 focus:border-blue-400 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30"
            aria-label="Search"
            autoComplete="off"
          />
          {inputValue !== "" && (
            <button
              className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-slate-300 transition hover:text-white"
              onClick={clearValues}
            >
              <MdClear />
            </button>
          )}
        </div>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-10 w-[132px] rounded-xl border border-slate-600 bg-slate-800 px-2.5 text-sm font-semibold text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300/30 sm:w-[140px]"
          aria-label="Search type"
        >
          <option value="all">All</option>
          <option value="user">People</option>
          <option value="post">Posts</option>
          <option value="community">Communities</option>
        </select>
      </div>

      {inputValue !== "" && (
        <div
          onBlur={() => !community && clearValues()}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 w-full max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          {loading && (
            <div className="flex items-center justify-center px-2 py-2 text-sm text-slate-600">
              <MoonLoader size={20} color={"#008cff"} />
              <span className="ml-2">Searching...</span>
            </div>
          )}
          {posts.length > 0 && (
            <ul className="z-30">
              {posts.map((post) => (
                <li key={post._id} className="border-b border-slate-100 py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                      clearValues();
                    }}
                    className="block cursor-pointer text-sm text-gray-700 hover:text-blue-500"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">
                          {post.content}
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted by {post.user.name} in {post.community.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {users.length > 0 && (
            <ul className="z-30">
              {users.map((user) => (
                <li key={user._id} className="border-b border-slate-100 py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/user/${user._id}`);
                      clearValues();
                    }}
                    className="block cursor-pointer text-sm text-gray-700 hover:text-indigo-500"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {community && (
            <div className="border-b border-slate-100 py-2 px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={community.banner}
                    alt={community.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className=" px-2 flex justify-between items-center gap-2">
                  <div className="">
                    <p className="font-medium">{community.name}</p>

                    <p className="text-sm line-clamp-2">
                      {community.description}
                    </p>
                  </div>

                  {!community.isMember && (
                    <>
                      <JoinModal
                        show={joinModalVisibility}
                        onClose={() => {
                          toggleModal(false);
                          setCommunity(null);
                        }}
                        community={community}
                      />
                      <button
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        onClick={() => toggleModal(true)}
                      >
                        Join
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {joinedCommunity && (
            <div
              key={joinedCommunity._id}
              onClick={() => {
                navigate(`/community/${joinedCommunity.name}`);
                clearValues();
              }}
              className="block cursor-pointer border-b border-slate-100 py-2 px-4 text-sm text-gray-700 hover:text-indigo-500"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={joinedCommunity.banner}
                    alt={joinedCommunity.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-md text-primary">
                    {joinedCommunity.name}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {joinedCommunity.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
