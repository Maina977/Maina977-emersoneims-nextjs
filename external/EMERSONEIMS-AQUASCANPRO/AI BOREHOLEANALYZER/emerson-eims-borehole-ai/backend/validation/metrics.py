"""
metrics.py — Validation metrics for AquaScan Pro
=================================================
Computes all requested performance metrics from prediction vs reality pairs.

Sections:
  A. Success Classification (confusion matrix, accuracy, precision, recall, FPR)
  B. Yield MAE
  C. Depth accuracy (% within ±10m, ±25%)
  D. Probability calibration (reliability diagram, Expected Calibration Error)
  E. Stratified analysis (by soil type, terrain class, county/region)
"""

from __future__ import annotations

import math
import logging
from dataclasses import dataclass, field
from typing import Optional
from collections import defaultdict

from .dataset import ValidationRecord
from .predictor import Prediction

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# A. Classification metrics
# ---------------------------------------------------------------------------

@dataclass
class ConfusionMatrix:
    TP: int = 0  # Predicted SUCCESS, Actually SUCCESS
    FP: int = 0  # Predicted SUCCESS, Actually FAIL
    FN: int = 0  # Predicted FAIL,    Actually SUCCESS
    TN: int = 0  # Predicted FAIL,    Actually FAIL

    @property
    def total(self) -> int:
        return self.TP + self.FP + self.FN + self.TN

    @property
    def accuracy(self) -> float:
        return (self.TP + self.TN) / self.total if self.total else 0.0

    @property
    def precision(self) -> float:
        """When we say DRILL, how often are we right?"""
        denom = self.TP + self.FP
        return self.TP / denom if denom else 0.0

    @property
    def recall(self) -> float:
        """How many good sites did we correctly identify?"""
        denom = self.TP + self.FN
        return self.TP / denom if denom else 0.0

    @property
    def false_positive_rate(self) -> float:
        """Fraction of bad sites we incorrectly recommended drilling = wasted money."""
        denom = self.FP + self.TN
        return self.FP / denom if denom else 0.0

    @property
    def f1(self) -> float:
        p, r = self.precision, self.recall
        return 2 * p * r / (p + r) if (p + r) else 0.0

    @property
    def specificity(self) -> float:
        """True negative rate."""
        denom = self.TN + self.FP
        return self.TN / denom if denom else 0.0

    def to_dict(self) -> dict:
        return {
            "TP": self.TP, "FP": self.FP, "FN": self.FN, "TN": self.TN,
            "total": self.total,
            "accuracy":           round(self.accuracy, 4),
            "precision":          round(self.precision, 4),
            "recall":             round(self.recall, 4),
            "false_positive_rate": round(self.false_positive_rate, 4),
            "f1":                 round(self.f1, 4),
            "specificity":        round(self.specificity, 4),
        }


def compute_confusion_matrix(
    pairs: list[tuple[ValidationRecord, Prediction]],
) -> ConfusionMatrix:
    """
    Build confusion matrix.
    Only includes pairs where outcome_success is known (not None).
    """
    cm = ConfusionMatrix()
    excluded = 0
    for record, pred in pairs:
        if record.outcome_success is None:
            excluded += 1
            continue
        actual_success = record.outcome_success
        predicted_success = pred.decision_success

        if predicted_success and actual_success:
            cm.TP += 1
        elif predicted_success and not actual_success:
            cm.FP += 1
        elif not predicted_success and actual_success:
            cm.FN += 1
        else:
            cm.TN += 1

    if excluded > 0:
        logger.info("Excluded %d records with unknown outcome from classification metrics", excluded)
    return cm


# ---------------------------------------------------------------------------
# B. Yield MAE
# ---------------------------------------------------------------------------

