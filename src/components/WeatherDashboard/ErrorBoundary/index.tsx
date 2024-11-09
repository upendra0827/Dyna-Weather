import React, { useEffect, useState, ReactNode } from "react";
import "./style.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FunctionComponent<ErrorBoundaryProps> = ({
  children,
}) => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: ErrorEvent) => {
    setError(error.error);
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    setError(new Error(`Unhandled promise rejection: ${event.reason}`));
  };

  useEffect(() => {
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return error ? (
    <div className="errorBoundary">
      <div>
        Something Went wrong on our side, please try again after sometime
      </div>
    </div>
  ) : (
    <> {children}</>
  );
};

export default ErrorBoundary;
