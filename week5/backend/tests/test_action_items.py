def test_create_and_complete_action_item(client):
    payload = {"description": "Ship it"}
    r = client.post("/action-items/", json=payload)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["ok"] is True
    assert body["data"]["completed"] is False

    item_id = body["data"]["id"]
    r = client.put(f"/action-items/{item_id}/complete")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["data"]["completed"] is True

    r = client.get("/action-items/")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["data"]["total"] == 1
    assert len(body["data"]["items"]) == 1


def test_action_item_not_found(client):
    r = client.put("/action-items/9999/complete")
    assert r.status_code == 404
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "NOT_FOUND"
    assert "message" in body["error"]


def test_action_item_validation_empty_description(client):
    r = client.post("/action-items/", json={"description": ""})
    assert r.status_code == 422
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "VALIDATION_ERROR"
