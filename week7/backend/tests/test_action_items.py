def test_create_complete_list_and_patch_action_item(client):
    payload = {"description": "Ship it"}
    r = client.post("/action-items/", json=payload)
    assert r.status_code == 201, r.text
    item = r.json()
    assert item["completed"] is False
    assert "created_at" in item and "updated_at" in item

    r = client.put(f"/action-items/{item['id']}/complete")
    assert r.status_code == 200
    done = r.json()
    assert done["completed"] is True

    r = client.get("/action-items/", params={"completed": True, "limit": 5, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.patch(f"/action-items/{item['id']}", json={"description": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["description"] == "Updated"

    r = client.delete(f"/action-items/{item['id']}")
    assert r.status_code == 204

    r = client.get(f"/action-items/{item['id']}")
    assert r.status_code == 404


def test_action_items_pagination(client):
    """Test pagination with skip and limit parameters."""
    # Create 12 action items
    item_ids = []
    for i in range(12):
        payload = {"description": f"Task {i:02d}"}
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201
        item_ids.append(r.json()["id"])

    # Test default limit (50)
    r = client.get("/action-items/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 12

    # Test limit parameter
    r = client.get("/action-items/", params={"limit": 4})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 4

    # Test skip parameter
    r = client.get("/action-items/", params={"skip": 8, "limit": 4})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 4

    # Test skip with remaining items less than limit
    r = client.get("/action-items/", params={"skip": 10, "limit": 4})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2

    # Test skip beyond total count
    r = client.get("/action-items/", params={"skip": 50, "limit": 10})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 0


def test_action_items_sorting_by_description(client):
    """Test sorting action items by description field."""
    # Create action items with specific descriptions
    descriptions = ["Zebra task", "Apple task", "Mango task", "Banana task", "Cherry task"]
    for desc in descriptions:
        payload = {"description": desc}
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201

    # Test ascending order by description
    r = client.get("/action-items/", params={"sort": "description", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    desc_result = [item["description"] for item in items if item["description"] in descriptions]
    assert desc_result == sorted(descriptions)

    # Test descending order by description
    r = client.get("/action-items/", params={"sort": "-description", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    desc_result = [item["description"] for item in items if item["description"] in descriptions]
    assert desc_result == sorted(descriptions, reverse=True)


def test_action_items_sorting_by_created_at(client):
    """Test sorting action items by created_at field."""
    # Create action items
    for i in range(5):
        payload = {"description": f"Task {i}"}
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201

    # Test ascending order by created_at
    r = client.get("/action-items/", params={"sort": "created_at", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    # Verify that created_at timestamps are in ascending order
    created_ats = [item["created_at"] for item in items]
    assert created_ats == sorted(created_ats)

    # Test descending order by created_at (default behavior)
    r = client.get("/action-items/", params={"sort": "-created_at", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    # Verify that created_at timestamps are in descending order
    created_ats = [item["created_at"] for item in items]
    assert created_ats == sorted(created_ats, reverse=True)


def test_action_items_sorting_by_completed(client):
    """Test sorting action items by completed status."""
    # Create some completed and some incomplete items
    for i in range(3):
        payload = {"description": f"Task {i}"}
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201
        item_id = r.json()["id"]
        # Complete every other item
        if i % 2 == 0:
            r = client.put(f"/action-items/{item_id}/complete")
            assert r.status_code == 200

    # Test ascending order by completed (False first, then True)
    r = client.get("/action-items/", params={"sort": "completed", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    completed_vals = [item["completed"] for item in items]
    # False (0) should come before True (1)
    assert completed_vals == sorted(completed_vals)

    # Test descending order by completed (True first, then False)
    r = client.get("/action-items/", params={"sort": "-completed", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    completed_vals = [item["completed"] for item in items]
    assert completed_vals == sorted(completed_vals, reverse=True)


def test_action_items_filtering_and_pagination(client):
    """Test filtering by completed status with pagination and sorting."""
    # Create 10 items, complete 5 of them
    for i in range(10):
        payload = {"description": f"Task {i:02d}"}
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201
        item_id = r.json()["id"]
        if i % 2 == 0:
            r = client.put(f"/action-items/{item_id}/complete")
            assert r.status_code == 200

    # Get only completed items with limit
    r = client.get("/action-items/", params={"completed": True, "limit": 2})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    assert all(item["completed"] for item in items)

    # Get only incomplete items with skip and limit
    r = client.get("/action-items/", params={"completed": False, "skip": 1, "limit": 2})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    assert all(not item["completed"] for item in items)

    # Get all completed items sorted descending
    r = client.get("/action-items/", params={"completed": True, "sort": "-created_at", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    assert all(item["completed"] for item in items)
    created_ats = [item["created_at"] for item in items]
    assert created_ats == sorted(created_ats, reverse=True)


