const copyToClipboard = (content) => {
  const stringToCopy = typeof content === 'string' ? content : JSON.stringify(content)
  navigator.clipboard.writeText(stringToCopy).then(() => {
    console.log(stringToCopy)
    console.log('Copied to clipboard successfully!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  })
}

const executeOnEnter = (event, callbackFn, args = {}) => {
  if (event.key === 'Enter') {
    callbackFn(args)
  }
}

const getFileName = (url) => {
  return url.split('/').at(-1)
}

const getCoordsArrayFromString = (coordsString) => {
  return coordsString
    .split(',')
    .map(coord => parseFloat(coord.trim()))
    .filter(n => !isNaN(n));
}

const getFormattedCoords = (topLeft, bottomRight) => {
  return [
    [topLeft[0], topLeft[1]],
    [bottomRight[0], topLeft[1]],
    [bottomRight[0], bottomRight[1]],
    [topLeft[0], bottomRight[1]]
  ]
}

const isImage = (url) => {
  const fileName = url.split('/').at(-1).trim();
  if (fileName.endsWith('jpg')) return true;
  if (fileName.endsWith('jpeg')) return true;
  if (fileName.endsWith('png')) return true;
  console.log("!isImage")
  return false;
}

export {
  copyToClipboard,
  executeOnEnter,
  getCoordsArrayFromString,
  getFileName,
  getFormattedCoords,
  isImage,
}