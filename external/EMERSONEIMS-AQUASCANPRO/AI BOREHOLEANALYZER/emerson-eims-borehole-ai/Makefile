.PHONY: help dev-backend dev-frontend dev-mobile build-backend build-frontend test deploy validate typecheck

help:
	@echo "Available commands:"
	@echo "  validate       - Run ALL checks (TypeScript + Python + build + hygiene)"
	@echo "  typecheck      - TypeScript type checking only"
	@echo "  dev-backend    - Start backend development server"
	@echo "  dev-frontend   - Start frontend development server"
	@echo "  dev-mobile     - Start mobile app"
	@echo "  build-backend  - Build backend Docker image"
	@echo "  build-frontend - Build frontend Docker image"
	@echo "  test          - Run all tests"
	@echo "  deploy        - Deploy to production"

validate:
	@echo "Running full project validation..."
	node scripts/validate-all.mjs

typecheck:
	npx tsc --noEmit

dev-backend:
	cd backend && uvicorn app.main:app --reload

dev-frontend:
	cd frontend && npm run dev

dev-mobile:
	cd mobile && flutter run

build-backend:
	docker build -t borehole-ai/backend ./backend

build-frontend:
	docker build -t borehole-ai/frontend ./frontend

test:
	cd backend && pytest
	cd frontend && npm test
	cd mobile && flutter test

deploy:
	./scripts/deploy/deploy_backend.sh
	./scripts/deploy/deploy_frontend.sh