class Slide {
    constructor() {
        this.pgList = Array.from(
            document.querySelectorAll('.holder .page'))
        this.current = 0;
        this.currentPg = () => this.pgList[this.current]
        this.obstruct = false;
        this.entered;
    }
    enter() {
        evthandler.fullscreen();
        this.display('.title-page', 'none');
        document.body.style.color = '#e8968b';
        document.body.style.backgroundColor = 'white';
        this.change(0);
        this.entered = true;
        this.display('.fullscreen', '');
    }
    change(increment) {
        if (this.current == 0 && increment < 0) {
            return
        }
        if (slide.obstruct) {
            this.obstruct = false;
            return
        }
        this.current += increment;
        this.displayAdjust();
        this.captionAdjust()
        this.imgAdjust();
        this.videoPlay();
        this.endpage();
        pc4Cursor();
    }
    displayAdjust() {
        this.display(this.currentPg(),
            this.currentPg().classList.contains('image') ? 'flex' : 'block')
        for (let i = 0; i < this.pgList.length; i++) {
            const page = this.pgList[i];
            if (i !== this.current) {
                this.display(page, 'none')
            }
        }
    }
    captionAdjust() {
        const adjust = (overflow, ch) => {
            document.body.style.overflow = overflow;
            if (ch) {
                const top = this.currentPg().firstElementChild.getBoundingClientRect().top,
                    bottom = this.currentPg().lastElementChild.getBoundingClientRect().bottom;
                this.currentPg().style.height = `${bottom - top}px`;
            }
        }
        this.currentPg().classList.contains('text') ?
            adjust('auto', true) : adjust('hidden', false)
    }
    imgAdjust() {
        if (this.currentPg().classList.contains('image')) {
            const img = this.currentPg().querySelector('img'),
                w = img ? parseFloat(getComputedStyle(img).width) : null;
            if (w >= window.innerWidth) {
                img.style.height = 'auto';
                img.style.width = '100vw';
            }
        }
    }
    videoPlay() {
        if (this.currentPg().classList.contains('video')) {
            const vid = this.currentPg().querySelector('video');
            vid.autoplay = true;
            vid.play();
        }
    }
    display(elem, style) {
        if (typeof elem == 'string') {
            document.querySelector(elem).style.display = style;
        } else if (typeof elem == 'object') {
            elem.style.display = style;
        }
    }
    endpage() {
        if (this.currentPg().classList.contains('end-page')) {
            document.body.style.backgroundColor = '#e8968b';
            document.body.style.color = 'white';
            this.display('.fullscreen', 'none');
        } else {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = '#e8968b';
            this.display('.fullscreen', '');
        }

    }
}

