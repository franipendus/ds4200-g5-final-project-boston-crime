// Map 1: zoomable incident map (ported from Project/map2.ipynb)
const STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const HOME = [-71.0892, 42.3398]; // Northeastern University (Centennial Common)
const START_ZOOM = 13;

fetch("data/map1.json")
  .then((r) => r.json())
  .then((data) => {
    const map = new maplibregl.Map({ container: "map1", style: STYLE, center: HOME, zoom: START_ZOOM });

    // + / - zoom buttons and a home button that flies back to Northeastern
    const controls = document.createElement("div");
    controls.className = "zoom-buttons";
    for (const [text, title, action] of [
      ["+", "Zoom in", () => map.zoomIn()],
      ["−", "Zoom out", () => map.zoomOut()],
      ["⌂", "Back to Northeastern", () => map.flyTo({ center: HOME, zoom: START_ZOOM })],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.title = title;
      button.textContent = text;
      button.onclick = action;
      controls.appendChild(button);
    }
    document.getElementById("map1").appendChild(controls);

    // Northeastern: red pin plus a label to its right
    const pin = new maplibregl.Marker({ color: "#EA4335" }).setLngLat(HOME).addTo(map);
    pin.getElement().title = "Northeastern University";
    const label = document.createElement("div");
    label.className = "neu-label";
    label.textContent = "Northeastern";
    new maplibregl.Marker({ element: label, anchor: "left", offset: [12, -20] }).setLngLat(HOME).addTo(map);

    // Filter controls
    const day = document.getElementById("day");
    data.days.forEach((d, k) => day.add(new Option(d, k)));
    const startHour = document.getElementById("start-hour");
    const endHour = document.getElementById("end-hour");
    const hourText = document.getElementById("hour-text");
    const panel = document.getElementById("offense-list");
    const boxes = data.offenses.map((name, k) => {
      const row = document.createElement("label");
      row.innerHTML = `<input type="checkbox" checked value="${k}">` +
        `<span class="swatch" style="background:${data.colors[k]}"></span>${name}`;
      panel.appendChild(row);
      return row.querySelector("input");
    });

    const fmt = (h) => (h % 12 || 12) + (h < 12 ? " AM" : " PM");
    function update() {
      // Keep the two slider handles from crossing
      if (+startHour.value > +endHour.value) {
        if (document.activeElement === startHour) startHour.value = endHour.value;
        else endHour.value = startHour.value;
      }
      const start = +startHour.value, end = +endHour.value, w = +day.value;
      const picked = boxes.filter((b) => b.checked).map((b) => +b.value);
      hourText.textContent = `${fmt(start)} – ${fmt(end)}`;

      const set = new Set(picked);
      let n = 0;
      for (let i = 0; i < data.o.length; i++) {
        if (set.has(data.o[i]) && data.h[i] >= start && data.h[i] <= end && (w < 0 || data.w[i] === w)) n++;
      }
      document.getElementById("shown").textContent = `${n.toLocaleString()} incidents shown`;

      if (!map.getLayer("dots")) return;
      const rules = ["all",
        ["in", ["get", "o"], ["literal", picked]],
        [">=", ["get", "h"], start],
        ["<=", ["get", "h"], end]];
      if (w >= 0) rules.push(["==", ["get", "w"], w]);
      map.setFilter("dots", rules);
    }
    for (const el of [day, startHour, endHour, ...boxes]) el.addEventListener("input", update);
    document.getElementById("all").onclick = () => { boxes.forEach((b) => (b.checked = true)); update(); };
    document.getElementById("none").onclick = () => { boxes.forEach((b) => (b.checked = false)); update(); };
    update();

    const when = (t) => new Date(Date.UTC(2017, 8, 1) + t * 60000).toLocaleString("en-US", {
      timeZone: "UTC", weekday: "short", month: "short", day: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    map.on("load", () => {
      const features = data.lon.map((lon, i) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, data.lat[i]] },
        properties: { i, o: data.o[i], w: data.w[i], h: data.h[i] },
      }));
      map.addSource("incidents", { type: "geojson", data: { type: "FeatureCollection", features } });
      map.addLayer({
        id: "dots",
        type: "circle",
        source: "incidents",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2.5, 15, 6],
          "circle-color": ["match", ["get", "o"], ...data.colors.flatMap((c, k) => [k, c]), "#999"],
          "circle-opacity": 0.85,
        },
      });
      update();

      // Hover a dot to see the offense, description, time, and street
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      map.on("mousemove", "dots", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const i = e.features[0].properties.i;
        popup.setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`<div style="color:#222;font:12px sans-serif"><b>${data.offenses[data.o[i]]}</b>` +
                   `<br>${data.descriptions[data.d[i]]}<br>${when(data.t[i])}<br>${data.streets[data.s[i]]}</div>`)
          .addTo(map);
      });
      map.on("mouseleave", "dots", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
  });
