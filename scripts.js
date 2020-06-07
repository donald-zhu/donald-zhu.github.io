document.querySelector('.fullscreen').style.display = 'none';
class Slide {
    constructor() {
        this.pgList = Array.from(
            document.querySelectorAll('.holder .page'))
        this.current = 0;
        this.currentPg = () => this.pgList[this.current]
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
        document.body.style.color = '#e8968b';
        document.body.style.backgroundColor = 'white';
        this.change(0);
        this.entered = true;
        this.display('.title-page', 'none',
            '.fullscreen', '',
            '.loading', 'flex');
        loader.enter()
    }
    change(increment) {
        if (this.current == 0 && increment < 0) return;
        this.current += increment;
        for (const obj in this.adjustCallback) {
            this.adjust(this.adjustCallback[obj]);
        }
        pc4Cursor();
    }
    adjust(obj) {
        const validation = obj.not ? (hasClass(obj.className) &&
                !hasClass(obj.not) ? true : false) :
            (hasClass(obj.className) ? true : false);
        let arg = validation ? obj.matched : obj.noMatch;
        if (!arg) {
            if (!validation) return;
            arg = [null, null]
        }
        this[obj.className](...arg);
    }
    display(...args) {
        const itr = args.length / 2;
        for (let i = 0; i < itr; i++) {
            const elem = args.shift(),
                style = args.shift();
            if (style === undefined) return;
            if (typeof elem == 'string') {
                document.querySelector(elem).style.display = style;
            } else if (typeof elem == 'object') {
                elem.style.display = style;
            }
        }
    }
    page() {
        this.display(cp(),
            hasClass('image') ? 'flex' : 'block')
        if (hasClass('image') && !hasClass('ft-holder') &&
            !cp().querySelector('img').getAttribute('src').includes('hiRes')) {}
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
    }
    imgSize(img, w) {
        if (w >= window.innerWidth) {
            img.style.height = 'auto';
            img.style.width = '100vw';
        }
    }
    video() {
        cp().querySelector('video').play();
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
                        if (currentFt.remind()) prevent = true;
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
        this.lastPage = lastPage;
        this.dom = document.getElementById(`${this.pcNum}-ft`);
        this.flipped;
        this.reminded;
        this.currentPgNum = 1;

    }
    remind() {
        if (!this.flipped && !this.reminded) {
            slide.display(`#${this.pcNum}-arrow_l`,
                'none', `#${this.pcNum}-reminder`, 'block')
            this.reminded = true;
            return true;
        }
    }
    startFlip() {
        slide.display(`#${this.pcNum}-arrow_l`, 'none',
            `#${this.pcNum}-reminder`, 'none');
        this.dom.style.transform = 'rotate(0)';
        this.flip(1);
        this.flipped = true;
        this.cursor();
    }
    flip(direction) {
        if (!(direction < 0 &&
                this.currentPgNum == 1) && !(direction > 0 &&
                this.currentPgNum == this.lastPage)) {
            this.currentPgNum += direction
        }
        if (this.pcNum == 'pc3') {
            this.dom.style.cursor =
                `-webkit-image-set(url(cursor/${
                        (this.clickP - this.left) < this.half ? 'prev' : 'next'
                    }_${!!this.blue.find(n => n == this.currentPgNum) ? 'bl' : 'yt'}.svg) 2.5x) 20 20,
                    ${(this.clickP - this.left) < this.half ? 
                        'w-resize' : 'e-resize'}`
        }
        if (this.pcNum == 'pc6') this.frenchFold();
        this.dom.setAttribute('src', `images/${this.pcNum}/fullbook/f${this.currentPgNum}.jpg`);
    }
    cursor() {
        const left = () => this.dom.getBoundingClientRect().left,
            right = () => this.dom.getBoundingClientRect().right,
            half = () => (right() - left()) / 2,
            position = e => (e.pageX - left()) < half();
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

class Loader {
    constructor() {
        this.cursor = ['cursor/auto_yt.svg', 'cursor/next_yt.svg']
        this.essentials = [];
        this.others = [];
        this.vidArr = ['images/pc5/5.mp4', 'images/pc5/6.mp4'];
        this.svg = ['auto', 'next', 'prev', 'replay'];
        this.essDiv = document.getElementById('essentials-loader');
        this.otherDiv = document.getElementById('others-loader');
        this.numLoaded = 0;
        this.precentage = 0;
        this.notLoaded = [];
        this.int;
    }
    populateEssentials() {
        for (let i = 0; i < this.svg.length; i++) {
            this.essentials.push(`cursor/${this.svg[i]}_clr.svg`, `cursor/${this.svg[i]}_yt.svg`)
        }
        for (let i = 0; i < 2; i++) this.essentials.splice(this.essentials.indexOf(this.cursor[i]), 1)
        this.essentials.push('cursor/next_bl.svg', 'cursor/prev_bl.svg');
        const imgCount = [13, 1, 11, 8];
        for (let i = 0; i < imgCount.length; i++) {
            for (let ii = 0; ii < imgCount[i]; ii++) {
                this.essentials.push(`images/pc${i + 1}/${ii + 1}.jpg`)
            }
        }
        for (let i = 0; i < 3; i++) {
            const n = ftPc[i];
            for (let ii = 0; ii < pageAmt[i]; ii++) {
                this.essentials.push(`images/pc${n}/fullbook/f${ii + 1}.jpg`)
            }
            this.essentials.push(`images/pc${n}/fullbook/f1_hover.jpg`)
        }
        for (let i = 0; i < 27; i++) {
            this.essentials.push(`images/pc6/fullbook/frenchFold/ff${i + 1}.jpg`)
        }
    }
    populateOthers() {
        const imgCount = [4, 12, 6];
        for (let i = 0; i < imgCount.length; i++) {
            for (let ii = 0; ii < imgCount[i]; ii++) {
                this.others.push(`images/pc${i + 5}/${ii + 1}.jpg`)
            }
        }
        for (let i = 0; i < 17; i++) {
            this.others.push(`pc4/${i + 1}.svg`)
        }
    }
    preload(arr, dom) {
        for (let i = 0; i < arr.length; i++) {
            const src = arr[i],
                img = new Image();
            img.src = src;
            dom.appendChild(img);
        }
    }
    log() {
        for (let i = 0; i < this.essDiv.length; i++) {
            if (this.essDiv[i].complete) {
                this.numLoaded += 1;
            } else {
                this.essDiv[i].onload = () => this.numLoaded += 1;
            }
        }
    }
    update() {
        const img = Array.from(this.essDiv.children);
        this.notLoaded = img.filter(n => !n.complete);
        this.numLoaded = 270 - this.notLoaded.length
        this.precentage = this.numLoaded == 270 ? 100 : ((this.numLoaded / 309) * 100).toFixed(1);
        document.querySelector('.loading-text').innerHTML = this.precentage + '%';
    }
    videoLoad() {
        for (let i = 0; i < 2; i++) {
            const vid = document.createElement('video');
            vid.src = `images/pc5/${i + 5}.mp4`;
            document.getElementById('video-loader').appendChild(vid);
        }
    }
    initialize() {
        this.preload(this.cursor, this.otherDiv)
        this.populateEssentials();
        this.preload(this.essentials, this.essDiv)
    }
    enter() {
        document.body.style.pointerEvents = 'none';
        this.populateOthers();
        this.log()
        this.update();
        this.int = setInterval(() => {
            this.update();
            if (this.precentage == 100) {
                slide.display('.loading', 'none')
                document.body.style.pointerEvents = 'auto';
                this.preload(this.others, this.otherDiv)
                this.videoLoad();
                clearInterval(this.int);
            }
        }, 100)

    }
}

const slide = new Slide(),
    flipThrough = new FlipThrough(),
    chldnH = (parent) => {
        const top = parent.firstElementChild.getBoundingClientRect().top,
            bottom = parent.lastElementChild.getBoundingClientRect().bottom;
        return bottom - top
    },
    cp = slide.currentPg,
    hasClass = className => cp().classList.contains(className);

function pc4Cursor() {
    if (cp().parentElement.id == 'pc4' &&
        hasClass('image') &&
        !pc4Cursor.int) {
        pc4Cursor.n = 1;
        cursorHelper = false;
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
}

//flipThrough
const ft = {
        pc1,
        pc3,
        pc6
    },
    ftPc = [1, 3, 6],
    pageAmt = [116, 44, 39]
for (let i = 0; i < 3; i++) {
    ft[`pc${ftPc[i]}`] = new FlipThrough(ftPc[i], pageAmt[i]);
    ft[`pc${ftPc[i]}`].hover()
}
ft.pc3.blue = [2, 3, 5, 9, 11, 13, 15, 19, 27, 37, 38, 39, 40, 41];
ft.pc6.index = [7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 37, 38];
ft.pc6.frenchFold = function () {
    const ff = document.getElementById('ff'),
        fullscreen = () => window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height),
        match = () => !!this.index.find(elem => elem == this.currentPgNum);
    this.dom.style.left = match() ? (fullscreen() ?
        '5vw' : '10vw') : '';
    ff.style.right = fullscreen() ? '5vw' : '10vw';
    ff.style.display = match() ? 'block' : 'none';
    if (match()) {
        const i = this.index.findIndex(elem => elem == this.currentPgNum);
        ff.setAttribute('src', `images/pc6/fullbook/frenchFold/ff${i + 1}.jpg`)
    }
    document.getElementById('ff-text').style.display = this.match() ? 'block' : 'none';
}

const evthandler = new Events();
evthandler.initialize();

const loader = new Loader();
loader.initialize();