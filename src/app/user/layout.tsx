import React from "react";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
     Guest layoput
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
};

export default GuestLayout;
