class Slide {
    constructor() {
        this.pgList = Array.from(
            document.querySelectorAll('.holder .page'))
        this.current = 0;
        this.currentPg = () => this.pgList[this.current]
        this.obstruct = false;
        this.entered;
        this.adjustCallback = {
            page: {
                className: 'page',
            },
            text: {
                className: 'text',
                matched: ['auto', true],
                noMatch: ['hidden', false]
            },
            image: {
                className: 'image',
                not: 'video',
            },
            video: {
                className: 'video'
            },
            endpage: {
                className: 'endpage',
                matched: [true, 'none'],
                noMatch: [false, '']
            }
        }
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
        if (this.current == 0 && increment < 0) return;
        if (slide.obstruct) {
            this.obstruct = false;
            return
        }
        this.current += increment;
        for (const obj in this.adjustCallback) {
            this.adjust(this.adjustCallback[obj]);
        }
        pc4Cursor();
    }
    adjust(obj) {
        const validation = obj.not ? (cp().classList.contains(obj.className) &&
                !cp().classList.contains(obj.not) ? true : false) :
            (cp().classList.contains(obj.className) ? true : false);
        let arg = validation ? obj.matched : obj.noMatch;
        if (!arg) {
            if (!validation) return;
            arg = [null, null]
        }
        this[obj.className](...arg);
    }
    display(elem, style) {
        if (typeof elem == 'string') {
            document.querySelector(elem).style.display = style;
        } else if (typeof elem == 'object') {
            elem.style.display = style;
        }
    }
    page() {
        this.display(cp(),
            cp().classList.contains('image') ? 'flex' : 'block')
        for (let i = 0; i < this.pgList.length; i++) {
            const page = this.pgList[i];
            if (i !== this.current &&
                page.style.display !== 'none') {
                this.display(page, 'none')
            }
        }
    }
    text(overflow, captionHeight) {
        document.body.style.overflow = overflow;
        if (captionHeight) {
            const h = chldnH(cp());
            cp().style.height = h + 'px';
        }
    }
    image() {
        const id = cp().parentElement.id,
            img = cp().querySelector('img'),
            w = parseFloat(getComputedStyle(img).width);
        this.imgSize(img, w);
        this.imgRes(id, img);
    }
    imgSize(img, w) {
        if (w >= window.innerWidth) {
            img.style.height = 'auto';
            img.style.width = '100vw';
        }
    }
    imgRes(id, img) {
        const siblings = Array.from(cp().parentElement.getElementsByClassName('image'));
        if (siblings[siblings.length - 1].classList.contains('ft-holder')) {
            siblings.pop();
        }
        const imgNum = siblings.findIndex(n => n === cp()) + 1,
            src = `images/${id}/hiRes/${imgNum}.jpg`;
        if (img.getAttribute !== src && imgNum !== 0) {
            if (!cp().classList.contains('ft-holder')) {
                loading('show')
            }
            const callback = () => {
                img.setAttribute('src', src);
            }
            resolution(img, callback, img.complete, 'onload')
        }
    }
    video() {
        const vid = cp().querySelector('video'),
            ready = () => vid.readyState === 4;
        loading('flex');
        resolution(vid, () => {
            vid.currentTime = 1;
            vid.play();
        }, ready, 'oncanplaythrough')
    }
    endpage(negative, fullscreen) {
        document.body.style.backgroundColor = negative ? '#e8968b' : 'white';
        document.body.style.color = negative ? 'white' : '#e8968b';
        this.display('.fullscreen', fullscreen)
    }
}

const windowPosition = e => e.pageX < (window.innerWidth / 2)
let cursorHelper = true;
class Events {
    constructor() {
        this.click = [
            ['.enter', () => slide.enter()],
            ['body', e => {
                let prevent;
                if (hasClass('ft-holder')) {
                    let currentFt = ft[cp().id.replace('ft-holder', '')]
                    if (e.target.classList.contains('ft') && !currentFt.flipped) {
                        currentFt.startFlip();
                    } else {
                        currentFt.remind();
                    }
                }
                if (e.target.classList.contains('prevent-click')) {
                    prevent = true
                }
                if (slide.entered && !prevent) {
                    slide.change(windowPosition(e) ?
                        -1 : 1)
                }
            }],
            ['.fullscreen', () => {
                this.fullscreen();
                if (document.getElementById('ff-text').style.display == 'block') {
                    document.getElementById('pc6-ft').style.left = '5vw';
                    document.getElementById('ff').style.right = '5vw';
                }
            }],
            [Array.from(document.getElementsByTagName('video')), e => {
                e.currentTarget.currentTime = 1;
                e.currentTarget.play()
            }],
            ['.endpage', () => {
                slide.change(-1)
            }],
            ['.restart', () => {
                slide.current = 0;
                slide.change(0);
            }],
            [Array.from(document.getElementsByClassName('pc2-click')), () => {
                window.open("https://www.thepoorimage.com")
            }],
            ['.instagram', () => {
                window.open("https://www.instagram.com/donaldzhu.graphics/");
            }]
        ];
        this.mousemove = [
            ['body', e => {
                if (!cursorHelper) return
                if (!hasClass('endpage')) {
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
    }
    addEvt(elem, evt, callback) {
        if (Array.isArray(elem)) {
            for (let i = 0; i < elem.length; i++) {
                elem[i].addEventListener(evt, callback)
            }
        } else if (typeof elem == 'string') {
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
        slide.display('.loading', 'flex')
        if (this.dom.complete) {
            this.dom.setAttribute('src', `images/${this.pcNum}/fullbook/f${this.currentPgNum}.jpg`)
            slide.display('.loading', 'none')
        } else {
            this.dom.onload = () => {
                this.dom.setAttribute('src', `images/${this.pcNum}/fullbook/f${this.currentPgNum}.jpg`)
                slide.display('.loading', 'none')
            }
        }
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
    flipThrough = new FlipThrough();
//flipThrough
const ft = {
        pc1,
        pc3,
        pc6
};
    ftPc = [1, 3, 6],
    pageAmt = [116, 44, 39]
for (let i = 0; i < 3; i++) {
    ft[`pc${ftPc[i]}`] = new FlipThrough(ftPc[i], pageAmt[i]);
    ft[`pc${ftPc[i]}`].hover()
}
ft.pc3.blue = [2, 3, 5, 9, 11, 13, 15, 19, 27, 37, 38, 39, 40, 41];

const evthandler = new Events();
evthandler.initialize();

const chldnH = (parent) => {
        const top = parent.firstElementChild.getBoundingClientRect().top,
            bottom = parent.lastElementChild.getBoundingClientRect().bottom;
        return bottom - top
    },
    cp = slide.currentPg,
    loading = style => {
        slide.display('.loading', (style == 'show' ? 'flex' : 'none'))
    },
    hasClass = className => cp().classList.contains(className);

function resolution(img, callback, complete, load) {
    const check = cb => {
        if (complete) {
            cb()
        } else {
            img[load] = () => cb()
        }
    }
    check(() => {
        callback();
        check(loading)
    })
}

function pc4Cursor() {
    if (cp().parentElement.id == 'pc4' &&
        hasClass('image') &&
        !pc4Cursor.int) {
        pc4Cursor.n = 1;
        pc4Change()
        pc4Cursor.int = setInterval(() => {
            pc4Cursor.n = pc4Cursor.n <= 17 ? (pc4Cursor.n + 1) : 1;
            pc4Change()
        }, 1000)
    } else {
        clearInterval(pc4Cursor.int);
        pc4Cursor.int = null;
        cursorHelper = true;
    }
}

function pc4Change() {
    const style = `-webkit-image-set(url(pc4/${pc4Cursor.n}.svg) 2x) 5 5, auto`
    document.querySelector('body').style.cursor = style;
    cursorHelper = false;
}

ft.pc6.frenchFold = function () {
    this.index = [7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 37, 38];
    this.ff = document.getElementById('ff');
    this.fullscreen = () => window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height);
    this.match = () => !!this.index.find(elem => elem == this.currentPgNum);
    this.dom.style.left = this.match() ? (this.fullscreen() ?
        '5vw' : '10vw') : '';
    this.ff.style.right = this.fullscreen() ? '5vw' : '10vw';
    this.ff.style.display = this.match() ? 'block' : 'none';
    slide.display('.loading', 'flex')
    if (this.match()) {
        const i = this.index.findIndex(elem => elem == this.currentPgNum);
        this.ff.setAttribute('src', `images/pc6/fullbook/frenchFold/lowRes/ff${i + 1}.jpg`)
        if (this.ff.complete) {
            this.ff.setAttribute('src', `images/pc6/fullbook/frenchFold/ff${i + 1}.jpg`)
            slide.display('.loading', 'none')
        } else {
            this.ff.onload = () => this.ff.setAttribute('src', `images/pc6/fullbook/frenchFold/ff${i + 1}.jpg`);
            slide.display('.loading', 'none')
        }
    }
    document.getElementById('ff-text').style.display = this.match() ? 'block' : 'none';
}

slide.display('.fullscreen', 'none');
$.fn.preload = function () {
    this.each(function () {
        $('<img>')[0].src = this;
    })
    console.log('all loaded')
}
const imgArr = [
    'cursor/auto_yt.svg', 'cursor/next_yt.svg',
    'cursor/prev_clr.svg', 'cursor/next_clr.svg'
];
for (let i = 0; i < 3; i++) {
    const pa = pageAmt[i];
    const n = ftPc[i]
    for (let i = 0; i < pa; i++) {
        imgArr.push(`images/pc${n}/fullbook/f${i + 1}.jpg`)
        imgArr.push(`images/pc${n}/fullbook/f1_hover.jpg`);
    }
}
$(imgArr).preload();