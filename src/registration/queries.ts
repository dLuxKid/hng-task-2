export const getYourOrgQuery = (id: string) => {
  return `
  SELECT 
  orgid,
  name, 
  description 
FROM 
  organisation 
WHERE 
  ${id} = ANY (users);
  `;
};

export const getOrgQuery = (id: string, userid: string) => {
  return `
  SELECT 
  orgid,
  name, 
  description 
FROM 
  organisation 
WHERE 
  ${id} = orgid
  AND ${userid} = ANY (users);
  `;
};

export const createOrgQuery = ({
  name,
  userid,
  description,
}: {
  name: string;
  userid: string;
  description?: string;
}) => {
  return `
     INSERT INTO organisation (name, description, users)
      VALUES ('${name.replace("'", "''")}', ${
    description ? `'${description.replace("'", "''")}'` : "NULL"
  }, ARRAY [${userid}])
      RETURNING orgid,name,description
  `;
};

export const addToOrgQuery = (userId: string, orgId: string) => {
  return `
    UPDATE organisation
    SET users = users || '{${userId}}'
    WHERE orgid = ${orgId}
    AND NOT users @> ARRAY[${userId}];
  `;
};
