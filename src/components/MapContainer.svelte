<script>
  import { getTheme } from './theme'
  import { getNoLabelsLayers } from './layers'

  import { copyToClipboard, getCoordsArrayFromString, getFileName, getFormattedCoords, isImage } from './utils'

  import { CheckIcon, CloseIcon, CopyIcon } from './icons'
  import MapComponent from './MapComponent.svelte'

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

  let mapComponentRef

  let inputImageUrl = $state('')
  let overlayImages = $state([])
  let copyStatusArray = $state([])
  let overlayImagesOpacity = $state(1)
  let isOptionsPanelOpen = $state(true)

  let inputPointCoords = $state('')
  let pointsArray = $state([])

  let isSatelliteLayerVisible = $state(true)

  let inputCoords = $state('')
  let targetCoords = $state([])

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

  const toggleOptionsPanel = () => {
    isOptionsPanelOpen = !isOptionsPanelOpen
  }

  const handleImageUrlSubmit = () => {
    if (!inputImageUrl) return;
    if (!isImage(inputImageUrl)) return;

    overlayImages.push(createImageOverlayObject(inputImageUrl))
    copyStatusArray.push(false)

    inputImageUrl = ''
  }

  const handlePointCoordsSubmit = () => {
    if (!inputPointCoords) return;

    const arrayRegex = /\[.*?\]/;
    console.log(arrayRegex.test(inputPointCoords))
    if (arrayRegex.test(inputPointCoords) === true) {
      const inputPointsArray = JSON.parse(inputPointCoords).map(el => [el[1], el[0]])
      console.log(pointsArray)
      pointsArray.push(...inputPointsArray)
      return;
    }

    const cleanCoords = getCoordsArrayFromString(inputPointCoords)
    pointsArray.push([cleanCoords[1], cleanCoords[0]])
  }

  const handleCoordsInputKeydown = (e) => {
    if (e.key === 'Enter') { 
      handleCoordsInputSubmit()
    }
  }

  const handleCoordsInputSubmit = () => {
    console.log('handleCoordsInputKeydown')
    console.log(inputCoords)

    const cleanCoords = getCoordsArrayFromString(inputCoords)
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

  let optionsClassList = $derived([
    'options',
    isOptionsPanelOpen ? 'options_open' : 'options_closed'
  ])
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

  <div class={optionsClassList.join(' ')}>
    <div class="options__toggle">
      <p onclick={toggleOptionsPanel}>
        {isOptionsPanelOpen ? 'Masquer' : 'Afficher'}
      </p>
    </div>
    <div class="options__panel">
      <div class="options__item">
        <p class="options__title">Images</p>
        <div class="options__input">
          <input
            type="url"
            placeholder="URL de l'image"
            bind:value={inputImageUrl}
          />
          <button onclick={handleImageUrlSubmit}>Valider</button>
        </div>
  
        {#if overlayImages.length > 0}
          <div class="options__list">
            {#each overlayImages as image, index}
              {@const classList = ['list__item']}
              <div class={classList.join(' ')}>
                <p class="list__remove" onclick={() => removeImage(index)}>
                  <CloseIcon />
                </p>
                <p class="list__name">{getFileName(image.src)}</p>
                <p class="list__copy" onclick={() => getImageCoordinates(index)}>
                  {#if copyStatusArray[index] === true}
                    <CheckIcon />
                  {:else}
                    <CopyIcon />
                  {/if}
                </p>
              </div>
            {/each}
          </div>
        {/if}
  
        {#if overlayImages.length > 0}
          <div>
            <label>
              Opacité
              <input 
                type="range" 
                min="0"
                max="1" 
                step="0.1"
                bind:value={overlayImagesOpacity} 
              />
            </label>
          </div>
        {/if}
      </div>
  
      <div class="options__item">
        <p class="options__title">Points</p>
        <div class="options__input">
          <input
            type="url"
            placeholder="Latitude, longitude"
            bind:value={inputPointCoords}
          />
          <button onclick={handlePointCoordsSubmit}>Valider</button>
        </div>
  
        {#if pointsArray.length > 0}
          <div class="options__list">
            {#each pointsArray as coords, index}
              {@const classList = ['list__item']}
              <div class={classList.join(' ')}>
                <p class="list__remove" onclick={() => removePoint(index)}>
                  <CloseIcon />
                </p>
                <p class="list__name">{coords}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
  
      <div class="options__item">
        <label>
          <input 
            type="checkbox" 
            bind:checked={isSatelliteLayerVisible}
          />
          Couche satellite
        </label>
      </div>
  
      <div class="options__item">
        <label>
          Zoomer sur
          <input
            type="text"
            placeholder="Latitude, longitude"
            bind:value={inputCoords}
            onkeydown={handleCoordsInputKeydown}
          />
        </label>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .options {
    --options-background: #ffffff99;
    --options-button-hover: #ffffff55;
    --options-border-light: rgba(0, 0, 0, 0.2);
    --options-border-dark: rgba(0, 0, 0, 0.6);
    z-index: 2;
    position: absolute;
    top: 24px;
    left: 24px;
    width: 300px;
  }

  .options__toggle {
    font-family: monospace;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: 0.1em;
  }

  .options__panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
  }

  .options.options_closed .options__panel {
    pointer-events: none;
    opacity: 0;
    transform: translateX(-20%);
  }

  .options input[type="url"],
  .options input[type="text"] {
    padding: 6px;
    border-radius: 2px;
    border: unset;
    border-bottom: 1px solid var(--options-border-dark);
  }

  .options label:has(input) {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .options input[type="url"],
  .options input[type="text"],
  .options input[type="range"] {
    flex-grow: 1;
  }

  .options button {
    border-radius: 2px;
    padding: 6px 12px;
    font-weight: 500;
  }

  .options button:hover {
    background-color: var(--options-button-hover);
  }

  .options__item {
    background: var(--options-background);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 12px;
  }

  .options__title {
    font-weight: 700;
    margin-bottom: 6px;
  }

  .options__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .options__list {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    gap: 6px;
    margin: 6px 0 0 0;
    overflow: hidden;
  }

  .options__list + div {
    margin-top: 12px;
  }

  .list__item {
    display: contents;
  }

  .list__item::after {
    content: "";
    display: block;
    border-top: 1px solid var(--options-border-light);
    grid-column: span 3;
  }

  .list__item:first-child::before {
    content: "";
    display: block;    
    border-top: 1px solid var(--options-border-dark);
    grid-column: span 3;
  }

  .list__item:last-child::after {
    border-top: 1px solid var(--options-border-dark);
  }

  .list__name {
    font-family: monospace;
  }

  .list__copy,
  .list__remove {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
    border-radius: 2px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 200ms;
  }

  .list__copy:hover,
  .list__remove:hover {
    background-color: var(--options-button-hover);
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