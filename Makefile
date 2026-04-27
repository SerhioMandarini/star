up:
	docker compose up -d

down:
	docker compose down

recreate:
	docker compose down --remove-orphans
	docker compose build --no-cache frontend backend node-legacy
	docker compose up -d --force-recreate frontend backend node-legacy

logs:
	docker compose logs -f frontend backend node-legacy

test:
	python3 -m pytest -v -q backend/python/tests