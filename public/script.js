// Started on 03/07/2025
let progressInterval = null;
let songlist = []
let songlist1 = {}
let minisong = document.querySelector(".minisong")
let showall = document.querySelector(".exp1")
let plus = document.querySelector(".plus")
let addsong = document.querySelector(".addsong")
let confirm = document.querySelector('.confirm')
let chooseimagebtn = document.querySelector('.imagebtn')
let choosesongbtn = document.querySelector('.songbtn')
let showSongname = document.querySelector('.Songname')
let showImagename = document.querySelector('.Imagename')
let imagefile = document.querySelector('.fileImg')
let songfile = document.querySelector('.fileMp3')
let songsdetails = []
let songcache = []
let ids = []
window.currentId = ''

confirm.addEventListener("click", () => {
    uploadToDatabase()
})

async function uploadToDatabase() {
    let snameInput = document.querySelector('.addsong .songName')
    let anameInput = document.querySelector('.addsong .artistName')

    let SongName = snameInput.value
    let ArtistName = anameInput.value
    let Image = imagefile.files[0]
    let Song = songfile.files[0]

    const form = new FormData()
    form.append('songname', SongName)
    form.append('artistname', ArtistName)
    form.append('img', Image)
    form.append('audio', Song)

    let response = await fetch('/upload', {
        method: 'POST',
        body: form
    })
    let res = await response.json()

    console.log(res)

    snameInput.value = ""
    anameInput.value = ""
    imagefile.value = ''
    songfile.value = ''
    chooseimagebtn.textContent = "Choose file"
    choosesongbtn.textContent = "Choose file"
    showSongname.textContent = "No File Choosen"
    showImagename.textContent = "No File Choosen"
}

chooseimagebtn.addEventListener("click", () => {
    imagefile.click()
})

choosesongbtn.addEventListener("click", () => {
    songfile.click()
})

imagefile.addEventListener("change", () => {
    let showimagename = document.querySelector('.Imagename')
    if (imagefile.files.length > 0) {
        let file = imagefile.files[0]
        showimagename.textContent = file.name
        chooseimagebtn.textContent = "Chosen"
    }
})

songfile.addEventListener("change", () => {
    let showsongname = document.querySelector('.Songname')
    if (songfile.files.length > 0) {
        let file = songfile.files[0]
        showsongname.textContent = file.name
        choosesongbtn.textContent = "Chosen"
    }
})

plus.addEventListener("click", () => {
    if (plus.classList.contains("rotated")) {
        plus.style.transform = "rotate(0deg)"
        plus.classList.remove("rotated")
        addsong.style.display = "none"
    }
    else {
        plus.style.transform = "rotate(45deg)"
        plus.classList.add("rotated")
        addsong.style.display = "flex"
    }
})

showall.addEventListener("click", () => {
    let cardcont = document.querySelector(".cardcontainer")
    if (showall.textContent === "Show All") {
        cardcont.style.flexWrap = "wrap"
        toggleShow()
        if (window.innerWidth < 450) {
            cards = cardcont.querySelectorAll(".card")
            cards.forEach((card) => {
                card.style.width = "91px"
            })
        }
    }

    else if (showall.textContent === "Show Less") {
        cardcont.style.overflowX = "scroll";
        cardcont.style.flexWrap = "nowrap";
        toggleShow()
        if (window.innerWidth < 450) {
            cards = cardcont.querySelectorAll(".card")
            cards.forEach((card) => {
                card.style.width = "120px"
            })
        }
    }

})

function toggleShow() {

    if (showall.textContent === "Show All") {
        showall.textContent = "Show Less"
    }
    else if (showall.textContent === "Show Less") {
        showall.textContent = "Show All"
    }
}

async function getdetails() {
    let response = await fetch('/getmeta')
    let Meta = await response.json()
    return Meta
}

async function main() {
    let Meta = await getdetails()
    Meta.forEach(songdetail => {
        let songname = songdetail.SongName
        let artistname = songdetail.ArtistName
        let id = songdetail.id
        let imgbase64 = songdetail.Image.data
        let imgContentType = songdetail.Image.contentType
        let imgsrc = `data:${imgContentType};base64,${imgbase64}`

        ids.push(id)

        songsdetails[id] = {
            Imagesrc: imgsrc,
            SongName: songname,
            ArtistName: artistname,
        }

        // for table content
        const ul = document.querySelector(".songlist ul");
        let li = document.createElement("li");
        let title = `${songname} - ${artistname}`
        li.innerText = title
        li.dataset.songurl = id
        ul.appendChild(li)

        // for cards content
        let cardcont = document.querySelector('.cardcontainer')
        let div = document.createElement("div")
        div.innerHTML = `<div class="card">
                            <div class="img">
                                <img src="${imgsrc}" alt="">
                                <span class="playbtn flex justify-center align-center">
                                    <img src="items/playButton.svg" alt="">
                                </span>
                            </div>
                            <div class="sname" data-songurl="${id}">${songname}</div>
                            <div class="aname">${artistname}</div>
                        </div>`
        cardcont.appendChild(div)

    })

    let lis = Array.from(document.querySelector(".songlist ul").children)
    lis.forEach(li => {
        li.addEventListener('click', function () {
            let id = this.dataset.songurl
            fetchsong(id)
        })
    })

    let cards = Array.from(document.querySelector('.cardcontainer').children)
    cards.forEach(card => {
        let playbtn = card.querySelector('.playbtn')
        playbtn.addEventListener('click', async function () {
            let sname = card.querySelector('.sname')
            let id = sname.dataset.songurl
            fetchsong(id)
        })
    })
}
main();

