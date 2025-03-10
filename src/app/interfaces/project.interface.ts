interface IAuditProject {
  createdOn: string,
  modifiedOn: string,
}

export interface IProject {
  id: string,
  name: string,
  code: string,
  description: string,
  issueCounter: number,
  audit: IAuditProject,
  selected?: boolean,
}
