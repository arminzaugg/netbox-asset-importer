import api, {route, storage, fetch} from '@forge/api';

export const patchMapping = async (workspaceId, importId, mapping) => {
    debugger;
    const response = await api
        .asUser()
        .requestJira(
            route`/jsm/assets/workspace/${workspaceId}/v1/importsource/${importId}/mapping`,
            {
                method: "PATCH",
                body: JSON.stringify(mapping),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    // Write response to console
    console.log(response.json());
    return response.json();
};


// Helper function to delete import and mapping during App configuration
export const deleteImportAndMapping = async (workspaceId, importId, executionId) => {
    debugger;
    const response = await api
        .asUser()
        .requestJira(
            route`/jsm/assets/workspace/${workspaceId}/v1/importsource/${importId}/executions/${executionId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    // Write response to console
    console.log(response.json());
    return response.json();
};

// Helper function to fetch device data from external system
export const fetchDeviceData = async () => {
console.log("fetching data from external system");
const apiToken = await storage.getSecret('api-token');

const nbHeaders = new Headers();
nbHeaders.append("Authorization", `Token ${apiToken}`);
nbHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: nbHeaders,
  redirect: "follow"
};

try {
    const response = await fetch("https://demo.netbox.dev/api/dcim/devices/", requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Returns the JSON object directly
  } catch (error) {
    console.error("Failed to fetch device data:", error);
    throw error; // Rethrow or handle as needed for further error handling up the chain
  }
};