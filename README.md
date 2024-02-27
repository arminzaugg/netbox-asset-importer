# Forge "Hello, World!"

This project contains a Forge app written in Javascript that displays "Hello, World!" and ImportId in the "Configure App" modal for 3rd Party Import Structures. 
It also outlines how to make use of Forge's Async Events API to import 3rd party data into Assets by setting up a controller and worker queue for data ingestion. 

See [developer.atlassian.com/platform/forge/assets-import-app/](https://developer.atlassian.com/platform/forge/assets-import-app) for documentation and tutorial of this Forge Template, including the [documentation of Asset APIs](https://developer.atlassian.com/cloud/assets/). 

Also see [Forge Async Events API Diagram](https://dac-static.atlassian.com/platform/forge/images/assets-import-async-events-api-example.png?_v=1.5800.258) for a visual representation of the Async Events API.
With the Controller Queue a reference to `controller-resolver.js` and Worker Queue in `worker-resolver.js`

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app by editing the `src/index.jsx` file.

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

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
