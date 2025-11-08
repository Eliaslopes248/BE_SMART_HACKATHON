import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/chatbot/chatbot";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9pcmVtIiwiYSI6ImNtaHBweDk1ZDBucGUybHBxMXcxeGM1YWMifQ.zcbLzPvxUSkLx8vR9s7FrQ";

const jobs = [
  { 
    title: "City Hall - Data Entry", 
    address: "300 W Washington St, Greensboro, NC",
    pay: "$18/hour",
    payType: "hourly",
    contactPerson: "Sarah Johnson",
    contactTitle: "HR Coordinator",
    contactPhone: "(336) 373-2000",
    contactEmail: "sarah.johnson@greensboro-nc.gov",
    company: "City of Greensboro"
  },
  { 
    title: "Downtown Cleanup", 
    address: "200 N Elm St, Greensboro, NC",
    pay: "$16/hour",
    payType: "hourly",
    contactPerson: "Michael Chen",
    contactTitle: "Operations Manager",
    contactPhone: "(336) 373-2100",
    contactEmail: "mchen@greensboro-nc.gov",
    company: "City of Greensboro Public Works"
  },
  { 
    title: "Recycling Center Assistant", 
    address: "401 Patton Ave, Greensboro, NC",
    pay: "$17.50/hour",
    payType: "hourly",
    contactPerson: "Patricia Williams",
    contactTitle: "Facility Supervisor",
    contactPhone: "(336) 373-2400",
    contactEmail: "pwilliams@greensboro-nc.gov",
    company: "Greensboro Recycling Center"
  },
  { 
    title: "Park Maintenance", 
    address: "1500 Yanceyville St, Greensboro, NC",
    pay: "$19/hour",
    payType: "hourly",
    contactPerson: "Robert Martinez",
    contactTitle: "Parks Supervisor",
    contactPhone: "(336) 373-2500",
    contactEmail: "rmartinez@greensboro-nc.gov",
    company: "Greensboro Parks & Recreation"
  },
  { 
    title: "Community Center Helper", 
    address: "1001 S Eugene St, Greensboro, NC",
    pay: "$15.50/hour",
    payType: "hourly",
    contactPerson: "Lisa Anderson",
    contactTitle: "Program Director",
    contactPhone: "(336) 373-2600",
    contactEmail: "landerson@greensboro-nc.gov",
    company: "Greensboro Community Centers"
  },
];

export default function JobMapPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [jobsWithCoords, setJobsWithCoords] = useState([]);

  // Static coordinates for now (later can use AI/geocoding)
  const staticCoords = {
    "300 W Washington St, Greensboro, NC": [-79.792, 36.071],
    "200 N Elm St, Greensboro, NC": [-79.791, 36.073],
    "401 Patton Ave, Greensboro, NC": [-79.800, 36.075],
    "1500 Yanceyville St, Greensboro, NC": [-79.776, 36.087],
    "1001 S Eugene St, Greensboro, NC": [-79.800, 36.058],
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return; // Prevent multiple map initializations

    let map;
    try {
      // Initialize Mapbox map
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-79.792, 36.0726],
        zoom: 12,
        pitch: 50,
        bearing: -17.6,
        antialias: true,
      });

      mapRef.current = map;

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Helper function to add markers
      const addMarkers = () => {
        // Add 3D buildings layer if it doesn't exist
        if (!map.getLayer("add-3d-buildings")) {
          try {
            map.addLayer({
              id: "add-3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": ["get", "height"],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.6,
              },
            });
          } catch (err) {
            console.warn("Could not add 3D buildings layer:", err);
          }
        }

        // Add markers for jobs
        const mappedJobs = [];
        jobs.forEach((job) => {
          const coords = staticCoords[job.address];
          if (!coords) return;

          const markerEl = document.createElement("div");
          markerEl.className =
            "bg-green-500 rounded-full w-4 h-4 border-2 border-white shadow-lg cursor-pointer";

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="min-width: 200px;">
              <h3 class="font-semibold text-gray-900 mb-2" style="font-size: 16px; margin-bottom: 8px;">${job.title}</h3>
              <div style="margin-bottom: 8px;">
                <p class="text-gray-700 text-sm mb-1" style="margin-bottom: 4px;">
                  <strong>Company:</strong> ${job.company || 'N/A'}
                </p>
                <p class="text-gray-700 text-sm mb-1" style="margin-bottom: 4px;">
                  <strong>Pay:</strong> <span style="color: #16a34a; font-weight: 600;">${job.pay}</span>
                </p>
              </div>
              <div style="margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <p class="text-gray-600 text-xs mb-1" style="margin-bottom: 4px; font-size: 12px;">
                  <strong>Contact:</strong> ${job.contactPerson}
                </p>
                <p class="text-gray-600 text-xs mb-1" style="margin-bottom: 4px; font-size: 12px;">
                  ${job.contactTitle}
                </p>
                <p class="text-gray-600 text-xs" style="font-size: 12px;">
                  ${job.contactPhone}
                </p>
              </div>
              <p class="text-gray-500 text-xs mt-2" style="margin-top: 8px; font-size: 11px;">
                ${job.address}
              </p>
            </div>
          `);

          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
          mappedJobs.push({ ...job, coords });
        });

        setJobsWithCoords(mappedJobs);
      };

      // Add markers when style is loaded
      map.on("style.load", addMarkers);

      // Handle map load errors
      map.on("error", (e) => {
        console.error("Map error:", e);
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
    }

    // Cleanup function
    return () => {
      // Remove all markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      
      // Remove map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] w-full">
        {/* Left side: Map */}
        <div className="w-[70%] h-full relative">
          <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '100%' }} />
        </div>

        {/* Right side: Scrollable Job List */}
        <div className="w-[30%] bg-white overflow-y-auto border-l border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Jobs
            </h2>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white"
                  onClick={() => {
                    const jobWithCoords = jobsWithCoords.find(
                      (j) => j.title === job.title
                    );
                    if (jobWithCoords && jobWithCoords.coords && mapRef.current) {
                      mapRef.current.flyTo({
                        center: jobWithCoords.coords,
                        zoom: 16,
                        speed: 1.2,
                        curve: 1.2,
                        essential: true,
                      });
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {job.title}
                    </h3>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {job.pay}
                    </span>
                  </div>
                  
                  {job.company && (
                    <p className="text-sm text-gray-500 mb-2">
                      {job.company}
                    </p>
                  )}

                  <div className="mb-3 space-y-2">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{job.address}</span>
                    </div>

                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{job.contactPerson}</p>
                        <p className="text-xs text-gray-500">{job.contactTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{job.contactPhone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </>
  );
}
