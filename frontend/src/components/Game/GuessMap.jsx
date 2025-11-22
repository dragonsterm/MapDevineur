import { useEffect, useRef, useState } from 'react';

function GuessMap({ 
  onGuess, 
  disabled, 
  isOpen, 
  onClose, 
  currentGuess, 
  showResult, 
  actualLocation, 
  result,
  onSubmit 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  
  // Refs for result visualization to clear them later
  const actualMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const distanceLabelRef = useRef(null);

  const [hasGuessed, setHasGuessed] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [markerLibrary, setMarkerLibrary] = useState(null);

  // Inject CSS for markers (Blue for user, Green for result)
  useEffect(() => {
    const styleId = 'custom-marker-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* User Marker (Blue) */
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
        
        /* Actual Location Marker (Green) */
        .custom-marker-pin.actual {
          background: #10B981; /* Emerald Green */
          z-index: 20;
        }

        /* Distance Label */
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

  // Load Google Maps
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
  
  // Initialize Map
  useEffect(() => {
    if (isOpen && isApiReady && markerLibrary && mapRef.current && !mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapId: 'DEMO_MAP_ID',
        clickableIcons: false,
        restriction: {
          latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
          strictBounds: true
        }
      });

      mapInstanceRef.current = map;

      const clickListener = map.addListener('click', (event) => {
        // Only allow placing markers if we are NOT showing results
        if (!disabled && !showResult) {
          placeMarker(event.latLng);
        }
      });

      return () => {
        window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [isOpen, isApiReady, disabled, markerLibrary, showResult]);

  // Logic to place the User's Guess Marker
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

    // Only pan if it's the user manually placing it, not resizing for result
    if (!showResult) {
      mapInstanceRef.current.panTo(latLng);
    }

    const currentZoom = mapInstanceRef.current.getZoom();
    const minSnapZoom = 5;
    if (currentZoom < minSnapZoom && !showResult) {
      mapInstanceRef.current.setZoom(minSnapZoom);
    }

    userMarkerRef.current = newMarker;
    setHasGuessed(true);
    
    // Safety check if latLng is a function (from click event) or object (from manual set)
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

  // Sync marker if guess exists (e.g. from state restoration)
  useEffect(() => {
    if (isOpen && currentGuess && mapInstanceRef.current && !userMarkerRef.current) {
      const latLng = new window.google.maps.LatLng(currentGuess.lat, currentGuess.lng);
      placeMarker(latLng);
    }
  }, [isOpen, currentGuess]);

  // RESULT VISUALIZATION LOGIC
  useEffect(() => {
    if (isOpen && showResult && actualLocation && mapInstanceRef.current && markerLibrary && currentGuess) {
      
      const map = mapInstanceRef.current;
      const guessLatLng = { lat: currentGuess.lat, lng: currentGuess.lng };
      const actualLatLng = { lat: parseFloat(actualLocation.latitude), lng: parseFloat(actualLocation.longitude) };

      // 1. Create Green Marker for Actual Location
      const actualPin = document.createElement('div');
      actualPin.className = 'custom-marker-pin actual'; // Green style
      
      const actualMarker = new markerLibrary.AdvancedMarkerElement({
        position: actualLatLng,
        map: map,
        content: actualPin,
        title: 'Actual Location'
      });
      actualMarkerRef.current = actualMarker;

      // 2. Draw Dashed Line
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
      };

      const polyline = new window.google.maps.Polyline({
        path: [guessLatLng, actualLatLng],
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        map: map,
        strokeColor: '#10B981' // Green line
      });
      polylineRef.current = polyline;

      // 3. Add Distance Label at midpoint
      // Simple midpoint calculation
      const midLat = (guessLatLng.lat + actualLatLng.lat) / 2;
      const midLng = (guessLatLng.lng + actualLatLng.lng) / 2;
      // Note: This is a simple linear midpoint. For long distances across the dateline or poles 
      // it might be slightly off visually, but sufficient for this game context.
      
      const labelDiv = document.createElement('div');
      labelDiv.className = 'distance-label';
      labelDiv.textContent = `${result?.distance?.toFixed(1) || '?'} km`;

      const labelMarker = new markerLibrary.AdvancedMarkerElement({
        position: { lat: midLat, lng: midLng },
        map: map,
        content: labelDiv,
        zIndex: 100
      });
      distanceLabelRef.current = labelMarker;

      // 4. Fit Bounds to show both markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(guessLatLng);
      bounds.extend(actualLatLng);
      map.fitBounds(bounds, {
        top: 100, right: 100, bottom: 200, left: 100 // Extra bottom padding for the result card
      });
    }
  }, [isOpen, showResult, actualLocation, markerLibrary]);

  // Handle Resize
  useEffect(() => {
    if (isOpen && mapInstanceRef.current) {
      setTimeout(() => {
        window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }, 100);
    }
  }, [isOpen]);

  // Clean up on Close (Reset)
  useEffect(() => {
    if (!isOpen) {
      // Clear User Marker
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
      // Clear Result Elements
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

      mapInstanceRef.current = null;
      setHasGuessed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center z-10 shadow-md">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {showResult ? 'Round Results' : 'Make Your Guess'}
        </h2>
        {/* Only show Close button if result is NOT shown, or if you want to allow closing during result view (optional, keeping it for safety) */}
        {!showResult && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Instructions (Only if not guessed and not result) */}
        {!hasGuessed && !showResult && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl border border-gray-700 pointer-events-none">
            <p className="font-medium text-sm">Click anywhere to place guess</p>
          </div>
        )}

        {/* SUBMIT BUTTON - GREEN (Only show if guessed and result NOT shown) */}
        {hasGuessed && !showResult && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={onSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-12 py-4 rounded-xl shadow-2xl text-lg transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Submit Guess</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5l10 -10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuessMap;