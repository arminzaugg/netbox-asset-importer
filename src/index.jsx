import ForgeUI, {
  useState,
  render,
  Text,
  AssetsAppImportTypeConfiguration,
  useProductContext,
  Button,
  Heading,
  TextField,
} from "@forge/ui";
import { controllerQueueHandler, controllerQueue } from "./controller-resolver";
import { workerQueueHandler } from "./worker-resolver";
import api, { route, storage, startsWith } from "@forge/api";

import { mapping } from "./schema";
import { deleteImportAndMapping, patchMapping } from "./utils";

export {
  onDeleteImport,
  startImport,
  stopImport,
  importStatus,
  controllerQueueHandler,
  workerQueueHandler,
};

const onDeleteImport = async (context) => {
  console.log("import with id ", context.importId + " got deleted");

  return {
    result: "on delete import",
  };
};

const startImport = async (context) => {
  console.log("import with id ", context.importId + " got started");

  // Check if an import is already running
  const configStatus = await api
    .asUser()
    .requestJira(
      route`/jsm/assets/workspace/${context.workspaceId}/v1/importsource/${context.importId}/configstatus`,
      {
        method: "GET",
      },
    );
  console.log("configStatus", configStatus);
  const configJson = await configStatus.json();

  // If an import is already running, stop it
  if (configJson.status === "RUNNING") {
    // Extract executionId from cancelUrl
    const cancelUrl = configJson.links.cancel;
    let executionId = cancelUrl.split("/").pop();
    const stopImport = await api
      .asUser()
      .requestJira(
        route`/jsm/assets/workspace/${context.workspaceId}/v1/importsource/${context.importId}/executions/${executionId}`,
        {
          method: "DELETE",
        },
      );
    console.log("stopImport", stopImport);
  }

  // Create a new execution
  const newlyCreatedExecution = await api
    .asUser()
    .requestJira(
      route`/jsm/assets/workspace/${context.workspaceId}/v1/importsource/${context.importId}/executions`,
      {
        method: "POST",
      },
    );
  console.log("newlyCreatedExecution", newlyCreatedExecution);
  const newlyCreatedExecutionJson = await newlyCreatedExecution.json();
  let executionId = newlyCreatedExecutionJson.links.cancel.split("/").pop();

  // Write Import Metadata to storage
  await storage.set(`import-context`, {
    importId: context.importId,
    workspaceId: context.workspaceId,
    executionId: executionId,
  });

  // Push event onto controller queue to start data ingestion process
  const id = await controllerQueue.push({
    eventContext: { importConfigurationId: context.importId },
  });
  console.log(`Pushed queueControllerEvent with id ${id}`);

  return {
    result: "start import",
  };
};

const stopImport = async (context) => {
  console.log("import with id ", context.importId + " got stopped");

  return {
    result: "stop import",
  };
};

const importStatus = async (context) => {
  const status = "READY";

  console.log(
    `import with id `,
    context.importId + ` sending import progress ${status}`,
  );

  return {
    status: status,
  };
};

const App = () => {
  const { extensionContext } = useProductContext();
  const importId = extensionContext.importId;
  const workspaceId = extensionContext.workspaceId;
  const [password, setPassword] = useState("");
  debugger;
  const onSubmit = async (formData) => {
    console.log("submit button clicked, submitting schema to import source...");
    //console.log("###\n", mapping);
    const response = await api
      .asUser()
      .requestJira(
        route`/jsm/assets/workspace/${workspaceId}/v1/importsource/${importId}/mapping`,
        {
          method: "PUT",
          body: JSON.stringify(mapping),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    if (response.status === 204) {
      console.log("schema submitted successfully");
    }
    if (response.status === 409) {
      console.log("A mapping already exists for this import");
    }
    else {
      console.log("status code: ", response.status);
    }
    console.log("save api token to secret store...")
    const secret = await storage.setSecret('token', formData.apiToken);
  };

  return (
    <AssetsAppImportTypeConfiguration onSubmit={onSubmit}>
      <Heading size="large">Netbox Importer Config</Heading>
      <Text>
        Netbox Importer App Config, ImportId = {importId}, WorkspaceId ={" "}
        {workspaceId}
      </Text>
      <TextField
        label="Netbox API URL"
        name="apiUrl"
        defaultValue="https://demo.netbox.dev/api/"
      />
      <TextField
        label="Netbox API Token"
        name="apiToken"
        type="password"
      />
    </AssetsAppImportTypeConfiguration>
  );
};
export const renderImportConfig = render(<App />);
