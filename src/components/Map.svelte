<script>
  import {
    MapLibre,
    NavigationControl,
    ScaleControl,
    Marker,
    DefaultMarker,
    RasterLayer,
    ImageSource
  } from 'svelte-maplibre'

  import { mapConfig } from './mapConfig.js'
  import { copyToClipboard, getFormattedCoords } from './utils.js'

  let { 
    style, 
    overlayImages = $bindable(), 
    overlayImagesOpacity, 
    pointsArray,
    mapZoom = $bindable(),
    mapLat = $bindable(),
    mapLng = $bindable(),
    mouseLat = $bindable(),
    mouseLng = $bindable(),
  } = $props()

  let markerOnClickEnabled = false

  let map = $state()

  let markers = $state([])
  
  const onClick = (e) => {
    console.log('click!')
    console.log(mouseLat, mouseLng)

    copyToClipboard(`${mouseLat}, ${mouseLng}`)

    if (markerOnClickEnabled == true) {
      markers = [...markers, { lngLat: e.lngLat }];
    }
  }

  const onMouseMove = (e) => {
    if (!map) return
    if (!e.lngLat) return

    mouseLat = e.lngLat.lat
    mouseLng = e.lngLat.lng
  }

  const onMapMove = () => {
    if (!map) return

    const currentCenter = map.getCenter()
    mapLat = currentCenter.lat
    mapLng = currentCenter.lng
    mapZoom = map.getZoom()
  }

  export const flyToTarget = (coords) => {
    if (!map) return

    map.jumpTo({ center: coords })
  }

  export const getCurrentCenter = () => {
    return [mapLng, mapLat]
  }
</script>

<div>
  <!-- [WIP] dev -->
  <MapLibre
    {style}
    center={mapConfig.center}
    zoom={mapConfig.zoom}
    interactive={true}
    attributionControl={false}
    bind:map
    onmousemove={onMouseMove}
    onmoveend={onMapMove}
    onzoom={onMapMove}
    onclick={onClick}
  >
    <NavigationControl position="top-right" />
    <ScaleControl position="bottom-left" />

    {#each overlayImages as image, index}
      {#key image.src}
        <ImageSource
          url={image.src}
          coordinates={getFormattedCoords(image.topLeft, image.bottomRight)}>
          <RasterLayer
            paint={{
              'raster-opacity': overlayImagesOpacity,
            }} />
        </ImageSource>
      {/key}
        
      <Marker
        class="marker marker_image"
        bind:lngLat={image.topLeft}
        draggable
      >
      </Marker>  

      <Marker
        class="marker marker_image"
        bind:lngLat={image.bottomRight}
        draggable
      >
      </Marker>  
    {/each}

    {#each pointsArray as coords}
      <Marker class="marker" lngLat={coords} />
    {/each}

    {#each markers as marker}
      <DefaultMarker lngLat={marker.lngLat} />
    {/each}
  </MapLibre>
</div>

<style>
  :global(.marker::before) {
    --marker-radius: 12px;
    display: block;
    content: '';
    height: var(--marker-radius);
    width: var(--marker-radius);
    border-radius: var(--marker-radius);
    background-color: rgb(166, 255, 0);
    position: absolute;
    top: calc(-0.5 * var(--marker-radius));
    left: calc(-0.5 * var(--marker-radius));
    border: 1px solid #000;
  }

  :global(.marker_image::before) {
    background-color: red;
    opacity: 0.8;
  }
</style>