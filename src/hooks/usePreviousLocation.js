// usePreviousLocation.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePreviousLocation = () => {
  const location = useLocation();
  const previousLocationRef = useRef();

  useEffect(() => {
    // Skip the initial update to prevent undefined value
    if (previousLocationRef.current) {
      previousLocationRef.current = location;
    }
  }, [location]);

  // Set initial value if it's not set
  if (!previousLocationRef.current) {
    previousLocationRef.current = location;
  }

  return previousLocationRef.current;
};

export default usePreviousLocation;
