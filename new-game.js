const configs = [
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
  {
    id: "filter-upside-down",
    label: "Upside Down",
  },
  {
    id: "filter-pixelate",
    label: "Pixelate",
  },
]

// Create a style element to apply the filters
const styleElement = document.createElement('style');
document.body.append(styleElement);

const handleConfigChange = () => {
  const blur = document.getElementById('filter-blur').checked;
  const invert = document.getElementById('filter-invert').checked;
  const greyscale = document.getElementById('filter-greyscale').checked;
  const upsidedown = document.getElementById('filter-upside-down').checked;
  const pixelate = document.getElementById('filter-pixelate').checked;

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
  if (upsidedown) {
    transform.push('rotate(180deg)');
  }
  if (pixelate) {
    filters.push('url(#pixelate)');
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
configs.forEach(config => { 
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

// Append svg for pixelate filter
const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
const filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
filter.setAttribute('id', 'pixelate');
filter.setAttribute('x', '0%');
filter.setAttribute('y', '0%');
filter.setAttribute('width', '100%');
filter.setAttribute('height', '100%');
svg.appendChild(filter);

const feImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
feImage.setAttribute('width', '15');
feImage.setAttribute('height', '15');
feImage.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC');
feImage.setAttribute('result', 'displacement-map');
filter.appendChild(feImage);

const feTile = document.createElementNS("http://www.w3.org/2000/svg", 'feTile');
feTile.setAttribute('in', 'displacement-map');
feTile.setAttribute('result', 'pixelate-map');
filter.appendChild(feTile);

const gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", 'feGaussianBlur');
gaussianBlur.setAttribute('stdDeviation', '2');
gaussianBlur.setAttribute('in', 'SourceGraphic');
gaussianBlur.setAttribute('result', 'smoothed');
filter.appendChild(gaussianBlur);

const feDisplacementMap = document.createElementNS("http://www.w3.org/2000/svg", 'feDisplacementMap');
feDisplacementMap.setAttribute('in', 'smoothed');
feDisplacementMap.setAttribute('in2', 'pixelate-map');
feDisplacementMap.setAttribute('xChannelSelector', 'R');
feDisplacementMap.setAttribute('yChannelSelector', 'G');
feDisplacementMap.setAttribute('scale', '50');
filter.appendChild(feDisplacementMap);

svg.style.display = 'none';
document.body.append(svg);