const windowPosition = e => e.pageX < (window.innerWidth / 2)
let cursorHelper = true;
class Events {
    constructor() {
        this.click = [
            ['.enter', () => slide.enter()],
            ['body', e => {
                let ft;
                if (slide.currentPg().classList.contains('ft-holder')) {
                    const pcNum = slide.currentPg().id.replace('ft-holder', '');
                    if (e.target.classList.contains('ft') && !collection[pcNum].flipped) {
                        collection[pcNum].startFlip();
                    } else {
                        collection[pcNum].remind();
                    }
                }
                if (e.target.tagName == 'VIDEO' ||
                    e.target.classList.contains('ft') ||
                    e.target.classList.contains('fullscreen') ||
                    e.target == document.querySelector('#pc2 .image img') ||
                    e.target == document.querySelector('#pc2text .text-indent') ||
                    e.target == document.querySelector('.instagram')) {
                    e.stopPropagation();
                    ft = true
                }
                if (slide.entered && !ft &&
                    !slide.currentPg().classList.contains('end-page')) {
                    slide.change(windowPosition(e) ?
                        -1 : 1)
                } else if (slide.currentPg().classList.contains('end-page')) {
                    slide.change(-1)
                }

            }],
            ['.fullscreen', this.fullscreen],
            ['#video-1', () => {
                document.getElementById('video-1').currentTime = 0;
                document.getElementById('video-1').play();
            }],
            ['#video-2', () => {
                document.getElementById('video-2').currentTime = 0;
                document.getElementById('video-2').play();
            }],
            ['#pc2 .image img', () => {
                window.open("https://www.thepoorimage.com");
            }],
            ['#pc2text .text-indent', () => {
                window.open("https://www.thepoorimage.com");
            }],
            ['.restart', () => {
                location.reload();
            }],
            ['.instagram', () => {
                window.open("https://www.instagram.com/donaldzhu.graphics/");
            }]
        ];
        this.mousemove = [
            ['body', e => {
                if (!cursorHelper) {
                    return
                }
                if (!slide.currentPg().classList.contains('end-page')) {
                    document.body.style.cursor = `-webkit-image-set(url(cursor/${
                    windowPosition(e) ? 'prev' : 'next'}_clr.svg) 2.5x) 20 20, ${
                    windowPosition(e) ? 'w-resize' : 'e-resize'}`;
                } else {
                    document.body.style.cursor = `-webkit-image-set(url(cursor/prev_clr.svg) 2.5x) 20 20, w-resize`;
                }
            }]
        ]
    }
    fullscreen() {
        const validate = condition => {
            if (document.documentElement[`${condition}Fullscreen`]) {
                document.documentElement[`${condition}Fullscreen`]()
            }
        };
        const conditions = ['request', 'mozRequest', 'webkitRequest', 'msRequest'];
        for (let i = 0; i < conditions.length; i++) {
            validate(conditions[i])
        }
        const ffDisplay = document.getElementById('ff-text').style.display;
        if (ffDisplay == 'block') {
            console.log('hi')
            document.getElementById('pc6-ft').style.left = '5vw';
            document.getElementById('ff').style.right = '5vw';
        }
    }
    addEvt(elem, evt, callback) {
        if (typeof elem == 'string') {
            document.querySelector(elem).addEventListener(evt, callback)
        } else if (typeof elem == 'object') {
            elem.addEventListener(evt, callback)
        }
    }
    initialize() {
        for (let events in evthandler) {
            const handlers = evthandler[events];
            for (let i = 0; i < handlers.length; i++) {
                const h = handlers[i]
                this.addEvt(h[0], events, h[1]);
            }
        }
    }
}

class FlipThrough {
    constructor(ftNum, lastPage) {
        this.pcNum = `pc${ftNum}`
        this.dom = document.getElementById(`${this.pcNum}-ft`);
        this.flipped;
        this.reminded;
        this.currentPgNum = 1;
        this.lastPage = lastPage;
    }
    remind() {
        if (!this.flipped && !this.reminded) {
            slide.display(`#${this.pcNum}-arrow_l`, 'none')
            slide.display(`#${this.pcNum}-reminder`, 'block')
            this.reminded = true;
            slide.obstruct = true
        }
    }
    startFlip() {
        this.flip(1);
        const left = () => this.dom.getBoundingClientRect().left;
        const right = () => this.dom.getBoundingClientRect().right;
        const half = () => (right() - left()) / 2
        const position = e => (e.pageX - left()) < half();
        this.dom.addEventListener('click', e => {
            if (this.pcNum == 'pc3') {
                this.clickP = e.pageX;
                this.left = left();
                this.half = half();
            }
            this.flip(position(e) ? -1 : 1);
        })
        this.dom.addEventListener('mousemove', e => {
            this.dom.style.cursor =
                `-webkit-image-set(url(cursor/${
                    position(e) ? 'prev' : 'next'}_${
                        this.pcNum == 'pc3'? (!!this.blue.find(n => n == this.currentPgNum) ?
                         'bl' : 'yt') : 'yt'
                        }.svg) 2.5x) 20 20, ${position(e) ? 
                    'w-resize' : 'e-resize'}`;
        })
    }
    flip(direction) {
        slide.display(`#${this.pcNum}-arrow_l`, 'none');
        slide.display(`#${this.pcNum}-reminder`, 'none');
        this.flipped = true;
        slide.obstruct = false;
        this.dom.style.transform = `rotate(${
            this.currentPgNum == 1 ? 0 : 20})`
        if (!(direction < 0 &&
                this.currentPgNum == 1) && !(direction > 0 &&
                this.currentPgNum == this.lastPage)) {
            this.currentPgNum += direction
        }
        if (this.pcNum == 'pc6') {
            this.frenchFold();
        }
        if (this.pcNum == 'pc3') {
            this.dom.style.cursor =
                `-webkit-image-set(url(cursor/${
                        (this.clickP - this.left) < this.half ? 'prev' : 'next'
                    }_${!!this.blue.find(n => n == this.currentPgNum) ? 'bl' : 'yt'}.svg) 2.5x) 20 20,
                    ${(this.clickP - this.left) < this.half ? 
                        'w-resize' : 'e-resize'}`
        }
        this.dom.setAttribute('src', `images/${this.pcNum}/fullbook/lowRes/f${this.currentPgNum}.jpg`);
        this.dom.setAttribute('src', `images/${this.pcNum}/fullbook/f${this.currentPgNum}.jpg`);
    }
    hover() {
        const dom = $(`#${this.pcNum}-ft`);
        dom.hover(() => {
            if (!this.flipped) {
                dom[0].setAttribute('src', `images/${this.pcNum}/fullbook/f1_hover.jpg`)
            }
        }, () => {
            if (!this.flipped) {
                dom[0].setAttribute('src', `images/${this.pcNum}/fullbook/f1.jpg`)
            }
        })
    }
}

