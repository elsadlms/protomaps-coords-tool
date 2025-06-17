<script>
  import { CopyIcon } from './icons'
  import { copyToClipboard } from './utils'

  let {
    mapZoom,
    mapLat,
    mapLng,
    mouseLat,
    mouseLng
  } = $props()

  const formatValue = (value, decimals) => {
    return value.toFixed(decimals)
  }

  const copyMapCoordsToClipboard = () => {
    const toCopy = `center: [${mapLng}, ${mapLat}], zoom: ${mapZoom},`
    copyToClipboard(toCopy)
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<div class="dashboard">
  <div class="dashboard__map">
    <div class="dashboard__header dashboard__header_map">
      <div class="dashboard__copy" onclick={copyMapCoordsToClipboard}>
        <CopyIcon />
      </div>
      <p>MAP</p>
    </div>
    lat: {mapLat.toFixed(4)}, lng: {mapLng.toFixed(4)}, zoom: {mapZoom.toFixed(2)}x
  </div>
  <div class="dashboard__mouse">
    <div class="dashboard__header dashboard__header_mouse">
      <p>MOUSE</p>
    </div>
    lat: {mouseLat.toFixed(4)}, lng: {mouseLng.toFixed(4)}
  </div>
</div>

<style lang="scss">
  .dashboard {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    z-index: 100;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 12px;
    text-align: right;
    min-width: 280px;
  }

  .dashboard__header {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }

  .dashboard__copy {
    cursor: pointer;
    transition: opacity 100ms;
  }
  
  .dashboard__copy:hover {
    opacity: 0.6;
  }
</style>
