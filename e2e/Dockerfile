ARG playwright_version=1.44.0
FROM mcr.microsoft.com/playwright:v$playwright_version-jammy

WORKDIR /app
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./e2e ./e2e
COPY ./packages ./packages
COPY ./playwright ./playwright
COPY ./playwright-ct.config.ts ./playwright-ct.config.ts
RUN yarn add --prefix \
    playwright@$playwright_version \
    @playwright/test@$playwright_version \
    @playwright/experimental-ct-react17@$playwright_version \
    react@^17 \
    react-dom@^17 \
    @fontsource/roboto@^4.5.1 \
    && rm -rf playwright/.cache

ENTRYPOINT ["/app/e2e/entrypoint.sh"]