async function fetchsong(id) {
    if (!songcache[id]) {
        console.log("fetching song");
        let response = await fetch(`/getsong/${id}`)
        let audioBlob = await response.blob()
        let songsrc = URL.createObjectURL(audioBlob)
        songcache[id] = songsrc;
        console.log('Song is fetched');
    } else {
        console.log("available in cache");
    }
    setupAudio(songcache[id], id)
}

function setUpMiniCard(id) {
    console.log(songlist1);
    let { Imagesrc, SongName, ArtistName } = songsdetails[id]
    minisong.innerHTML =
        `<img src=${Imagesrc} alt="">
        <div class="names">
            <div class="sname">${SongName}</div>
            <div class="aname">${ArtistName}</div>
        </div>`
}

playPause = document.getElementById("playPause");

function toggleSong() {
    if (!window.currentSong.paused) {
        window.currentSong.pause();
        updateProgress()
    } else {
        window.currentSong.play();
        updateProgress()
    }
}

function toggleUi() {
    if (playPause.classList.contains("fa-circle-pause")) {
        playPause.classList.replace("fa-circle-pause", "fa-circle-play");
    }
    else {
        playPause.classList.replace("fa-circle-play", "fa-circle-pause");
    }
}

let progress = document.getElementById("progress");
let animationFrameId = null

function orgtime(secs) {
    let mins = Math.floor(secs / 60)
    let sec = Math.floor(secs % 60)

    let paddedsec = sec < 10 ? `0${sec}` : sec
    return `${mins}:${paddedsec}`;
}

function updateProgress() {
    let currenttime = document.querySelector(".currenttime")
    let maxtime = document.querySelector(".maxtime")

    progressInterval = setInterval(() => {
        progress.max = window.currentSong.duration;
        progress.value = window.currentSong.currentTime;

        let ctime = window.currentSong.currentTime;
        let mtime = window.currentSong.duration;

        let progTime = orgtime(ctime)
        let totalTime = orgtime(mtime)

        currenttime.textContent = progTime;
        maxtime.textContent = totalTime;


        const percentage = (progress.value / progress.max) * 100;
        progress.style.background = `linear-gradient(to right, white 0%, white ${percentage}%, #4d4d4d ${percentage}%)`;
    }, 30);
}

function setupAudio(url, id) {
    if (window.currentSong && !window.currentSong.paused) {
        window.currentSong.pause();
        clearInterval(progressInterval);
        progress.value = 0;
    }

    window.currentSong = new Audio(url);
    window.currentId = id
    console.log(currentId);
    setUpMiniCard(id);
    window.currentSong.play().then(() => {

        playPause.classList.replace("fa-circle-play", "fa-circle-pause");
        updateProgress()
    }).catch((err) => {
        console.warn("Audio play failed :" + err)
    })

    window.currentSong.addEventListener("ended", function () {
        clearInterval(progressInterval);
        progress.value = 0;
        percentage = 0;
        progress.style.background = `linear-gradient(to right, white 0%, white ${percentage}%, #4d4d4d ${percentage}%)`;
        playPause.classList.replace("fa-circle-pause", "fa-circle-play");
    });
}

let nextel = document.querySelector(".next")
let prevel = document.querySelector(".prev")

nextel.addEventListener("click", () => {

    if (currentSong === null) {
        console.log("Please start song first");
    }
    else {

        next()
    }
})

prevel.addEventListener("click", () => {

    if (currentSong === null) {
        console.log("Please start song first");
    }
    else {

        prev()
    }
})

async function next() {
    let i = ids.indexOf(window.currentId)
    if (i === ids.length-1) {
        i = 0
        let newid = ids[i]
        fetchsong(newid)
    }else{
        let newid = ids[i + 1]
        fetchsong(newid)
    }
}

async function prev() {
    let i = ids.indexOf(window.currentId)
    if (i === 0) {
        i = ids.length - 1
        let newid = ids[i]
        fetchsong(newid)
    } else {
        let newid = ids[i - 1]
        fetchsong(newid)
    }
}

progress.addEventListener("input", () => {
    currentSong.currentTime = progress.value;
});