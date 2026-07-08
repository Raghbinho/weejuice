"use client";

import { useEffect, useRef, useState } from "react";

// Sélecteur d'adresse sur carte, basé sur OpenStreetMap + Leaflet (aucune clé API requise).
// Leaflet est chargé depuis un CDN à la demande — pas de dépendance npm à installer.
// Centré sur la Tunisie.
const TUNISIA_CENTER = [34.0, 9.5];

// Charge le CSS + JS Leaflet une seule fois et résout quand `window.L` est prêt.
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if (window.L) return resolve(window.L);

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existing = document.getElementById("leaflet-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function MapPicker({ value, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;

        const start =
          value?.lat && value?.lng ? [value.lat, value.lng] : TUNISIA_CENTER;
        const map = L.map(containerRef.current).setView(start, value?.lat ? 14 : 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        const icon = L.divIcon({
          html: "📍",
          className: "text-2xl leading-none",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });

        function place(lat, lng) {
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], {
              icon,
              draggable: true,
            }).addTo(map);
            markerRef.current.on("dragend", (e) => {
              const p = e.target.getLatLng();
              onChange({ lat: p.lat, lng: p.lng });
            });
          }
          onChange({ lat, lng });
        }

        if (value?.lat && value?.lng) place(value.lat, value.lng);
        map.on("click", (e) => place(e.latlng.lat, e.latlng.lng));

        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
        La carte n'a pas pu être chargée. Vous pouvez continuer sans — l'adresse
        écrite suffit.
      </p>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      />
      <p className="mt-2 text-xs text-slate-400">
        {status === "ready"
          ? value?.lat
            ? `Position : ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)} — déplacez le repère si besoin.`
            : "Cliquez sur la carte pour indiquer votre position (optionnel)."
          : "Chargement de la carte…"}
      </p>
    </div>
  );
}
