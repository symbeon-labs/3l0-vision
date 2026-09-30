import {
  createResolutionRequest,
  createResolutionResult
} from "./contracts.js";

export class OrcClient {
  constructor({ resolver } = {}) {
    if (typeof resolver !== "function") {
      throw new Error("resolver function is required");
    }

    this.resolver = resolver;
  }

  async resolve(input) {
    const request = createResolutionRequest(input);
    const result = await this.resolver(request);

    return createResolutionResult({
      ...result,
      resolutionId: request.resolution_id
    });
  }
}
