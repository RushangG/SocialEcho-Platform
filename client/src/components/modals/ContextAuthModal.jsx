const ContextAuthModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsConsentGiven,
  isModerator,
}) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Context-Based Authentication
            </h2>
            <p className="mb-6 text-gray-600">
              To enhance the security of your account, SocialEcho now{" "}
              <span className="font-semibold">requires</span> context-based
              authentication for all users.
              <br />
              <br />
              We process limited information about your device and location,
              including your current location, device, browser info, and IP
              address. This data is used only to verify your identity when you
              sign in from a new location or device, and is encrypted and kept
              confidential.
              <br />
              <br />
              Email verification is a mandatory part of this process. By
              creating an account, you agree to these security checks.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsConsentGiven(true);
                  handleCloseModal();
                }}
                className={`${
                  isModerator
                    ? "hidden"
                    : "bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                } text-white px-4 py-2 rounded-md`}
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextAuthModal;
