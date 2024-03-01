export const mapping = {
  "$schema": "https://api.atlassian.com/jsm/assets/imports/external/schema/versions/2021_09_15",
  "schema": {
    "objectSchema": {
      "name": "Disk Analysis Tool",
      "description": "Data imported from The Disk Analysis Tool",
      "objectTypes": [
        {
          "externalId": "object-type/hard-drive",
          "name": "Hard Drive",
          "description": "A hard drive found during scanning",
          "attributes": [
            {
              "externalId": "object-type-attribute/duid",
              "name": "DUID",
              "description": "Device Unique Identifier",
              "type": "text",
              "label": true
            },
            {
              "externalId": "object-type-attribute/disk-label",
              "name": "Disk Label",
              "description": "Hard drive label",
              "type": "text"
            }
          ],
          "children": [
            {
              "externalId": "object-type/file",
              "name": "File",
              "description": "A file present in a hard drive",
              "attributes": [
                {
                  "externalId": "object-type-attribute/path",
                  "name": "Path",
                  "description": "Path of the file",
                  "type": "text",
                  "label": true
                },
                {
                  "externalId": "object-type-attribute/size",
                  "name": "Size",
                  "description": "Size of the file",
                  "type": "integer"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "mapping": {
    "objectTypeMappings": [
      {
        "objectTypeExternalId": "object-type/hard-drive",
        "objectTypeName": "Hard Drive",
        "selector": "hardDrives",
        "description": "Mapping for Hard Drives",
        "attributesMapping": [
          {
            "attributeExternalId": "object-type-attribute/duid",
            "attributeName": "DUID",
            "attributeLocators": [
              "id"
            ],
            "externalIdPart": true
          },
          {
            "attributeExternalId": "object-type-attribute/disk-label",
            "attributeName": "Disk Label",
            "attributeLocators": [
              "label"
            ]
          }
        ]
      },
      {
        "objectTypeExternalId": "object-type/file",
        "objectTypeName": "File",
        "selector": "hardDrives.files",
        "description": "Maps files found in hard drives",
        "attributesMapping": [
          {
            "attributeExternalId": "object-type-attribute/path",
            "attributeName": "Path",
            "attributeLocators": [
              "path"
            ],
            "externalIdPart": true
          },
          {
            "attributeExternalId": "object-type-attribute/size",
            "attributeName": "Size",
            "attributeLocators": [
              "size"
            ]
          }
        ]
      }
    ]
  }
};

