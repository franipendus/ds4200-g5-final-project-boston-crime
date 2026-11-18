// Draws an Altair/Vega-Lite chart saved as JSON into the element with the given id.
// Usage in a page: <div id="viz3" class="chart"></div> then embedChart("viz3", "charts/viz3.json");
function embedChart(id, file) {
  // Use the site font in every chart
  const config = { font: '"Public Sans", system-ui, sans-serif' };
  vegaEmbed("#" + id, file, { actions: false, config }).catch((err) => {
    document.getElementById(id).textContent = "Could not load " + file + ": " + err;
  });
}
