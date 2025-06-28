import React from "react";

const ResponsiveContainer = ({
  children,
  className = "",
  maxWidth = "1200px",
  padding = true,
  centered = true,
}) => {
  const baseClasses = "w-full mx-auto";
  const paddingClasses = padding ? "px-4 sm:px-6 lg:px-8" : "";
  const centerClasses = centered ? "flex flex-col items-center" : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${centerClasses} ${className}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
