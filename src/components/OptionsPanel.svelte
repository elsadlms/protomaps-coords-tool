<script>
  import { copyToClipboard, executeOnEnter, getFileName } from './utils'
  import { CheckIcon, CloseIcon, CopyIcon } from './icons'

  import CopyToClipboardButton from './CopyToClipboardButton.svelte'

  let { 
    onSubmitImageUrl,
    onRemoveImage,
    onGetImageCoordinates,
    onSubmitPointCoords,
    onSubmitZoomCoords,
    onRemovePoint,
    overlayImages,
    copyStatusArray,
    pointsArray,
    mapZoom,
    mapLat,
    mapLng,
    mouseLat,
    mouseLng,
    overlayImagesOpacity = $bindable(1),
    isSatelliteLayerVisible = $bindable(true),
  } = $props()

  let inputImageUrl = $state('')
  let inputPointCoords = $state('')
  let inputZoomCoords = $state('')

  let isOptionsPanelOpen = $state(true)

  const submitImageUrl = () => { 
    onSubmitImageUrl(inputImageUrl); 
    inputImageUrl = ''; 
  }

  const submitPointCoords = () => { 
    onSubmitPointCoords(inputPointCoords); 
    inputPointCoords = ''; 
  }

  const submitZoomCoords = () => { 
    onSubmitZoomCoords(inputZoomCoords); 
  }

  const copyMapCoordsToClipboard = () => {
    const toCopy = `center: [${mapLng}, ${mapLat}], zoom: ${mapZoom},`
    copyToClipboard(toCopy)
  }

  const toggleOptionsPanel = () => {
    isOptionsPanelOpen = !isOptionsPanelOpen
  }

  let optionsClassList = $derived([
    'options',
    isOptionsPanelOpen ? 'options_open' : 'options_closed'
  ])
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<div class={optionsClassList.join(' ')}>
  <div class="options__toggle">
    <p onclick={toggleOptionsPanel}>
      {isOptionsPanelOpen ? 'Masquer' : 'Afficher'}
    </p>
  </div>

  <div class="options__panel">
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
      <p class="options__title">Images</p>
      <div class="options__input">
        <input
          type="url"
          placeholder="URL de l'image"
          bind:value={inputImageUrl}
          onkeypress={(e) => executeOnEnter(e, submitImageUrl)}
        />
        <button onclick={submitImageUrl}>
          Valider
        </button>
      </div>

      {#if overlayImages.length > 0}
        <div class="options__subitems options__subitems_list">
          {#each overlayImages as image, index}
            {@const classList = ['options__subitem']}
            <div class={classList.join(' ')}>
              <p class="options__icon-btn options__icon-btn_remove" onclick={() => onRemoveImage(index)}>
                <CloseIcon />
              </p>
              <p class="options__subcontent">{getFileName(image.src)}</p>
              <div class="options__icon-btn options__icon-btn_copy">
                <CopyToClipboardButton
                  callbackFunction={() => onGetImageCoordinates(index)}
                />
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if overlayImages.length > 0}
        <div class="options__slider options__slider_opacity">
          <label>
            Opacité
            <input 
              type="range" 
              min="0"
              max="1" 
              step="0.02"
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
          type="text"
          placeholder="lat, lng"
          bind:value={inputPointCoords}
          onkeypress={(e) => executeOnEnter(e, submitPointCoords)}
        />
        <button onclick={submitPointCoords}>
          Valider
        </button>
      </div>

      {#if pointsArray.length > 0}
        <div class="options__subitems options__subitems_list">
          {#each pointsArray as coords, index}
            {@const classList = ['options__subitem']}
            <div class={classList.join(' ')}>
              <p class="options__icon-btn options__icon-btn_remove" onclick={() => onRemovePoint(index)}>
                <CloseIcon />
              </p>
              <p class="options__subcontent">{coords}</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="options__item">
      <p class="options__title">Zoomer sur</p>
      <div class="options__input">
        <input
          type="text"
          placeholder="lat, lng"
          bind:value={inputZoomCoords}
          onkeypress={(e) => executeOnEnter(e, submitZoomCoords)}
        />
        <button onclick={submitZoomCoords}>
          Valider
        </button>      
      </div>
    </div>

    <div class="options__item">
      <p class="options__title">Coordonnées</p>
      <div class="options__subitems">
        <div class="options__subitem options__subitem_map">
          <div class="options__icon-btn options__icon-btn_copy">
            <CopyToClipboardButton
              callbackFunction={copyMapCoordsToClipboard}
            />
          </div>
          <p class="options__subtitle">
            Map
          </p>
          <div class="options__subcontent">
            <span>
              lat: {mapLat.toFixed(4)}
            </span>
            <span>
              lng: {mapLng.toFixed(4)}
            </span>
            <span>
              zoom: {mapZoom.toFixed(2)}x
            </span>
          </div>
        </div>
        <div class="options__subitem options__subitem_mouse">
          <p class="options__subtitle">
            Mouse
          </p>
          <div class="options__subcontent">
            <span>
              lat: {mouseLat.toFixed(4)}
            </span>
            <span>
              lng: {mouseLng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .options {
    --options-c-background: #ffffff8f;
    --options-c-text: var(--c-black);
    --options-c-border: #ffffff91;
    --options-c-button-hover: #ffffff55;
    --options-c-divider-light: rgba(0, 0, 0, 0.2);
    --options-c-divider-dark: rgba(0, 0, 0, 0.6);
    z-index: 2;
    position: absolute;
    top: 24px;
    left: 24px;
    width: 300px;
    color: var(--options-c-text);
  }

  .options__toggle {
    font-family: monospace;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: 0.1em;
    width: fit-content;
    padding: 2px 8px;
    background: var(--c-black);
    border-radius: 4px;
  }

  .options__panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    border-bottom: 1px solid var(--options-c-divider-dark);
    background: var(--options-c-background);
    font-family: monospace;
    font-size: 12px;
  }

  .options label:has(input) {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .options label:has(input[type="range"]) {
    gap: 12px;
  }

  .options input[type="url"],
  .options input[type="text"],
  .options input[type="range"] {
    flex-grow: 1;
  }

  // .options input[type="range"],
  .options input[type="checkbox"] {
    accent-color: var(--c-black);
  }

  .options button {
    border-radius: 2px;
    padding: 6px 12px;
    font-weight: 500;
  }

  .options button:hover {
    background-color: var(--options-c-button-hover);
  }

  .options__item {
    background: var(--options-c-background);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    padding: 8px;
    border: 1px solid var(--options-c-border);
    font-size: 14px;
  }

  .options__item label {
    font-weight: 700;
    font-family: monospace;
  }

  .options__title {
    font-weight: 700;
    margin-bottom: 6px;
    font-family: monospace;
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
    font-size: 12px;
  }

  .options__subitems {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .options__input + .options__subitems {
    margin-top: 12px;
  }

  .options__slider.options__slider_opacity {
    margin-top: 12px; 
  }

  .options__subitem {
    background-color: var(--options-c-background);
    border-radius: 2px;
    padding: 4px 8px;
    position: relative;
  }

  .options__subitems.options__subitems_list .options__subitem {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .options__subitems.options__subitems_list .options__icon-btn.options__icon-btn_copy {
    margin-left: auto;
  }

  .options__subtitle {
    font-family: monospace;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.1em;
    opacity: 0.6;
  }

  .options__subcontent {
    display: flex;
    flex-direction: column;
    font-family: monospace;
    font-size: 12px;
  }

  .options__icon-btn {
    display: flex;
    cursor: pointer;
    opacity: 0.4;
  }

  .options__icon-btn:hover {
    opacity: 0.8;
  }

  .options__subitem.options__subitem_map .options__icon-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 8px;
    z-index: 1;
  }
</style>