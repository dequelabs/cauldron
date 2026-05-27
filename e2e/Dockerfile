ARG playwright_version=latest
FROM mcr.microsoft.com/playwright:v$playwright_version-jammy
ARG playwright_version

WORKDIR /app

# Install the whole workspace inside the image. Cauldron is a yarn-workspaces
# monorepo, so cauldron-react's dependencies (e.g. react-id-generator) hoist to
# the root node_modules rather than packages/react/node_modules. The screenshot
# run mounts the host packages/ over /app/packages but does NOT mount
# node_modules, so the deps must live in the image's /app/node_modules for Vite
# to resolve them when it bundles the component sources.
COPY package.json yarn.lock ./
COPY packages/react/package.json ./packages/react/package.json
COPY packages/styles/package.json ./packages/styles/package.json
RUN yarn install --frozen-lockfile

# Pin the render-affecting dependencies to the versions the screenshot
# baselines were generated against (Playwright matched to the base image,
# React 19, and @fontsource/roboto 4.5.x imported by playwright/index.tsx).
RUN yarn add -W \
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
