export interface IIssueUpdateRequest {
  name: string;
  description?: string;
  priority: string;
  state: string | null;
  stage: string;
}
