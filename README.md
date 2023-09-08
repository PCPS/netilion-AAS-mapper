# Asset to AAS Mapper

## Introduction

This project provides a tool for mapping proprietary assets from an asset
manager serivce like [Netilion](https://netilion.endress.com/) to the
standardized format of Asset Administration Shells and Submodels as specified by
the
[Industrial Digital Twin Association](https://industrialdigitaltwin.org/en/). By
default the project provides support for mapping assets form
[Netilion](https://netilion.endress.com/) – Though it is designed to be generalizable for any other proprietary asset repository – to any standard AAS infrustructure
compliant with **_Specification of the Asset Administratoin Shell_**
[Part 1 v3.0](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf)
and
[Part 2](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01002-3-0_SpecificationAssetAdministrationShell_Part2_API_.pdf).
For information on how to costumize the source asset manager, refer to the
[documentation](null)

## Pre-requisites

- To run this application you will need [Node.js](https://nodejs.org/en/)
    version 8.0.0

## Getting started

- Clone the repository

```shell
git clone https://github.com/PCPS/netilion-AAS-mapper <project_root_dir>
```

- Install dependencies

```shell
cd <project_root_dir>
npm install
```

- To run the mapper in _dev_ mode make sure the required environment variables
    are present in a file named `.env` in the root directory. To run in
    _production_ mode, the variables must be manually exported/set in the
    environment. Refer to [Environment Variables](#environment-variables) for
    information. **Plesaese note that dev mode relies on the presence of
    environment varialble `NODE_ENV='development'`. This value is automatically
    set using the `export` command. If your command line environment of choice
    does not `export`, please set this environment variable prior to running the
    application in dev mode.**

> ### Production
>
> ```shell
> npm start
> ```
>
> ### Development
>
> ```shell
> npm run start:dev
> ```

- To use the application API you can use a command line tool like
    [cURL](https://curl.se/) or a GUI like [Postman](https://www.postman.com/).
    refer to [API Guide](#api-guide) for information on how to use the API.

## NPM Scripts

The following scripts defined within the project can be used in a command line.
To run the scripts, navigate to the project root directory and use the following
format:

```shell
cd <project_root_dir>
npm run <script_name>
```

| Script Name    | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| **start**      | Start the mapper in production mode.                          |
| **start:dev**  | Start the mapper in development mode.                         |
| **preprocess** | Execute [Preprocessors](#preprocessors).                      |
| **build**      | Transpile the project to JavaScript and write to ./build      |
| **format**     | Format the project files via [Prettier](https://prettier.io/) |

## Preprocessors

The mapper comes with two preprocessor tasks;
[Submodel Generator Function Definitions](#submodel-generator-function-definition),
and
[Generation of Data Specifications Dictionary](#generation-of-data-specifications-dictionary).
the functionality of these two preprocessors are described below:

### Submodel Generator Function Definition

This preprocessor generates the contents of the
`<project_root_dir>/src/oi4_definitions/submodels/` folder using the simplified json
submodel definitons found in `<project_root_dir>/src/preprocessors/submodels/`.
These simplified submodel definitios conform to the following schema.\
_**Note**: This schema is incomplete will be extended as support for more submodel
element types is added to the preprocessor._

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "SubmodelDefinitionContainer",
    "description": "Container of simplified submodel definitions",
    "type": "object",
    "patternProperties": {
        "^[A-Z][a-zA-Z0-9]*$": { "$ref": "#/definitions/Submodel" }
    },
    "minProperties": 1,
    "definitions": {
        "CommonProperties": {
            "type": "object",
            "properties": {
                "semanticId": { "type": "string" },
                "semanticIdType": {
                    "type": "string",
                    "enum": ["IRI", "IRDI", "Custom"]
                },
                "isCaseOf": { "type": "string" },
                "modelType": { "type": "string" },
                "count": { "type": "string", "enum": ["?", "!", "*", "+"] }
            },
            "required": ["modelType", "count"]
        },
        "SubmodelElement": {
            "title": "SubmodelElement",
            "oneOf": [
                { "$ref": "#/definitions/Property" },
                { "$ref": "#/definitions/MultiLanguageProperty" },
                { "$ref": "#/definitions/SubmodelElementCollection" },
                { "$ref": "#/definitions/ReferenceElement" },
                { "$ref": "#/definitions/File" },
                { "$ref": "#/definitions/Entity" }
            ]
        },
        "Property": {
            "title": "Property",
            "allOf": [
                { "$ref": "#/definitions/CommonProperties" },
                {
                    "properties": {
                        "valueType": {
                            "type": "string",
                            "enum": [
                                "xs:string",
                                "xs:decimal",
                                "xs:date",
                                "xs:boolean"
                            ]
                        }
                    },
                    "required": ["valueType"]
                }
            ]
        },
        "MultiLanguageProperty": {
            "title": "MultiLanguageProperty",
            "allOf": [{ "$ref": "#/definitions/CommonProperties" }]
        },
        "SubmodelElementCollection": {
            "title": "SubmodelElementCollection",
            "allOf": [
                { "$ref": "#/definitions/CommonProperties" },
                {
                    "properties": {
                        "value": {
                            "type": "object",
                            "patternProperties": {
                                "^[A-Z][a-zA-Z0-9]*$": {
                                    "$ref": "#/definitions/SubmodelElement"
                                }
                            },
                            "minProperties": 1
                        }
                    },
                    "required": ["value"]
                }
            ]
        },
        "ReferenceElement": {
            "title": "ReferenceElement",
            "allOf": [{ "$ref": "#/definitions/CommonProperties" }]
        },
        "File": {
            "title": "File",
            "allOf": [{ "$ref": "#/definitions/CommonProperties" }]
        },
        "Entity": {
            "title": "Entity",
            "allOf": [{ "$ref": "#/definitions/CommonProperties" }]
        },
        "Submodel": {
            "title": "Submodel",
            "type": "object",
            "properties": {
                "submodelElements": {
                    "type": "object",
                    "patternProperties": {
                        "^[A-Z][a-zA-Z0-9]*$": {
                            "$ref": "#/definitions/SubmodelElement"
                        }
                    },
                    "minProperties": 1
                }
            },
            "required": ["submodelElements"]
        }
    }
}

```

The values of the count are explained in the following table:
|`.count` Parameter Value | Explanation                                                                           | UML Notation |
| ----------------------- | ------------------------------------------------------------------------------------- | ------------ |
| **?**                   | This element is optional, either a single instance of it is present, or none.         | 0..1         |
| **!**                   | This element is mandatory, a single instance of it must be present.                   | 1            |
| **\***                  | This element is optional, an array of it might be present.                            | 0..*         |
| **+**                   | This element is mandatory, an array of it with a minimum length of 1 must be present. | 1..*         |
_____________________

### Generation of Data Specifications Dictionary

This preprocessor generates data specification content for elements with semantic IDs that can be looked up in an ECLASS dictionary. It needs an `ECLASS.json` dictionary for this purpose, which it can generate if needed from a standard **Advanced** Eclass XML dictionary. For the predicted purposes of this mapper, ECLASS Advanced dictionary number 27 version 12 (`ECLASS12_0_ADVANCED_EN_SG_27.xml`) is best suited for conversion to `ECLASS.json`. To perform this conversion, the following function in `<project_root_dir>/src/preprocessors/main.ts` must be uncommented:

```typescript
semantic_id_collector.GenerateEclassFromXml()
```

Then, the xml dictionary must be put in `<project_root_dir>/src/dictionaries/ECLASS.json` and finally, if necessary, the value of the following variable in `<project_root_dir>/src/preprocessors/operations/semantic_id_collector.ts` must be changed:

```typescript
const ECLASS_XML_FILE_NAME
```

***This conversion needs to be done only once*** and the result will be saved in `<project_root_dir>/src/dictionaries/ECLASS.json`.

## API Guide

[This SwaggerHub document](https://app.swaggerhub.com/apis/ariaranjbar-EH/aas-mapper_api/1.0.0#/Mapper/get_all_aas) defines the API endpoints in the mapper as is, if no defaults are changed. Please note, all endpoints are preceded by `<SERVER_URL>/<SERVER_API_VERSION>/` in _production_ mode and `<SERVER_URL>:<PORT>/<SERVER_API_VERSION>/` in _dev_ mode. This Swagger UI can also be accessed on the deployed application through `<SERVER_URL>/api-docs` in _production_ mode and `<SERVER_URL>:<PORT>/api-docs` in _dev_ mode.

## Environment Variables

Here is a table of environment variables and their role:
|Environment Variable| Role | Value Explanation|
| --- | --- | --- |
| SERVER_URL | URL of the mapper. | For dev mode can be "<http://127.0.0.1>" |
| PORT | The server port the mapper listens to | For example "1337" |
| SERVER_API_VERSION | Version of the mapper API | Letter 'v' followed by version number. For example "v1" |
| NETILION_API_URL | API URL of the asset source (in case of modification of the asset source this name must be changed) | "<https://api.netilion.endress.com/v1>" |
| NETILION_API_KEY | API Key of the asset source | A string of letters and numbers |
| NETILION_SECRET | Secret of the asset source in case of Bearer authentication type. |A string of letters and numbers |
| NETILION_USERNAME | Username of the master asset source account, In case of 'Internal' authentication mode | For example "app_name@connect" |
| NETILION_PASSWORD | Password of the master asset source account, In case of 'Internal' authentication mode. | A string of characters |
| NETILION_AUTH_TYPE | Type of authentication | "Bearer" or "Basic" |
| MAPPER_AUTH_MODE | Mode of authentication | "BY_USER" or "INTERNAL" |
| NETILION_AUTH_SERVER | Asset source authentication server | "<https://api.netilion.endress.com/oauth/token>" |
| OI4_REPO_API_URL | AAS Repo URL | For example "<https://eundh-aas-repository.cpone.conplement.cloud/api/v3.0>" |
| OI4_REPO_AUTH_TOKEN | Auth typ of AAS Repo | "Bearer eh_aas_repository_bidlJWSwVAXRLL=hNh1eCgMzbQx8P=LuWUG2Nfx1f6Buh06SGC/Qgfo=!AUJ6/6eJVPbNvsjAVFj?jHSyimig9YdmBLlcsqrM6bxDAiD0t0!AxQfQOFkeon/xd6j!x" |
