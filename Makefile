.PHONY: help build install deploy

help build install deploy :
	$(MAKE) -C galponvial-front $@