@dataclass
class YieldMetrics:
    n: int = 0
    mae_m3hr: float = 0.0
    rmse_m3hr: float = 0.0
    mean_actual: float = 0.0
    mean_predicted: float = 0.0
    within_0_5: float = 0.0    # fraction within ±0.5 m³/hr
    within_1_0: float = 0.0    # fraction within ±1.0 m³/hr
    within_2_0: float = 0.0    # fraction within ±2.0 m³/hr

    def to_dict(self) -> dict:
        return {
            "n_with_yield_data": self.n,
            "mae_m3hr":          round(self.mae_m3hr, 3),
            "rmse_m3hr":         round(self.rmse_m3hr, 3),
            "mean_actual_m3hr":  round(self.mean_actual, 3),
            "mean_predicted_m3hr": round(self.mean_predicted, 3),
            "within_0_5_m3hr_pct": round(self.within_0_5 * 100, 1),
            "within_1_0_m3hr_pct": round(self.within_1_0 * 100, 1),
            "within_2_0_m3hr_pct": round(self.within_2_0 * 100, 1),
            "target_met_le1_m3hr": self.mae_m3hr <= 1.0,
        }


def compute_yield_metrics(
    pairs: list[tuple[ValidationRecord, Prediction]],
) -> YieldMetrics:
    errors: list[float] = []
    actuals: list[float] = []
    predicted: list[float] = []

    for record, pred in pairs:
        if record.actual_yield_m3hr is not None and record.actual_yield_m3hr >= 0:
            err = abs(pred.predicted_yield_m3hr - record.actual_yield_m3hr)
            errors.append(err)
            actuals.append(record.actual_yield_m3hr)
            predicted.append(pred.predicted_yield_m3hr)

    n = len(errors)
    if n == 0:
        logger.warning("No records with known yield — yield metrics unavailable")
        return YieldMetrics()

    mae = sum(errors) / n
    rmse = math.sqrt(sum(e**2 for e in errors) / n)

    def frac_within(thresh: float) -> float:
        return sum(1 for e in errors if e <= thresh) / n

    return YieldMetrics(
        n=n,
        mae_m3hr=round(mae, 3),
        rmse_m3hr=round(rmse, 3),
        mean_actual=round(sum(actuals) / n, 3),
        mean_predicted=round(sum(predicted) / n, 3),
        within_0_5=frac_within(0.5),
        within_1_0=frac_within(1.0),
        within_2_0=frac_within(2.0),
    )


# ---------------------------------------------------------------------------
# C. Depth accuracy
# ---------------------------------------------------------------------------

@dataclass
class DepthMetrics:
    n: int = 0
    mae_m: float = 0.0
    rmse_m: float = 0.0
    within_10m_pct: float = 0.0
    within_25pct_pct: float = 0.0   # within ±25% of actual depth
    within_20m_pct: float = 0.0

    def to_dict(self) -> dict:
        return {
            "n_with_depth_data":      self.n,
            "mae_m":                   round(self.mae_m, 1),
            "rmse_m":                  round(self.rmse_m, 1),
            "within_10m_pct":          round(self.within_10m_pct, 1),
            "within_25pct_of_actual_pct": round(self.within_25pct_pct, 1),
            "within_20m_pct":          round(self.within_20m_pct, 1),
        }


def compute_depth_metrics(
    pairs: list[tuple[ValidationRecord, Prediction]],
) -> DepthMetrics:
    errors_abs: list[float] = []
    errors_rel: list[float] = []

    within_10m = 0
    within_25p = 0
    within_20m = 0

    for record, pred in pairs:
        if record.actual_depth_m is not None and record.actual_depth_m > 0:
            err = abs(pred.predicted_depth_m - record.actual_depth_m)
            errors_abs.append(err)
            errors_rel.append(err / record.actual_depth_m)
            if err <= 10:
                within_10m += 1
            if err <= 20:
                within_20m += 1
            if err / record.actual_depth_m <= 0.25:
                within_25p += 1

    n = len(errors_abs)
    if n == 0:
        logger.warning("No records with known depth — depth metrics unavailable")
        return DepthMetrics()

    return DepthMetrics(
        n=n,
        mae_m=round(sum(errors_abs) / n, 1),
        rmse_m=round(math.sqrt(sum(e**2 for e in errors_abs) / n), 1),
        within_10m_pct=round(100 * within_10m / n, 1),
        within_25pct_pct=round(100 * within_25p / n, 1),
        within_20m_pct=round(100 * within_20m / n, 1),
    )


