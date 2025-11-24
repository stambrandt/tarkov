var satelliteView = false;
var hasImage = true;
var hasTile = true;
var LayerName = "";
var mainLayerName;
var MapInfo;

var old_json_packet;
var new_json_packet;
var last_loot_packet;
var last_container_packet;
var last_corpse_packet;

allItemsInRaid = [];

console.log("V 3.7");

function charCodesToString(charCodes) {
  return String.fromCharCode(...charCodes);
}
const showLootCheckbox = document.getElementById("showLoot");
let showLoot = showLootCheckbox.checked;
showLootCheckbox.addEventListener("change", () => {
  showLoot = showLootCheckbox.checked;
  clearMarkers();
  createItems();
  createContainers();
});

const showContainersCheckbox = document.getElementById("showContainers");
let showContainers = showContainersCheckbox.checked;
showContainersCheckbox.addEventListener("change", () => {
  showContainers = showContainersCheckbox.checked;
  clearMarkers();
  createItems();
  createContainers();
});


const sliderElement = document.getElementById("mySlider");
const valueLabel = document.getElementById("sliderValue");
let minValue = parseInt(sliderElement.value);
sliderElement.addEventListener("mouseup", () => {
  minValue = parseInt(sliderElement.value);
  valueLabel.textContent = `₽${minValue.toLocaleString()}`;
  clearMarkers();
  createItems();
  createContainers();
});

function updateViewType(viewType) {
    satelliteView = (viewType === 'satellite');
    changeMap();
}

var mapData = {
    transform: [1, 1, 1, 1],
    coordinateRotation: 90
};

function getCRS(mapData) {
    let scaleX = 1;
    let scaleY = 1;
    let marginX = 0;
    let marginY = 0;
    if (mapData) {    
        if (mapData.transform) {
            scaleX = mapData.transform[0];
            scaleY = mapData.transform[2] * -1;
            marginX = mapData.transform[1];
            marginY = mapData.transform[3];
        }
    }
    return L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(scaleX, marginX, scaleY, marginY),
        projection: L.extend({}, L.Projection.LonLat, {
            project: latLng => {
                return L.Projection.LonLat.project(applyRotation(latLng, mapData.coordinateRotation));
            },
            unproject: point => {
                return applyRotation(L.Projection.LonLat.unproject(point), mapData.coordinateRotation * -1);
            },
        }),
    });
}

function applyRotation(latLng, rotation) {
    if (!rotation) {
        return latLng;
    }
    const angleInRadians = (rotation * Math.PI) / 180;
    const cosAngle = Math.cos(angleInRadians);
    const sinAngle = Math.sin(angleInRadians);
    const {lng: x, lat: y} = latLng;
    const rotatedX = x * cosAngle - y * sinAngle;
    const rotatedY = x * sinAngle + y * cosAngle;
    return L.latLng(rotatedY, rotatedX);
}

function getScaledBounds(bounds, scaleFactor) {
    const centerX = (bounds[0][0] + bounds[1][0]) / 2;
    const centerY = (bounds[0][1] + bounds[1][1]) / 2;
    const width = bounds[1][0] - bounds[0][0];
    const height = bounds[1][1] - bounds[0][1];
    const newWidth = width * scaleFactor;
    const newHeight = height * scaleFactor;
    const newBounds = [
        [centerY - newHeight / 2, centerX - newWidth / 2],
        [centerY + newHeight / 2, centerX + newWidth / 2]
    ];
    return newBounds;
}

//initialize our custom CRS
var customCRS = getCRS(mapData);
//creat the map with the custom CRS
var map = L.map('map', {
    crs: customCRS,
    zoomControl: false
});

map.createPane('overlay');

var originalBounds = [[79, -64.5], [-66.5, 67.4]];
var scaleFactor = 1;
var scaledBounds = getScaledBounds(originalBounds, scaleFactor);
var image = L.imageOverlay('https://assets.tarkov.dev/maps/svg/Factory-Ground_Floor.svg', scaledBounds).addTo(map);
map.fitBounds(scaledBounds);

var markers = {
    players: new Map(),
    items: new Map(),
    containers: new Map(),
    exfils: new Map(),
    corpses: new Map()
};

function updateCoordinateBox(e) {
    var coords = e.latlng;
    var lat = coords.lat.toFixed(2);
    var lng = coords.lng.toFixed(2);
    document.getElementById('coordinates').innerHTML = `X: ${lat}, Y: ${lng}`;
}
map.on('mousemove', updateCoordinateBox);

