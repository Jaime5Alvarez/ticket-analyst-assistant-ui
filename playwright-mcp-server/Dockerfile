FROM mcr.microsoft.com/playwright:v1.50.0-noble
WORKDIR /app
RUN npm install -g @playwright/mcp@latest
EXPOSE 3050
ENTRYPOINT ["npx", "@playwright/mcp@latest", "--headless", "--browser", "chromium", "--port", "3050", "--host", "0.0.0.0", "--allowed-origins", "*"]