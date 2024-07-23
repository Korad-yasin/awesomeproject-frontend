// hooks/useReturnMessage.js
import { useContext, useState, useEffect } from 'react';
import SetupContext from '../SetupContext';

const useReturnMessage = () => {
    const { isReturningUser, setIsReturningUser } = useContext(SetupContext);
    const [showMessage, setShowMessage] = useState(isReturningUser);

    useEffect(() => {
        if (showMessage) {
            setShowMessage(true); 
            setIsReturningUser(false); 
        }
    }, [showMessage, setIsReturningUser]);

    return showMessage;
};

export default useReturnMessage;
