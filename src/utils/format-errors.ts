type TransformedError = {
  property: string;
  message: string;
};

type FormattedError = {
  [key: string]: {
    message: string;
  };
};

const formatErrors = (transformedErrors: TransformedError[]): FormattedError => {
  return transformedErrors.reduce((acc, { property, message }) => {
    acc[property] = { message };
    return acc;
  }, {} as FormattedError);
};

export { formatErrors };