async function createItems() {
  if(last_loot_packet)
  {
    allItemsInRaid = [];
    markers.items.forEach((marker) => {
      map.removeLayer(marker);
    });
    markers.items.clear();

    for (const item of last_loot_packet.items) {
      const itemObject = {
        id: item.attributes.ID,
        position: {
          x: item.position.x,
          y: item.position.y,
          z: item.position.z
        }
      };
      allItemsInRaid.push(itemObject);
      const markerData = await createMarkerFromData(item.attributes.ID);
      if(showLoot){
        if (markerData.avg24hPrice >= minValue || markerData.avg24hPrice == " ???") {
          let newMarker = L.marker([item.position.y, item.position.x], { icon: markerData.icon })
            .addTo(map)
            .bindPopup(`<strong>Name: </strong>${markerData.name}<br><strong>Price:</strong> ₽${markerData.avg24hPrice.toLocaleString()}<br><strong>Height:</strong> ${item.position.z.toFixed(1)}`);
          markers.items.set(markers.items.size, newMarker);
        }
      }
    }
  }
}

async function createContainers() {
  if (last_container_packet) {

    // Clear existing container markers
    markers.containers.forEach((marker) => {
      map.removeLayer(marker);
    });
    markers.containers.clear();

    for (const container of last_container_packet.containers) {

      const marker = L.marker([container.position.y, container.position.x], { icon: Container_Icon });
      let highestValue = 0;
      // Create the popup content for the container
      let popupContent = `
        <div style="text-align: center; width: 300px;">
          <div style="font-weight: bold; margin-bottom: 0px;">
            ${container.attributes.ID}
          </div>
          <div style="margin-bottom: 10px;">
            Height: ${container.position.z.toFixed(1)}
          </div>
          <div style="max-height: 160px; overflow-y: auto; padding-right: ${container.items.length > 2 ? '15px' : '0'}">
      `;
      // Fetch and append item profiles to the popup content
      for (let i = 0; i < container.items.length; i++) {
        const itemID = container.items[i];
        const itemObject = {
          id: itemID,
          position: {
            x: container.position.x,
            y: container.position.y,
            z: container.position.z
          }
        };
        allItemsInRaid.push(itemObject);
        const itemProfile = await createItemProfileFromData(itemID);
        if(showContainers){
          if (itemProfile) {
            if (createdMarkers[itemID].avg24hPrice > highestValue || createdMarkers[itemID].avg24hPrice == " ???") {
              highestValue = createdMarkers[itemID].avg24hPrice;
            }
            // Add margin-bottom if the item is not the last one
            popupContent += `<div style="margin-bottom: ${i !== container.items.length - 1 ? '15px' : '0'};">${itemProfile.popupContent}</div>`;
          }
        }
      }

      popupContent += `
          </div>
        </div>`;

      // Bind the popup content to the marker
      marker.bindPopup(popupContent);

      if (showContainers && highestValue >= minValue || highestValue == " ???") {
        // Add the marker to the map and store it
        marker.addTo(map);
        markers.containers.set(markers.containers.size, marker);
      }
    }
  }
}

async function createCorpses() {
  if (last_corpse_packet) {
    // clear existing corpse markers
    markers.corpses.forEach((marker) => {
      map.removeLayer(marker);
    });
    markers.corpses.clear();

    for (const corpse of last_corpse_packet.corpses) {
      const marker = L.marker([corpse.position.y, corpse.position.x], { icon: Corpse_Icon });

      // create popup content for the corpse
      let popupContent = `
        <div style="text-align: center; width: 300px;">
          <div style="font-weight: bold; margin-bottom: 0px;">
            ${corpse.attributes.Name}
          </div>
          <div style="margin-bottom: 10px;">
            Height: ${corpse.position.z.toFixed(1)}
          </div>
          <div style="max-height: 300px; overflow-y: auto; padding-right: 15px">
      `;

      // array of item slots to display
      const itemSlots = [
        'FirstPrimaryWeapon', 'SecondPrimaryWeapon', 'Holster', 'FaceCover',
        'Headwear', 'TacticalVest', 'Earpiece', 'Dogtag', 'Eyewear', 'Backpack'
      ];

      //fetch and add item profiles to the popup content
      for (const slot of itemSlots) {
        const itemID = corpse.items[slot];
        if (itemID) {
          const itemObject = {
            id: itemID,
            position: {
              x: corpse.position.x,
              y: corpse.position.y,
              z: corpse.position.z
            }
          };
          allItemsInRaid.push(itemObject);
          const itemProfile = await createItemProfileFromData(itemID);
          
          if (showContainers && itemProfile) {
            popupContent += `
              <div style="margin-bottom: 15px;">
                <div style="font-weight: bold;">${slot}:</div>
                ${itemProfile.popupContent}
              </div>
            `;
          }
        }
      }

      // fuinction to add container items
      const addContainerItems = async (containerName, items) => {
        if (items && items.length > 0) {
          popupContent += `
            <div style="margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
              <div style="font-weight: bold;">${containerName} Contents:</div>
          `;
          for (const itemID of items) {
            const itemObject = {
              id: itemID,
              position: {
                x: corpse.position.x,
                y: corpse.position.y,
                z: corpse.position.z
              }
            };
            allItemsInRaid.push(itemObject);
            const itemProfile = await createItemProfileFromData(itemID);
            if (showContainers && itemProfile) {
              popupContent += `
                <div style="margin-bottom: 10px;">
                  ${itemProfile.popupContent}
                </div>
              `;
            }
          }
          popupContent += `</div>`;
        }
      };

      // add items for each container
      await addContainerItems('Pockets', corpse.items.Pocket_items);
      await addContainerItems('Vest', corpse.items.Vest_items);
      await addContainerItems('Backpack', corpse.items.Backpack_items);

      popupContent += `
          </div>
        </div>`;

      //bind the popup content to the marker
      marker.bindPopup(popupContent);

      if (showContainers) {
        marker.addTo(map);
        markers.corpses.set(markers.corpses.size, marker);
      }
    }
  }
}


