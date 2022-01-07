[...document.body.children].slice(1,-1).forEach(el => el.style.visibility = 'hidden');
document.body.style.overflowY = 'hidden';

let load = setInterval(() => {
    if (document. readyState === 'complete') {
        clearInterval(load);
        document.body.style.overflowY = '';
        document.getElementsByClassName('lds-roller')[0].style.display = 'none';
        [...document.body.children].slice(1,-1).forEach(el => el.style.visibility = 'visible');
    }
},10);








function videosSlide() {
    let totalSwipped = 0, lastPositionX = 0, acceleration = 0, isAdditionalScrolling = false, 
    prevX = 0, currentX = 0, isBroken = false, movementX, interval;
    const container = document.getElementById('videosContainer');
    let boundries = container.getBoundingClientRect();
    boundries.center = boundries.left + boundries.width / 2;
    const videos = {}, zIndexList = {}, initialSize = {};
    [...document.getElementsByClassName('modelVideos')].forEach((el,i) => {videos[i] = el; initialSize[el] = el.getBoundingClientRect().width});
    const videosList = Object.values(videos);
    let zIndexListSorted = videosList;
    


    setInterval(() => {
        movementX = currentX - prevX;
        prevX = currentX;
    }, 100);// calculate movementX

    function spin(x){
        isAdditionalScrolling = false;
        totalSwipped += x - lastPositionX;
        for (const key in videos) {
            const el = videos[key];

            const limit = boundries.width - initialSize[el]
            const totalSwippedId = totalSwipped + Number(el.id.replace('modelVideo','')) * (boundries.x * 6.4 / videosList.length);// totalSwipped + gap between elements
            el.style.left = Math.sin(totalSwippedId / boundries.x) * limit * (isBroken ? .8 : 1.2) + 'px';
            
            if (videos[key].getBoundingClientRect().right > window.innerWidth) {
                isBroken = true;
            }

            let shrinkValue = limit + Math.cos(totalSwippedId / boundries.x) * limit;
            el.style.transform = 'scale(' + shrinkValue * 50 / limit + '%)';
            
            zIndexList[key] = shrinkValue;
            zIndexListSorted = Object.entries(zIndexList).sort((a,b)=>a[1]-b[1]);
            for (let i = 0; i < zIndexListSorted.length; i++) {
                document.getElementById('modelVideo' + zIndexListSorted[i][0]).style.zIndex = i;
            }
        }
        lastPositionX = x;
    }   
    spin(0);
    spin(1);
    spin(0);

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        function touchstart({touches:[{pageX:x}], target:target}) {
            if(!isOnScreen(container)) return;

            lastPositionX = x;
            currentX = x;
            prevX = x;
            clearInterval(interval);
            isAdditionalScrolling = false;

            if (target.nodeName === 'VIDEO') {
                for (const key in videos) {
                    if (videos[key] !== target) {
                        videos[key].pause();
                        videos[key].currentTime = 0;
                    }
                }
                if (target.paused) {
                    target.play();
                 } else {
                    target.pause();
                }
            return
            }
            pauseAll();
        }   document.addEventListener('touchstart',touchstart);
        function touchmove({touches:[{pageX:x}]}) {
            currentX = x;
            if(isOnScreen(container)) spin(x);
        }   document.addEventListener('touchmove',touchmove);
        function touchend() {
            if (movementX !== 0 && !movementX) return;
            if(isOnScreen(container)) additionalSpin(movementX / 10)
        }   document.addEventListener('touchend',touchend);    
    } else {
        function mousemove({pageX:x,buttons:btn}) {
            currentX = x;
            if (btn !== 1 || totalSwipped === 0) {totalSwipped++; return lastPositionX = x};
            if(isOnScreen(container)) spin(x);
        }   document.addEventListener('mousemove',mousemove);// spin videos
        function mousedown(e) {
            if(!isOnScreen(container)) return;
            
            e.preventDefault();
            isAdditionalScrolling = false;
            clearInterval(interval);
            
            if (e.target.nodeName === 'VIDEO') {
                for (const key in videos) {
                    if (videos[key] !== e.target) {
                        videos[key].pause();
                        videos[key].currentTime = 0;
                    }
                }
                if (e.target.paused) {
                    e.target.play();
                 } else {
                    e.target.pause();
                }
            return
            }
            pauseAll();
        }   document.addEventListener('mousedown',mousedown)// stop & play videos onclick
        function mouseup() {
            if(isOnScreen(container)) additionalSpin(movementX / 10)
        }   document.addEventListener('mouseup',mouseup);// continue spinning after mouse is up
    }

    function keyup() {
        if(!isOnScreen(container)) return;
        
        let temp = acceleration; // to restart it every time you click anew
        acceleration = 0; 
        additionalSpin(temp);
    }   document.addEventListener('keyup',keyup);// additional spin
    function keydown(e) {
        if(!isOnScreen(container)) return;
    
        isAdditionalScrolling = false;
        clearInterval(interval);
    
        const el = document.getElementById('modelVideo' + zIndexListSorted[zIndexListSorted.length - 1][0]);
        if (e.code === 'ArrowLeft') {
            acceleration -= .5;
            spin(lastPositionX - 10 + acceleration)
        } else if (e.code === 'ArrowRight') {
            acceleration += .5;
            spin(lastPositionX + 10 + acceleration) 
        } else if (e.code === 'Space') {
            e.preventDefault();
            for (const key in videos) {
                if (videos[key] !== el) {
                    videos[key].pause();
                    videos[key].currentTime = 0;
                }
            }
            if (el.paused) {
                el.play();
            } else {
                el.pause();
            }
            return
        }
        pauseAll();
    }   document.addEventListener('keydown',keydown);// move and play with keyboard



    function additionalSpin(energyForSpin) {
        if (isAdditionalScrolling || !energyForSpin) return clearInterval(interval);
        energyForSpin = energyForSpin || 0
        isAdditionalScrolling = true;
        energyForSpin = Math.trunc(energyForSpin);// so that it doesnt end up .4 then -.1 then .4 
        interval = setInterval(() => {
            spin(lastPositionX + energyForSpin);
            energyForSpin -= Math.sign(energyForSpin) * .5;
            if (Math.abs(energyForSpin) === 0) {
                isAdditionalScrolling = false;
                clearInterval(interval);
            }
        }, 30);
    }
    function pauseAll() {
        for (const key in videos) {
            videos[key].pause();
            videos[key].currentTime = 0;
        }
    }
}

