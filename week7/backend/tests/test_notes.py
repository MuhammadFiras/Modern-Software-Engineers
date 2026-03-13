def test_create_list_and_patch_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"
    assert "created_at" in data and "updated_at" in data

    r = client.get("/notes/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.get("/notes/", params={"q": "Hello", "limit": 10, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    note_id = data["id"]
    r = client.patch(f"/notes/{note_id}", json={"title": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["title"] == "Updated"

    r = client.delete(f"/notes/{note_id}")
    assert r.status_code == 204

    r = client.get(f"/notes/{note_id}")
    assert r.status_code == 404


def test_notes_pagination(client):
    """Test pagination with skip and limit parameters."""
    # Create 15 notes with varying titles
    note_ids = []
    for i in range(15):
        payload = {"title": f"Note {i:02d}", "content": f"Content {i}"}
        r = client.post("/notes/", json=payload)
        assert r.status_code == 201
        note_ids.append(r.json()["id"])

    # Test default limit (50)
    r = client.get("/notes/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 15

    # Test limit parameter
    r = client.get("/notes/", params={"limit": 5})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5

    # Test skip parameter
    r = client.get("/notes/", params={"skip": 10, "limit": 5})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5

    # Test skip with remaining items less than limit
    r = client.get("/notes/", params={"skip": 12, "limit": 5})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 3

    # Test skip beyond total count
    r = client.get("/notes/", params={"skip": 100, "limit": 5})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 0


def test_notes_sorting_by_title(client):
    """Test sorting notes by title field."""
    # Create notes with specific titles
    titles = ["Zebra", "Apple", "Mango", "Banana", "Cherry"]
    for title in titles:
        payload = {"title": title, "content": f"Content for {title}"}
        r = client.post("/notes/", json=payload)
        assert r.status_code == 201

    # Test ascending order by title
    r = client.get("/notes/", params={"sort": "title", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    titles_result = [item["title"] for item in items if item["title"] in titles]
    assert titles_result == sorted(titles)

    # Test descending order by title
    r = client.get("/notes/", params={"sort": "-title", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    titles_result = [item["title"] for item in items if item["title"] in titles]
    assert titles_result == sorted(titles, reverse=True)


def test_notes_sorting_by_created_at(client):
    """Test sorting notes by created_at field."""
    # Create notes
    for i in range(5):
        payload = {"title": f"Note {i}", "content": f"Content {i}"}
        r = client.post("/notes/", json=payload)
        assert r.status_code == 201

    # Test ascending order by created_at
    r = client.get("/notes/", params={"sort": "created_at", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    # Verify that created_at timestamps are in ascending order
    created_ats = [item["created_at"] for item in items]
    assert created_ats == sorted(created_ats)

    # Test descending order by created_at (default behavior)
    r = client.get("/notes/", params={"sort": "-created_at", "limit": 50})
    assert r.status_code == 200
    items = r.json()
    # Verify that created_at timestamps are in descending order
    created_ats = [item["created_at"] for item in items]
    assert created_ats == sorted(created_ats, reverse=True)


def test_notes_pagination_and_sorting_combined(client):
    """Test pagination and sorting used together."""
    # Create 10 notes with varying titles
    titles = ["Zebra", "Apple", "Mango", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"]
    for title in titles:
        payload = {"title": title, "content": f"Content for {title}"}
        r = client.post("/notes/", json=payload)
        assert r.status_code == 201

    # Test sorting by title ascending with skip and limit
    r = client.get("/notes/", params={"sort": "title", "skip": 2, "limit": 3})
    assert r.status_code == 200
    items = r.json()
    # Should get items 2, 3, 4 from sorted list
    sorted_titles = sorted(titles)
    titles_result = [item["title"] for item in items if item["title"] in titles]
    expected = sorted_titles[2:5]
    assert titles_result == expected

    # Test sorting by title descending with skip and limit
    r = client.get("/notes/", params={"sort": "-title", "skip": 1, "limit": 4})
    assert r.status_code == 200
    items = r.json()
    sorted_titles_desc = sorted(titles, reverse=True)
    titles_result = [item["title"] for item in items if item["title"] in titles]
    expected = sorted_titles_desc[1:5]
    assert titles_result == expected


