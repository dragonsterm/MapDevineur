import { useEffect, useRef, useState } from 'react';

function StreetView({ location }) {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.StreetViewPanorama) {
        console.log('[API] Google Maps loaded');
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) {
      return;
    }

    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isApiReady || !location || !streetViewRef.current) {
      return;
    }

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('[Street View] Invalid coordinates');
      return;
    }

    console.log(`[Street View] Initializing at: ${lat}, ${lng}`);

    // Clean up previous panorama
    if (panoramaRef.current) {
      console.log('[Street View] Cleaning up previous instance');
      try {
        panoramaRef.current.setVisible(false);
        window.google.maps.event.clearInstanceListeners(panoramaRef.current);
      } catch (err) {
        console.error('[Street View] Cleanup error:', err);
      }
      panoramaRef.current = null;
    }

    const initTimer = setTimeout(() => {
      try {
        const streetViewService = new window.google.maps.StreetViewService();
        const position = { lat, lng };

        streetViewService.getPanorama({ location: position, radius: 50 }, (data, status) => {
          if (status === 'OK' && streetViewRef.current) {
            console.log('[Street View] ✓ Panorama available, loading...');
            
            panoramaRef.current = new window.google.maps.StreetViewPanorama(
              streetViewRef.current,
              {
                position: position,
                pov: { heading: 0, pitch: 0 },
                zoom: 0,
                addressControl: false,
                linksControl: true,
                panControl: true,
                enableCloseButton: false,
                zoomControl: true,
                fullscreenControl: true,
                motionTracking: false,
                motionTrackingControl: false,
                showRoadLabels: false,
                visible: true,
              }
            );

            // Listen for status changes
            panoramaRef.current.addListener('status_changed', () => {
              const panoStatus = panoramaRef.current.getStatus();
              console.log('[Street View] Status:', panoStatus);
              window.google.maps.event.trigger(panoramaRef.current, 'resize');
            });

            setTimeout(() => {
              if (panoramaRef.current) {
                panoramaRef.current.setVisible(true);
              }
            }, 100);

          } else {
            console.error('[Street View] ✗ Not available:', status);
          }
        });

      } catch (error) {
        console.error('[Street View] Initialization error:', error);
      }
    }, 300);

    return () => {
      clearTimeout(initTimer);
      if (panoramaRef.current) {
        console.log('[Street View] Unmounting');
        try {
          panoramaRef.current.setVisible(false);
          window.google.maps.event.clearInstanceListeners(panoramaRef.current);
        } catch (err) {
          console.error('[Street View] Unmount error:', err);
        }
        panoramaRef.current = null;
      }
    };
  }, [location, isApiReady]);

  if (!isApiReady) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            display: 'inline-block',
            width: '48px',
            height: '48px',
            border: '4px solid #333',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <p>Loading Maps...</p>
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
        bottom: 0,
        zIndex: 0
      }}
    />
  );
}

export default StreetView;