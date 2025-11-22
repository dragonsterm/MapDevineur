import { useEffect, useRef, useState } from 'react';

function GuessMap({ onGuess, disabled, isOpen, onClose, currentGuess }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [markerLibrary, setMarkerLibrary] = useState(null);

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
          background: #007bff;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -20px 0 0 -15px;
          animation: bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate;
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

    if (loadGoogleMaps()) {
      return;
    }

    const interval = setInterval(() => {
      if (loadGoogleMaps()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (isOpen && isApiReady && markerLibrary && mapRef.current && !mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapId: 'DEMO_MAP_ID',
        clickableIcons: false, // Disables clicking on POIs
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180
          },
          strictBounds: true
        }
      });

      mapInstanceRef.current = map;

      const clickListener = map.addListener('click', (event) => {
        if (!disabled) {
          placeMarker(event.latLng);
        }
      });

      return () => {
        window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [isOpen, isApiReady, disabled, markerLibrary]);

  const placeMarker = (latLng) => {
    if (markerRef.current) {
      markerRef.current.map = null;
    }

    const pinElement = document.createElement('div');
    pinElement.className = 'custom-marker-pin';

    const newMarker = new markerLibrary.AdvancedMarkerElement({
      position: latLng,
      map: mapInstanceRef.current,
      gmpDraggable: true,
      content: pinElement,
      title: 'Your Guess'
    });

    mapInstanceRef.current.panTo(latLng);

    const currentZoom = mapInstanceRef.current.getZoom();
    const minSnapZoom = 5;
    if (currentZoom < minSnapZoom) {
      mapInstanceRef.current.setZoom(minSnapZoom);
    }

    markerRef.current = newMarker;
    setHasGuessed(true);
    
    onGuess({
      lat: latLng.lat(),
      lng: latLng.lng(),
    });

    newMarker.addEventListener('dragend', (e) => {
      onGuess({
        lat: newMarker.position.lat,
        lng: newMarker.position.lng,
      });
    });
  };

  useEffect(() => {
    if (isOpen && currentGuess && mapInstanceRef.current) {
      const latLng = new window.google.maps.LatLng(currentGuess.lat, currentGuess.lng);
      if (!markerRef.current) {
        placeMarker(latLng);
      }
    }
  }, [isOpen, currentGuess]);

  useEffect(() => {
    if (isOpen && mapInstanceRef.current) {
      setTimeout(() => {
        window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      mapInstanceRef.current = null;
      setHasGuessed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Make Your Guess
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Instructions */}
        {!hasGuessed && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-8 py-4 rounded-lg shadow-2xl border border-gray-700">
            <p className="text-center font-semibold text-lg">📍 Click anywhere on the map to place your guess</p>
          </div>
        )}

        {/* Confirm Button */}
        {hasGuessed && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-12 py-4 rounded-lg shadow-2xl text-lg"
            >
              Confirm Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuessMap;