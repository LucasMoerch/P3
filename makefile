dev:
\tdocker compose -f docker-compose.dev.yml up --build

dev-down:
\tdocker compose -f docker-compose.dev.yml down

prod:
\tdocker compose -f docker-compose.prod.yml up --build -d

prod-down:
\tdocker compose -f docker-compose.prod.yml down
