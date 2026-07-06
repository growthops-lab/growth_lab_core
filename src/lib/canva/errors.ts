export class CanvaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CanvaConfigError";
  }
}
