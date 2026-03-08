FROM node:20-slim
WORKDIR /app
RUN npm install -g @playwright/mcp@latest
EXPOSE 3050
ENTRYPOINT ["/bin/sh", "-c", "npx @playwright/mcp@latest --port 3050 --host 0.0.0.0 --allowed-hosts '*' --cdp-endpoint \"wss://chrome.browserless.io?token=${BROWSERLESS_TOKEN}\""]