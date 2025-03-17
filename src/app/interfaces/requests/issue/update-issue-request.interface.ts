export interface IIssueUpdateRequest {
  name?: string | null;
  description?: string | null;
  priority: string;
  state: string | null;
  stage: string | null;
}
