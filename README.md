##  tarkov - Escape From Tarkov web-radar
This is the front-end of an old project of mine from around 2023. It connects to a websocket and receives data about game state, players, and loot and displays it in real time on an interactive map using leaflet.js. This allows for one host to share data simultaneously with multiple teammates. 

The code itself is very poorly written as it was one of my first JavaScript/HTML projects but I figure there are some useful parts such as the needed conversions to get 1:1 coordinates between EFT and leaflet. 

### Features
- Interactive maps with both abstract and satellite views and multiple floors
- Markers for different player and enemy types (Scavenger, PMC, Boss)
- Logic to follow the position and floor of a player
- Loot display with icons and value using [tarkov.dev](https:://tarkov.dev) API
- In game loot finder with auto completing search based on API
- Container loot viewer
