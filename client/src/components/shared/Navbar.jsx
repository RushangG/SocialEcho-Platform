import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import Logo from "../../assets/SocialEcho.png";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[#0F172A] shadow-md">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-0">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 md:hidden"
            onClick={toggleLeftbar}
          >
            {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
          </button>
          <Link to="/" className="inline-flex items-center gap-2">
            <img className="w-36" src={Logo} alt="SocialEcho" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center md:justify-center">
          <div className="w-full max-w-md">
            <Search />
          </div>
        </div>

        <div className="relative flex items-center justify-end gap-2 md:w-44">
          <span className="hidden text-sm font-semibold text-slate-200 md:inline-flex">
            {userData?.name?.split(" ")?.[0] || "User"}
          </span>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-800 transition hover:ring-2 hover:ring-slate-500"
            onClick={handleProfileClick}
          >
            <img
              src={userData.avatar}
              alt="profile"
              className="h-9 w-9 rounded-full object-cover"
            />
          </button>
          <Transition
            show={showDropdown}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {() => (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-11 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="py-3 px-4" role="none">
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={userData.avatar}
                      alt="profile"
                      className="mb-1 h-16 w-16 rounded-full object-cover ring-2 ring-primary/10"
                    />
                    <div className="text-sm font-semibold text-slate-800 hover:underline">
                      <Link to={`/profile`}>{userData.name}</Link>
                    </div>
                    <div className="text-xs text-slate-500">{userData.email}</div>
                  </div>
                  <hr className="my-3 border-slate-200" />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      role="menuitem"
                      onClick={logout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? (
                        <span>Logging out...</span>
                      ) : (
                        <>
                          <span>Logout</span>
                          <IoLogOutOutline className="text-base" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