const slide = new Slide(),
    ft = new FlipThrough(),
    collection = {
        pc1,
        pc3,
        pc6
    },
    evthandler = new Events();
for (let i = 0; i < 3; i++) {
    const ftNum = [1, 3, 6][i],
        lastPage = [116, 44, 39][i]
    collection[`pc${ftNum}`] = new FlipThrough(ftNum, lastPage);
    collection[`pc${ftNum}`].hover()
}
collection.pc3.blue = [2, 3, 5, 9, 11, 13, 15, 19, 27, 37, 38, 39, 40, 41];
evthandler.initialize();

function pc4Cursor() {
    if (slide.currentPg().parentElement.id == 'pc4' &&
        slide.currentPg().classList.contains('image')) {
        if (!pc4Cursor.int) {
            pc4Cursor.n = 1;
            pc4Cursor.changeCursor = () => {
                const style = `-webkit-image-set(url(pc4/${pc4Cursor.n}.svg) 2x) 5 5, auto`
                document.querySelector('body').style.cursor = style;
                cursorHelper = false;
            }
            pc4Cursor.changeCursor();
            pc4Cursor.int = setInterval(() => {
                pc4Cursor.n += 1;
                if (pc4Cursor.n > 17) {
                    pc4Cursor.n = 1;
                }
                pc4Cursor.changeCursor()
            }, 1000)
        }
    } else {
        clearInterval(pc4Cursor.int);
        pc4Cursor.int = null;
        cursorHelper = true
    }
}

collection.pc6.frenchFold = function () {
    this.index = [7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 37, 38];
    this.ff = document.getElementById('ff');
    this.fullscreen = () => window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height);
    this.match = () => !!this.index.find(elem => elem == this.currentPgNum);
    this.dom.style.left = this.match() ? (this.fullscreen() ?
        '5vw' : '10vw') : '';
    this.ff.style.right = this.fullscreen() ? '5vw' : '10vw';
    this.ff.style.display = this.match() ? 'block' : 'none';
    if (this.match()) {
        const i = this.index.findIndex(elem => elem == this.currentPgNum);
        this.ff.setAttribute('src', `images/pc6/fullbook/frenchFold/ff${i + 1}.jpg`)
    }
    document.getElementById('ff-text').style.display = this.match() ? 'block' : 'none';
}

slide.display('.fullscreen', 'none');