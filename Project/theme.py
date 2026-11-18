"""Shared chart colors for the project.

Import these in any notebook instead of typing hex codes, e.g.
    from theme import DAY, NIGHT

The website uses the same colors, defined at the top of style.css.
If you change a color here, change it there too.
All color pairs below were checked for colorblind safety.
"""

# Time of day
DAY = '#C17F00'     # amber
NIGHT = '#2E66B0'   # blue

# Selection (e.g. the Viz 6 brush)
HIGHLIGHT = NIGHT   # selected marks
MUTED = '#C9CED6'   # unselected marks

# Reference lines and labels (e.g. the campus edge in Viz 5)
REFERENCE = '#4D5766'

# Heatmaps and other "how much crime" scales: one hue, light = few, dark = many
SEQUENTIAL_SCHEME = 'blues'

# Offense types: the same colors Map 1 uses (data/map1.json)
OFFENSE_COLORS = {
    'Aggravated Assault': '#4C78A8',
    'Auto Theft': '#F58518',
    'Commercial Burglary': '#FFFFFF',
    'Homicide': '#72B7B2',
    'Larceny': '#54A24B',
    'Larceny From Motor Vehicle': '#EECA3B',
    'Other Burglary': '#B279A2',
    'Residential Burglary': '#FF9DA6',
    'Robbery': '#9D755D',
}
