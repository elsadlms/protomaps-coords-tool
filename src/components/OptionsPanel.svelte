<script>
  import { executeOnEnter, getFileName } from './utils'
  import { CheckIcon, CloseIcon, CopyIcon } from './icons'

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
    inputZoomCoords = ''; 
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
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

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
          onkeypress={(e) => executeOnEnter(e, submitImageUrl)}
        />
        <button onclick={submitImageUrl}>
          Valider
        </button>
      </div>

      {#if overlayImages.length > 0}
        <div class="options__list">
          {#each overlayImages as image, index}
            {@const classList = ['list__item']}
            <div class={classList.join(' ')}>
              <p class="list__remove" onclick={() => onRemoveImage(index)}>
                <CloseIcon />
              </p>
              <p class="list__name">{getFileName(image.src)}</p>
              <p class="list__copy" onclick={() => onGetImageCoordinates(index)}>
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
          onkeypress={(e) => executeOnEnter(e, submitPointCoords)}
        />
        <button onclick={submitPointCoords}>
          Valider
        </button>
      </div>

      {#if pointsArray.length > 0}
        <div class="options__list">
          {#each pointsArray as coords, index}
            {@const classList = ['list__item']}
            <div class={classList.join(' ')}>
              <p class="list__remove" onclick={() => onRemovePoint(index)}>
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
          bind:value={inputZoomCoords}
          onkeypress={(e) => executeOnEnter(e, submitZoomCoords)}
        />
      </label>
      <button onclick={submitZoomCoords}>
        Valider
      </button>
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
</style>