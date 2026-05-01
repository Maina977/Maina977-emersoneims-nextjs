"""
AquaScan Pro — Independent Validation Pipeline (GLOBAL)
========================================================
Blind validation of AquaScan Pro predictions against real borehole outcomes.
Covers any country with WPdx+ data — 80+ countries, ~1.1 million water points.

Data sources (all authoritative, no fabrication):
  PRIMARY
  ───────
  WPdx+           https://data.waterpointdata.org  (UNICEF/World Bank, CC BY 4.0)
  NASA POWER      https://power.larc.nasa.gov       (climatology, 1984–2023)
  ISRIC SoilGrids https://rest.isric.org            (global soil properties)
  Open-Elevation  https://api.open-elevation.com    (SRTM 90m global DEM)

  SUPPLEMENTARY (for local CSV import — see dataset.load_local_csv)
  ─────────────
  IGRAC GGMN      https://www.un-igrac.org/ggmn     (UN groundwater monitoring)
  BGS Africa GW   https://www.bgs.ac.uk/research/groundwater/international/
  FAO AQUASTAT    https://www.fao.org/aquastat       (country water statistics)
  WHYMAP          https://www.whymap.org             (UNESCO hydrogeological atlas)
  USGS NWIS       https://waterdata.usgs.gov/nwis/gw (USA)
  India CGWB      https://cgwb.gov.in/wris           (Central Ground Water Board)
  SADC-GMI        https://www.sadc.int/themes/natural-resources-environment/water/
  WHO/UNICEF JMP  https://washdata.org               (global WASH monitoring)

Regional calibration profiles (13 zones):
  east_africa, west_africa, southern_africa, north_africa, horn_sahel,
  south_asia, southeast_asia, central_asia, latin_america, central_america,
  mena, europe, default

Usage:
    # Single country
    python -m validation.run_validation --country Kenya --adm1 "Murang'a"
    python -m validation.run_validation --country Nigeria --limit 500
    python -m validation.run_validation --country India   --adm1 Rajasthan
    python -m validation.run_validation --country Cambodia

    # All countries globally
    python -m validation.run_validation --limit 2000

    # Or double-click validate.bat
"""
