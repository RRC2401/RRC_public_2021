import React, { useEffect, useState } from 'react';
import axios from "../../utils/Axios/axiosInst";
import * as Config from "../../config";

/*
===============================================================================================================================================
MyApplications API Call
===============================================================================================================================================
*/

export async function GetProjectsSummarize() {

    const options = {
        url: '/v1/projects/summarize',
        method: 'GET',
        withCredentials: true
    };

    let response = await axios(options);

    return response;
};

export async function GetProjects(appID) {

    const filter = {
        id: appID
    }

    const options = {
        url: '/v1/projects' + '?filter=' + JSON.stringify(filter),
        method: 'GET',
        withCredentials: true
    };

    let response = await axios(options);

    return response.data;
};

export async function GetUserDetails() {

    const options = {
        url: 'v1/workers/me',
        method: 'GET',
        withCredentials: true
    };

    let response = await axios(options);

    return response.data;
};

export async function GetAppOwnerDetails(wwid) {

    const options = {
        url: 'v1/applications?filter={"AppOwnerWWID":"' + wwid + '","LifecycleStatusTxt":{"!":"End of Life"}}&limit=1000',
        method: 'GET',
        withCredentials: true
    };

    let response = await axios(options);

    return response.data;
};

/*
===============================================================================================================================================
Admin Control API Call
===============================================================================================================================================
*/

export async function GetProjectSubStatus() {

    const options = {
        url: 'v1/projectsubstatuses',
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data;
};

export async function GetProjectDetails(props) {

    const options = {
        url: 'v1/projects' + '/' + props,
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data;
};

export async function GetProjectAuditDetails(props) {

    const filter = {
        modelId: props,
        modelName: "project",
        isMostRecent: true
    }

    const options = {
        url: 'v1/audits' + '/?filter=' + JSON.stringify(filter),
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data;
};

export async function GetDynamicScannerIds(props) {

    const options = {
        url: 'v1/projectscanners' + '?filter={"project":"' + props + '"}',
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data;
};

export async function GetSubmissions(props) {

    const options = {
        url: 'v1/submissions' + '?filter={"project":"' + props + '"}',
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data;
};

export async function GetWorkerEmail(props) {

    const options = {
        baseURL: Config.WORKERAPI + "?filter=%7B%22id%22:%22" + props + "%22%7D",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'GET',
        withCredentials: true
    }

    let response = await axios(options);

    return response.data.data[0];
};

export async function PutSecurityCertStatus(props) { //Used for updating Security Certification and Dynamic Code Scan Status

    const options = {
        url: 'v1/projects' + '/' + props.appsecPortalId,
        method: 'PUT',
        withCredentials: true
    }
    /////-----Security Certification-----/////
    if (props.status) {
        options.data = {
            data: {
                type: "project",
                id: props.appsecPortalId,
                relationships: {
                    subStatus: {
                        data: {
                            id: props.id,
                            type: "projectsubstatus"
                        }
                    }
                },
                attributes: {
                    starStatus: props.status,
                    starStatusComment: props.comment
                }
            }
        }
    }
    /////-----Dynamic Code Scan-----/////
    if (props.dynamicScanStatus) {
        options.data = {
            data: {
                type: "project",
                id: props.appsecPortalId,
                attributes: {
                    active: true,
                    id: props.appsecPortalId,
                    dynamicScanStatus: props.dynamicScanStatus,
                    dynamicScanComment: props.dynamicScanComment,
                    dynamicScanMethod: props.dynamicScanMethod
                }
            }
        }
    }

    let response = await axios(options);

    return response.data;
};

export async function PutDynamicScannerIds(props) { //Used for updating Dynamic Code Scan Status in addition with 'PutSecurityCertStatus' method

    const options = {
        url: 'v1/projectscanners' + '/' + props.dynamicScanId,
        method: 'PUT',
        withCredentials: true,
        data: {
            data: {
                type: "projectscanner",
                id: props.dynamicScanId,
                attributes: {
                    required: props.required
                }
            }
        }
    }

    let response = await axios(options);

    return response.data;
};

export async function PutStaticCodeScanStatus(props) { //Used for updating Static Code Scan Status

    const options = {
        url: 'v1/submissions' + '/' + props.staticScanId,
        method: 'PUT',
        withCredentials: true,
        data: {
            data: {
                id: props.staticScanId,
                type: "submission",
                relationships: {
                    project: {
                        data: {
                            id: props.appsecPortalId,
                            type: "project"
                        }
                    }
                },
                attributes: {
                    status: props.staticScanStatus,
                    statusComment: props.staticScanComment
                }
            }
        }
    }

    let response = await axios(options);

    return response.data;
}

/*
===============================================================================================================================================
Configure Tool Access API Call
===============================================================================================================================================
*/

export async function GetIntegrationDefinition(props) {

    let options = {};

    if (props.tool) {
        options = {
            url: 'v1/integrationdefinitions' + '?filter={' +
                '"project":' + JSON.stringify(props.appID) + ',' +
                '"tool":"' + props.tool + '"}',
            method: 'GET',
            withCredentials: true
        }
    }
    else {
        options = {
            url: 'v1/integrationdefinitions' + '?filter={"project":"' + props + '"}',
            method: 'GET',
            withCredentials: true
        }
    }

    let response = await axios(options);

    return response.data;
};

export async function PutIntegrationDefinition(props) {

    const options = {
        url: 'v1/integrationdefinitions' + '/' + props.integrationDefId,
        method: 'PUT',
        withCredentials: true,
        data: {
            data: {
                id: props.integrationDefId,
                type: "integrationdefinition",
                attributes: {
                    errorCount: 0,
                    status: props.status
                }
            }
        }
    };

    let response = await axios(options);

    return response.data;
};

/*
===============================================================================================================================================
ALM (Jira & Rally) API Call
===============================================================================================================================================
*/

export async function PutAlm(props) {

    const options = {
        url: 'v1/integrationdefinitions' + '/' + props.integrationDefId,
        method: 'PUT',
        withCredentials: true,
        data: {
            data: {
                id: props.integrationDefId,
                type: "integrationdefinition",
                attributes: {
                    metadata: props.metadata,
                    status: props.status,
                    errorCount: 0
                }
            }
        }
    };

    let response = await axios(options);

    return response.data;
};

/*
===============================================================================================================================================
Rally API Call
===============================================================================================================================================
*/

export async function GetRally(props) {

    let response = '';

    const options = {
        url: Config.RALLYAPI,
        method: 'GET',
        // withCredentials: true
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'zsessionid': props.apiKey
        }
    };

    if (!props.workspaceId) {
        options.url = options.url + '/Subscription/12668058712/Workspaces?query=(State%20=%20Open)';
        response = await axios(options);
    }
    else {
        options.url = options.url + '/workspace/' + props.workspaceId
            + '/projects?query=((State%20=%20Open)%20and%20(TeamMembers.UserName%20=%20'
            + props.userEmail + '))&pagesize=50';
        response = await axios(options);
    }

    return response;
};
