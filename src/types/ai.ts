export type AiProviderId = "future-open-source-llm" | "future-managed-llm";

export type AiExtensionPoint = {
  enabled: false;
  provider?: AiProviderId;
  consumes: "tourism-services";
};
