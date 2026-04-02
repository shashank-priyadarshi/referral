NX := npx nx

PROJECT ?= api
TARGET  ?= build

help:
	node scripts/help.js

run:
	$(NX) $(TARGET) $(PROJECT)

all:
	$(NX) run-many -t $(TARGET)

affected:
	$(NX) affected -t $(TARGET)

ci:
	$(NX) run-many -t lint typecheck build test

.PHONY: help run all affected ci
