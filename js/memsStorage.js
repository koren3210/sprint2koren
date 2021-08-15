'use strict'

var gMemsStorage = []

const KEY_MEMS = 'savedMemes'



function loadMemes() {
  var memes = getMemesFromStorage()
  if (!memes) return
  gMemsStorage = memes
  return gMemsStorage
}

function getMemesFromStorage() {
  var memes = loadFromStorage(KEY_MEMS)
  return memes
}

function saveMemesToStorage(memes) {
  addToStorage(KEY_MEMS, memes)
}

function saveMeme(img) {
  var meme = getMeme()
  meme.img = img
  gMemsStorage.push(meme)
  saveMemesToStorage(gMemsStorage)
}
