import { createContext, useContext } from "react";
import { apiResponseHead } from "../../types/apiResponseHead";
import { useState } from "react";

type StateType = {
  customer: apiResponseHead[];
  setCustomers: React.Dispatch<React.SetStateAction<apiResponseHead[]>>;
};

export const CustomerContext = createContext<StateType | null>(null);

export const CustomerContextProvide = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [customer, setCustomers] = useState<apiResponseHead[]>([]);
  return (
    <CustomerContext.Provider
      value={{
        customer,
        setCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomerContext must be used within a CustomerContextProvide"
    );
  }
  return context;
};
