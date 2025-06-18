<script>
  import { getTheme } from './theme'
  import { getNoLabelsLayers } from './layers'

  import { copyToClipboard, getCoordsArrayFromString, getFileName, getFormattedCoords, isImage } from './utils'

  import Map from './Map.svelte'
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

  let mapZoom = $state(0)
  let mapLat = $state(0)
  let mapLng = $state(0)
  let mouseLat = $state(0)
  let mouseLng = $state(0)

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
  }

  let containerClassList = $derived([
    'container',
  ])
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<div class={containerClassList.join(' ')}>
  <Map 
    bind:this={mapComponentRef}
    bind:mapZoom={mapZoom}
    bind:mapLat={mapLat}
    bind:mapLng={mapLng}
    bind:mouseLat={mouseLat}
    bind:mouseLng={mouseLng}
    bind:overlayImages={overlayImages}
    {overlayImagesOpacity}
    {pointsArray}
    {style}
  ></Map>

  <OptionsPanel 
    onSubmitImageUrl={handleSubmitImageUrl}
    onRemoveImage={removeImage}
    onGetImageCoordinates={getImageCoordinates}
    onSubmitPointCoords={handleSubmitPointCoords}
    onSubmitZoomCoords={handleSubmitZoomCoords}
    onRemovePoint={removePoint}
    {overlayImages}
    {copyStatusArray}
    {pointsArray}
    {mapZoom}
    {mapLat}
    {mapLng}
    {mouseLat}
    {mouseLng}
    bind:overlayImagesOpacity={overlayImagesOpacity}
    bind:isSatelliteLayerVisible={isSatelliteLayerVisible}
  />

  <div class="reference">
    <div class="reference__cross"></div>
  </div>
</div>

<style lang="scss">
  .container {
    --c-black: #18191d;
  }

  .reference {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .reference__cross {
    position: relative;
  }

  .reference__cross::before,
  .reference__cross::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1px;
    height: 18px;
    background-color: #ffffff91;
    transform-origin: center;
  }

  .reference__cross::before {
    transform: translate(-50%, -50%);
  }

  .reference__cross::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

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