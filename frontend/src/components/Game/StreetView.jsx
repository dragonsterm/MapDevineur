import { useEffect, useRef, useState } from 'react';

function StreetView({ location }) {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // 1. Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.StreetViewPanorama) {
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) return;
    
    const interval = setInterval(() => {
      if (checkGoogleMaps()) clearInterval(interval);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // 2. Initialize the Panorama Instance (RUNS ONCE)
  useEffect(() => {
    if (!isApiReady || !streetViewRef.current) return;

    // Prevent double-initialization (Strict Mode safety)
    if (panoramaRef.current) return;

    console.log('[Street View] Initializing instance');
    
    panoramaRef.current = new window.google.maps.StreetViewPanorama(
      streetViewRef.current,
      {
        position: { lat: 0, lng: 0 }, // Start with a safe default
        pov: { heading: 0, pitch: 0 },
        zoom: 0,
        addressControl: false,
        linksControl: true,
        panControl: true,
        enableCloseButton: false,
        showRoadLabels: false,
        motionTracking: false,
        motionTrackingControl: false,
        fullscreenControl: false,
        visible: false, // Keep invisible until we set the real location
      }
    );

    // Cleanup function: destroys the instance if the component unmounts
    return () => {
      if (panoramaRef.current) {
        // There isn't a strict "destroy" method, but we nullify the ref
        // to ensure we don't hold onto the DOM element or listeners.
        panoramaRef.current = null;
      }
    };
  }, [isApiReady]);

  // 3. Update Position (Runs ONLY when location changes)
  useEffect(() => {
    if (!panoramaRef.current || !location) return;

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const latLng = { lat, lng };
    
    console.log('[Street View] Updating position to:', latLng);
    
    panoramaRef.current.setPosition(latLng);
    panoramaRef.current.setPov({ heading: 0, pitch: 0 });
    panoramaRef.current.setVisible(true);
    
    // Force a resize trigger to ensure tiles render correctly
    window.google.maps.event.trigger(panoramaRef.current, 'resize');

  }, [location, isApiReady]); // Only re-run if 'location' object or API status changes

  if (!isApiReady) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-gray-500">
        Loading Street View...
      </div>
    );
  }

  return (
    <div 
      ref={streetViewRef} 
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: '#000' }}
    />
  );
}

export default StreetView;