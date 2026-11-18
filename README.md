# Walking Home Safely

DS4200 final project website: Boston crime incident reports, Sep 2017 - Aug 2018.

## Pages

| Page | Section | Visualizations |
|---|---|---|
| `index.html` | Home | Introduction |
| `what.html` | What happens | Viz 3 |
| `when.html` | When it happens | Viz 1, Viz 2, Viz 4 |
| `where.html` | Where it happens | Map 1, Map 2, Viz 6 |
| `walk-home.html` | The walk home itself | Viz 5 |
| `trends.html` | Trends | Viz 7 |

## Folders

- `charts/` holds Altair charts  
- `data/` holds data files that pages load (Map 1 uses `data/map1.json`)
- `js/` holds page scripts (`charts.js` draws the Altair charts, `map1.js` draws Map 1)
- `Project/` holds the notebooks that make the charts, plus `crime.csv`

## Colors

Chart colors are in `Project/theme.py`. Import them in a notebook instead of typing hex codes:

```python
from theme import DAY, NIGHT, HIGHLIGHT, MUTED, REFERENCE, SEQUENTIAL_SCHEME, OFFENSE_COLORS
```

The website's colors are at the top of `style.css`. If you change a color in one file, change it in the other too.

## Other Notes

### WebGL

Map 1 is drawn with MapLibre, which needs WebGL (the browser's graphics acceleration). WebGL is built into the browser, not an extension, so there's nothing to install. If it's turned off, the Map 1 section on `where.html` comes up blank, including the offense checkboxes and the incident count.

To check, open https://get.webgl.org. If you don't see a spinning cube, turn WebGL on:

- **Chrome:** Settings → System → turn on **Use graphics acceleration when available**, then click **Relaunch**. Under WebGL, `chrome://gpu` should say "Hardware accelerated".
- **Safari:** WebGL is on by default, so the map should work. If it doesn't, try Chrome.
- **Firefox:** go to `about:config`, search `webgl.disabled` and set it to `false`.

