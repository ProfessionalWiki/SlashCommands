.PHONY: ci test cs phpunit phpcs stan psalm

ci: test cs parser
test: phpunit
cs: phpcs stan psalm

phpunit:
ifdef filter
	php ../../tests/phpunit/phpunit.php -c phpunit.xml.dist --filter $(filter)
else
	php ../../tests/phpunit/phpunit.php -c phpunit.xml.dist
endif

perf:
	php ../../tests/phpunit/phpunit.php -c phpunit.xml.dist --group Performance

phpcs:
	vendor/bin/phpcs -p -s --standard=$(shell pwd)/phpcs.xml

stan:
	vendor/bin/phpstan analyse --configuration=phpstan.neon --memory-limit=2G

stan-baseline:
	vendor/bin/phpstan analyse --configuration=phpstan.neon --memory-limit=2G --generate-baseline

psalm:
	vendor/bin/psalm --config=psalm.xml --no-diff

psalm-baseline:
	vendor/bin/psalm --config=psalm.xml --set-baseline=psalm-baseline.xml

lint:
	npm run test

lint-docker:
	docker run -it --rm -v "$(CURDIR)":/home/node/app -w /home/node/app -u node node:16 npm install && npm run test

baseline:
	$(MAKE) stan-baseline
	$(MAKE) psalm-baseline

parser:
	php ../../tests/parser/parserTests.php --changetree "null"

js: visual-editor-build

visual-editor-install:
	cd resources/visual-editor && docker compose run node npm install

visual-editor-build:
	cd resources/visual-editor && docker compose run node npm run build

visual-editor-lint:
	cd resources/visual-editor && docker compose run node npm run lint

visual-editor:
	$(MAKE) visual-editor-build
	$(MAKE) visual-editor-lint

add-production-assets:
	git add -f resources/visual-editor/dist/assets
