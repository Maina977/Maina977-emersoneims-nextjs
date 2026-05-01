def test_login(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password"
    })
    assert response.status_code == 200

def test_register(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "password",
        "name": "Test User"
    })
    assert response.status_code == 200