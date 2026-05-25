PAGES=$(wildcard pages/*.md)
HTML=$(foreach page,$(PAGES),$(subst pages/,,$(page:.md=.html)))

$(HTML): $(PAGES)
	node pages.js

.PHONY: watcher serve watch analytics

watcher:
	while true; do $(MAKE) -q || $(MAKE); sleep 0.5; done

serve:
	npx live-server --no-browser --port=8000

watch:
	make -j 2 serve watcher

analytics:
	cat ../../logs/pocketoperations/*access.log | goaccess --log-format='%h %^[%d:%t %^] "%r" %s %b "%R" "%u"' --time-format="%H:%M:%S" --date-format="%d/%b/%Y" --ignore-crawlers > analytics.html
