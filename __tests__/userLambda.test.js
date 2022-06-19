const userLambda = require("../src/lambda/userLambda");
const dynamo = require("../src/dbServices/dynamo");

// mock dynamodb
jest.mock("../src/dbServices/dynamo");

test('UserLambda is an object', () => {
    expect(typeof userLambda).toBe('object');
});

const res = {
    status: jest.fn((x) => x), json: jest.fn((x) => x)
};
describe("Testing userLamba.create, dynamo.create", () => {
    it('should send a status code of 400 if body is empty or "name" not a string', async () => {
        const req = { body: {} };
        await userLambda.create(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should send a status code of 400 if "name" not a string', async () => {
        const req = { body: { name: 9087 } };
        await userLambda.create(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    
    it('should send a status code of 500 if item could not be created', async () => {
        const req = { body: { name: "John Doe" } };
        dynamo.create.mockImplementationOnce(() => ({
            error: "error"
        }))
        await userLambda.create(req, res);
        expect(res.status).toBeCalledWith(500);
    });
    
    it('should send a status code of 201 if item is created', async () => {
        const req = { body: { name: "John Doe" } };
        dynamo.create.mockImplementationOnce(() => ({
            PK: "random byte",
            SK: "user",
            name: "John Doe"
        }))
        await userLambda.create(req, res);
        expect(res.status).toBeCalledWith(201);
    });
});