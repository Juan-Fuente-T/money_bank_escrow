import { ClipLoader } from "react-spinners";

const LoadingSpinner = (loadingText:string) => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col bg-stone-100 p-8 items-center justify-center border-2 border-stone-800 rounded-md">
          <ClipLoader color="#3498db" size={150} />
          <p className="mt-4 text-xl font-semibold">{loadingText}</p>
          <p className="mt-2 text-lg text-stone-900">
            Esto puede tomar unos momentos. Por favor, no cierres esta página.
          </p>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;