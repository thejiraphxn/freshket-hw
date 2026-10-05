export interface ErrorView {
  success: false;
  error: { message: string };
}

export function renderError(message: string): ErrorView {
  return { success: false, error: { message } };
}
