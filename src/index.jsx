import ForgeUI, {render, Text, AssetsAppImportTypeConfiguration, useProductContext} from '@forge/ui';
import {controllerQueueHandler, controllerQueue} from './controller-resolver';
import {workerQueueHandler} from './worker-resolver';

export {onDeleteImport, startImport, stopImport, importStatus, controllerQueueHandler, workerQueueHandler};

const onDeleteImport = async (context) => {
  console.log('import with id ', context.importId + ' got deleted');

  return {
    result: 'on delete import'
  };
};

const startImport = async (context) => {
  console.log('import with id ', context.importId + ' got started');

  // Call Assets API here to mark import as started

  // Push event onto controller queue to start data ingestion process
  const id = await controllerQueue.push({eventContext: {importConfigurationId: context.importId}});
  console.log(`Pushed queueControllerEvent with id ${id}`);

  return {
    result: 'start import'
  };
};

const stopImport = async (context) => {
  console.log('import with id ', context.importId + ' got stopped');

  return {
    result: 'stop import'
  };
};

const importStatus = async (context) => {
  const status = 'READY';

  console.log(`import with id `, context.importId + ` sending import progress ${status}`);

  return {
    status: status
  };
};

const App = () => {
  const {extensionContext} = useProductContext();
  const importId = extensionContext.importId;
  const workspaceId = extensionContext.workspaceId;
  const onSubmit = async () => {
    console.log('submit button clicked');
  };

  return (
    <AssetsAppImportTypeConfiguration onSubmit={onSubmit}>
      <Text>
        Hello World!, ImportId = {importId}, WorkspaceId = {workspaceId}
      </Text>
    </AssetsAppImportTypeConfiguration>
  );
};
export const renderImportConfig = render(<App/>);
