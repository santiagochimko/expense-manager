export const getErrorMessage = (error) => {
  if (!error) {
    return "Ocurrió un error inesperado";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return "Ocurrió un error inesperado";
};