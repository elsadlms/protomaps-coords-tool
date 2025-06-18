<script>
  import { getTheme } from './theme'
  import { getNoLabelsLayers } from './layers'

  import { copyToClipboard, getCoordsArrayFromString, getFileName, getFormattedCoords, isImage } from './utils'

  import MapComponent from './MapComponent.svelte'
  import OptionsPanel from './OptionsPanel.svelte'

  const createImageOverlayObject = (url) => {
    const [lng, lat] = mapComponentRef.getCurrentCenter()
    const offsetLng = 0.002
    const offsetLat = 0.001

    return {
      src: url.trim(),
      topLeft: [lng - offsetLng,  lat + offsetLat],
      bottomRight: [lng + offsetLng, lat - offsetLat],
    }
  }

  let mapComponentRef = null
  let overlayImages = $state([])
  let copyStatusArray = $state([])
  let overlayImagesOpacity = $state(1)
  let pointsArray = $state([])
  let isSatelliteLayerVisible = $state(true)
  let targetCoords = $state([])

  // [WIP] move map style to another file
  const sources = {
    protomaps: {
      maxzoom: 15,
      type: 'vector',
      tiles: ['https://stg-protomap.8080.lemonde.io/20240111/{z}/{x}/{y}.mvt'],
    },
    satellite: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
    }
  }

  // const layers = getNoLabelsLayers('protomaps', getTheme())
  const layers = $derived([
    ...getNoLabelsLayers('protomaps', getTheme()),
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
      paint: {
        'raster-opacity': isSatelliteLayerVisible ? 1 : 0,
      },
    }
  ])

  const style = $derived({
    version: 8,
    sources,
    layers,
  })

  const handleSubmitImageUrl = (url) => {
    if (!url) return;
    if (!isImage(url)) return;

    overlayImages.push(createImageOverlayObject(url))
    copyStatusArray.push(false)
  }

  const handleSubmitPointCoords = (coords) => {
    if (!coords) return;

    const arrayRegex = /\[.*?\]/;
    if (arrayRegex.test(coords) === true) {
      const inputPointsArray = JSON.parse(coords).map(el => [el[1], el[0]])
      pointsArray.push(...inputPointsArray)
      return;
    }

    const cleanCoords = getCoordsArrayFromString(coords)
    pointsArray.push([cleanCoords[1], cleanCoords[0]])
  }

  const handleSubmitZoomCoords = (coords) => {
    if (!coords) return;

    console.log(coords)
    
    const cleanCoords = getCoordsArrayFromString(coords)
    targetCoords = [cleanCoords[1], cleanCoords[0]]

    if (mapComponentRef && mapComponentRef.flyToTarget) {
      mapComponentRef.flyToTarget(targetCoords)
    }
  }

  const removeImage = (index) => {
    overlayImages = overlayImages.filter((_, i) => i !== index)
  }

  const removePoint = (index) => {
    pointsArray = pointsArray.filter((_, i) => i !== index)
  }

  const getImageCoordinates = (index) => {
    const selectedImage = overlayImages[index]
    console.log(getFileName(selectedImage.src))
    const imageCoords = getFormattedCoords(selectedImage.topLeft, selectedImage.bottomRight)

    copyToClipboard(imageCoords)
    copyStatusArray[index] = true

    setTimeout(() => {
      copyStatusArray[index] = false 
    }, 2000)
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<div>
  <MapComponent 
    bind:this={mapComponentRef} 
    bind:overlayImages={overlayImages}
    {overlayImagesOpacity}
    {pointsArray}
    {style}
  ></MapComponent>

  <OptionsPanel 
    onSubmitImageUrl={handleSubmitImageUrl}
    onRemoveImage={removeImage}
    onGetImageCoordinates={getImageCoordinates}
    {overlayImages}
    {copyStatusArray}
    bind:overlayImagesOpacity={overlayImagesOpacity}
    onSubmitPointCoords={handleSubmitPointCoords}
    onSubmitZoomCoords={handleSubmitZoomCoords}
    {pointsArray}
    onRemovePoint={removePoint}
    bind:isSatelliteLayerVisible={isSatelliteLayerVisible}
  />
</div>

<style lang="scss">
  .overlay {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .overlay__image img {
    max-width: 90vw;
    max-height: 90vh;
  }
</style>