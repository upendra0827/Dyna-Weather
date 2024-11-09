import React, { useEffect, useState, ReactNode } from "react";
import "./style.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FunctionComponent<ErrorBoundaryProps> = ({
  children,
}) => {
  const [error, setError] = useState(null);

  const handleError = (error: any) => {
    setError(error);
  };

  useEffect(() => {
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return error ? (
    <div className="errorBoundary">
      Something Went wrong on our side, please try again after sometime
    </div>
  ) : (
    <> {children}</>
  );
};

export default ErrorBoundary;
