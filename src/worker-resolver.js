import Resolver from '@forge/resolver';
import {Queue} from '@forge/events';
import api, { route, storage } from '@forge/api';
import { fetchDeviceData } from './utils';

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
  
  const remoteData = await fetchDeviceData();
  const data = {
    "data": {
      "devices": remoteData.results,
    }
  };
  
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
