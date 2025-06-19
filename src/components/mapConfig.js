import { getNoLabelsLayers } from './layers/index.js'
import { getTheme } from './theme.js'

const mapConfig = {
  center: [8.127, 26.640], 
  zoom: 1.5,
}

const getMapSources = () => {
  return {
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
}

const getMapLayers = ({ theme, satellite }) => {
  return [
    ...getNoLabelsLayers('protomaps', theme),
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
      paint: {
        'raster-opacity': satellite ? 1 : 0,
      },
    }
  ]
}

const getMapStyle = ({ theme = getTheme(), satellite = 0 }) => {
  return {
    version: 8,
    sources: getMapSources(),
    layers: getMapLayers(
      {
        theme,
        satellite
      }
    ),
  }
}

export {
  mapConfig,
  getMapStyle
}