# Variables
DEV_COMPOSE = docker compose -f docker-compose.dev.yml
PROD_COMPOSE = docker compose -f docker-compose.prod.yml

# Default target
.DEFAULT_GOAL := help


dev: ## Start everything in dev mode
	$(DEV_COMPOSE) up --build


dev-down: ## Stop dev containers
	$(DEV_COMPOSE) down


prod: ## Build and run production containers
	$(PROD_COMPOSE) up --build -d


prod-down: ## Stop production containers
	$(PROD_COMPOSE) down



build-frontend: ## Run frontend build
	cd frontend && npm ci && npm run build



help: ## Show available commands
	@echo "Available make targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-15s %s\n", $$1, $$2}'
