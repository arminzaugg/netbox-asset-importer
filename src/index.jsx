import ForgeUI, {
  useState,
  useProductContext,
  useEffect,
  render,
  Text,
  AssetsAppImportTypeConfiguration,
  Heading,
  TextField,
} from "@forge/ui";
import { controllerQueueHandler, controllerQueue } from "./controller-resolver";
import { workerQueueHandler } from "./worker-resolver";
import api, { route, storage, startsWith } from "@forge/api";
import { mapping } from "./schema";

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

  // State for the form fields
  const [apiUrl, setApiUrl] = useState('');
  const [apiToken, setApiToken] = useState('');


// Fetch existing configuration on component mount
useEffect(() => {
  async function fetchConfig() {
    console.log("Fetching existing configuration...");

    try {
      // Update state only if responses are valid
      // Fetch API URL and Token from storage, assuming keys are 'api-url' and 'api-token'
      const apiUrlResponse = await storage.get('api-url');
      const apiTokenResponse = await storage.getSecret('api-token');
      console.log("apiUrlResponse", apiUrlResponse);
      if (apiUrlResponse) {
        console.log(`set apiUrl with value ${apiUrlResponse} of type ${typeof apiUrlResponse}`)
        setApiUrl(apiUrlResponse);
      }
      if (apiTokenResponse) {
        setApiToken(apiTokenResponse);
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  }

  fetchConfig();
}, [apiUrl]); // Empty dependency array ensures this runs only once when the component mounts

    

  debugger;
  const onSubmit = async (formData) => {
    console.log("submit button clicked, submitting schema to import source...");

    // Update API URL and Token in storage
    console.log("Form data received:", formData);

  // Example: updating storage with the new API URL and token
    try {
      // Storing API URL and token using Forge's storage API
      if (formData.apiUrl) {
        await storage.set('api-url', formData.apiUrl);
        setApiUrl(formData.apiUrl);
        console.log("API URL updated successfully.");
      }
      if (formData.apiToken) {
        await storage.setSecret('api-token', formData.apiToken);
        setApiToken(formData.apiToken);
        console.log("API Token updated successfully.");
      }
        // Additional business logic based on form submission
        console.log("Form submitted and processed successfully.");
      } catch (error) {
        console.error("Error handling form submission:", error);
      }


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
  };

  return (
    <AssetsAppImportTypeConfiguration onSubmit={onSubmit}>
      <Heading size="large">Netbox Importer Config</Heading>
      <Text>
        Netbox Importer App Config
        ImportId - {importId}
        WorkspaceId -{workspaceId}
      </Text>
      <Text>
        Please note that the URL and the API token must on be set once and will be stored securely.
        Once saved the key will no longer be displayed. Exit the Form by clicking on cancel.
      </Text>
      <TextField
        label="Netbox URL"
        name="apiUrl"
        defaultValue={apiUrl}
        placeholder="Enter URL e.g https://demo.netbox.dev/api/"
      />
      <TextField
        label="Netbox API Token"
        name="apiToken"
        defaultValue={apiToken}
        placeholder="Enter API Token"
      />
    </AssetsAppImportTypeConfiguration>
  );
};
export const renderImportConfig = render(<App />);
