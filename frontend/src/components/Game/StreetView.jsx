import { useEffect, useRef, useState, memo, forwardRef, useImperativeHandle } from 'react';
import { loadGoogleMaps } from '../../services/googleMapsLoader';

const StreetView = forwardRef(({ location, onHeadingChange }, ref) => {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const initialPanoIdRef = useRef(null); 
  const [isApiReady, setIsApiReady] = useState(false);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      if (panoramaRef.current && initialPanoIdRef.current) {
         panoramaRef.current.setPano(initialPanoIdRef.current);
         panoramaRef.current.setPov({ heading: 0, pitch: 0 });
         panoramaRef.current.setZoom(0);
         
         if (onHeadingChange) onHeadingChange(0);
      }
    }
  }));

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
    
    const panorama = new window.google.maps.StreetViewPanorama(
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

    panoramaRef.current = panorama;

    const listener = panorama.addListener('pov_changed', () => {
        const pov = panorama.getPov();
        if (onHeadingChange) {
            onHeadingChange(pov.heading);
        }
    });

    return () => {
      window.google.maps.event.removeListener(listener);
      panoramaRef.current = null;
    };
  }, [isApiReady]);

  useEffect(() => {
    if (!panoramaRef.current || !location || !isApiReady) return;

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    if (panoramaRef.current.getPosition()) {
        const currentPos = panoramaRef.current.getPosition();
        if (Math.abs(currentPos.lat() - lat) < 0.0001 && Math.abs(currentPos.lng() - lng) < 0.0001) {
            return; 
        }
    }

    initialPanoIdRef.current = null;

    const svService = new window.google.maps.StreetViewService();
    
    const request = {
      location: { lat, lng },
      radius: 50,
      source: window.google.maps.StreetViewSource.OUTDOOR
    };

    svService.getPanorama(request)
      .then(({ data }) => {
        const panoId = data.location.pano;
        
        initialPanoIdRef.current = panoId;

        if (panoramaRef.current.getPano() === panoId) return;
        
        panoramaRef.current.setPano(panoId);
        panoramaRef.current.setPov({ heading: 0, pitch: 0 });
        panoramaRef.current.setVisible(true);

        if (onHeadingChange) onHeadingChange(0);

        window.google.maps.event.trigger(panoramaRef.current, 'resize');
      })
      .catch((err) => {
        console.warn('[Street View] No outdoor street view found, retrying loose search...', err);
        return svService.getPanorama({ location: { lat, lng }, radius: 50 });
      })
      .then((result) => {
        if (result && result.data) {
           const panoId = result.data.location.pano;
           initialPanoIdRef.current = panoId;
           panoramaRef.current.setPano(panoId);
           panoramaRef.current.setVisible(true);
        }
      })
      .catch((err) => {
         console.error('[Street View] Absolutely no view found:', err);
         panoramaRef.current.setVisible(false);
      });

  }, [location?.id, isApiReady]); 

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
});

export default memo(StreetView, (prevProps, nextProps) => {
  return prevProps.location?.id === nextProps.location?.id;
});