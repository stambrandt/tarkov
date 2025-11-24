var TeamIcon = L.icon({
  iconUrl: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/14_2-512.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

var PMC_Level0 = L.icon({
    iconUrl: '/icons/pmc_0.png',
    iconSize: [20, 20],
    iconAnchor: [10, 7]
})

var PMC_Level1 = L.icon({
    iconUrl: '/icons/pmc_1.png',
    iconSize: [20, 20],
    iconAnchor: [10, 7]
})

var PMC_Level2 = L.icon({
    iconUrl: '/icons/pmc_2.png',
    iconSize: [20, 20],
    iconAnchor: [10, 7]
})

var PMC_Level3 = L.icon({
    iconUrl: '/icons/pmc_3.png',
    iconSize: [20, 20],
    iconAnchor: [10, 7]
})

var PMC_Level4 = L.icon({
    iconUrl: '/icons/pmc_4.png',
    iconSize: [20, 20],
    iconAnchor: [10, 7]
})

var BotIcon = L.icon({
    iconUrl: 'https://tarkov.dev/maps/interactive/spawn_scav.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
})

var Bot_Level0 = L.icon({
  iconUrl: '/icons/Bot_0.png',
     iconSize: [28, 32],
     iconAnchor: [14, 14]
})

var Bot_Level1 = L.icon({
  iconUrl: '/icons/Bot_1.png',
     iconSize: [28, 32],
     iconAnchor: [14, 14]
})

var Bot_Level2 = L.icon({
  iconUrl: '/icons/Bot_2.png',
     iconSize: [28, 32],
     iconAnchor: [14, 14],
})

var Bot_Level3 = L.icon({
  iconUrl: '/icons/Bot_3.png',
     iconSize: [28, 32],
     iconAnchor: [14, 14]
})

var Bot_Level4 = L.icon({
  iconUrl: '/icons/Bot_4.png',
     iconSize: [28, 32],
     iconAnchor: [14, 14]
})

var Scav_Level0 = L.icon({
  iconUrl: '/icons/Scav_0.png',
      iconSize: [28, 28],
      iconAnchor: [14, 0]
})

var Scav_Level1 = L.icon({
  iconUrl: '/icons/Scav_1.png',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
})

var Scav_Level2 = L.icon({
  iconUrl: '/icons/Scav_2.png',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
})

var Scav_Level3 = L.icon({
  iconUrl: '/icons/Scav_3.png',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
})

var Scav_Level4 = L.icon({
  iconUrl: '/icons/Scav_4.png',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
})

var Boss_Level0 = L.icon({
  iconUrl: '/icons/Boss_0.png',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Boss_Level1 = L.icon({
  iconUrl: '/icons/Boss_1.png',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Boss_Level2 = L.icon({
  iconUrl: '/icons/Boss_2.png',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Boss_Level3 = L.icon({
  iconUrl: '/icons/Boss_3.png',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Boss_Level4 = L.icon({
  iconUrl: '/icons/Boss_4.png',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Missing_Icon = L.icon({
  iconUrl: '',
      iconSize: [28, 30],
      iconAnchor: [14, 15]
})

var Container_Icon = L.icon({
  iconUrl: 'https://tarkov.dev/maps/interactive/container_wooden-crate.png', //change to new icon later
      iconSize: [25, 25],
      iconAnchor: [13, 13]
})

var Open_Exfil_Icon = L.icon({
  iconUrl: 'https://tarkov.dev/maps/interactive/extract_pmc.png',
      iconSize: [25, 25],
      iconAnchor: [13, 25]
})

var Closed_Exfil_Icon = L.icon({
  iconUrl: 'https://tarkov.dev/maps/interactive/extract_scav.png',
      iconSize: [25, 25],
      iconAnchor: [13, 25]
})

var Corpse_Icon = L.icon({
  iconUrl: '/icons/x.png',
      iconSize: [25, 25],
      iconAnchor: [13, 25]
})

var createdMarkers = {};

async function createItemProfileFromData(id) {
  try {
    var marker = await createMarkerFromData(id);
    
    //check if marker and icon are properly defined
    if (!marker || !marker.icon) {
      console.error('Marker or icon is undefined:', marker);
      return null;
    }

    // Use a default icon url if options or iconUrl are undefined
    const iconUrl = marker.icon.options?.iconUrl || 'https://assets.tarkov.dev/unknown-item-grid-image.jpg';
    const iconWidth = marker.icon.options?.iconSize?.[0] || 40;
    const iconHeight = marker.icon.options?.iconSize?.[1] || 40;

    //popup for item info
    var popupContent = `
      <div style="background-color: #dfdfdf; border-radius: 10px; padding: 10px;">
        <div style="display: flex; align-items: center;">
          <div style="flex: 0 0 80px; display: flex; align-items: center; justify-content: center;">
            <img src="${iconUrl}" style="cursor: pointer; max-width: ${iconWidth}px; max-height: ${iconHeight}px;" alt="Icon">
          </div>
          <div style="text-align: left; margin-left: 10px; flex: 1;">
            <strong>Name:</strong> ${marker.name}<br>
            <strong>Price:</strong> ₽${marker.avg24hPrice !== '?' ? marker.avg24hPrice.toLocaleString() : ' ???'}
          </div>
        </div>
      </div>
    `;

    //retunr object with popup
    return {
      id: id,
      popupContent: popupContent
    };
  } catch (error) {
    console.error('An error occurred while creating the item profile:', error);
    return null;
  }
}

async function createMarkerFromData(id) {
  if (createdMarkers[id]) {
    if (createdMarkers[id].fetching) {
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (!createdMarkers[id].fetching) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
    }
    return createdMarkers[id];
  }


  createdMarkers[id] = {
    icon: "https://assets.tarkov.dev/unknown-item-grid-image.jpg",
    name: "Unknown",
    avg24hPrice: " ???",
    fetching: true,
  };

  try {
    const url = "https://api.tarkov.dev/graphql";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            items(ids: "${id}") {
              shortName
              baseImageLink
              avg24hPrice
              width
              height
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok`);
    }

    const data = await response.json();
    const markerData = data.data.items[0];

    if (!markerData) {
      createdMarkers[id].fetching = false;
    }

    //calculate size and anchor
    const scale = markerData.width / markerData.height;
    const iconSize = calculateIconSize(scale);
    const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2];

    //create icon
    const iconUrl = markerData.baseImageLink ? markerData.baseImageLink : "https://assets.tarkov.dev/unknown-item-grid-image.jpg";
    const icon = L.icon({
      iconUrl: iconUrl,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
    });

    //update marker data
    createdMarkers[id] = {
      icon: icon,
      name: markerData.shortName,
      avg24hPrice: markerData.avg24hPrice !== null ? markerData.avg24hPrice : " ???",
      fetching: false,
    };

  } catch (error) {
    createdMarkers[id].fetching = false;
  }

  return createdMarkers[id];
}

//fix the sizing of items that are not square apect ratio
function calculateIconSize(scale) {
  if (scale > 1) {
    return [20 * scale, 20];
  } else if (scale < 1) {
    return [20, 20 / scale];
  } else {
    return [20, 20];
  }
}

//holy garbage code
function chooseIcon(player) {
  var chosenIcon
  switch (player.attributes.Type)
  {
    case "Player":
      if(player.attributes.Side != 4)
        {
          switch (player.attributes.Floor)
          {
          case 0:
            chosenIcon = PMC_Level0;
            break;
          case 1:
            chosenIcon = PMC_Level1;
            break;
          case 2:
            chosenIcon = PMC_Level2;
            break;
          case 3:
            chosenIcon = PMC_Level3;
            break;
          case 4:
            chosenIcon = PMC_Level4;
            break;
          }
        }
      else
        {
          switch (player.attributes.Floor)
          {
            case 0:
              chosenIcon = Scav_Level0;
              break;
            case 1:
              chosenIcon = Scav_Level1;
              break;
            case 2:
              chosenIcon = Scav_Level2;
              break;
            case 3:
              chosenIcon = Scav_Level3;
              break;
            case 4:
              chosenIcon = Scav_Level4;
              break;
          }
        }
      break;
    case "AI":
      switch (player.attributes.Floor)
        {
          case 0:
            chosenIcon = Bot_Level0;
            break;
          case 1:
            chosenIcon = Bot_Level1;
            break;
          case 2:
            chosenIcon = Bot_Level2;
            break;
          case 3:
            chosenIcon = Bot_Level3;
            break;
          case 4:
            chosenIcon = Bot_Level4;
            break;
        }
      break;
    case "Boss":
      switch (player.attributes.Floor)
        {
          case 0:
            chosenIcon = Boss_Level0;
            break;
          case 1:
            chosenIcon = Boss_Level1;
            break;
          case 2:
            chosenIcon = Boss_Level2;
            break;
          case 3:
            chosenIcon = Boss_Level3;
            break;
          case 4:
            chosenIcon = Boss_Level4;
            break;
        }
      break;
    case "Host":
      chosenIcon = TeamIcon;
      break;
    case "Teammate":
      chosenIcon = TeamIcon;
      break;
  }
  return chosenIcon;
}