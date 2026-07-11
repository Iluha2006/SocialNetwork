
export const validateProfile = (values) => {
  const errors = {};
  
  if (!values.name?.trim()) {
    errors.name = 'Имя обязательно для заполнения ';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  if (values.bio && values.bio.length > 50) {
    errors.bio = 'Описание не должно превышать 50 символов';
  }

  return errors;
};