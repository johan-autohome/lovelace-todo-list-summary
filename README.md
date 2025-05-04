# Install

Follow [developers.home-assistant.io/docs/frontend/development/](https://developers.home-assistant.io/docs/frontend/development/)

Mount your development folder in to devcontainer.json, for example:
```json
  "mounts": [
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/WorkspaceWSL/lovelace-cards/,target=/workspaces/core/config/www/development,type=bind,consistency=cached"
  ],
```

```bash
sudo apt update
sudo apt install npm
cd config/www/development/todo-list-summary
npm install
npm run build
```

Start the server:
`ctrl+shift+p`
`Tasks:Run Task` -> `Run Home Assistant Core`

View the card in:
`http://localhost:8123/dashboard-test/0`

Network -> Disable cache
Application -> service workers -> "Bypass for network"

# Update in Home assistant

```bash
scp dist/card.js piassistant:homeassistant/www/todo-list-summary.js
```

# Todo
- editor
- hacs