function Textboxes() {
    function infoToRight() {
        let currentText =  textboxes.filter(el => el.style.display === 'block')[0];
        let currentTextId = Number(currentText.id.replace('text',''));
        currentText.style.display = 'none';
        textboxes[currentTextId === textboxes.length ? 0 : currentTextId].style.display = 'block';
        for (let i = 0; i < textboxes.length; i++) {
            document.getElementById(`btn${i+1}`).style.backgroundColor = '';
        }
        document.getElementById(`btn${currentTextId === textboxes.length ? 1 : ++currentTextId}`).style.backgroundColor = 'hsla(0, 0%, 0%, 0.698)';
    }
    function infoToLeft() {
        let currentText =  textboxes.filter(el => el.style.display === 'block')[0];
        let currentTextId = Number(currentText.id.replace('text',''));
        currentText.style.display = 'none';
        textboxes[currentTextId === 1 ? textboxes.length - 1 : currentTextId - 2].style.display = 'block';
        for (let i = 0; i < textboxes.length; i++) {
            document.getElementById(`btn${i+1}`).style.backgroundColor = '';
        }
        document.getElementById(`btn${currentTextId === 1 ? textboxes.length : --currentTextId}`).style.backgroundColor = 'hsla(0, 0%, 0%, 0.698)';
    }

    const textboxes = [...document.getElementsByClassName('textBox')];
    let maxHeight = 0
    for (let i = 0; i < textboxes.length; i++) {
        textboxes[i].style.display = 'block';
        textboxes[i > 0 ? i-1 : 1].style.display = 'none';
        maxHeight = Math.max(maxHeight,textboxes[i].getBoundingClientRect().height);
        document.getElementById('infoContainer').style.height = maxHeight + 'px';
    }
    
    for (let i = 0; i < textboxes.length; i++) {
        document.getElementById(`btn${i+1}`).addEventListener('click',(e) => {
            for (let i = 0; i < textboxes.length; i++) {
                textboxes[i].style.display = 'none';
                document.getElementById(`btn${i+1}`).style.backgroundColor = '';
            }
            document.getElementById(e.target.id.replace('btn','text')).style.display = 'block';
            e.target.style.backgroundColor = 'hsla(0, 0%, 0%, 0.698)';
        })
    }
    document.getElementById('btn1').click();
    document.getElementById('btn1').style.backgroundColor = 'hsla(0, 0%, 0%, 0.698)';

    document.getElementById('infoArrowRight').addEventListener('click',() => {
        infoToRight();
    });
    document.getElementById('infoArrowLeft').addEventListener('click',() => {
        infoToLeft();
    });
    document.addEventListener('keydown',(e) => {
        if (!isOnScreen(document.getElementById('infoContainer'))) return;

        if (e.code === 'ArrowLeft') {
            infoToLeft();
        } else if (e.code === 'ArrowRight') {
            infoToRight()
        }
    })
    
}

function OtherVideos() {
    const videosContainer = document.getElementsByClassName('videosContainer2')[0];
    const videoDivs = [...videosContainer.children];
    const videos = videoDivs.map(el => el.children[0]);
    const currVideo = document.getElementById('currVideo');
    
    [...document.getElementsByClassName('replace')].forEach(el => {
        el.innerHTML = el.innerHTML.replace('video','image').replace('mp4','png').replace('videos','images')
    });

    for (let i = 0; i < videos.length; i++) {
        videoDivs[i].addEventListener('click',() => {
            if (videosContainer.style.opacity === '0') return;
            videosContainer.style.opacity = '0';
            currVideo.style.display = 'flex';
            setTimeout(() => {
                const vid = document.createElement('video');
                vid.src = videos[i].src;
                vid.setAttribute('controls', true);
                currVideo.appendChild(vid);

                
                currVideo.style.opacity = '1';
            }, 2000)
        })
    }// to main menu
    
    document.addEventListener('click',(e) => {
        if(isOnScreen(videosContainer) && currVideo.children[0] && e.target.nodeName !== 'VIDEO') {
            currVideo.style.opacity = '0';
            currVideo.children[0].pause();
            setTimeout(() => {
                currVideo.style.display = 'none';
                videosContainer.style.opacity = '1';
                currVideo.innerHTML = '';
            }, 1500)
        }
    });// to video menu
}



function isOnScreen(el) {
    const viewHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);
    const box = el.getBoundingClientRect();
    if (!(box.top - viewHeight >= 0 || box.bottom < 0)) return true;
    return false
}

window.addEventListener('load', () => {videosSlide();Textboxes();OtherVideos()});
window.addEventListener('resize', () => {videosSlide();Textboxes()});