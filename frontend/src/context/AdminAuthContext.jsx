import React, { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const requestAdminAccess = (callback) => {
    if (isAdminVerified) {
      callback();
    } else {
      setPendingAction(() => callback);
      setShowAdminModal(true);
    }
  };

  const handleAdminVerified = () => {
    setIsAdminVerified(true);
    setShowAdminModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setPendingAction(null);
  };

  const resetAdminAuth = () => {
    setIsAdminVerified(false);
  };

  const value = {
    isAdminVerified,
    showAdminModal,
    requestAdminAccess,
    handleAdminVerified,
    closeAdminModal,
    resetAdminAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
