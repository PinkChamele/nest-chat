import { BadRequestException, ValidationError } from '@nestjs/common';

function getError(errorData: ValidationError) {
  let error: ValidationError | undefined = errorData;
  let constraints = error?.constraints;

  while (!constraints) {
    error = error?.children?.shift();
    constraints = error?.constraints;
  }

  return error;
}

export default function TransformValidationErrors(
  validationErrors: ValidationError[] = [],
): BadRequestException {
  return new BadRequestException({
    error: 'Validation error',
    message: Object.fromEntries(
      validationErrors.map((e) => {
        const error = getError(e);

        return [error?.property, Object.values(error?.constraints || {})];
      }),
    ),
  });
}
