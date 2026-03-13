def test_create_and_list_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["ok"] is True
    assert body["data"]["title"] == "Test"

    r = client.get("/notes/")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["data"]["total"] >= 1
    assert len(body["data"]["items"]) >= 1

    r = client.get("/notes/search/")
    assert r.status_code == 200
    assert r.json()["ok"] is True

    r = client.get("/notes/search/", params={"q": "Hello"})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert len(body["data"]) >= 1


def test_note_not_found(client):
    r = client.get("/notes/9999")
    assert r.status_code == 404
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "NOT_FOUND"
    assert "message" in body["error"]


def test_note_validation_empty_title(client):
    r = client.post("/notes/", json={"title": "", "content": "x"})
    assert r.status_code == 422
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "VALIDATION_ERROR"


def test_note_validation_empty_content(client):
    r = client.post("/notes/", json={"title": "Ok", "content": ""})
    assert r.status_code == 422
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "VALIDATION_ERROR"
