const configs = [
  {
    id: "filter-pixelate",
    label: "Pixelate",
  },
  {
    id: "filter-half-visible",
    label: "Half Visible",
  },
  {
    id: "filter-upside-down",
    label: "Upside Down",
  },
  {
    id: "filter-blur",
    label: "Blur",
  },
  {
    id: "filter-invert",
    label: "Invert colors",
  },
  {
    id: "filter-greyscale",
    label: "Greyscale",
  },
]


// Create a style element to apply the filters
const styleElement = document.createElement('style');
document.body.append(styleElement);

const handleConfigChange = () => {
  const blur = document.getElementById('filter-blur').checked;
  const invert = document.getElementById('filter-invert').checked;
  const greyscale = document.getElementById('filter-greyscale').checked;
  const upsideDown = document.getElementById('filter-upside-down').checked;
  const pixelate = document.getElementById('filter-pixelate').checked;
  const halfVisible = document.getElementById('filter-half-visible').checked;

  const filters = [];
  const transform = [];

  if (blur) {
    filters.push('blur(5px)');
  }
  if (invert) {
    filters.push('invert(100%)');
  }
  if (greyscale) {
    filters.push('grayscale(100%)');
  }
  if (upsideDown) {
    transform.push('rotate(180deg)');
  }
  if (pixelate) {
    filters.push('url(#pixelate)');
  }
  if (halfVisible) {
    filters.push('url(#half-visible)');
  }

  if (styleElement.sheet.cssRules.length > 0) {
    styleElement.sheet.deleteRule(0);
  }
  styleElement.sheet.insertRule('.viewer-canvas img { filter: ' + filters.join(' ') + '; transform: ' + transform.join(' ') + ' !important; }');
}

// Create container for filter controls
const ctaElement = document.querySelector('.start-game-btn-container');
const configContainer = document.createElement('div');
const title = document.createElement('h4');

title.textContent = 'Advanced Filters';
configContainer.append(title);
configContainer.style.marginTop = '1.2em';

// Append each filter to container
configs.forEach((config, i) => { 
  if (i == 3) {
    configContainer.append(document.createElement('br'));
  }

  const div = document.createElement('div');
  div.classList.add('form-check', 'form-check-inline');
  
  const checkbox = document.createElement('input');
  checkbox.id = config.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  checkbox.onchange = handleConfigChange;
  
  const label = document.createElement('label');
  label.htmlFor = config.id;
  label.classList.add('form-check-label');
  label.textContent = config.label;

  div.append(checkbox, label);
  configContainer.append(div);
});

ctaElement.before(configContainer);

// Append svg for filters
const maskUrl = chrome.runtime.getURL('mask.png');
const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

const pixelate_filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
pixelate_filter.setAttribute('id', 'pixelate');
pixelate_filter.setAttribute('x', '0%');
pixelate_filter.setAttribute('y', '0%');
pixelate_filter.setAttribute('width', '100%');
pixelate_filter.setAttribute('height', '100%');
svg.appendChild(pixelate_filter);

const pixelate_feImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
pixelate_feImage.setAttribute('width', '15');
pixelate_feImage.setAttribute('height', '15');
pixelate_feImage.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC');
pixelate_feImage.setAttribute('result', 'displacement-map');
pixelate_filter.appendChild(pixelate_feImage);

const pixelate_feTile = document.createElementNS("http://www.w3.org/2000/svg", 'feTile');
pixelate_feTile.setAttribute('in', 'displacement-map');
pixelate_feTile.setAttribute('result', 'pixelate-map');
pixelate_filter.appendChild(pixelate_feTile);

const pixelate_gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", 'feGaussianBlur');
pixelate_gaussianBlur.setAttribute('stdDeviation', '2');
pixelate_gaussianBlur.setAttribute('in', 'SourceGraphic');
pixelate_gaussianBlur.setAttribute('result', 'smoothed');
pixelate_filter.appendChild(pixelate_gaussianBlur);

const pixelate_feDisplacementMap = document.createElementNS("http://www.w3.org/2000/svg", 'feDisplacementMap');
pixelate_feDisplacementMap.setAttribute('in', 'smoothed');
pixelate_feDisplacementMap.setAttribute('in2', 'pixelate-map');
pixelate_feDisplacementMap.setAttribute('xChannelSelector', 'R');
pixelate_feDisplacementMap.setAttribute('yChannelSelector', 'G');
pixelate_feDisplacementMap.setAttribute('scale', '50');
pixelate_filter.appendChild(pixelate_feDisplacementMap);

const half_visible_filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
half_visible_filter.setAttribute('id', 'half-visible');
half_visible_filter.setAttribute('x', '0%');
half_visible_filter.setAttribute('y', '0%');
half_visible_filter.setAttribute('width', '100%');
half_visible_filter.setAttribute('height', '100%');
svg.appendChild(half_visible_filter);

const half_visible_feImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
half_visible_feImage.setAttribute('width', '60');
half_visible_feImage.setAttribute('height', '60');
half_visible_feImage.setAttribute('href', maskUrl);
half_visible_feImage.setAttribute('result', 'mask-tile');
half_visible_filter.appendChild(half_visible_feImage);

const half_visible_feTile = document.createElementNS("http://www.w3.org/2000/svg", 'feTile');
half_visible_feTile.setAttribute('in', 'mask-tile');
half_visible_feTile.setAttribute('result', 'mask');
half_visible_filter.appendChild(half_visible_feTile);

const half_visible_feBlend = document.createElementNS("http://www.w3.org/2000/svg", 'feBlend');
half_visible_feBlend.setAttribute('in', 'SourceGraphic');
half_visible_feBlend.setAttribute('in2', 'mask');
half_visible_feBlend.setAttribute('mode', 'multiply');
half_visible_filter.appendChild(half_visible_feBlend);

svg.style.display = 'none';
document.body.appendChild(svg);