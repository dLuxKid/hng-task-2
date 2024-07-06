export const createUserQuery = ({
  firstName,
  lastName,
  email,
  password,
  phone,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  return `
WITH new_user AS (
      INSERT INTO users (firstName, lastName, email, password, phone)
      VALUES ('${firstName}', '${lastName}', '${email}', '${password}', ${
    phone ? `'${phone}'` : "NULL"
  })
      RETURNING *
    ), new_org AS (
      INSERT INTO organisation (name, description, users)
      VALUES ('${firstName}''s Organisation', 'Organisation created for ${firstName}', ARRAY[(SELECT userId FROM new_user)])
    )
    SELECT * FROM new_user;
  `;
};

export const loginQuery = ({ email }: { email: string }) => {
  return `
    SELECT * FROM users WHERE email = '${email}';
  `;
};

export const findUserQuery = (id: string) => {
  return `
    SELECT * FROM users WHERE id = '${id}';
  `;
};
