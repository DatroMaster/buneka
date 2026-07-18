"use client";

import { createContext, useContext } from "react";
import type { FeatureCode } from "@/lib/licensing/access";

type LicenseAccess = {
  planName: string | null;
  expiresAt: string | null;
  featureCodes: FeatureCode[];
};

type LicenseAccessContextValue = LicenseAccess & {
  hasFeature: (featureCode: FeatureCode) => boolean;
};

const LicenseAccessContext = createContext<LicenseAccessContextValue>({
  planName: null,
  expiresAt: null,
  featureCodes: [],
  hasFeature: () => false,
});

export function LicenseAccessProvider({
  value,
  children,
}: {
  value: LicenseAccess;
  children: React.ReactNode;
}) {
  const featureSet = new Set(value.featureCodes);

  return (
    <LicenseAccessContext.Provider
      value={{
        ...value,
        hasFeature: (featureCode) => featureSet.has(featureCode),
      }}
    >
      {children}
    </LicenseAccessContext.Provider>
  );
}

export function useLicenseAccess() {
  return useContext(LicenseAccessContext);
}
