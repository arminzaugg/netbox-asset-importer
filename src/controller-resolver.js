import Resolver from '@forge/resolver';
import {Queue} from '@forge/events';
import {workerQueue} from "./worker-resolver";
import api, {route, storage} from '@forge/api';

const resolver = new Resolver();

// The responsibility of the controller queue is to start the import ingestion
// by pushing the initial work item to the worker queue and then keep pushing
// to itself (controller) to check the status of the work items until they are all complete
// Once all work items are complete the controller queue will call the Assets API
export const controllerQueue = new Queue({key: 'controller-queue'});

resolver.define('controller-queue-listener', async ({payload, context}) => {
  console.log(
    `### Entering controller-queue-listener with payload: ${JSON.stringify(payload, null, 2)} and context: ${JSON.stringify(context, null, 2)}`
  );
  debugger;
  await handleControllerEvent(payload.eventContext);
});

const handleControllerEvent = async (eventContext) => {
  // Read import metadata from storage
  const importContext = await storage.get('import-context');
    
  debugger;
  // Push initial work item to worker queue here
  // e.g. await workerQueue.push({ eventContext: workItem });
  const id = await workerQueue.push({eventContext: {workId: 'your-work-id'}});

  // Once the initial work item is pushed to the worker queue,
  // keep pushing events to the controller queue with a delay until the work items are all complete
  // e.g. await controllerQueue.push({ eventContext: workItem });

  // Once work items are all complete call the Assets API to signal the completion of data submission
  if (true){
    debugger;
    console.log("All jobs have succeeded, marking import as COMPLETED...");
    // If all jobs have finished, mark data chunk submission as completed
    const submitResponse = await api
    .asApp()
    .requestJira(
      route`/jsm/assets/workspace/${importContext.workspaceId}/v1/importsource/${importContext.importId}/executions/${importContext.executionId}/data`,       {
        method: "POST",
        body: JSON.stringify({
          completed: true
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('submitResponse', submitResponse);
  }
};

export const controllerQueueHandler = resolver.getDefinitions();
