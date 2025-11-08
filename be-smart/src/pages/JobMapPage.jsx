import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

import WebScene from "@arcgis/core/WebScene";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import * as locator from "@arcgis/core/rest/locator";
import esriConfig from "@arcgis/core/config.js";

// Set ArcGIS Online as the portal source (required for webscene)
esriConfig.portalUrl = "https://www.arcgis.com";

const jobs = [
  { title: "City Hall - Data Entry", address: "300 W Washington St, Greensboro, NC" },
  { title: "Downtown Cleanup", address: "200 N Elm St, Greensboro, NC" },
  { title: "Recycling Center Assistant", address: "401 Patton Ave, Greensboro, NC" },
  { title: "Park Maintenance", address: "1500 Yanceyville St, Greensboro, NC" },
  { title: "Community Center Helper", address: "1001 S Eugene St, Greensboro, NC" },
];

export default function JobMapPage() {
  const mapDiv = useRef(null);
  const [view, setView] = useState(null);
  const [geocodingComplete, setGeocodingComplete] = useState(false);
  const [jobsWithCoords, setJobsWithCoords] = useState([]);

  useEffect(() => {
    if (mapDiv.current && !view) {
      // Try loading the hosted WebScene
      let scene;
      try {
        scene = new WebScene({
          portalItem: {
            id: "f6e2139cd2c648bbb59eb01fbc868333", // ✅ Your WebScene ID
          },
        });
      } catch (err) {
        console.error("Error creating WebScene, falling back to OSM:", err);
        scene = new WebScene({
          basemap: "osm",
          ground: "world-elevation",
        });
      }

      // Create SceneView
      const sceneView = new SceneView({
        container: mapDiv.current,
        map: scene,
        camera: {
          position: {
            longitude: -79.7878,
            latitude: 36.0701,
            z: 300,
          },
          tilt: 55,
          heading: 324,
        },
      });

      // Handle failed scene loads gracefully
      scene.load().catch((err) => {
        console.error("Failed to load WebScene, using fallback basemap:", err);
        scene.basemap = "osm";
      });

      setView(sceneView);

      return () => sceneView.destroy();
    }
  }, [view]);

  // Add job markers
  useEffect(() => {
    if (!view) return;

    view.when(() => {
      const graphicsLayer = new GraphicsLayer();
      view.map.add(graphicsLayer);

      const locatorUrl =
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      const geocodeJobs = async () => {
        const jobsData = [];

        for (const job of jobs) {
          try {
            const response = await locator.addressToLocations(locatorUrl, {
              address: { SingleLine: job.address },
              maxLocations: 1,
            });

            if (response.length > 0 && response[0].location) {
              const { x, y } = response[0].location;
              const point = new Point({ longitude: x, latitude: y });

              const markerSymbol = new SimpleMarkerSymbol({
                style: "circle",
                color: [34, 197, 94, 1], // Green
                size: 12,
                outline: {
                  color: [255, 255, 255, 1],
                  width: 2,
                },
              });

              const popupTemplate = new PopupTemplate({
                title: job.title,
                content: `<div>
                  <p><strong>Job Title:</strong> ${job.title}</p>
                  <p><strong>Address:</strong> ${job.address}</p>
                </div>`,
              });

              const graphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                popupTemplate,
                attributes: job,
              });

              graphicsLayer.add(graphic);

              jobsData.push({ ...job, longitude: x, latitude: y });
            } else {
              jobsData.push({ ...job, longitude: null, latitude: null });
            }
          } catch (error) {
            console.error(`Error geocoding ${job.address}:`, error);
            jobsData.push({ ...job, longitude: null, latitude: null });
          }
        }

        setJobsWithCoords(jobsData);
        setGeocodingComplete(true);
      };

      geocodeJobs();
    });
  }, [view]);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] w-full">
        {/* Left: WebScene Map */}
        <div className="w-[70%] h-full">
          <div ref={mapDiv} className="w-full h-full" />
        </div>

        {/* Right: Sidebar Job List */}
        <div className="w-[30%] bg-white overflow-y-auto border-l border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Jobs</h2>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white"
                  onClick={() => {
                    const jobWithCoords = jobsWithCoords.find(
                      (j) => j.title === job.title
                    );
                    if (
                      jobWithCoords &&
                      jobWithCoords.longitude &&
                      jobWithCoords.latitude &&
                      view
                    ) {
                      view.goTo(
                        {
                          center: [jobWithCoords.longitude, jobWithCoords.latitude],
                          zoom: 16,
                        },
                        { duration: 1000 }
                      );
                    }
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
