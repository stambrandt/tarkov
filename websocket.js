var clearedPlayers = false;

//debug values
const debugGameState = {
    unique: "1",
    map: 0,
    exfils: [
        {
          position: { x: 100.5, y: 40.2, z: 0.0 },
          attributes: {
            Name: "Cellars",
            Status: "4"
          }
        },
        {
          position: { x: 80.5, y: -20.2, z: 0.0 },
          attributes: {
            Name: "gate 3",
            Status: "2"
          }
        }
    ],
    players: [
      {
        position: { x: 50.5, y: 40.2, z: 0.0 },
        rotation: { x: 0.0, y: 0.0 },
        attributes: {
          Type: "Host",
          Floor: 1,
          ID: "player_base_address_1",
          Side: 1,
          Name: [80, 108, 97, 121, 101, 114, 79, 110, 101]
        }
      },
      {
        position: { x: 60.7, y: 30.4, z: 0.0 },
        rotation: { x: 20.0, y: 0.0 },
        attributes: {
          Type: "Player",
          Floor: 2,
          ID: "player_base_address_2",
          Side: 1,
          Name: [80, 108, 97, 121, 101, 114, 84, 119, 111]
        }
      }
    ],
    items: [
      {
        position: { x: 10.0, y: 5.0, z: 20.0 },
        attributes: {
          Type: "Item",
          ID: "57347ca924597744596b4e71"
        }
      },
      {
        position: { x: 15.0, y: 5.0, z: 25.0 },
        attributes: {
          Type: "Item",
          ID: "5c0e531d86f7747fa23f4d42"
        }
      },
      {
        position: { x: 30.0, y: 10.0, z: 40.0 },
        attributes: {
          Type: "Item",
          ID: "59faff1d86f7746c51718c9c"
        }
      },
      {
        position: { x: 35.0, y: 15.0, z: 45.0 },
        attributes: {
          Type: "Item",
          ID: "588200cf2459774414733d55"
        }
      }
    ],
    containers: [
      {
        position: { x: 50.0, y: 0.0, z: 60.0 },
        attributes: {
          Type: "Container",
          ID: "container1",
          version: "1.0"
        },
        items: ["5c0e531d86f7747fa23f4d42", "59faff1d86f7746c51718c9c", "588200cf2459774414733d55", "588200cf2459774414733d55"]
      },
      {
        position: { x: 70.0, y: 0.0, z: 80.0 },
        attributes: {
          Type: "Container",
          ID: "container2",
          version: "1.0"
        },
        items: ["5c0e531d86f7747fa23f4d42"]
      }
    ]
  };  
var shouldUpdate = false;

const debugPlayers = document.getElementById("debugPlayers");
const debugLoot = document.getElementById("debugLoot");
const debugWorld = document.getElementById("debugWorld");
const debugFollow = document.getElementById("debugFollow");
const debugLevel = document.getElementById("debugLevel");
const debugMap = document.getElementById("debugMap");

debugLoot.onclick = function () { 
    new_json_packet = debugGameState;
    last_loot_packet = debugGameState;
    last_container_packet = debugGameState;
    createItems();
    createContainers();
};
debugPlayers.onclick = function () { 
    new_json_packet = debugGameState;
    if(!shouldUpdate)
    {
        createPlayers();
        shouldUpdate = true;
    }
    else
    {
        updatePlayers();
    }
 };
 debugWorld.onclick = function () { 
  new_json_packet = debugGameState;
  createExfils();
};
debugFollow.onclick = function () {
  follow();
}
debugLevel.onclick = function () {
  new_json_packet = debugGameState;
  console.log("debuggng levels");
  autoUpdateLayer();
}
debugMap.onclick = function () {
  new_json_packet = debugGameState;
  console.log("debugging map levels");
  autoUpdateMap();
}


document.addEventListener("DOMContentLoaded", function() {
  let ws;
  let retries = 0;
  const maxRetries = 40;
  const retryInterval = 300;

  function connectWebSocket() {
    ws = new WebSocket('wss://ip:port');

    ws.onopen = function() {
      console.log("Connected to the WebSocket server");
      retries = 0;
    };

    ws.onmessage = function (event) {
      //console.log("recieved packet");
      const data = JSON.parse(event.data);
      new_json_packet = data;
      if(data.map == 9 && clearedPlayers != true) //map 9 is only when we are not in raid.
      {
        //console.log("clearing players")
        clearMarkers();
        clearedPlayers = true;
        //if we arent in raid (9) we should not change the map!!

      }
      // Check if "items" array exists and has elements
      if (data.items && data.items.length > 0) {
        //console.log("update items")
        last_loot_packet = data;
        createItems();
      }
      if (data.containers && data.containers.length > 0) {
        //console.log("update items")
        last_container_packet = data;
        createContainers();
      }
      if (data.corpses && data.corpses.length > 0) {
        //console.log("update items")
        last_corpse_packet = data;
        createCorpses();
      }
      if (data.exfils && data.exfils.length > 0) {
        createExfils();
      }
      if (data.players && data.players.length > 0) {
        //console.log(old_json_packet)
        if(data.unique || old_json_packet == null) //if we get unique packet or first packet.
        {
          //console.log("createplayers");
          createPlayers();
        }
        else
        {
          //console.log("update players");
          updatePlayers();
        }
        clearedPlayers = false;
        follow();
        autoUpdateLayer();
        autoUpdateMap();
      }
      //this will allow reconnection at any time
      if(old_json_packet == null)
      {
        //console.log("first packet saved.");
        old_json_packet = data;
      }
      else
      {
        //console.log("first packet was already recieved.");
        old_json_packet = new_json_packet;
      }
    };

    ws.onerror = function(error) {
      //console.log(" websocket error:", error);
    };

    ws.onclose = function(event) {
      console.log("WebSocket closed. Attempting to reconnect...");
      if (retries < maxRetries) {
          setTimeout(() => {
              retries++;
              console.log(`Retrying connection: Attempt ${retries} of ${maxRetries}`);
              connectWebSocket();
          }, retryInterval);
      } else {
          console.log("maximum retries reached. Unable to connect to WebSocket  server.");
      }
    };
  }

  // initial connection attempt
  connectWebSocket();
});