if (!markers) {
  var markers = {
    players: new Map(),
    items: new Map(),
    containers: new Map(),
    corpses: new Map()
  };
}

function clearMarkers() {
  Object.values(markers).forEach(markerMap => {
    markerMap.forEach(marker => {
      map.removeLayer(marker);
    });
    markerMap.clear();
  });
}

function createPlayers() {
  if(new_json_packet)
    {
      document.getElementById('playerCountNumber').innerHTML = new_json_packet.players.length;

      markers.players.forEach((marker) => {
        map.removeLayer(marker);
      });
      markers.players.clear();
      new_json_packet.players.forEach(player => {
        var chosenIcon = chooseIcon(player);
        let newMarker = L.marker([player.position.y, player.position.x], {
          rotationAngle: (player.rotation.x + 90 - MapInfo.rotation),
          rotationOrigin: 'center center', zIndexOffset: 100,
          icon: chosenIcon
        })
        .bindPopup(`${charCodesToString(player.attributes.Name)} | ${player.attributes.Type}<br>x: ${player.position.x.toFixed(1)} y: ${player.position.y.toFixed(1)} z: ${player.position.z.toFixed(1)}`);
      
        map.addLayer(newMarker);
        markers.players.set(player.attributes.ID, newMarker);
      });
    }
}

function updatePopupXY(popup, X, Y, Z) {
  var currentContent = popup.getContent();
  var contentParts = currentContent.split("<br>");
  contentParts[1] = `x: ${X} y: ${Y} z: ${Z}`;
  var updatedContent = contentParts.join("<br>");
  popup.setContent(updatedContent);
}

function updateIcon(icon, player)
{
  icon.setIcon(chooseIcon(player));
}

function updatePlayers()
{
  new_json_packet.players.forEach(player => {
    if(currentMarker = markers.players.get(player.attributes.ID))
    {
      updatePopupXY(currentMarker.getPopup(), player.position.x.toFixed(1), player.position.y.toFixed(1), player.position.z.toFixed(1));
      currentMarker.setLatLng([player.position.y, player.position.x]);
      currentMarker.setRotationAngle(player.rotation.x + 90 - MapInfo.rotation);
      updateIcon(currentMarker, player);
    }
    else
    {
      createPlayers();
    }
  });
}

function changeLayer() {
    var selectedMap = document.getElementById('mapSelector').value;
    var selectedLevel = document.getElementById('levelSelector').value;
  
    MapInfo = mapInfo[selectedMap];
    selectedLevel = MapInfo.levels[selectedLevel];
  
    if (selectedLevel) {
      map.eachLayer(function(layer) {
        if (layer._url !== mainLayerName) {
          map.removeLayer(layer);
        }
      });

      map.eachLayer(function(layer) {
        if (layer._url === selectedLevel) {
          map.removeLayer(layer);
        }
      });
  
      var newLayer;
      if (selectedLevel.endsWith('.png')) {
        newLayer = L.tileLayer(selectedLevel, { bounds: scaledBounds, zIndex: 3000, pane: 'overlay', minZoom: 2, maxZoom: 6});
      } else {
        newLayer = L.imageOverlay(selectedLevel, scaledBounds);
      }
  

      newLayer.addTo(map);
  

      map.eachLayer(function(layer) {
        if (layer._url === mainLayerName) {
          layer.setOpacity(selectedLevel ? 0.3 : 1);
        }
      });
    } else {
      map.eachLayer(function(layer) {
        if (layer._url === mainLayerName) {
          layer.setOpacity(1);
        }
      });
  
      map.eachLayer(function(layer) {
        if (layer._url !== mainLayerName) {
          map.removeLayer(layer);
        }
      });
    }
    createItems();
    createContainers();
    createPlayers();
    createExfils();
}