# ---------------------------------------------------------------------------
# D. Probability calibration
# ---------------------------------------------------------------------------

@dataclass
class CalibrationBin:
    label: str          # e.g. "0.50–0.60"
    low: float
    high: float
    n: int
    mean_predicted_prob: float
    actual_success_rate: float
    calibration_error: float   # |mean_predicted - actual_success_rate|

    def to_dict(self) -> dict:
        return {
            "bin":                      self.label,
            "n":                        self.n,
            "mean_predicted_prob":      round(self.mean_predicted_prob, 3),
            "actual_success_rate":      round(self.actual_success_rate, 3),
            "calibration_error":        round(self.calibration_error, 3),
            "well_calibrated":          self.calibration_error < 0.10,
        }


@dataclass
class CalibrationMetrics:
    bins: list[CalibrationBin] = field(default_factory=list)
    expected_calibration_error: float = 0.0
    max_calibration_error: float = 0.0
    n_bins_with_data: int = 0
    well_calibrated: bool = False   # ECE < 0.10

    def to_dict(self) -> dict:
        return {
            "expected_calibration_error": round(self.expected_calibration_error, 4),
            "max_calibration_error":      round(self.max_calibration_error, 4),
            "well_calibrated_ECE_lt_010": self.well_calibrated,
            "n_bins_with_data":           self.n_bins_with_data,
            "bins": [b.to_dict() for b in self.bins],
        }


def compute_calibration(
    pairs: list[tuple[ValidationRecord, Prediction]],
    n_bins: int = 10,
) -> CalibrationMetrics:
    """
    Reliability diagram data.
    Groups predictions into n_bins probability buckets and checks whether
    the predicted probability matches the actual success rate in each bucket.

    Example: if the model says 0.70 for 30 sites, ~21 should actually succeed.
    """
    # Only use records with known outcome
    usable = [
        (record, pred) for record, pred in pairs
        if record.outcome_success is not None
    ]
    if len(usable) < 20:
        logger.warning("Too few records with known outcome for calibration analysis")
        return CalibrationMetrics()

    bin_width = 1.0 / n_bins
    bins_data: dict[int, list[tuple[float, bool]]] = defaultdict(list)

    for record, pred in usable:
        bin_idx = min(int(pred.predicted_probability / bin_width), n_bins - 1)
        bins_data[bin_idx].append((pred.predicted_probability, record.outcome_success))

    cal_bins: list[CalibrationBin] = []
    weighted_errors = 0.0
    total_n = 0

    for bin_idx in range(n_bins):
        entries = bins_data.get(bin_idx, [])
        if len(entries) < 3:
            continue   # skip underpopulated bins
        low = bin_idx * bin_width
        high = low + bin_width
        mean_pred = sum(p for p, _ in entries) / len(entries)
        actual_rate = sum(1 for _, s in entries if s) / len(entries)
        cal_err = abs(mean_pred - actual_rate)
        n = len(entries)
        cal_bins.append(CalibrationBin(
            label=f"{low:.2f}–{high:.2f}",
            low=low, high=high,
            n=n,
            mean_predicted_prob=round(mean_pred, 4),
            actual_success_rate=round(actual_rate, 4),
            calibration_error=round(cal_err, 4),
        ))
        weighted_errors += cal_err * n
        total_n += n

    ece = weighted_errors / total_n if total_n else 0.0
    max_err = max((b.calibration_error for b in cal_bins), default=0.0)

    return CalibrationMetrics(
        bins=cal_bins,
        expected_calibration_error=round(ece, 4),
        max_calibration_error=round(max_err, 4),
        n_bins_with_data=len(cal_bins),
        well_calibrated=ece < 0.10,
    )


