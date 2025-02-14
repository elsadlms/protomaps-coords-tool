<script>
  let {
    mapZoom,
    mapLat,
    mapLng,
    mouseLat,
    mouseLng
  } = $props();

  const formatValue = (value, decimals) => {
    return value.toFixed(decimals)
  }
</script>

<div class="coordinates-dashboard">
  <div class="coordinates-dashboard__map">
    <p>MAP</p>
    lat: {formatValue(mapLat, 8)}, lng: {formatValue(mapLng, 8)}, zoom: {formatValue(mapZoom, 2)}x
  </div>
  <div class="coordinates-dashboard__mouse">
    <p>MOUSE</p>
    lat: {formatValue(mouseLat, 8)}, lng: {formatValue(mouseLng, 8)}
  </div>
</div>

<style lang="scss">
  .coordinates-dashboard {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    pointer-events: none;
    z-index: 100;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 12px;
    text-align: right;
    min-width: 280px;
  }
</style>
