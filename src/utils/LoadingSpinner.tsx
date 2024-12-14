import { ClipLoader } from "react-spinners";

/**
 * Functional component that displays a loading spinner with a centered overlay.
 *
 * @param {string} loadingText - Text message displayed below the spinner.
 * @return {JSX.Element} - A modal with a centered spinner and message.
 */
const LoadingSpinner = (loadingText:string) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
      {/* <div className="fixed inset-0 flex items-center justify-center h-screen z-[1000] position-fixed top-0 left-0"> */}
        <div className="flex flex-col bg-[#1b3b6f] p-8 items-center justify-center rounded-md">
          <ClipLoader color="#ffb451" size={150} />
          <p className="mt-4 text-xl font-semibold text-white">{loadingText}</p>
          <p className="mt-2 text-lg text-white">
            Esto puede tomar unos momentos. Por favor, no cierres esta página.
          </p>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;