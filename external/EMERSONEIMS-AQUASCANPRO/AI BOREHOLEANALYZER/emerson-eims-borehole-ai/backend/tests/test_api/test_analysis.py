import pytest
from fastapi.testclient import TestClient

def test_analyze_image(client: TestClient):
    response = client.post("/api/v1/analysis/analyze")
    assert response.status_code == 200
    assert "probability" in response.json()

def test_soil_analysis(client: TestClient):
    response = client.post("/api/v1/analysis/soil")
    assert response.status_code == 200
    assert "soilType" in response.json()