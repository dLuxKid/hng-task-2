// import { canAccessOrganisation } from '../src/utils/organisation'; // Adjust the path to your organisation access function

// describe('Organisation Access', () => {
//   it('should deny access to organisations the user does not belong to', async () => {
//     const userId = 1;
//     const orgId = 2;

//     const result = await canAccessOrganisation(userId, orgId);

//     expect(result).toBe(false);
//   });

//   it('should allow access to organisations the user belongs to', async () => {
//     const userId = 1;
//     const orgId = 1; // Assuming user 1 belongs to organisation 1

//     const result = await canAccessOrganisation(userId, orgId);

//     expect(result).toBe(true);
//   });
// });

// import httpMocks from "node-mocks-http"

// describe("Organisation Access", () => {
//   it("Should return the organisation if the user is the owner", async () => {

//     const req = httpMocks.createRequest({
//       method: "GET",
//       url: "/organisations/1",
//       params: {
//         orgid: 1,
//       },
//       user: user,
//     });
//     const res = httpMocks.createResponse();
//     await getOrganisation(req, res);
//     expect(res.statusCode).toBe(200);
//     expect(res._getData()).toBe(JSON.stringify(organisation));
//   });
// });

describe("testing test file", () => {
  it("testing test file", () => {
    expect(true).toBeTruthy();
  });
});
