import { useEffect, useRef, useState } from 'react';
import '../../styles/gameStyles.css';

function GuessMap({ 
  onGuess, 
  disabled, 
  currentGuess, 
  showResult, 
  actualLocation, 
  result,
  onSubmit,
  roundId 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  
  // Refs for result visualization
  const actualMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const distanceLabelRef = useRef(null);

  const [viewState, setViewState] = useState('minimized');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [markerLibrary, setMarkerLibrary] = useState(null);

  useEffect(() => {
    setViewState('minimized');
    setHasGuessed(false);

    if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
    }

    if (actualMarkerRef.current) {
        actualMarkerRef.current.map = null;
        actualMarkerRef.current = null;
    }
    if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
    }
    if (distanceLabelRef.current) {
        distanceLabelRef.current.map = null;
        distanceLabelRef.current = null;
    }

    if (mapInstanceRef.current) {
        mapInstanceRef.current.setZoom(1);
        mapInstanceRef.current.setCenter({ lat: 15, lng: 0 });
        
        if (window.google && window.google.maps) {
            window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
    }
  }, [roundId]);

  useEffect(() => {
    const styleId = 'custom-marker-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .custom-marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #3B82F6;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -20px 0 0 -15px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .custom-marker-pin::after {
          content: '';
          width: 14px;
          height: 14px;
          margin: 8px 0 0 8px;
          background: #fff;
          position: absolute;
          border-radius: 50%;
        }
        .custom-marker-pin.actual {
          background: #10B981; 
          z-index: 20;
        }
        .distance-label {
          background: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 14px;
          color: #1F2937;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid #10B981;
          white-space: nowrap;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
        setMarkerLibrary({ AdvancedMarkerElement });
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (loadGoogleMaps()) return;
    const interval = setInterval(() => {
      if (loadGoogleMaps()) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (isApiReady && markerLibrary && mapRef.current && !mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 15, lng: 0 }, 
        zoom: 1,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false, 
        zoomControl: false, 
        mapId: 'DEMO_MAP_ID',
        clickableIcons: false,
        disableDefaultUI: true, 
        restriction: {
          latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
          strictBounds: true
        }
      });

      mapInstanceRef.current = map;
    }
  }, [isApiReady, markerLibrary]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      
      const isMinimized = viewState === 'minimized';

      if (!isMinimized && mapInstanceRef.current.getZoom() < 2) {
         mapInstanceRef.current.setZoom(2);
         mapInstanceRef.current.setCenter({ lat: 20, lng: 0 });
      }

      mapInstanceRef.current.setOptions({
        zoomControl: !isMinimized,
        disableDefaultUI: isMinimized, 
        gestureHandling: isMinimized ? 'none' : 'auto',
        keyboardShortcuts: !isMinimized 
      });
    }
  }, [viewState]);

  const handleMapClick = (event) => {
    if (viewState === 'minimized') {
      setViewState('expanded');
      return;
    }

    if (disabled && !showResult) return;

    if (!showResult) {
       placeMarker(event.latLng);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    window.google.maps.event.clearListeners(mapInstanceRef.current, 'click');
    mapInstanceRef.current.addListener('click', handleMapClick);
  }, [viewState, disabled, showResult, markerLibrary]);

  const placeMarker = (latLng) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    const pinElement = document.createElement('div');
    pinElement.className = 'custom-marker-pin';

    const newMarker = new markerLibrary.AdvancedMarkerElement({
      position: latLng,
      map: mapInstanceRef.current,
      gmpDraggable: true,
      content: pinElement,
      title: 'Your Guess',
      zIndex: 10
    });

    userMarkerRef.current = newMarker;
    setHasGuessed(true);
  
    const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
    const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;

    onGuess({ lat, lng });

    newMarker.addEventListener('dragend', (e) => {
      if (!showResult) {
        onGuess({
          lat: newMarker.position.lat,
          lng: newMarker.position.lng,
        });
      }
    });
  };

  useEffect(() => {
    if (showResult && actualLocation && mapInstanceRef.current && markerLibrary && currentGuess) {
        if (viewState === 'minimized') setViewState('expanded');

        const map = mapInstanceRef.current;
        const guessLatLng = { lat: currentGuess.lat, lng: currentGuess.lng };
        const actualLatLng = { lat: parseFloat(actualLocation.latitude), lng: parseFloat(actualLocation.longitude) };

        if (!userMarkerRef.current) {
            const pinElement = document.createElement('div');
            pinElement.className = 'custom-marker-pin';
            userMarkerRef.current = new markerLibrary.AdvancedMarkerElement({
                position: guessLatLng,
                map: map,
                content: pinElement
            });
        }

        const actualPin = document.createElement('div');
        actualPin.className = 'custom-marker-pin actual';
        
        actualMarkerRef.current = new markerLibrary.AdvancedMarkerElement({
            position: actualLatLng,
            map: map,
            content: actualPin,
            title: 'Actual Location'
        });

        const lineSymbol = { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 };
        polylineRef.current = new window.google.maps.Polyline({
            path: [guessLatLng, actualLatLng],
            strokeOpacity: 0,
            icons: [{ icon: lineSymbol, offset: '0', repeat: '20px' }],
            map: map,
            strokeColor: '#10B981'
        });

        const midLat = (guessLatLng.lat + actualLatLng.lat) / 2;
        const midLng = (guessLatLng.lng + actualLatLng.lng) / 2;
        const labelDiv = document.createElement('div');
        labelDiv.className = 'distance-label';
        labelDiv.textContent = `${result?.distance?.toFixed(1) || '?'} km`;

        distanceLabelRef.current = new markerLibrary.AdvancedMarkerElement({
            position: { lat: midLat, lng: midLng },
            map: map,
            content: labelDiv,
            zIndex: 100
        });
        
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(guessLatLng);
        bounds.extend(actualLatLng);
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    } else if (!showResult) {
        if (actualMarkerRef.current) actualMarkerRef.current.map = null;
        if (polylineRef.current) polylineRef.current.setMap(null);
        if (distanceLabelRef.current) distanceLabelRef.current.map = null;
    }
  }, [showResult, actualLocation, markerLibrary, currentGuess]);

  const getContainerClass = () => {
    const base = "fixed z-40 shadow-2xl overflow-hidden map-container-transition ";
    switch (viewState) {
      case 'fullscreen':
        return base + "inset-0 w-full h-full rounded-none";
      case 'expanded':
        return base + "bottom-6 left-6 map-size-expanded";
      case 'minimized':
      default:
        return base + "bottom-[72px] left-6 map-size-minimized cursor-pointer hover:opacity-100 opacity-90 border-2 border-white/10";
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    setViewState(prev => prev === 'fullscreen' ? 'expanded' : 'fullscreen');
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setViewState('minimized');
  };

  const handleExpand = () => {
      if (viewState === 'minimized') setViewState('expanded');
  }

  const handleMainButtonClick = (e) => {
    e.stopPropagation();
    if (viewState === 'minimized') {
        setViewState('expanded');
    } else {
        onSubmit();
    }
  };

  return (
    <>
        {/* Main Map */}
        <div 
            className={getContainerClass()}
            onClick={handleExpand}
        >
            <div ref={mapRef} className="w-full h-full bg-gray-800" />
            {viewState === 'minimized' && (
                <div className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors" />
            )}

            {/* Expanded UI */}
            {viewState === 'expanded' && (
                <div className="absolute top-3 right-3 flex gap-3 z-10">
                    <button 
                        onClick={toggleFullscreen}
                        className="glass-icon-btn w-10 h-10" 
                        title="Fullscreen"
                    >
                         <svg width="24" height="24" style={{ width: '24px', height: '24px', minWidth: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={handleMinimize}
                        className="glass-icon-btn red-hover w-10 h-10"
                        title="Close"
                    >
                        <svg width="24" height="24" style={{ width: '24px', height: '24px', minWidth: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Fullscreen UI */}
            {viewState === 'fullscreen' && (
                <div className="absolute top-6 right-6 z-50">
                    <button 
                        onClick={toggleFullscreen}
                        className="glass-icon-btn red-hover w-12 h-12 rounded-lg shadow-lg"
                        title="Exit Fullscreen"
                    >
                        <svg width="28" height="28" style={{ width: '28px', height: '28px', minWidth: '28px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            
            {/* fullscreen state button */}
            {(viewState === 'expanded' || viewState === 'fullscreen') && !showResult && (
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    <button
                        onClick={handleMainButtonClick}
                        disabled={!hasGuessed}
                        className={`
                            font-bold px-8 py-3 rounded-xl shadow-xl text-base flex items-center justify-center transition-all
                            ${hasGuessed 
                                ? 'guess-btn-active text-white cursor-pointer' 
                                : 'guess-btn-disabled cursor-not-allowed text-gray-400'
                            }
                        `}
                    >
                        <span>Guess</span>
                    </button>
                 </div>
            )}
        </div>

        {/* minimized state vutton */}
        {viewState === 'minimized' && (
            <div 
                className="fixed bottom-6 left-6 z-30 map-size-minimized-width text-center transition-all"
                onClick={() => setViewState('expanded')}
            >
                <button 
                    className={`
                        w-full py-3 px-4 rounded-lg font-bold text-sm tracking-wider uppercase shadow-lg border border-white/10
                        ${hasGuessed 
                            ? 'guess-btn-active text-white'  
                            : 'bg-gray-900/90 text-gray-400 hover:bg-gray-800 hover:text-white' 
                        }
                    `}
                >
                    {hasGuessed ? "Guess" : "Click the map to make a guess"}
                </button>
            </div>
        )}
    </>
  );
}

export default GuessMap;