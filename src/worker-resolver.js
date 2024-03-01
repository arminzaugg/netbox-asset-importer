import Resolver from '@forge/resolver';
import {Queue} from '@forge/events';
import api, { route, storage } from '@forge/api';

const resolver = new Resolver();

// The responsibility of the worker queue is to fetch data from the external system
// and submit that data to CMDB. Since data most likely will be fetched in batches,
// the worker queue will keep pushing to itself (worker) until all data is fetched and submitted
// At which point it should mark the work items as complete so that the controller queue can
// call the Assets API to signal the completion of data submission
export const workerQueue = new Queue({key: 'worker-queue'});

resolver.define('worker-queue-listener', async ({payload, context}) => {
  console.debug(
    `### Entering worker-queue-listener with payload: ${JSON.stringify(payload, null, 2)} and context: ${JSON.stringify(context, null, 2)}`
  );
  await handleWork(payload.eventContext);
});

const handleWork = async (eventContext) => {
  
  debugger;
  // Read import metadata from storage
  const importContext = await storage.get('import-context');
  
  // Fetch data from external system here
  const data = {
    "data": {
      "devices": [
          {
            "id": 112,
            "url": "https://demo.netbox.dev/api/dcim/devices/112/",
            "display": "AMS2-SW01",
            "name": "AMS2-SW01",
            "device_type": {
                "id": 15,
                "url": "https://demo.netbox.dev/api/dcim/device-types/15/",
                "display": "Cisco WS-C3850-48",
                "manufacturer": {
                    "id": 3,
                    "url": "https://demo.netbox.dev/api/dcim/manufacturers/3/",
                    "display": "Cisco",
                    "name": "Cisco",
                    "slug": "cisco"
                },
                "model": "Cisco WS-C3850-48",
                "slug": "cisco-ws-c3850-48"
            },
            "role": {
                "id": 2,
                "url": "https://demo.netbox.dev/api/dcim/device-roles/2/",
                "display": "Core Switch",
                "name": "Core Switch",
                "slug": "core-switch"
            },
            "device_role": {
                "id": 2,
                "url": "https://demo.netbox.dev/api/dcim/device-roles/2/",
                "display": "Core Switch",
                "name": "Core Switch",
                "slug": "core-switch"
            },
            "tenant": null,
            "platform": null,
            "serial": "",
            "asset_tag": null,
            "site": {
                "id": 28,
                "url": "https://demo.netbox.dev/api/dcim/sites/28/",
                "display": "AMS2",
                "name": "AMS2",
                "slug": "ams2"
            },
            "location": null,
            "rack": null,
            "position": null,
            "face": null,
            "latitude": null,
            "longitude": null,
            "parent_device": null,
            "status": {
                "value": "active",
                "label": "Active"
            },
            "airflow": {
                "value": "front-to-rear",
                "label": "Front to rear"
            },
            "primary_ip": null,
            "primary_ip4": null,
            "primary_ip6": null,
            "oob_ip": null,
            "cluster": null,
            "virtual_chassis": null,
            "vc_position": null,
            "vc_priority": null,
            "description": "",
            "comments": "",
            "config_template": null,
            "config_context": {},
            "local_context_data": null,
            "tags": [],
            "custom_fields": {
                "License": null,
                "Serial": null
            },
            "created": "2024-03-01T12:53:01.535948Z",
            "last_updated": "2024-03-01T12:53:01.536029Z",
            "console_port_count": 0,
            "console_server_port_count": 0,
            "power_port_count": 0,
            "power_outlet_count": 0,
            "interface_count": 0,
            "front_port_count": 0,
            "rear_port_count": 0,
            "device_bay_count": 0,
            "module_bay_count": 0,
            "inventory_item_count": 0
        }
      ],
    }
  }
  
  // Call Assets API to write data to CMDB
  const submitData = await api
  .asApp()
  .requestJira(
    route`/jsm/assets/workspace/${importContext.workspaceId}/v1/importsource/${importContext.importId}/executions/${importContext.executionId}/data`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('submitData', submitData);
  debugger;

  // Update work items according to how much data is left to be fetched
  // And push to worker queue again if there is more data to be fetched
  // eg. await workerQueue.push({ eventContext: updatedWorkItem });
  return Promise.resolve();
};

export const workerQueueHandler = resolver.getDefinitions();
