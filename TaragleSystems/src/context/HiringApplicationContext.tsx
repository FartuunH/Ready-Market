import { createContext, ReactNode, useContext, useState } from "react";
export type EmploymentRecord = {
  id: string;
  companyName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  position: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  dotRegulated: "yes" | "no" | null;
  subjectToDrugTesting: "yes" | "no" | null;
};
export type HiringApplicationData = {
  // Step 1 — Personal Information
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dateOfBirth: string;

  // Step 1 — CDL
  cdlNumber: string;
  cdlState: string;
  cdlClass: string;
  cdlExpiration: string;

  // Step 2 — Driving Experience
  yearsDriving: string;
  tractorTrailerYears: string;
  equipmentTypes: string;
  statesOperated: string;

  // Step 2 — Qualifications
  endorsements: string;
  restrictions: string;
  canDriveInterstate: "yes" | "no" | null;

  // Step 2 — Medical Certificate
  hasMedicalCard: "yes" | "no" | null;
  medicalExpiration: string;

  // Step 3 — Employment History
  employmentHistory: EmploymentRecord[];

  // Step 4 — Driving & Safety History
  hasAccidents: "yes" | "no" | null;
  accidents: AccidentRecord[];

  hasViolations: "yes" | "no" | null;
  violations: ViolationRecord[];

  licenseSuspended: "yes" | "no" | null;
  licenseSuspensionExplanation: string;

  licenseDenied: "yes" | "no" | null;
  licenseDenialExplanation: string;
};
export type AccidentRecord = {
  id: string;
  date: string;
  location: string;
  description: string;
  fatalities: string;
  injuries: string;
  towAway: "yes" | "no" | null;
};

export type ViolationRecord = {
  id: string;
  date: string;
  state: string;
  violation: string;
  disposition: string;
};
const initialApplication: HiringApplicationData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dateOfBirth: "",

  cdlNumber: "",
  cdlState: "",
  cdlClass: "",
  cdlExpiration: "",

  yearsDriving: "",
  tractorTrailerYears: "",
  equipmentTypes: "",
  statesOperated: "",

  endorsements: "",
  restrictions: "",
  canDriveInterstate: null,

  hasMedicalCard: null,
  medicalExpiration: "",

  employmentHistory: [],

  hasAccidents: null,
  accidents: [],

  hasViolations: null,
  violations: [],

  licenseSuspended: null,
  licenseSuspensionExplanation: "",

  licenseDenied: null,
  licenseDenialExplanation: "",
};

type HiringApplicationContextType = {
  application: HiringApplicationData;

  updateApplication: (values: Partial<HiringApplicationData>) => void;

  resetApplication: () => void;
};

const HiringApplicationContext = createContext<
  HiringApplicationContextType | undefined
>(undefined);

export function HiringApplicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [application, setApplication] =
    useState<HiringApplicationData>(initialApplication);

  function updateApplication(values: Partial<HiringApplicationData>) {
    setApplication((current) => ({
      ...current,
      ...values,
    }));
  }

  function resetApplication() {
    setApplication(initialApplication);
  }

  return (
    <HiringApplicationContext.Provider
      value={{
        application,
        updateApplication,
        resetApplication,
      }}
    >
      {children}
    </HiringApplicationContext.Provider>
  );
}

export function useHiringApplication() {
  const context = useContext(HiringApplicationContext);

  if (!context) {
    throw new Error(
      "useHiringApplication must be used inside HiringApplicationProvider",
    );
  }

  return context;
}
