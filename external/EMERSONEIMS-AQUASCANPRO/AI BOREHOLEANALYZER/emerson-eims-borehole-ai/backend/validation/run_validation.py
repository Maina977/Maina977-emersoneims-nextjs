"""
run_validation.py — AquaScan Pro Validation Pipeline Entry Point
================================================================
Orchestrates the full validation workflow end-to-end.

Usage examples:
    # Full Kenya validation, all counties
    python -m validation.run_validation

    # Murang'a County only (target geology)
    python -m validation.run_validation --county "Murang'a" --limit 150

    # Load a local contractor CSV + WPdx
    python -m validation.run_validation --local-csv data/muranga_boreholes.csv

    # Skip API calls (offline mode, uses spatial-only scoring)
    python -m validation.run_validation --no-api

    # Save results to a specific output directory
    python -m validation.run_validation --output-dir results/run_01/

    # Re-fetch WPdx data even if cache exists
    python -m validation.run_validation --force-refresh

Output files:
    <output_dir>/validation_report.json    — full machine-readable results
    <output_dir>/predictions_table.csv     — per-site prediction vs reality
    <output_dir>/calibration_chart.txt     — ASCII reliability diagram
    <output_dir>/summary.txt               — human-readable headline report

Data provenance:
    All records are sourced from WPdx+ (CC BY 4.0) or locally-supplied
    contractor data.  No outcomes are fabricated or estimated.
    Records with unknown status are excluded from classification metrics
    but included in yield/depth accuracy if measured values are present.
"""

from __future__ import annotations

import argparse
import csv
import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from .dataset import fetch_dataset, load_local_csv, ValidationRecord
from .predictor import run_blind_predictions, Prediction
from .metrics import build_validation_report, ValidationReport

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("validation.run")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="AquaScan Pro — blind validation against real borehole records (global)"
    )
    p.add_argument(
        "--country",
        default=None,
        help=(
            "Country name as used in WPdx (e.g. Kenya, Nigeria, India, Bangladesh, "
            "Ethiopia, Cambodia, Bolivia, Haiti). "
            "Omit for all countries globally."
        ),
    )
    p.add_argument(
        "--adm1",
        default=None,
        help=(
            "First-level admin unit (state/province/county/region). "
            "Examples: \"Murang'a\" (Kenya), \"Rajasthan\" (India), \"Oyo\" (Nigeria). "
            "Alias: --county"
        ),
    )
    p.add_argument(
        "--county",
        default=None,
        help="Alias for --adm1 (backwards compatibility).",
    )
    p.add_argument(
        "--adm2",
        default=None,
        help="Second-level admin unit (district/sub-county).",
    )
    p.add_argument(
        "--limit",
        type=int,
        default=300,
        help="Max WPdx records to fetch. Default: 300.",
    )
    p.add_argument(
        "--local-csv",
        default=None,
        dest="local_csv",
        help="Path to a locally-collected borehole CSV to merge with WPdx data.",
    )
    p.add_argument(
        "--threshold",
        type=float,
        default=0.60,
        help="Probability threshold for DRILL decision. Default: 0.60.",
    )
    p.add_argument(
        "--radius-km",
        type=float,
        default=25,
        dest="radius_km",
        help="Spatial neighbour search radius in km. Default: 25.",
    )
    p.add_argument(
        "--no-api",
        action="store_true",
        dest="no_api",
        help="Skip external API calls (offline mode — spatial-prior scoring only).",
    )
    p.add_argument(
        "--force-refresh",
        action="store_true",
        dest="force_refresh",
        help="Ignore WPdx cache and re-fetch from API.",
    )
    p.add_argument(
        "--output-dir",
        default=None,
        dest="output_dir",
        help="Directory to write output files. Default: validation/results/<timestamp>/",
    )
    p.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress progress output.",
    )
    return p.parse_args()


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

