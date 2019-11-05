(function () {
    class AzizOverlayItem extends HTMLElement {
        constructor()
        {
            super();

            this.state = {
                config: {
                    edit: null,
                },
                item: null,
            }

            const shadow = this.attachShadow({mode: 'closed'});
            const style = document.createElement('style');
            style.textContent = '';
            style.textContent += '.wrapper {background: rgba(154, 154, 154, .1);position: absolute;z-index: 10000;border: 1px dotted white;border-radius: 4px;transform: scale(.99);transition: 200ms ease-in-out;transform-origin: center center;cursor: pointer;}';
            style.textContent += '.wrapper:hover {background: rgba(154, 154, 154, .2);transform: scale(1.01);border: 2px solid #f47c00;margin-top: -1px;}';
            style.textContent += '.overlay {position: fixed;left:0;top:0;width: 100%;height: 100%;z-index: 20000;background-color: rgba(0, 0, 0, .7);display: flex; flex-direction: column;opacity: 1;visibility: visibility;transition: 200ms ease-in-out;}';
            style.textContent += '.overlay[hidden] {opacity: 0;visibility: hidden;}';
            style.textContent += '.content {position: absolute; top: 5%; left: 5%; width: 90%; height: 90%; background: white; color: gray; border: 1px solid rgba(234,238,250,.6); border-radius: 2px; box-shadow: 0 0 3px rgba(0,0,0,.6); font-family: -apple-system,system-ui,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;display: flex;flex-direction: column;}';
            style.textContent += '.header {display:flex;padding: 18px 12px;background-color: #f3f3f5;border-radius: 2px 2px 0 0;border-bottom: 1px solid #ddd;justify-content: flex-end;}';
            style.textContent += '.headline {color: #222;font-size: 16px;font-weight: 600;font-family: -apple-system,system-ui,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;flex:1;}';
            style.textContent += '.close {color: #999; font-family: -apple-system,system-ui,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; font-size: 30px; font-weight: 400; line-height: 10px; text-decoration: none; border: 0; cursor: pointer;background:transparent;overflow:hidden;}';
            style.textContent += '.close:hover {color: #666;}';
            style.textContent += '.inner {flex: 1;}';
            shadow.appendChild(style);

            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('wrapper');
            shadow.appendChild(this.wrapper);

            this.overlay = document.createElement('div');
            this.overlay.hidden = true;
            this.overlay.classList.add('overlay');
            shadow.appendChild(this.overlay);

            this.wrapper.addEventListener('click', () => this.openOverlay());

            window.addEventListener('resize', () => this.newPosition());
            window.addEventListener('scroll', () => this.newPosition());
            window.addEventListener('readystatechange', () => this.ready());
        }

        getIframe()
        {
            if (!this.state.config.edit) {
                return '';
            }
            return '<iframe src="' + this.state.config.edit.url + '" width="100%" height="100%" frameborder="0"></iframe>';
        }

        ready()
        {
            this.newPosition();
        }

        openOverlay()
        {
            this.content = document.createElement('div');
            this.content.classList.add('content');
            this.overlay.appendChild(this.content);

            const header = document.createElement('div');
            header.classList.add('header');
            this.content.appendChild(header);

            const headline = document.createElement('div');
            headline.textContent = this.state.config.edit.title;
            headline.classList.add('headline');
            header.appendChild(headline);

            const close = document.createElement('button');
            close.addEventListener('click', () => this.closeOverlay());
            close.textContent = '×';
            close.classList.add('close');
            header.appendChild(close);

            const inner = document.createElement('div');
            inner.classList.add('inner');
            inner.innerHTML = this.getIframe();
            this.content.appendChild(inner);
            this.overlay.hidden = false;
            document.body.style.overflow = 'hidden';

            //window.open(this.state.config.edit);
        }
        closeOverlay()
        {
            this.overlay.hidden = true;
            this.content.remove();
            setTimeout(() => location.reload(), 200);
        }

        newPosition()
        {
            if (!this.state.item) {
                return;
            }

            const item = this.state.item;

            const rect = item.getBoundingClientRect();
            const left = window.scrollX + rect.x;
            const top = window.scrollY + rect.y;

            this.wrapper.classList.add('item');
            this.wrapper.style.left = left + 'px';
            this.wrapper.style.top = top + 'px';
            this.wrapper.style.width = item.offsetWidth + 'px';
            this.wrapper.style.height = item.offsetHeight + 'px';
        }

        set config(config)
        {
            this.state.config = config;
            this.newPosition();
        }
        get config()
        {
            return this.state.config;
        }
        set item(item)
        {
            this.state.item = item;
            this.newPosition();
        }
        get item()
        {
            return this.state.item;
        }
    }

    customElements.define('aziz-overlay-item', AzizOverlayItem);

    Array.from(document.querySelectorAll('*[data-azizoverlay]'))
        .map($item => {
            const $over = new AzizOverlayItem();
            $over.config = JSON.parse($item.dataset.azizoverlay);
            $over.item = $item;
            return $over;
        })
        .map(($over) => document.body.append($over));

    document.body.append(document.createElement('div'));
})();
