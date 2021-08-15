'use strict'


console.log('test');

var gCanvas;
var gCtx;
let gStartPos

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']



function onInit() {
  gCanvas = document.getElementById('my-canvas')
  gCtx = gCanvas.getContext('2d')
  renderImgs();
  renderMems()
  addListeners()
}

function onToggleMenu() {
  document.body.classList.toggle('opened');
}

function renderImgs() {
  var strHTML = getImgStr()
  document.querySelector('.mems').innerHTML = strHTML
}

function renderMems() {
  var memes = loadMemes()
  if (!memes) return

  var strHTMLs = memes.map(meme => {
    return `
              <img src="${meme.img}">
      `
  })
  var strHTML = strHTMLs.join('')
  document.querySelector('.memes-display').innerHTML = strHTML
}

function onOpenCanvas(imgIdx) {
  openEditorPage()
  createMeme(imgIdx)
  renderCanvas()

}


function addListeners() {
  addMouseListeners()
  addTouchListeners()
}

function addMouseListeners() {
  gCanvas.addEventListener('mousemove', onMove)
  gCanvas.addEventListener('mousedown', onDown)
  gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gCanvas.addEventListener('touchmove', onMove)
  gCanvas.addEventListener('touchstart', onDown)
  gCanvas.addEventListener('touchend', onUp)

}


function onDown(ev) {
  const pos = getEvPos(ev)
  var currLine = getCurrLine()
  var currSticker = getCurrSticker()
  if (isLineClicked(pos)) {
    currLine.isMoved = true
    gStartPos = pos
    document.body.style.cursor = 'grab'
  }
  if (isStickerClicked(pos)) {
    currSticker.isMoved = true
    gStartPos = pos
    document.body.style.cursor = 'grab'
  }
}

function onMove(ev) {
  var dragged
  var currLine = getCurrLine()
  if (!currLine.isMoved) return
  dragged = (currLine.isMoved) ? currLine : currSticker
  const pos = getEvPos(ev)
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  dragged.pos.x += dx
  dragged.pos.y += dy
  gStartPos = pos
  renderCanvas()
}

function onUp() {
  var currLine = getCurrLine()
  var currSticker = getCurrSticker()
  currLine.isMoved = false
  currSticker.isMoved = false
  document.body.style.cursor = 'grab'
}

function isStickerClicked(clickedPos) {
  var isClicked = true
  var currSticker = getCurrSticker()
  var stickerPos = currSticker.pos
  var distanceX = clickedPos.x - stickerPos.x
  var distanceY = clickedPos.y - stickerPos.y
  if (distanceX < 0 || distanceX > currSticker.size) isClicked = false
  if (distanceY < 0 || distanceY > currSticker.size) isClicked = false
  return isClicked
}

function isLineClicked(clickedPos) {
  var currLine = getCurrLine()
  var linePos = currLine.pos
  const distance = Math.sqrt((linePos.x - clickedPos.x) ** 2 + (linePos.y - clickedPos.y) ** 2)
  return distance <= currLine.size
}



function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY
  }
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
    }
  }
  return pos
}

function openEditorPage() {
  document.querySelector('.gallery').style.display = 'none'
  document.querySelector('.editor').classList.add('active')
  document.querySelector('.deatiles').style.display = 'none'
  document.querySelector('.search-div').style.display = 'none'
  document.querySelector('.main-page').style.display = 'none'
  document.querySelector('.memes-manage').style.display = 'flex'
  document.querySelector('.my-memes').style.display = 'none'

}

function onOpenGallery() {
  document.querySelector('.gallery').style.display = 'block'
  document.querySelector('.editor').classList.remove('active')
  document.querySelector('.deatiles').style.display = 'flex'
  document.querySelector('.memes-manage').style.display = 'none'
  document.querySelector('.my-memes').style.display = 'none'
  document.querySelector('.main-page').style.display = 'block'
  document.querySelector('.search-div').style.display = 'flex'






  onToggleMenu()
}

function onOpenMems() {
  document.querySelector('.my-memes').style.display = 'block'
  document.querySelector('.gallery').style.display = 'none'
  document.querySelector('.editor').classList.remove('active')
  document.querySelector('.deatiles').style.display = 'none'
  document.querySelector('.memes-manage').style.display = 'none'
  document.querySelector('.main-page').style.display = 'none'


  renderMems()
  onToggleMenu()
}


function renderCanvas() {
  var meme = getMeme()
  var img = new Image()
  var currImg = getImgById(meme.selectedImgId)
  img.src = currImg.url
  img.onload = () => {
    clearCanvas()
    setInputText()
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

    meme.lines.forEach(line => {

      drawText(line, line.pos.x, line.pos.y)
      stickerDispaly()

    });

  }
}

function stickerDispaly() {
  var meme = getMeme()
  if (!meme.sticker.id) return
  const img = new Image()
  img.src = `img/${meme.sticker.id}.png`
  img.onload = () => {
    gCtx.drawImage(img, meme.sticker.pos.x, meme.sticker.pos.y, 100, 100)
  }
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function setInputText() {
  var meme = getMeme()
  document.querySelector('.input-meme').value = meme.lines[meme.selectedLineIdx].txt
}

function onSetText(txt) {
  setText(txt)
  renderCanvas()
}

function drawText(line, x, y) {
  gCtx.lineWidth = 3;
  gCtx.fillStyle = line.color
  gCtx.font = `${line.size}px ${line.font}`
  gCtx.textAlign = line.align
  gCtx.fillText(line.txt, x, y)
  gCtx.strokeText(line.txt, x, y)
}

function onAddLine() {
  addLine()
  renderCanvas()
}

function onSwitchLine() {
  switchLine()
  renderCanvas()
}

function onRemoveLine() {
  removeLine()
  renderCanvas()
}


function onSetFont(font) {
  setFont(font)
  renderCanvas()
}

function onChangeTextPosY(direction) {
  ChangeTextPosY(direction)
  renderCanvas()
}

function onChangeTextPosX(direction) {
  ChangeTextPosX(direction)
  renderCanvas()
}

function onFontSize(sign) {
  changeFontSize(sign)
  renderCanvas()
}

function onSetTextAlignment(direction) {
  SetTextAlignment(direction)
  renderCanvas()
}


function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function getCanvasWidth() {

  const elContainer = document.querySelector('.canvas-container')
  return elContainer.offsetWidth

}

function onOpenModal() {
  document.body.classList.toggle('opened1');
  document.querySelector('.modal').classList.toggle('animate');
}

function onSumbit() {
  var UrlInput = document.querySelector('[name="url"]').value
  var keyInput = document.querySelector('[name="key"]').value

  pushImgInput(UrlInput, keyInput)
  renderImgs()
}

function onSetSticker(idx) {

  setSticker(idx)
  renderCanvas()
}


function onSaveMeme() {
  var MemedImg = gCanvas.toDataURL('image/jpg')
  saveMeme(MemedImg)
  swal("Meme saved!", "your meme add to myMems", "success");
}



function fbs_click() {
  var MemedImg = gCanvas.toDataURL('image/jpg')

  var u = MemedImg;
  // t=document.title;
  var t = 'img'
  window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false;
}



function onDownloadImg(btn) {
  btn.setAttribute('download', 'meme')
  btn.href = gCanvas.toDataURL('image/jpg')
}