'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Check } from 'lucide-react';
import { resolveGoogleMapsUrl } from '@/app/invite/[id]/actions';

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
    // Force invalidate size to fix gray tiles issue in dynamic layouts/tabs
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [center, map]);
  return null;
}

function MapEvents({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LeafletMapProps {
  address: string;
  mapCoordinates?: { lat: number; lng: number } | null;
  className?: string;
  onSelectAddress?: (address: string, lat?: number, lng?: number) => void;
  editable?: boolean;
}

export default function LeafletMap({ address, mapCoordinates, className, onSelectAddress, editable = false }: LeafletMapProps) {
  const defaultPos: [number, number] = [-6.2088, 106.8456];
  const [position, setPosition] = useState<[number, number]>(
    mapCoordinates ? [mapCoordinates.lat, mapCoordinates.lng] : defaultPos
  );
  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);
  const [tempAddress, setTempAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial geocoding when address changes from outside
  useEffect(() => {
    // Detect if the address contains direct coordinates or a Google Maps URL containing coordinates
    if (address) {
      const trimmed = address.trim();
      let detectedCoords: [number, number] | null = null;
      
      const directMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/);
      if (directMatch) {
        detectedCoords = [parseFloat(directMatch[1]), parseFloat(directMatch[2])];
      } else {
        const urlMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (urlMatch) {
          detectedCoords = [parseFloat(urlMatch[1]), parseFloat(urlMatch[2])];
        } else if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
          // If it's a short URL, we must resolve it via server action
          const urlPattern = /(https?:\/\/[^\s]+)/;
          const match = trimmed.match(urlPattern);
          if (match) {
            setLoading(true);
            resolveGoogleMapsUrl(match[1]).then(result => {
              setLoading(false);
              if (result && !result.error && result.lat && result.lng) {
                const asyncCoords: [number, number] = [result.lat, result.lng];
                setPosition(asyncCoords);
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${asyncCoords[0]}&lon=${asyncCoords[1]}`)
                  .then(res => res.json())
                  .then(data => {
                    const finalAddress = (data && data.display_name) ? data.display_name : `${asyncCoords[0]}, ${asyncCoords[1]}`;
                    if (onSelectAddress) {
                      onSelectAddress(finalAddress, asyncCoords[0], asyncCoords[1]);
                    }
                  })
                  .catch(() => {
                    if (onSelectAddress) {
                      onSelectAddress(`${asyncCoords[0]}, ${asyncCoords[1]}`, asyncCoords[0], asyncCoords[1]);
                    }
                  });
              } else {
                 setError('Gagal membaca koordinat dari link tersebut.');
                 setTimeout(() => setError(null), 3000);
              }
            });
            return; // Exit out because we handled it async
          }
        }
      }

      // Existing logic for direct matched coordinates
      if (detectedCoords && !isNaN(detectedCoords[0]) && !isNaN(detectedCoords[1])) {
        // Segera atur kamera ke koordinat tersebut dan otomatis ubah teksnya jadi nama area
        setPosition(detectedCoords);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${detectedCoords[0]}&lon=${detectedCoords[1]}`)
          .then(res => res.json())
          .then(data => {
            const finalAddress = (data && data.display_name) ? data.display_name : `${detectedCoords![0]}, ${detectedCoords![1]}`;
            if (onSelectAddress) {
              onSelectAddress(finalAddress, detectedCoords![0], detectedCoords![1]);
            }
          })
          .catch(err => {
            console.error('Reverse geocoding error:', err);
            if (onSelectAddress) {
              onSelectAddress(`${detectedCoords![0]}, ${detectedCoords![1]}`, detectedCoords![0], detectedCoords![1]);
            }
          });
        return;
      }
    }

    if (mapCoordinates) {
      setPosition([mapCoordinates.lat, mapCoordinates.lng]);
      return;
    }
    if (!address || tempPosition) return;

    const geocode = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }
    };

    const timer = setTimeout(geocode, 1000);
    return () => clearTimeout(timer);
  }, [address, tempPosition]);

  const handleMapClick = async (lat: number, lon: number) => {
    if (!editable) return;
    
    setLoading(true);
    setTempPosition([lat, lon]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setTempAddress(data.display_name);
        // Automatically call onSelectAddress if we want "instant" update, 
        // but the user said "keluar itu yg disimpan" which usually implies a confirmation.
        // However, to make it feel like "what I chose is what stays", we can update it.
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = () => {
    if (tempAddress && tempPosition && onSelectAddress) {
      onSelectAddress(tempAddress, tempPosition[0], tempPosition[1]);
      setPosition(tempPosition);
      setTempPosition(null);
      setTempAddress(null);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {editable && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-2 rounded-xl">
                <MapPin className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Lokasi Terpilih</p>
                <p className="text-sm text-stone-700 font-medium line-clamp-2 leading-tight">
                  {tempAddress || (address ? address : 'Klik pada peta untuk memilih lokasi')}
                </p>
              </div>
            </div>
            
            {tempAddress && (
              <button 
                onClick={handleSaveLocation}
                className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                Gunakan Lokasi Ini
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          {error}
        </div>
      )}
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-xs font-bold text-stone-800 p-1">{address || 'Lokasi Acara'}</div>
          </Popup>
        </Marker>

        {tempPosition && (
          <Marker position={tempPosition} icon={icon} opacity={0.7}>
            <Popup>
              <div className="text-xs font-medium text-rose-600 p-1">Lokasi Baru</div>
            </Popup>
          </Marker>
        )}

        <ChangeView center={tempPosition || position} />
        {editable && <MapEvents onClick={handleMapClick} />}
      </MapContainer>
    </div>
  );
}
