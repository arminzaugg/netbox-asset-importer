import Resolver from '@forge/resolver';
import {Queue} from '@forge/events';
import {workerQueue} from "./worker-resolver";

const resolver = new Resolver();

// The responsibility of the controller queue is to start the import ingestion
// by pushing the initial work item to the worker queue and then keep pushing
// to itself (controller) to check the status of the work items until they are all complete
// Once all work items are complete the controller queue will call the Assets API
export const controllerQueue = new Queue({key: 'controller-queue'});

resolver.define('controller-queue-listener', async ({payload, context}) => {
  console.log(
    `Entering controller-queue-listener with payload: ${JSON.stringify(payload, null, 2)} and context: ${JSON.stringify(context, null, 2)}`
  );
  await handleControllerEvent(payload.eventContext);
});

const handleControllerEvent = async (eventContext) => {
  // Push initial work item to worker queue here
  // e.g. await workerQueue.push({ eventContext: workItem });

  // Once the initial work item is pushed to the worker queue,
  // keep pushing events to the controller queue with a delay until the work items are all complete
  // e.g. await controllerQueue.push({ eventContext: workItem });

  // Once work items are all complete call the Assets API to signal the completion of data submission

  const id = await workerQueue.push({eventContext: {workId: 'your-work-id'}});
};

export const controllerQueueHandler = resolver.getDefinitions();
