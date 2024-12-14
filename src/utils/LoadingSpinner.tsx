import { ClipLoader } from "react-spinners";

const LoadingSpinner = (loadingText:string) => {
    return (
      <div className="flex items-center justify-center h-screen">
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