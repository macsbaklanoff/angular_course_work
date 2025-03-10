interface IAuditIssue {
  createdOn: string,
  modifiedOn: string,
}

export interface IIssue {
  id: string,
  name: string,
  projectId: string,
  code: string,
  priority: number,
  state: number,
  description: string,
  audit: IAuditIssue,
}
