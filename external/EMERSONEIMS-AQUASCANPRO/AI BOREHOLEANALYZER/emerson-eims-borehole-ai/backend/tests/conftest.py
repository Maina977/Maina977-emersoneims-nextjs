import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_image():
    with open("tests/sample.jpg", "rb") as f:
        return f.read()