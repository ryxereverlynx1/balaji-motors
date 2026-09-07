"use client";

import React, { createContext, useContext, useState } from "react";

interface QuoteModalContextType {
  isOpen: boolean;
  preselectedVehicle: string;
  defaultEnquiryType: string;
  openQuoteModal: (vehicle?: string, enquiryType?: string) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType>({
  isOpen: false,
  preselectedVehicle: "BAXY Super King E-Rickshaw",
  defaultEnquiryType: "Vehicle Purchase",
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedVehicle, setPreselectedVehicle] = useState("BAXY Super King E-Rickshaw");
  const [defaultEnquiryType, setDefaultEnquiryType] = useState("Vehicle Purchase");

  const openQuoteModal = (vehicle?: string, enquiryType?: string) => {
    if (vehicle) setPreselectedVehicle(vehicle);
    if (enquiryType) setDefaultEnquiryType(enquiryType);
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
  };

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        preselectedVehicle,
        defaultEnquiryType,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}
