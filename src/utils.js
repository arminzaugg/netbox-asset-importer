import api, {route, storage, startsWith} from '@forge/api';

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