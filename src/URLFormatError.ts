export default class URLFormatError extends Error {
  constructor(public url: string, public expectedFormat: RegExp) {
    super("Unexpected URL format");
  }
}
