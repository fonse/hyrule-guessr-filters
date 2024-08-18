const filters = [
  {
    id: "filter-pixelate",
    label: "Pixelate",
  },
  {
    id: "filter-scramble",
    label: "Scramble",
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
    id: "filter-invert",
    label: "Invert colors",
  },
  {
    id: "filter-greyscale",
    label: "Greyscale",
  },
];

// Create a style element to apply the filters
const styleElement = document.createElement('style');
document.body.append(styleElement);

const handleFiltersChange = () => {
  const scramble = document.getElementById('filter-scramble').checked;
  const pixelate = document.getElementById('filter-pixelate').checked;
  const halfVisible = document.getElementById('filter-half-visible').checked;
  const invert = document.getElementById('filter-invert').checked;
  const greyscale = document.getElementById('filter-greyscale').checked;
  const upsideDown = document.getElementById('filter-upside-down').checked;

  const filters = [];
  const transform = [];

  if (scramble) {
    filters.push('url(#scramble)');
  }
  if (pixelate) {
    filters.push('url(#pixelate)');
  }
  if (halfVisible) {
    filters.push('url(#half-visible)');
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

  if (styleElement.sheet.cssRules.length > 0) {
    styleElement.sheet.deleteRule(0);
  }
  styleElement.sheet.insertRule(`
    .viewer-canvas img {
      filter: ${filters.join(' ')};
      transform: ${transform.join(' ')} !important;
      width: 1280px ${scramble || halfVisible ? '!important' : ''};
      height: 720px ${scramble || halfVisible ? '!important' : ''};
    }
  `);
}

const createFilter = (filter) => {
  const div = document.createElement('div');
  div.classList.add('form-check', 'form-check-inline');
  
  const checkbox = document.createElement('input');
  checkbox.id = filter.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  checkbox.onchange = handleFiltersChange;
  
  const label = document.createElement('label');
  label.htmlFor = filter.id;
  label.classList.add('form-check-label');
  label.textContent = filter.label;

  div.append(checkbox, label);
  return div;
}

const onLoadNewGamePage = () => {
  // Clear current styles
  if (styleElement.sheet.cssRules.length > 0) {
    styleElement.sheet.deleteRule(0);
  }
  
  // Create container for filter controls
  const ctaElement = document.querySelector('.start-game-btn-container');
  const filtersContainer = document.createElement('div');
  
  const title = document.createElement('h4');
  title.textContent = 'Extra Filters';
  title.style.marginTop = '1.2em';
  filtersContainer.append(title);
  
  filters.forEach((filter, i) => { 
    if (i == 3) {
      const br = document.createElement('br');
      filtersContainer.append(br);
    }
    
    const filterDiv = createFilter(filter);
    filtersContainer.append(filterDiv);
  });
  
  ctaElement.before(filtersContainer);

}

// Inject content on "New Game" page
const isNewGamePage = () => {
  return !!document.querySelector('.start-game-btn-container');
}

let inNewGamePage = isNewGamePage();
if (inNewGamePage) {
  onLoadNewGamePage();
}

observer = new MutationObserver(() => {
  const previousInNewGamePage = inNewGamePage;
  inNewGamePage = isNewGamePage();
  
  if (inNewGamePage != previousInNewGamePage && inNewGamePage) {
    onLoadNewGamePage();
  }
});

const container = document.querySelector('.router-container');
observer.observe(container, {childList: true, subtree: true});

// Helper function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Append svg for filters
const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

const width = 1280;
const height = 720;
const xsteps = 5;
const ysteps = 4;

const stepX = width / xsteps;
const stepY = height / ysteps;

const greyPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjWLBgwX8ABqQC4OZS39wAAAAASUVORK5CYII=';
const blackPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII=';
const pixelateDisplacementMap = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC';

// Pixelate
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
pixelate_feImage.setAttribute('href', pixelateDisplacementMap);
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

// Half Visible
const half_visible_filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
half_visible_filter.setAttribute('id', 'half-visible');
half_visible_filter.setAttribute('x', '0%');
half_visible_filter.setAttribute('y', '0%');
half_visible_filter.setAttribute('width', '100%');
half_visible_filter.setAttribute('height', '100%');
svg.appendChild(half_visible_filter);

const half_visible_feMerge = document.createElementNS("http://www.w3.org/2000/svg", 'feMerge');
const half_visible_feMergeNode_source = document.createElementNS("http://www.w3.org/2000/svg", 'feMergeNode');
half_visible_feMergeNode_source.setAttribute('in', 'SourceGraphic');
half_visible_feMerge.appendChild(half_visible_feMergeNode_source);

for (let i = 0; i < xsteps; i++){
  for (let j = 0; j < ysteps; j++){
    const x = i * stepX;
    const y = j * stepY;

    if (i % 2 == j % 2) {
      continue;
    }

    const half_visible_feImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
    half_visible_feImage.setAttribute('x', x);
    half_visible_feImage.setAttribute('y', y);
    half_visible_feImage.setAttribute('width', stepX);
    half_visible_feImage.setAttribute('height', stepY);
    half_visible_feImage.setAttribute('preserveAspectRatio', 'none');
    half_visible_feImage.setAttribute('href', greyPixel);
    half_visible_feImage.setAttribute('result', `cover-${i}-${j}`);
    half_visible_filter.appendChild(half_visible_feImage);

    const half_visible_feMergeNode = document.createElementNS("http://www.w3.org/2000/svg", 'feMergeNode');
    half_visible_feMergeNode.setAttribute('in', `cover-${i}-${j}`);
    half_visible_feMerge.appendChild(half_visible_feMergeNode);
  }
}

half_visible_filter.appendChild(half_visible_feMerge);

// Scramble
const targets = [];
for (let i = 0; i < xsteps; i++){
  for (let j = 0; j < ysteps; j++){
    targets.push([i, j]);
  }
}
shuffleArray(targets);

const scramble_filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
scramble_filter.setAttribute('id', 'scramble');
scramble_filter.setAttribute('x', '0%');
scramble_filter.setAttribute('y', '0%');
scramble_filter.setAttribute('width', '100%');
scramble_filter.setAttribute('height', '100%');
svg.appendChild(scramble_filter);

const scramble_feMerge = document.createElementNS("http://www.w3.org/2000/svg", 'feMerge');

for (let i = 0; i < xsteps; i++){
  for (let j = 0; j < ysteps; j++){
    const x = i * stepX;
    const y = j * stepY;

    const [targetI, targetJ] = targets[i * ysteps + j];

    const scramble_feImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
    scramble_feImage.setAttribute('x', x);
    scramble_feImage.setAttribute('y', y);
    scramble_feImage.setAttribute('width', stepX);
    scramble_feImage.setAttribute('height', stepY);
    scramble_feImage.setAttribute('preserveAspectRatio', 'none');
    scramble_feImage.setAttribute('href', blackPixel);
    scramble_feImage.setAttribute('result', `mask-${i}-${j}`);
    scramble_filter.appendChild(scramble_feImage);

    const scramble_feComposite = document.createElementNS("http://www.w3.org/2000/svg", 'feComposite');
    scramble_feComposite.setAttribute('in', 'SourceGraphic');
    scramble_feComposite.setAttribute('in2', `mask-${i}-${j}`);
    scramble_feComposite.setAttribute('operator', 'in');
    scramble_feComposite.setAttribute('result', `tile-${i}-${j}`);
    scramble_filter.appendChild(scramble_feComposite);
    
    const scramble_feOffset = document.createElementNS("http://www.w3.org/2000/svg", 'feOffset');
    scramble_feOffset.setAttribute('in', `tile-${i}-${j}`);
    scramble_feOffset.setAttribute('dx', (targetI - i) * stepX);
    scramble_feOffset.setAttribute('dy', (targetJ - j) * stepY);
    scramble_feOffset.setAttribute('result', `offset-${i}-${j}`);
    scramble_filter.appendChild(scramble_feOffset);

    const scramble_feMergeNode = document.createElementNS("http://www.w3.org/2000/svg", 'feMergeNode');
    scramble_feMergeNode.setAttribute('in', `offset-${i}-${j}`);
    scramble_feMerge.appendChild(scramble_feMergeNode);
  }
}

scramble_filter.appendChild(scramble_feMerge);

svg.style.display = 'none';
document.body.appendChild(svg);