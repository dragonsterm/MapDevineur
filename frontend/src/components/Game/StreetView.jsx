import { useEffect, useRef, useState, memo } from 'react';
import { loadGoogleMaps } from '../../services/googleMapsLoader';

function StreetView({ location }) {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setIsApiReady(true);
      })
      .catch((err) => {
        console.error("[StreetView] Failed to load Google Maps API:", err);
      });
  }, []);

  useEffect(() => {
    if (!isApiReady || !streetViewRef.current || panoramaRef.current) return;

    console.log('[Street View] Initializing new Panorama instance');
    
    panoramaRef.current = new window.google.maps.StreetViewPanorama(
      streetViewRef.current,
      {
        pov: { heading: 0, pitch: 0 },
        zoom: 0,
        addressControl: false,
        linksControl: true,    
        panControl: true,
        clickToGo: true,         
        enableCloseButton: false,
        showRoadLabels: false,
        motionTracking: false,
        motionTrackingControl: false,
        fullscreenControl: false,
        visible: false,
      }
    );

    return () => {
      panoramaRef.current = null;
    };
  }, [isApiReady]);

  useEffect(() => {
    if (!panoramaRef.current || !location || !isApiReady) return;

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const svService = new window.google.maps.StreetViewService();
    
    const request = {
      location: { lat, lng },
      radius: 50,
      source: window.google.maps.StreetViewSource.OUTDOOR
    };

    svService.getPanorama(request)
      .then(({ data }) => {
        const panoId = data.location.pano;
        
        if (panoramaRef.current.getPano() === panoId) return;

        console.log('[Street View] Found Valid Outdoor Pano ID:', panoId);
        
        panoramaRef.current.setPano(panoId);
        panoramaRef.current.setPov({ heading: 0, pitch: 0 });
        panoramaRef.current.setVisible(true);

        window.google.maps.event.trigger(panoramaRef.current, 'resize');
      })
      .catch((err) => {
        console.warn('[Street View] No outdoor street view found here, retrying without filter...', err);
        return svService.getPanorama({ location: { lat, lng }, radius: 50 });
      })
      .then((result) => {
        if (result && result.data) {
           const panoId = result.data.location.pano;
           panoramaRef.current.setPano(panoId);
           panoramaRef.current.setVisible(true);
        }
      })
      .catch((err) => {
         console.error('[Street View] Absolutely no view found:', err);
         panoramaRef.current.setVisible(false);
      });

  }, [location, isApiReady]);

  if (!isApiReady) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading Maps...</div>
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

export default memo(StreetView, (prevProps, nextProps) => {
  return prevProps.location?.id === nextProps.location?.id;
});