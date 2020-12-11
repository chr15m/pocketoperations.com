PAGES=$(wildcard pages/*.md)
HTML=$(foreach page,$(PAGES),$(subst pages/,,$(page:.md=.html)))

MAKEPID:= $(shell echo $$PPID)

$(HTML): $(PAGES)
	node pages.js

watch:
	while true; do $(MAKE) -q || $(MAKE); sleep 0.5; done

serve:
	npx live-server --no-browser