def write_predictions_csv(
    pairs: list[tuple[ValidationRecord, Prediction]],
    path: Path,
) -> None:
    """Write per-site prediction vs reality table."""
    fieldnames = [
        "wpdx_id", "latitude", "longitude",
        "county", "sub_county",
        # Ground truth
        "actual_outcome", "actual_yield_m3hr", "actual_depth_m",
        "wpdx_status", "install_year",
        # Predictions
        "predicted_probability", "predicted_yield_m3hr", "predicted_depth_m",
        "decision_success", "threshold",
        # Classification result
        "classification_result",
        # Sub-scores
        "score_recharge", "score_terrain", "score_soil",
        "score_regional", "score_depth_proxy", "raw_score",
        # Features used
        "rainfall_mm", "elevation_m", "clay_pct",
        "regional_success_rate", "n_neighbours",
        # Data quality
        "flags",
    ]

    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()

        for record, pred in pairs:
            # Classification result label
            if record.outcome_success is None:
                clf = "UNKNOWN_OUTCOME"
            elif pred.decision_success and record.outcome_success:
                clf = "TP"
            elif pred.decision_success and not record.outcome_success:
                clf = "FP"
            elif not pred.decision_success and record.outcome_success:
                clf = "FN"
            else:
                clf = "TN"

            row = {
                "wpdx_id":                pred.wpdx_id,
                "latitude":               pred.latitude,
                "longitude":              pred.longitude,
                "county":                 record.county,
                "sub_county":             record.sub_county,
                "actual_outcome":         "SUCCESS" if record.outcome_success else ("FAIL" if record.outcome_success is False else "UNKNOWN"),
                "actual_yield_m3hr":      record.actual_yield_m3hr if record.actual_yield_m3hr is not None else "",
                "actual_depth_m":         record.actual_depth_m if record.actual_depth_m is not None else "",
                "wpdx_status":            record.status,
                "install_year":           record.install_year if record.install_year else "",
                "predicted_probability":  pred.predicted_probability,
                "predicted_yield_m3hr":   pred.predicted_yield_m3hr,
                "predicted_depth_m":      pred.predicted_depth_m,
                "decision_success":       "DRILL" if pred.decision_success else "PASS",
                "threshold":              pred.threshold_used,
                "classification_result":  clf,
                "score_recharge":         pred.recharge_score,
                "score_terrain":          pred.terrain_score,
                "score_soil":             pred.soil_score,
                "score_regional":         pred.regional_prior_score,
                "score_depth_proxy":      pred.depth_yield_proxy_score,
                "raw_score":              pred.raw_score,
                "rainfall_mm":            pred.rainfall_mm if pred.rainfall_mm is not None else "",
                "elevation_m":            pred.elevation_m if pred.elevation_m is not None else "",
                "clay_pct":               pred.clay_fraction if pred.clay_fraction is not None else "",
                "regional_success_rate":  pred.regional_success_rate if pred.regional_success_rate is not None else "",
                "n_neighbours":           pred.n_neighbours,
                "flags":                  "; ".join(pred.data_quality_flags),
            }
            writer.writerow(row)

    logger.info("Predictions CSV written: %s", path)


def write_calibration_chart(report: ValidationReport, path: Path) -> None:
    """ASCII reliability diagram."""
    lines = [
        "Probability Calibration — Reliability Diagram",
        "=" * 60,
        f"Expected Calibration Error (ECE): {report.calibration.expected_calibration_error:.4f}",
        f"{'Well calibrated (ECE < 0.10)' if report.calibration.well_calibrated else 'NEEDS RECALIBRATION (ECE >= 0.10)'}",
        "",
        f"{'Bin':<12} {'n':>5}  {'Pred%':>7}  {'Actual%':>8}  {'Error':>7}  {'Status':>12}  Chart",
        "-" * 75,
    ]

    for b in report.calibration.bins:
        pred_pct = b.mean_predicted_prob * 100
        actual_pct = b.actual_success_rate * 100
        err = b.calibration_error
        status = "✓ OK" if err < 0.10 else "⚠ HIGH ERR"

        bar_pred   = "█" * int(pred_pct / 5)
        bar_actual = "░" * int(actual_pct / 5)
        chart = f"{bar_pred:<20} | {bar_actual}"

        lines.append(
            f"{b.label:<12} {b.n:>5}  {pred_pct:>6.1f}%  {actual_pct:>7.1f}%  "
            f"{err:>6.3f}  {status:>12}  {chart}"
        )

    lines += [
        "",
        "█ = predicted probability  ░ = actual success rate",
        "Perfectly calibrated → predicted% = actual% in every bin",
    ]

    path.write_text("\n".join(lines), encoding="utf-8")
    logger.info("Calibration chart written: %s", path)


