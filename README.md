# Jira Asset Importer for Netbox"

This project contains a Forge app written in Javascript that takes a Netbox API endpoint and token as input. It fetches devices from Netbox and imports them into Jira Assets. 
Data is mapped as per mapping schema.

See [developer.atlassian.com/platform/forge/assets-import-app/](https://developer.atlassian.com/platform/forge/assets-import-app) for documentation and tutorial of this Forge Template, including the [documentation of Asset APIs](https://developer.atlassian.com/cloud/assets/). 

Also see [Forge Async Events API Diagram](https://dac-static.atlassian.com/platform/forge/images/assets-import-async-events-api-example.png?_v=1.5800.258) for a visual representation of the Async Events API.
With the Controller Queue a reference to `controller-resolver.js` and Worker Queue in `worker-resolver.js`

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- Pagination is not implemented. One can configure Netbox to return more than 50 records if needed.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.

## Development Notes

ATM we create the schema.js file out of schema.jsm.json by using.
1. ```rm src/schema.js```
2. ```echo "export const mapping = $(jq -c . < src/schema.jsm.json);" > src/schema.js```

Asset schema supports two versions
- "$schema": "https://api.atlassian.com/jsm/assets/imports/external/schema/versions/2023_10_19",
- "$schema": "https://api.atlassian.com/jsm/assets/imports/external/schema/versions/2021_09_15",

Testing PUT mapping requires SSL verification.

For whatever reason ngrok needs to be in the node module foldere. I symlink it there
```
ln -s $(which ngrok) /Users/aza/.nvm/versions/node/v20.10.0/lib/node_modules/@forge/cli/node_modules/ngrok/bin/ngrok
```

