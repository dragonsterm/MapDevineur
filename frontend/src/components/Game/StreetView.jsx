import { useEffect, useRef, useState } from 'react';

function StreetView({ location }) {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);

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

  useEffect(() => {
    if (!isApiReady || !streetViewRef.current) return;
    
    if (!location) return;

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);
    
    if (isNaN(lat) || isNaN(lng)) return;

    const latLng = { lat, lng };

    if (!panoramaRef.current) {
      console.log('[Street View] Initializing new instance');
      panoramaRef.current = new window.google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: latLng, // Initial position
          pov: { heading: 0, pitch: 0 },
          zoom: 0,
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
          showRoadLabels: false,
          motionTracking: false,
          motionTrackingControl: false,
          fullscreenControl: false, // cleaner UI
        }
      );
    } else {
      console.log('[Street View] Updating position');
      panoramaRef.current.setPosition(latLng);
      panoramaRef.current.setPov({ heading: 0, pitch: 0 });
      panoramaRef.current.setVisible(true);
      
      window.google.maps.event.trigger(panoramaRef.current, 'resize');
    }

  }, [location?.latitude, location?.longitude, isApiReady]);

  if (!isApiReady) {
    return <div className="w-full h-full bg-black" />;
  }

  return (
    <div 
      ref={streetViewRef} 
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: '#000' }}
    />
  );
}

export default StreetView;