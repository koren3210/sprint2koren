'use strict'

var gKeywords = {
  'happy': 12,
  'animals': 1,
}

var gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['animals'] },
  { id: 2, url: 'img/2.jpg', keywords: ['animals'] },
  { id: 3, url: 'img/3.jpg', keywords: ['animals'] },
  { id: 4, url: 'img/4.jpg', keywords: ['animals'] },
  { id: 5, url: 'img/5.jpg', keywords: ['animals'] },
  { id: 6, url: 'img/6.jpg', keywords: ['animals'] },
  { id: 7, url: 'img/7.jpg', keywords: ['animals'] },
  { id: 8, url: 'img/8.jpg', keywords: ['animals'] },
  { id: 9, url: 'img/9.jpg', keywords: ['animals'] }


];


var gMeme;

function getImgStr() {
  var imgs = loadImgs()
  if (!imgs) {
    imgs = gImgs
  }
  var strHTML = imgs.map(img => {
    return `<img class="img-" onclick="onOpenCanvas(${img.id})" src="${img.url}"></img>`
  })
  return strHTML.join('')
}

function createMeme(imgId) {
  gMeme = {
    selectedImgId: imgId,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'input text Place holder',
        size: 40,
        align: 'center',
        pos: { x: getCanvasWidth() / 2, y: 50 },
        font: 'impact',
        color: 'white',
        isMoved: false

      }
    ],
    sticker: {
      size: 100,
      pos: { x: 100, y: 100 },
      isMoved: false
    }
  }
  return gMeme
}

function getMeme() {
  return gMeme
}


function getImgById(imgId) {
  return gImgs.find(img => img.id === imgId)
}


function setText(txt) {
  gMeme.lines[gMeme.selectedLineIdx].txt = txt
}


function addLine() {

  gMeme.selectedLineIdx++
  var newLine = {
    txt: 'input text Place Holder',
    size: 40,
    font: 'impact',
    align: 'center',
    color: 'white',
    pos: getNewLinePos(gMeme.lines.length),
  }
  gMeme.lines.push(newLine)
}

function switchLine() {
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = 0
  } else {
    gMeme.selectedLineIdx++
  }
}

function removeLine() {
  var currLineIdx = gMeme.selectedLineIdx
  if (gMeme.lines.length === 1) return
  gMeme.lines.splice(currLineIdx, 1)
  gMeme.selectedLineIdx = 0
}


function setFont(font) {
  var currLine = getCurrLine()
  currLine.font = font
}

function ChangeTextPosY(direction) {
  var currLine = getCurrLine()
  currLine.pos.y += direction
}

function ChangeTextPosX(direction) {
  var currLine = getCurrLine()
  currLine.pos.x += direction
}

function getCurrLine() {
  var currLineIdx = gMeme.selectedLineIdx
  return gMeme.lines[currLineIdx]
}
function getCurrSticker() {
  return gMeme.sticker
}


function setSticker(id) {
  gMeme.sticker.id = id
  gMeme.sticker.pos = { x: 100, y: 100 }
}

function changeFontSize(sign) {
  var currLine = getCurrLine()
  if (sign === '+') currLine.size++;
  if (sign === '-') currLine.size--;
}


function getNewLinePos(idx) {
  switch (idx) {
    case 0:
      return { x: 225, y: 50 }
    case 1:
      return { x: 225, y: 100 }
    case 2:
      return { x: 225, y: 200 }
    case 3:
      return { x: 225, y: 250 }
    case 4:
      return { x: 225, y: 350 }
    default:
      return { x: 225, y: 200 }
  }
}

function SetTextAlignment(direction) {
  var x = setPosByDirection(direction)
  var currLine = getCurrLine()
  currLine.align = direction
  currLine.pos.x = x
}

function setPosByDirection(direction) {
  if (direction === 'start') return 10;
  else if (direction === 'end') return 450;
  else if (direction === 'center') return 225;
}

function pushImgInput(url, key) {
  var img =
  {
    id: gImgs.length + 1,
    url: url,
    keywords: key
  }

  addImgsToStorage(img)

}