const showExfils = document.getElementById('showExfil');
const showClosedExfil = document.getElementById('showClosedExfil');

showExfils.onclick = function () {
  createExfils();
}
showClosedExfil.onclick = function () {
  createExfils();
}
function createExfils()
{
  if(new_json_packet)
  {
    markers.exfils.forEach((marker) => {
      map.removeLayer(marker);
    });
    markers.exfils.clear();
    var chosenIcon;
    new_json_packet.exfils.forEach(exfil => {
      if(exfil.attributes.Status == 4)
      {
        chosenIcon = Open_Exfil_Icon;
      }
      else
      {
        chosenIcon = Closed_Exfil_Icon;
      }
      if(showExfils.checked)
        {
          if(!showClosedExfil.checked)
          {
            if(exfil.attributes.Status == 4)
            {
              let newMarker = L.marker([exfil.position.y, exfil.position.x], {
                rotationAngle: 0,
                rotationOrigin: 'center center',
                icon: chosenIcon
              })
              .bindPopup(`${exfil.attributes.Name}`);
            
              map.addLayer(newMarker);
              markers.exfils.set(markers.exfils.size, newMarker);
            }
          }
          else
          {
            let newMarker = L.marker([exfil.position.y, exfil.position.x], {
              rotationAngle: 0,
              rotationOrigin: 'center center',
              icon: chosenIcon
            })
            .bindPopup(`${exfil.attributes.Name}`);
          
            map.addLayer(newMarker);
            markers.exfils.set(markers.exfils.size, newMarker);
          }
        }
    });
  }
}



function changeMap() {
    const mapType = document.getElementById('mapSelector').value;

    MapInfo = mapInfo[mapType];
    mapData = {
        transform: MapInfo.transform,
        coordinateRotation: MapInfo.rotation
    };
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    const levelSelector = document.getElementById('levelSelector');
    levelSelector.innerHTML = '';

    var mainOption = document.createElement('option');
    mainOption.value = 'Main';
    mainOption.text = 'Main';
    levelSelector.add(mainOption);

    for (var levelName in MapInfo.levels) {
        if(levelName == "Satellite" || levelName == "Image")
        {
        }
        else
        {
            var option = document.createElement('option');
            option.value = levelName;
            option.text = levelName.replace(/Level/gi, 'Level ');
            levelSelector.add(option);
        }
    }

    // use custom CRS based on the new mapData
    customCRS = getCRS(mapData);
    map.options.crs = customCRS;

    scaledBounds = getScaledBounds(MapInfo.bounds, scaleFactor); //recalculate bounds for new map

    hasTile = true;
    hasImage = true;
    if(MapInfo.levels.Image)
    {
        hasImage = true;
        document.getElementById('abstractView').disabled = false;
    }
    else
    {
        hasImage = false;
        document.getElementById('abstractView').disabled = true;
        satelliteView = true;
        document.getElementById('satelliteView').click();
    }
    if(MapInfo.levels.Satellite)
    {
        document.getElementById('satelliteView').disabled = false;
    }
    else
    {
        hasTile = false;
        document.getElementById('satelliteView').disabled = true;
        satelliteView = false;
        document.getElementById('abstractView').click();
    }
    if (hasImage && !satelliteView) {
        L.imageOverlay(MapInfo.levels.Image, scaledBounds, {maxZoom: 5}).addTo(map);
        mainLayerName = MapInfo.levels.Image;
    }
    if (hasTile && satelliteView) {
        L.tileLayer(MapInfo.levels.Satellite, {bounds: scaledBounds, minZoom: 2, maxZoom: 6}).addTo(map);
        mainLayerName = MapInfo.levels.Satellite;
    }
    map.fitBounds(scaledBounds);
    map.setView([0, 0], 1);
    createItems();
    createContainers();
    createExfils();
    createPlayers();
}

changeMap(); //call this once because otherwise the first load is broken lmao