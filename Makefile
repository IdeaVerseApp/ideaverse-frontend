.PHONY: dev build start clean

dev:
	@echo "Starting development server..."
	npm run dev

build:
	@echo "Building production version..."
	npm run build

start:
	@echo "Starting production server..."
	npm start

clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next out

help:
	@echo "Available commands:"
	@echo "  make dev     - Start development server with hot reloading"
	@echo "  make build   - Build production version"
	@echo "  make start   - Start production server"
	@echo "  make clean   - Clean build artifacts" 