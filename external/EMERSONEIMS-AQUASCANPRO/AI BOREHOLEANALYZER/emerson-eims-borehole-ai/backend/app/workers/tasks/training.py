from app.workers.celery_app import celery_app
import subprocess
import os

@celery_app.task
def retrain_model(model_name: str):
    """Retrain a specific AI model"""
    scripts_dir = "/app/scripts"
    model_scripts = {
        "geological": "train_geological_model.py",
        "vegetation": "train_vegetation_model.py",
        "soil": "train_soil_model.py",
        "climate": "train_climate_model.py",
        "risk": "train_risk_model.py",
        "water_quality": "train_water_quality_model.py"
    }
    
    if model_name not in model_scripts:
        return {"status": "error", "message": f"Unknown model: {model_name}"}
    
    script_path = os.path.join(scripts_dir, model_scripts[model_name])
    
    try:
        result = subprocess.run(
            ["python", script_path],
            capture_output=True,
            text=True,
            timeout=3600  # 1 hour timeout
        )
        
        return {
            "status": "completed" if result.returncode == 0 else "failed",
            "model": model_name,
            "output": result.stdout,
            "error": result.stderr
        }
    except subprocess.TimeoutExpired:
        return {"status": "timeout", "model": model_name}

@celery_app.task
def schedule_model_retraining():
    """Schedule periodic model retraining"""
    models = ["geological", "vegetation", "soil", "climate", "risk", "water_quality"]
    results = {}
    
    for model in models:
        results[model] = retrain_model.delay(model).id
    
    return {"status": "scheduled", "task_ids": results}