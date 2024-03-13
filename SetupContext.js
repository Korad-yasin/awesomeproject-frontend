import React, { createContext, useState } from 'react';

const SetupContext = createContext();

export const SetupProvider = ({ children }) => {
  const [setupData, setSetupData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const value = {
    setupData,
    setSetupData,
    userId,
    setUserId,
    isReturningUser,
    setIsReturningUser,
  };

  return (
    <SetupContext.Provider value={value}>
      {children}
    </SetupContext.Provider>
  );
};

export default SetupContext;

