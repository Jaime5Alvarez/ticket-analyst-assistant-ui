FROM mcr.microsoft.com/playwright:latest
WORKDIR /app
RUN npm install -g @playwright/mcp@latest
EXPOSE 3050
ENTRYPOINT ["npx", "@playwright/mcp@latest", "--headless", "--browser", "chromium", "--port", "3050", "--host", "0.0.0.0", "--allowed-hosts", "*"]