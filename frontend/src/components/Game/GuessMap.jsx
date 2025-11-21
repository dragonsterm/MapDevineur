import { useEffect, useRef, useState } from 'react';

function GuessMap({ onGuess, disabled, isOpen, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);

  useEffect(() => {
    if (window.google && mapRef.current && isOpen && !mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeId: 'roadmap', // Changed from 'hybrid' to 'roadmap' (default, no colors)
      });

      mapInstanceRef.current = map;

      const clickListener = map.addListener('click', (event) => {
        if (!disabled) {
          if (marker) {
            marker.setMap(null);
          }
          const newMarker = new window.google.maps.Marker({
            position: event.latLng,
            map: map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
          });
          setMarker(newMarker);
          setHasGuessed(true);
          onGuess({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });

          newMarker.addListener('dragend', (e) => {
            onGuess({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          });
        }
      });

      return () => {
        window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [isOpen, disabled, onGuess]);

  useEffect(() => {
    if (!isOpen) {
      if (marker) {
        marker.setMap(null);
        setMarker(null);
      }
      setHasGuessed(false);
    }
  }, [isOpen, marker]);

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