def write_summary_txt(report: ValidationReport, path: Path, args: argparse.Namespace) -> None:
    """Human-readable summary report."""
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "AquaScan Pro — Blind Validation Report (GLOBAL)",
        f"Generated: {ts}",
        f"Country: {args.country or 'All countries globally'}  ADM1: {args.adm1 or args.county or 'All'}  ADM2: {getattr(args, 'adm2', None) or 'All'}",
        f"WPdx limit: {args.limit}  Threshold: {args.threshold:.0%}  API calls: {'disabled' if args.no_api else 'enabled'}",
        "",
        "DATA PROVENANCE",
        "  Primary source: Water Point Data Exchange (WPdx+) — CC BY 4.0",
        "  URL: https://data.waterpointdata.org",
        "  Coverage: 80+ countries, ~1.1 million water points",
        "  Climate: NASA POWER Climatology API (1984–2023)",
        "  Soil:    ISRIC SoilGrids v2 (rest.isric.org) — global",
        "  Terrain: Open-Elevation API (SRTM 90m) — global",
        "  Regional calibration profiles: 13 hydrogeological zones (East Africa,",
        "    West Africa, Southern Africa, South Asia, SE Asia, Latin America,",
        "    Central America, MENA, North Africa, Horn/Sahel, Central Asia, Europe, Default)",
        "  No fabricated or estimated data used without explicit labelling.",
        "",
        report.headline(),
        "",
        "INTERPRETATION GUIDE",
        "  Accuracy >= 75%: The model correctly classifies sites 3 in 4 times.",
        "  Precision >= 70%: When we say DRILL, we are right 7 in 10 times.",
        "  Low FPR:          Few wasted drilling attempts at bad sites.",
        "  Recall:           How many good sites we correctly flag for drilling.",
        "  Yield MAE <= 1.0: Predicted yield within 1 m³/hr of actual.",
        "  ECE < 0.10:       Probability scores are calibrated, not just rankings.",
        "",
        "WHAT THIS VALIDATES",
        "  The model is validated as a FILTER — a site screening tool.",
        "  It does not replace: pump test, ERT survey, lab analysis.",
        "  It replaces: expensive gate surveys on sites that will fail.",
        "  Success probability >= 60% ≈ experienced driller site visit assessment.",
    ]

    path.write_text("\n".join(lines), encoding="utf-8")
    logger.info("Summary written: %s", path)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    args = parse_args()

    if args.quiet:
        logging.getLogger().setLevel(logging.WARNING)

    # --- Output directory ---
    if args.output_dir:
        out_dir = Path(args.output_dir)
    else:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        out_dir = Path(__file__).parent / "results" / ts
    out_dir.mkdir(parents=True, exist_ok=True)
    logger.info("Output directory: %s", out_dir)

    # --- 1. Fetch dataset ---
    logger.info("STEP 1: Fetching real borehole dataset from WPdx+...")
    records: list[ValidationRecord] = []

    try:
        records = fetch_dataset(
            country=args.country,
            adm1=args.adm1 or args.county,
            adm2=getattr(args, "adm2", None),
            max_records=args.limit,
            force_refresh=args.force_refresh,
        )
    except RuntimeError as e:
        logger.error("Failed to fetch WPdx data: %s", e)
        logger.error("If offline, supply a local CSV with --local-csv and use --no-api")
        sys.exit(1)

    # Merge local CSV if provided
    if args.local_csv:
        logger.info("STEP 1b: Loading local CSV: %s", args.local_csv)
        try:
            local_records = load_local_csv(args.local_csv)
            records.extend(local_records)
            logger.info("Total after merge: %d records", len(records))
        except (FileNotFoundError, Exception) as e:
            logger.warning("Could not load local CSV: %s", e)

    if not records:
        logger.error("No records available. Aborting.")
        sys.exit(1)

    # Filter to records with known outcome
    n_with_outcome = sum(1 for r in records if r.outcome_success is not None)
    logger.info(
        "Dataset: %d records total, %d with known outcome (%.0f%%)",
        len(records), n_with_outcome, 100 * n_with_outcome / len(records)
    )

    if n_with_outcome < 20:
        logger.warning(
            "Only %d records have known outcomes — results may not be statistically robust. "
            "Target minimum is 50 for binary classification, 100 for stratified analysis.",
            n_with_outcome
        )

    # Save raw dataset
    raw_out = out_dir / "raw_dataset.json"
    with open(raw_out, "w", encoding="utf-8") as fh:
        json.dump(
            [
                {k: v for k, v in vars(r).items() if k != "raw_wpdx"}
                for r in records
            ],
            fh, indent=2, default=str
        )
    logger.info("Raw dataset saved: %s", raw_out)

    # --- 2. Run blind predictions ---
    logger.info(
        "STEP 2: Running blind predictions (outcome columns withheld from predictor)..."
    )
    t0 = time.time()
    pairs = run_blind_predictions(
        records=records,
        threshold=args.threshold,
        neighbour_radius_km=args.radius_km,
        fetch_apis=not args.no_api,
        progress_every=20,
    )
    elapsed = time.time() - t0
    logger.info("Blind prediction complete: %.1f seconds (%.2f s/site)", elapsed, elapsed / max(len(pairs), 1))

    # --- 3. Compute metrics ---
    logger.info("STEP 3: Computing validation metrics...")
    dataset_label = (
        args.country or "Global (all countries)"
    ) + (
        f" / {args.adm1 or args.county}" if (args.adm1 or args.county) else ""
    )
    report = build_validation_report(pairs, dataset_name=dataset_label, threshold=args.threshold)

    # --- 4. Write outputs ---
    logger.info("STEP 4: Writing results to %s ...", out_dir)

    write_predictions_csv(pairs, out_dir / "predictions_table.csv")
    write_calibration_chart(report, out_dir / "calibration_chart.txt")
    write_summary_txt(report, out_dir / "summary.txt", args)

    report_path = out_dir / "validation_report.json"
    with open(report_path, "w", encoding="utf-8") as fh:
        json.dump(report.to_dict(), fh, indent=2, default=str)
    logger.info("JSON report: %s", report_path)

    # --- 5. Print headline ---
    print("\n" + "=" * 70)
    print(report.headline())
    print("=" * 70)
    print(f"\nFull results: {out_dir}")

    # Exit code: 0 if accuracy target met, 1 if not
    if report.confusion.total < 10:
        logger.warning("Too few classified records for a reliable accuracy estimate.")
        sys.exit(0)

    passed = report.confusion.accuracy >= report.target_accuracy
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
