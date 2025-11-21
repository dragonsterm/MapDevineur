import { useEffect, useRef, useState } from 'react';

function StreetView({ location }) {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.StreetViewPanorama) {
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) {
      return;
    }

    // Poll for Google Maps to be ready
    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isApiReady || !location || !streetViewRef.current) {
      console.log('Waiting for:', { isApiReady, hasLocation: !!location, hasRef: !!streetViewRef.current });
      return;
    }

    // Validate and parse coordinates
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates:', location);
      return;
    }

    console.log('Initializing Street View at:', { lat, lng, name: location.name });

    try {
      // Create Street View Service to check if location has panorama
      const streetViewService = new window.google.maps.StreetViewService();
      const position = { lat, lng };

      streetViewService.getPanorama({ location: position, radius: 50 }, (data, status) => {
        if (status === 'OK') {
          console.log('Street View available, creating panorama');
          
          // Create panorama with full controls
          panoramaRef.current = new window.google.maps.StreetViewPanorama(
            streetViewRef.current,
            {
              position: position,
              pov: { heading: 0, pitch: 0 },
              zoom: 1,
              // Enable user controls
              addressControl: false,
              linksControl: true,
              panControl: true,
              enableCloseButton: false,
              zoomControl: true,
              fullscreenControl: true,
              motionTracking: true,
              motionTrackingControl: true,
              showRoadLabels: false,
              visible: true,
            }
          );

          // Force visibility
          setTimeout(() => {
            if (panoramaRef.current) {
              panoramaRef.current.setVisible(true);
            }
          }, 100);

        } else {
          console.error('Street View not available at this location:', status);
        }
      });

    } catch (error) {
      console.error('Error initializing Street View:', error);
    }

    return () => {
      if (panoramaRef.current) {
        panoramaRef.current = null;
      }
    };
  }, [location, isApiReady]);

  if (!isApiReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading Street View...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={streetViewRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}

export default StreetView;