# ---------------------------------------------------------------------------
# E. Stratified analysis
# ---------------------------------------------------------------------------

@dataclass
class StratumResult:
    stratum_key: str
    stratum_value: str
    n_total: int
    n_classified: int     # with known outcomes
    confusion: ConfusionMatrix
    yield_metrics: YieldMetrics

    def to_dict(self) -> dict:
        return {
            "stratum": f"{self.stratum_key}={self.stratum_value}",
            "n_total": self.n_total,
            "n_classified": self.n_classified,
            "accuracy":           round(self.confusion.accuracy, 4),
            "precision":          round(self.confusion.precision, 4),
            "recall":             round(self.confusion.recall, 4),
            "false_positive_rate": round(self.confusion.false_positive_rate, 4),
            "yield_mae_m3hr":     round(self.yield_metrics.mae_m3hr, 3),
            "confusion": self.confusion.to_dict(),
        }


def compute_stratified(
    pairs: list[tuple[ValidationRecord, Prediction]],
    stratum_keys: list[str] | None = None,
) -> list[StratumResult]:
    """
    Compute performance broken down by stratum.

    Stratum keys correspond to ValidationRecord attributes:
      - "soil_texture_class"  (sandy / loam / clay etc.)
      - "terrain_class"       (valley / slope / ridge / plain)
      - "county"              (Murang'a / Kirinyaga / etc.)

    Low-count strata (n < 5) are included but flagged as unreliable.
    """
    if stratum_keys is None:
        stratum_keys = ["soil_texture_class", "terrain_class", "county"]

    results: list[StratumResult] = []

    for key in stratum_keys:
        # Group pairs by stratum value
        groups: dict[str, list[tuple[ValidationRecord, Prediction]]] = defaultdict(list)
        for record, pred in pairs:
            val = getattr(record, key, None)
            groups[str(val) if val else "unknown"].append((record, pred))

        for stratum_val, group_pairs in sorted(groups.items()):
            cm = compute_confusion_matrix(group_pairs)
            ym = compute_yield_metrics(group_pairs)
            n_classified = cm.total

            results.append(StratumResult(
                stratum_key=key,
                stratum_value=stratum_val,
                n_total=len(group_pairs),
                n_classified=n_classified,
                confusion=cm,
                yield_metrics=ym,
            ))
            if len(group_pairs) < 5:
                logger.warning(
                    "Stratum %s=%s has only %d records — treat with caution",
                    key, stratum_val, len(group_pairs)
                )

    return results


# ---------------------------------------------------------------------------
# Aggregate report builder
# ---------------------------------------------------------------------------

