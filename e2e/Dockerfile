ARG playwright_version=latest
FROM mcr.microsoft.com/playwright:v$playwright_version-jammy
ARG playwright_version
ARG pnpm_version

# Install pnpm at the version pinned in package.json's packageManager (passed
# in by screenshots:docker). The published pnpm package has no runtime deps,
# so `npm install -g pnpm` is safe inside this throwaway build stage.
RUN npm install -g pnpm@${pnpm_version}

WORKDIR /app

# Install the full workspace so cauldron-react's hoisted deps (react-id-generator
# etc.) land in /app/node_modules — the screenshot run mounts host packages/ over
# /app/packages but not node_modules, so they need to live here.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/react/package.json ./packages/react/package.json
COPY packages/styles/package.json ./packages/styles/package.json
RUN pnpm install --frozen-lockfile

# Pin the render-affecting versions to what the baselines expect (Playwright
# matches the base image; @fontsource/roboto 4.5.x is imported by playwright/index.tsx).
RUN pnpm add -w \
    playwright@$playwright_version \
    @playwright/test@$playwright_version \
    @playwright/experimental-ct-react@$playwright_version \
    react@^19 \
    react-dom@^19 \
    @fontsource/roboto@^4.5.1

COPY tsconfig.json ./
COPY e2e ./e2e
COPY packages ./packages
COPY playwright ./playwright
COPY playwright-ct.config.ts ./playwright-ct.config.ts
RUN rm -rf playwright/.cache

ENTRYPOINT ["/app/e2e/entrypoint.sh"]
