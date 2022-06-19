const blogLambda = require("../src/lambda/blogLambda");
const dynamo = require("../src/dbServices/dynamo");

// mock dynamodb
jest.mock("../src/dbServices/dynamo");

test('BlogLambda is an object', () => {
    expect(typeof blogLambda).toBe('object');
});

const res = {
    status: jest.fn((x) => x), json: jest.fn((x) => x)
};

describe("Testing blogLamba.create, dynamo.create", () => {
    it('should send a status code of 400 if body is empty or "post" not a string', async () => {
        dynamo.getItem.mockImplementationOnce(() => ({
            name: "name"
        }));
        const req = { body: {} };
        await blogLambda.create(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should send a status code of 400 "post" not a string', async () => {
        const req = { body: { post: 5657 } };
        dynamo.getItem.mockImplementationOnce(() => ({
            name: "name"
        }));
        await blogLambda.create(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    
    it('should send a status code of 500 if item could not be created', async () => {
        const req = { body: { post: "some random post" } };
        dynamo.getItem.mockImplementationOnce(() => ({
            name: "name"
        }));
        dynamo.create.mockImplementationOnce(() => ({
            error: "error"
        }));
        await blogLambda.create(req, res);
        expect(res.status).toBeCalledWith(500);
    });

    it('should send a status code of 404 if a wrong userId is passed', async () => {
        const req = { params: { id: "some wrong id" } };
        dynamo.getItem.mockImplementationOnce(() => ({
            statusCode: 404,
            error: "error"
        }));
        dynamo.create.mockImplementationOnce(() => ({
            PK: req.params.id,
            SK: "blog",
            psot: "some random post"
        }));
        await blogLambda.create(req, res);
        expect(res.status).toBeCalledWith(404);
    });
    
    it('should send a status code of 201 if item is created', async () => {
        const req = { body: { post: "some random post" } };
        dynamo.getItem.mockImplementationOnce(() => ({
            name: "name"
        }));
        dynamo.create.mockImplementationOnce(() => ({
            PK: "random byte",
            SK: "blog",
            psot: "some random post"
        }));
        await blogLambda.create(req, res);
        expect(res.status).toBeCalledWith(201);
    });
});

describe("Testing blogLamba.getPost, dynamo.getItem", () => {
    it('should send a status code of 404 if post was not found with given id', async () => {
        const req = { params: { id: "some wrong id"} };
        dynamo.getItem.mockImplementationOnce(() => ({
            statusCode: 404,
            error: "error"
        }));
        await blogLambda.getPost(req, res);
        expect(res.status).toBeCalledWith(404);
    });

    it('should send a status code of 500 if a server error occurred', async () => {
        const req = { params: { id: 5657 } };
        dynamo.getItem.mockImplementationOnce(() => ({
            statusCode: 500,
            error: "error"
        }))
        await blogLambda.getPost(req, res);
        expect(res.status).toBeCalledWith(500);
    });
    
    it('should send a status code of 200 if item is retrieved', async () => {
        const req = { params: { id: "some correct id" } };
        dynamo.getItem.mockImplementationOnce(() => ({
            PK: req.params.id,
            SK: "blog",
            psot: "some random post"
        }));
        await blogLambda.getPost(req, res);
        expect(res.status).toBeCalledWith(200);
    });

    
});


describe("Testing blogLamba.updatePost, dynamo.updatePost", () => {
    it('should send a status code of 500 if post could not be updated', async () => {
        const req = { 
            params: { id: "some wrong id" },
            body: { post: "some random post edit"}
        };
        dynamo.updatePost.mockImplementationOnce(() => ({
            statusCode: 500,
            error: "error"
        }));
        await blogLambda.updatePost(req, res);
        expect(res.status).toBeCalledWith(500);
    });
    
    it('should send a status code of 200 if post was updated', async () => {
        const req = { 
            params: { id: "some correct id" },
            body: { post: "some random post edit" }
        };
        dynamo.updatePost.mockImplementationOnce(() => ({
            PK: req.params.id,
            body: req.body
        }));
        await blogLambda.updatePost(req, res);
        expect(res.status).toBeCalledWith(200);
    });
});


describe("Testing blogLamba.deletePost, dynamo.deletePost", () => {
    it('should send a status code of 500 if post could not be deleted', async () => {
        const req = { 
            params: { id: "some wrong id" }
        };
        dynamo.deletePost.mockImplementationOnce(() => ({
            statusCode: 500,
            error: "error"
        }));
        await blogLambda.deletePost(req, res);
        expect(res.status).toBeCalledWith(500);
    });
    
    it('should send a status code of 200 if post was deleted', async () => {
        const req = { 
            params: { id: "some correct id" },
        };
        dynamo.deletePost.mockImplementationOnce(() => ({
            PK: req.params.id,
            body: req.body
        }));
        await blogLambda.deletePost(req, res);
        expect(res.status).toBeCalledWith(200);
    });
});