@dataclass
class ValidationReport:
    """Full validation results for one run."""
    dataset_name: str
    n_records: int
    n_with_known_outcome: int
    threshold: float

    confusion: ConfusionMatrix
    yield_metrics: YieldMetrics
    depth_metrics: DepthMetrics
    calibration: CalibrationMetrics
    stratified: list[StratumResult]

    # Targets
    target_accuracy: float = 0.75
    target_precision: float = 0.70
    target_yield_mae: float = 1.0

    def headline(self) -> str:
        lines = [
            f"=== AquaScan Pro Validation Report — {self.dataset_name} ===",
            f"Records: {self.n_records} total, {self.n_with_known_outcome} with known outcome",
            f"Decision threshold: {self.threshold:.0%}",
            "",
            "A. Classification Accuracy",
            f"   Accuracy:           {self.confusion.accuracy:.1%}  (target ≥{self.target_accuracy:.0%})  {'✓ PASS' if self.confusion.accuracy >= self.target_accuracy else '✗ FAIL'}",
            f"   Precision:          {self.confusion.precision:.1%}  (target ≥{self.target_precision:.0%})  {'✓ PASS' if self.confusion.precision >= self.target_precision else '✗ FAIL'}",
            f"   Recall:             {self.confusion.recall:.1%}",
            f"   False Positive Rate:{self.confusion.false_positive_rate:.1%}  (wasted drilling risk)",
            f"   F1:                 {self.confusion.f1:.3f}",
            "",
            "   Confusion Matrix:",
            f"     TP={self.confusion.TP}  FP={self.confusion.FP}",
            f"     FN={self.confusion.FN}  TN={self.confusion.TN}",
            "",
            "B. Yield Prediction (MAE)",
            f"   MAE: {self.yield_metrics.mae_m3hr:.3f} m³/hr  (target ≤{self.target_yield_mae})  {'✓ PASS' if self.yield_metrics.mae_m3hr <= self.target_yield_mae and self.yield_metrics.n > 0 else '✗ FAIL/NO DATA'}",
            f"   RMSE: {self.yield_metrics.rmse_m3hr:.3f} m³/hr",
            f"   Within ±0.5 m³/hr: {self.yield_metrics.within_0_5:.1%}",
            f"   Within ±1.0 m³/hr: {self.yield_metrics.within_1_0:.1%}",
            f"   n={self.yield_metrics.n}",
            "",
            "C. Depth Accuracy",
            f"   MAE: {self.depth_metrics.mae_m:.1f} m",
            f"   Within ±10m: {self.depth_metrics.within_10m_pct:.1f}%",
            f"   Within ±25% of actual: {self.depth_metrics.within_25pct_pct:.1f}%",
            f"   n={self.depth_metrics.n}",
            "",
            "D. Probability Calibration",
            f"   ECE: {self.calibration.expected_calibration_error:.4f}  {'✓ WELL CALIBRATED' if self.calibration.well_calibrated else '✗ NEEDS RECALIBRATION'}",
            f"   Max bin error: {self.calibration.max_calibration_error:.4f}",
            "",
            "E. Stratified Analysis",
        ]
        for s in self.stratified:
            if s.n_classified >= 5:
                lines.append(
                    f"   [{s.stratum_key}={s.stratum_value}]  n={s.n_classified}  "
                    f"Acc={s.confusion.accuracy:.1%}  Prec={s.confusion.precision:.1%}  "
                    f"FPR={s.confusion.false_positive_rate:.1%}"
                )
        return "\n".join(lines)

    def to_dict(self) -> dict:
        return {
            "dataset": self.dataset_name,
            "n_records": self.n_records,
            "n_with_known_outcome": self.n_with_known_outcome,
            "threshold": self.threshold,
            "classification": self.confusion.to_dict(),
            "yield": self.yield_metrics.to_dict(),
            "depth": self.depth_metrics.to_dict(),
            "calibration": self.calibration.to_dict(),
            "stratified": [s.to_dict() for s in self.stratified],
            "passes": {
                "accuracy":   self.confusion.accuracy >= self.target_accuracy,
                "precision":  self.confusion.precision >= self.target_precision,
                "yield_mae":  self.yield_metrics.mae_m3hr <= self.target_yield_mae if self.yield_metrics.n > 0 else None,
            },
        }


def build_validation_report(
    pairs: list[tuple[ValidationRecord, Prediction]],
    dataset_name: str = "WPdx Kenya",
    threshold: float = 0.60,
) -> ValidationReport:
    """
    Compute all metrics and return a ValidationReport.
    """
    n_known = sum(1 for r, _ in pairs if r.outcome_success is not None)
    return ValidationReport(
        dataset_name=dataset_name,
        n_records=len(pairs),
        n_with_known_outcome=n_known,
        threshold=threshold,
        confusion=compute_confusion_matrix(pairs),
        yield_metrics=compute_yield_metrics(pairs),
        depth_metrics=compute_depth_metrics(pairs),
        calibration=compute_calibration(pairs),
        stratified=compute_stratified(pairs),
    )
