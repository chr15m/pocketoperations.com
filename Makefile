PAGES=$(wildcard pages/*.md)
HTML=$(foreach page,$(PAGES),$(subst pages/,,$(page:.md=.html)))

$(HTML): $(PAGES)
	node pages.js

.PHONY: watcher serve watc

watcher:
	while true; do $(MAKE) -q || $(MAKE); sleep 0.5; done

serve:
	npx live-server --no-browser --port=8000

watch:
	make -j 2 serve watcher
