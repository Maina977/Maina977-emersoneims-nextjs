# Engineering content review (2026-11-05)

Independent audits of the four engineering tools ran in rounds through October and November; the last scores on the live build of 2026-11-05 (before the final fix batch) were:

| Tool | Score | Main remaining limits |
|---|---|---|
| Generator Oracle | 8.5 / 10 | ~half the controller alarms still carry generic steps; a few unsourced troubleshooter part numbers; some searches return nothing ("excessive vibration") |
| SolarGenius Pro | 8.5 / 10 | Shop prices not the owner's; wiring-diagram labels small on phones; fault-code count 105 vs 81 |
| AquaScan Pro | 8 / 10 | No validation against drilled outcomes yet; test runs used stored ERA5 rainfall (Open-Meteo refused the test machine); household pricing uses institutional rates |
| Building Suite | 7.5 / 10 | Costing, fire travel distance, 3D not available (no verified source); new egress/ventilation/accessibility tools now live and hand-checked |

Every major finding of the final round was fixed and pushed (34f598cb). Safety: Oracle carries specific safety notices (runaway, fire, shock, CO, fuel/oil/coolant leaks, electrical burning, hot alternator); tools state that desktop results are preliminary and field work decides.

Sources used for new calculations, read on 2026-11-05: IBC 2021 Ch. 10 values (egress), ASHRAE 62.1 SI tables (ventilation), 2010 ADA Standards and UK Approved Document M Vol. 2 (2024) (accessibility), Deye SUN-3/3.6/5/6K-SG04LP1-EU datasheet (inverters), EmersonEIMS signed Baringo tender 16 Oct 2026 (borehole costs).

Not reviewed in this pass: the long-form articles in `/blog`, `/guides` and `/technical-bible` for regulatory currency (needs a dated review per article).

## Flagged for a dated review (2026-11-06)
`/services/borehole-drilling`: the two guarantees ("No dry holes", "predicts yield before drilling") and the "500+ boreholes" figure were removed. Still to review: "Deep boreholes (>200 m) use rotary drilling exclusively" (DTH air drilling is common), "300 m/day in hard rock", "development requires 3-7 days" (the signed Baringo tender priced 12 hours), and the transmissivity ranges quoted for Kenyan aquifers.

