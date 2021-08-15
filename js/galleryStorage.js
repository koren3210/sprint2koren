'use strict'


const KEY_GALLERY = 'savedImgs'





function saveDeafultImgs() {
  addToStorage(KEY_GALLERY, gImgs);
}


function loadImgs() {
  var imgs = getImgsFromStorage()
  if (!imgs) {
    saveDeafultImgs()
    return
  }
  gImgs = imgs
  return gImgs

}

function getImgsFromStorage() {
  var imgs = loadFromStorage(KEY_GALLERY)
  return imgs
}

function saveImgsToStorage(imgs) {
  addToStorage(KEY_GALLERY, imgs)
}

function addImgsToStorage(img) {
  gImgs.push(img)
  saveImgsToStorage(gImgs)
}
