from prometheus_client import Counter, Histogram, Gauge
import time

# Metrics
analysis_requests = Counter('analysis_requests_total', 'Total analysis requests')
analysis_duration = Histogram('analysis_duration_seconds', 'Analysis duration in seconds')
active_users = Gauge('active_users', 'Number of active users')
prediction_accuracy = Gauge('prediction_accuracy', 'Model prediction accuracy')

def track_analysis_duration(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        analysis_duration.observe(duration)
        analysis_requests.inc()
        return result
    return wrapper